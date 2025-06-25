import * as Queue from 'bull';
import { config } from './config';

const vrpOptimizationQueueOptions = config.createBullQueueOptions('vrp_optimize');

export const vrpOptimizationQueue = new Queue(
    vrpOptimizationQueueOptions.name,
    vrpOptimizationQueueOptions.options,
);

const vrpOptimizationPersistQueueOptions = config.createBullQueueOptions(
    'vrp_optimize_persist',
);

export const vrpOptimizationPersistQueue = new Queue(
    vrpOptimizationPersistQueueOptions.name,
    vrpOptimizationPersistQueueOptions.options,
);
