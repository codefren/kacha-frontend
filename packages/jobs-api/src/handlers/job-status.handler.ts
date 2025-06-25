import { LOG_VERSION } from 'pino';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Message } from 'src/interfaces/message.interface';
import { Ws } from 'src/interfaces/ws.interface';
import { JobStatusRequestMessagePayload } from 'src/messages/job-status-request.message';
import { queueManager } from 'src/queue-manager';
import { send } from 'src/shared/utiilities/send';
import { Log } from '../shared/logger';

export const jobStatusHandler = async (ws: Ws, payload: JobStatusRequestMessagePayload) => {
    let subscriptionsLeft = payload.jobs.length;
    const subscriptions: Subscription[] = [];

    function finish(index: number) {
        --subscriptionsLeft;
        queueManager.unsubscribe(payload.jobs[index]);

        if (subscriptionsLeft === 0) {
            if (!ws.closed) {
                ws.end(200, '');
            }
        }
    }

    for (let i = 0; i < payload.jobs.length; ++i) {
        const job = payload.jobs[i];

        let subject, currentStatus;

        ({ subject, currentStatus } = await queueManager.subscribe(job));

        send(ws, currentStatus);

        if (!subject) {
            subscriptions.push(null);
            finish(i);
            const hasresult = 'result' in currentStatus.payload;
            Log.debug(
                'finishing subscription!: ' + currentStatus.payload.id + ' ' + hasresult,
            );

            if (!hasresult) {
                console.log('No result:');
                console.log(currentStatus.payload);
            }
            continue;
        }

        const subscription = new Subscription();

        subscription.add(
            subject.subscribe(
                (status: Message) => {
                    if (ws.closed) {
                        Log.debug('SOCKET ALREADY CLOSED!!!');
                        return;
                    }

                    if (status.payload.result) {
                        Log.debug('result: ' + status.payload.id);
                    }

                    send(ws, status);
                },
                (error) => {
                    finish(i);
                },
                () => {
                    finish(i);
                },
            ),
        );

        subscriptions.push(subscription);
    }

    ws.onClose = () => {
        for (let i = 0; i < payload.jobs.length; ++i) {
            if (subscriptions[i]) {
                subscriptions[i].unsubscribe();
            }
            queueManager.unsubscribe(payload.jobs[i]);
        }
    };
};
