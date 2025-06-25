import * as pino from 'pino';
import { name } from '../../package.json';

export const Log = pino({
    name,
    level: process.env.LOG_LEVEL || 'trace',
});
