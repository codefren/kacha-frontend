import { JobDescriptor } from 'src/interfaces/job-descriptor.interface';

export interface JobStatusRequestMessagePayload {
    jobs: JobDescriptor[];
}
export interface JobStatusRequestMessage {
    type: 'job_status';
    payload: JobStatusRequestMessagePayload;
}
