import { name } from 'package.json';
import * as pino from 'pino';

export const Log = pino({
    name,
    level: process.env.LOG_LEVEL || 'trace',
}) as any;

Log.log = Log.info;
