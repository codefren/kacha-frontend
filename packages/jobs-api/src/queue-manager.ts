import { Job, Queue } from 'bull';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { JobDescriptor } from './interfaces/job-descriptor.interface';
import { Message } from './interfaces/message.interface';
import { JobFailedMessage } from './messages/job-failed.message';
import { vrpOptimizationPersistQueue, vrpOptimizationQueue } from './queue';
import { Log } from './shared/logger';

type StoredJob = JobDescriptor & {
    subject?: Subject<Message>;
    subscribersAmount?: number;
    child?: StoredJob;
    parent?: StoredJob;
};

export class QueueManager {
    private queueMap: {
        [queueName: string]: {
            queue: Queue;
            jobsMap: {
                [jobId: number]: StoredJob;
            };
        };
    } = {};

    constructor(...queues: Queue[]) {
        for (const queue of queues) {
            this.queueMap[queue.name] = {
                queue,
                jobsMap: {},
            };

            this.setListeners(queue);
        }
    }

    public unsubscribe({ queueName, id }: JobDescriptor): void {
        const queue = this.queueMap[queueName];
        const job = queue && queue.jobsMap[id];

        if (job) {
            --job.subscribersAmount;

            if (job.subscribersAmount === 0) {
                this.cleanResources(job);
            }
        }
    }

    public async subscribe({ queueName, id }: JobDescriptor) {
        const queue = this.queueMap[queueName];

        if (!queue) {
            return {
                currentStatus: {
                    type: 'job_status',
                    payload: {
                        id,
                        queueName,
                        found: false,
                    },
                },
            };
        }

        const job = await this.queueMap[queueName].queue.getJob(id);

        if (!job) {
            return {
                currentStatus: {
                    type: 'job_status',
                    payload: {
                        id,
                        queueName,
                        found: false,
                    },
                },
            };
        }

        let state = await job.getState();

        let storedJob = queue.jobsMap[id];
        let currentJob = job;
        let step = null;

        if (!storedJob) {
            if (state !== 'completed' && state !== 'failed') {
                storedJob = queue.jobsMap[id] = {
                    subject: new Subject(),
                    queueName,
                    id,
                    subscribersAmount: 1,
                };
            }

            step = 1;

            if (state === 'completed') {
                const lastChild = await this.getLastChildJob(job);
                step = lastChild.step;
                currentJob = lastChild.job;
                if (currentJob.id !== job.id || currentJob.queue.name !== job.queue.name) {
                    state = await currentJob.getState();
                }

                const result = job.returnvalue;

                if (
                    result.job &&
                    result.job.queueName in this.queueMap &&
                    state !== 'completed'
                ) {
                    // new child job
                    storedJob = queue.jobsMap[id] = {
                        subject: new Subject(),
                        queueName,
                        id,
                        subscribersAmount: 1,
                    };

                    const { id: childId, queueName: childQueueName } = result.job;

                    storedJob.child = this.queueMap[childQueueName].jobsMap[childId] = {
                        ...result.job,
                        parent: storedJob,
                    };
                }
            }
        } else {
            ++storedJob.subscribersAmount;
            step = this.getCurrentStep(storedJob).step;
        }
        const currentStatus: Message = {
            type: 'job_status',
            payload: {
                found: true,
                queueName,
                id,
                state,
                progress: (currentJob as any)._progress,
                step,
                attemptsMade: currentJob.attemptsMade,
            },
        };

        if (currentJob.returnvalue) {
            currentStatus.payload.result = currentJob.returnvalue;
        } else if (currentJob.stacktrace.length) {
            currentStatus.payload.error = currentJob.stacktrace;
        }

        return { subject: storedJob && storedJob.subject, currentStatus };
    }

    private cleanResources(job: StoredJob) {
        if (job.subject) {
            job.subject.complete();
        }

        delete this.queueMap[job.queueName].jobsMap[job.id];

        if (job.child) {
            this.cleanResources(job.child);
        }
    }

    private getCurrentStep(job: StoredJob) {
        let step = 1;

        while (job.child) {
            ++step;
            job = job.child;
        }

        return { step };
    }

    private async getLastChildJob(job: Job): Promise<{ job: Job; step: number }> {
        let step = 1;

        while (job.returnvalue && job.returnvalue.job) {
            const { queueName, id } = job.returnvalue.job;
            job = await this.queueMap[queueName].queue.getJob(id);

            ++step;
        }

        return { step, job };
    }

    private getInitialStoredJob(job: StoredJob) {
        function getInitialStoredJobImm(
            immJob: StoredJob,
            step: number,
        ): { step: number; storedJob: StoredJob } {
            if (immJob.parent) {
                return getInitialStoredJobImm(immJob.parent, step + 1);
            } else {
                return { storedJob: immJob, step };
            }
        }

        return getInitialStoredJobImm(job, 1);
    }

    private async onJobCompleted(queue: Queue, jobId: number, result: any) {
        const queueName = queue.name;
        const storedJob = this.queueMap[queueName].jobsMap[jobId];

        if (!storedJob) {
            return;
        }

        try {
            result = JSON.parse(result);
        } catch (error) {
            //
        }

        let hasChildJob = false;

        if (result.job && result.job.queueName in this.queueMap) {
            hasChildJob = true;
            // new child job

            const { id: childId, queueName: childQueueName } = result.job;

            storedJob.child = this.queueMap[childQueueName].jobsMap[childId] = {
                ...result.job,
                parent: storedJob,
            };
        }

        const { storedJob: initialStoredJob, step } = this.getInitialStoredJob(storedJob);

        if (hasChildJob) {
            initialStoredJob.subject.next({
                type: 'job_status',
                payload: {
                    found: true,
                    queueName: initialStoredJob.queueName,
                    id: initialStoredJob.id,
                    step: step + 1,
                    progress: 0,
                    attempsMade: 0,
                },
            });
        } else {
            initialStoredJob.subject.next({
                type: 'job_status',
                payload: {
                    found: true,
                    queueName: initialStoredJob.queueName,
                    id: initialStoredJob.id,
                    step,
                    progress: 100,
                    result,
                },
            });

            this.cleanResources(initialStoredJob);
        }
    }

    private async onJobProgress(queue: Queue, jobId: number, progress: any) {
        const storedJob = this.queueMap[queue.name].jobsMap[jobId];

        if (!storedJob) {
            return;
        }

        const { storedJob: initialJob, step } = this.getInitialStoredJob(storedJob);

        initialJob.subject.next({
            type: 'job_status',
            payload: {
                id: initialJob.id,
                queueName: initialJob.queueName,
                step,
                progress,
            },
        });
    }

    private async onJobFailed(queue: Queue, jobId: number, error: any) {
        Log.debug('Received failed ' + jobId);

        const storedJob = this.queueMap[queue.name].jobsMap[jobId];

        if (!storedJob) {
            return;
        }

        const { storedJob: initialJob, step } = this.getInitialStoredJob(storedJob);

        initialJob.subject.next({
            type: 'job_status',
            payload: {
                id: initialJob.id,
                queueName: initialJob.queueName,
                step,
                error: error || '',
            },
        });

        this.cleanResources(initialJob);
    }

    private setListeners(queue: Queue) {
        queue.on('global:completed', _.bind(this.onJobCompleted, this, queue));

        queue.on('global:failed', _.bind(this.onJobFailed, this, queue));

        queue.on('global:progress', _.bind(this.onJobProgress, this, queue));
    }
}

export const queueManager = new QueueManager(
    vrpOptimizationPersistQueue,
    vrpOptimizationQueue,
);
