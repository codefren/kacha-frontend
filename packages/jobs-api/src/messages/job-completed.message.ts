import { JobDescriptor } from 'src/interfaces/job-descriptor.interface';

export interface JobCompletedMessage {
    type: 'job_completed';
    payload: JobDescriptor & {
        result: any;
    };
}
