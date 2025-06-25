import * as Bull from 'bull';
import { JobDescriptor } from 'src/interfaces/job-descriptor.interface';

export interface JobStatusResponseMessage {
    type: 'job_status';
    payload: {
        jobs: Array<
            JobDescriptor & {
                state?: Bull.JobStatus;
                progress?: number;
                found: boolean;
                step?: number;
                attempsMade?: number;
            }
        >;
    };
}
