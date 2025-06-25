import * as _ from 'lodash';
import * as path from 'path';
import { of } from 'rxjs';
import { spawnDetached, spawn } from 'spawn-rx';
import { config } from './config';
import { vrpOptimizationPersistQueue, vrpOptimizationQueue } from './queues';
import { Log } from './shared/logger';
import { compress, decompress } from './utils/compression';
import * as fs from 'fs';
import { Source } from 'webpack-sources';

async function onOptimizationFinish(result: string, refer: any, done: any) {
    const json = { ...JSON.parse(result), refer };

    const compressedJson = await compress(JSON.stringify(json));

    const job = await vrpOptimizationPersistQueue.add('persist', compressedJson, {
        timeout: 20 * 1000,
        attempts: 1,
    });

    done(null, { job: { id: job.id, queueName: 'vrp_optimize_persist' } });
}

export const optimizeJob = async (job: any, done: any) => {
    Log.debug(`Job ${job.id} received`);

    const compressed = await compress(JSON.stringify(job.data));

    const input = await decompress(compressed);
    const { refer } = JSON.parse(input);

    const executablePath =
        config.executablePath ||
        path.join(
            __dirname,
            '..',
            'core',
            'jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar',
        );

    const env = Object.create(process.env);

    env.OSRM_HOST = config.osrmHost;

    const currentdate = new Date();
    const filename =
        currentdate.getFullYear() +
        '-' +
        (currentdate.getMonth() + 1) +
        '-' +
        currentdate.getDate() +
        '.' +
        currentdate.getHours() +
        ':' +
        currentdate.getMinutes() +
        ':' +
        currentdate.getSeconds() +
        '-' +
        job.id +
        '.json';

    //await fs.writeFileSync(path.join(__dirname, '..', 'optimizations', filename), input);
    const optimizeProcess = spawnDetached(
        'java',
        [
            '-jar',
            executablePath,
            'random_seed=1',
            'print_arguments=true',
            'osrm_host=dev.osrm.polpoo.com',
            'distance_objective_preference=1',
            'num_vehicles_objective_preference=1',
            'customer_satisfaction_objective_preference=1',
            'vehicle_time_balance_objective_preference=1',
            'ignore_capacity_constraint=false',
            'min_vehicles=0',
            `input_file_path=${filename}`,
            `output_file_path=${filename}`,
        ],
        {
            stdin: of(input),
            cwd: path.join(__dirname, '..', 'optimizations'),
            env,
            split: true,
        },

        /*  ,
        [`print_instance_to_file_path=${filename}`, `random_seed=1`],
        {
            stdin: of(input),
            env,
            cwd: path.join(__dirname, '..', 'optimizations'),
            split: true,
        }, */
    );

    const MIN_TIME_BETWEEN_PROGRESS_NOTIFICATIONS = 1000;
    let lastMessageTime = new Date();
    let optimizationFinished = false;

    let output = '';
    let stderr = '';
    let optimizationOutput = '';

    optimizeProcess.subscribe(
        (out: any) => {
            console.log(out);
            if (out.source === 'stdout') {
                output += out.text;
            } else {
                stderr += out.text;
                return;
            }
            const lines = _.trim(out.text).split('\n');
            for (const line of lines) {
                if (optimizationFinished) {
                    optimizationOutput += line;
                } else if (line[0] === '1') {
                    job.progress(100);
                    optimizationFinished = true;
                } else if (
                    !isNaN(line as any) &&
                    new Date().getTime() - lastMessageTime.getTime() >=
                    MIN_TIME_BETWEEN_PROGRESS_NOTIFICATIONS
                ) {
                    lastMessageTime = new Date();
                    job.progress(Math.floor(+line * 10000) / 100);
                }
            }
        },
        (error: any) => {
            // Log.debug(output);
            Log.debug(`Job ${job.id} failed hola: ${stderr}`);
            done(null, {
                error,
                output,
            });
        },
        async () => {
            Log.debug(output);
            if (stderr.length > 0) {
                done(null, {
                    error: stderr,
                    output,
                });
            } else {
                try {
                    await onOptimizationFinish(optimizationOutput, refer, done);
                } catch (error) {
                    done({
                        error,
                        context: 'Parsing optimization result',
                        output,
                    });
                }
            }

            Log.debug(`Job ${job.id} finished`);
        },
    );
};
