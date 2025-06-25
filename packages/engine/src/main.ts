import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise-native';
import * as tsconfigPaths from 'tsconfig-paths';
import { InjectQueue } from './lib/bull.decorators';
const tsconfig = tsconfigPaths.loadConfig(path.join(__dirname, '..')) as any;
tsconfig.baseUrl = tsconfig.absoluteBaseUrl;
tsconfigPaths.register(tsconfig);
import { Queue } from 'bull';
import * as Sentry from '@sentry/node';
import { config } from 'src/config';
import { optimizeJob } from './optimize-job';
import { vrpOptimizationQueue, vrpOptimizationPersistQueue } from './queues';
import { Log } from './shared/logger';
import { compress, decompress } from './utils/compression';
export class main {
    constructor(@InjectQueue('vrp_optimize_persist') private persistQueue: Queue) {
        this.persistQueue.process('persist', this.persistOptimization.bind(this));
    }

    private async persistOptimization(job: any) {
        try {
            var DatosCliente: any;
            var dataPost = {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: config.grantType,
            };
            let optionsAuth = {
                method: 'POST',
                uri: config.backendConfig + config.urlAuth,
                body: dataPost,
                json: true, // Automatically stringifies the body to JSON
            };

            await request(optionsAuth)
                .then(function(parsedBody) {
                    DatosCliente = parsedBody;
                })
                .catch(function(err) {
                    throw err;
                });

            let data = await decompress(job.data);
            let options = {
                method: 'POST',
                uri: config.backendConfig + config.urlPersist,
                body: JSON.parse(data),
                json: true, // Automatically stringifies the body to JSON
                headers: {
                    Authorization: DatosCliente.access_token,
                    ContenTtype: 'application/json',
                },
            };
            let value: any;

            // Log.info('job id:' + job.id);

            await request(options)
                .then(function(parsedBody) {
                    value = parsedBody;
                })
                .catch(function(err) {
                    throw err;
                });
            return value;
        } catch (e) {
            throw e;
        }
    }
}

const sentryOptions = config.createSentryOptions();

Sentry.init(sentryOptions);

new main(vrpOptimizationPersistQueue);

const optimizationsPath = path.join(__dirname, '..', 'optimizations');

if (!fs.existsSync(optimizationsPath)) {
    fs.mkdirSync(optimizationsPath);
}

vrpOptimizationQueue.process('optimize', config.processConcurrency, optimizeJob);

Log.info('Ready to process jobs');
