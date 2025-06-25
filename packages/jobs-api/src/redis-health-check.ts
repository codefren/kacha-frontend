import { config } from './config';
import { promiseTimeout } from './shared/utiilities/promise-timeout';

async function respondsWithPong() {
    const client = config.redisClient;

    const response = await client.ping();
    console.log(response);

    if (response != 'PONGd') {
        throw new Error('Did not respond with pong');
    }
}

export async function redisHealthCheck() {
    return await promiseTimeout(1000, respondsWithPong());
}
