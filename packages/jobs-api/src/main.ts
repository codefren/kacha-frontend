import * as path from 'path';
import * as tsconfigPaths from 'tsconfig-paths';

const tsconfig = tsconfigPaths.loadConfig(path.join(__dirname, '..')) as any;
tsconfig.baseUrl = tsconfig.absoluteBaseUrl;
tsconfigPaths.register(tsconfig);

import * as Sentry from '@sentry/node';
import { Buffer } from 'buffer';
import { jobStatusHandler } from 'src/handlers/job-status.handler';
import { Message } from 'src/interfaces/message.interface';
import * as uWS from 'uWebSockets.js';
import { config } from './config';
import { Ws } from './interfaces/ws.interface';
import { Log } from './shared/logger';
import { redisHealthCheck } from './redis-health-check';
import { createTerminus } from '@godaddy/terminus';

const sentryOptions = config.createSentryOptions();
Sentry.init(sentryOptions);

const port = config.port;

const server = uWS.App({});

server
    .ws('/*', {
        compression: 0,
        maxPayloadLength: 16 * 1024 * 1024,
        message: async (uWs: uWS.WebSocket, message: ArrayBuffer) => {
            const ws = uWs as Ws;

            if (ws.handled) {
                return;
            }

            // TODO: Check if already authenticated
            const content: Message = JSON.parse(Buffer.from(message) as any);
            Log.debug('Received message:');
            Log.debug(content);

            switch (content.type) {
                case 'job_status':
                    ws.handled = true;
                    try {
                        await jobStatusHandler(ws, content.payload);
                    } catch (error) {
                        Sentry.captureException(error);
                        ws.end(500, 'Internal server error');
                    }

                    break;
                default:
                    ws.end(400, `Unknown message type ${content.type}`);
            }
        },
        close: (uWs: uWS.WebSocket, code: any, message: ArrayBuffer) => {
            const ws = uWs as Ws;

            Log.debug(
                `Connection closed due to ${code}, message ${String.fromCharCode.apply(
                    null,
                    message as any,
                )}`,
            );
            ws.closed = true;

            if (ws.onClose) {
                ws.onClose(code, message);
            }
        },
    })
    .any('*', (res) => {
        res.writeStatus('200 OK').end('');
    })
    .listen(port, (token: string) => {
        if (token) {
            Log.info('Listening to port ' + port);
        } else {
            Log.info('Failed to listen to port ' + port);
        }
    });
