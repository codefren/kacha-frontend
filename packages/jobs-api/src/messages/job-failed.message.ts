import { JobDescriptor } from 'src/interfaces/job-descriptor.interface';

export interface JobFailedMessage {
    type: 'job_failed';
    payload: JobDescriptor & {
        error: any;
    };
}
