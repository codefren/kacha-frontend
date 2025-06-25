import { Provider } from '@nestjs/common';
import * as Bull from 'bull';
import { Queue } from 'bull';
import {
    BullModuleAsyncOptions,
    BullModuleOptions,
    BullModuleQueueAsyncOptions,
    BullModuleQueueOptions,
    BullQueueOptionsFactory,
} from './bull.interfaces';
import { BullQueueProcessor, isAdvancedProcessor } from './bull.types';
import { getQueueToken } from './bull.utils';

function buildQueue(option: BullModuleQueueOptions): Queue {
    const queue: Queue = new Bull(option.name ? option.name : 'default', option.options);

    if (option.processors) {
        option.processors.forEach((processor: BullQueueProcessor) => {
            if (isAdvancedProcessor(processor)) {
                const hasName = !!processor.name;
                const hasConcurrency = !!processor.concurrency;
                hasName && hasConcurrency
                    ? queue.process(
                          processor.name,
                          processor.concurrency,
                          processor.callback,
                      )
                    : hasName
                    ? queue.process(processor.name, processor.callback)
                    : queue.process(processor.concurrency, processor.callback);
            } else {
                queue.process(processor);
            }
        });
    }

    return queue;
}

export function createQueuesProviders(options: BullModuleOptions): any[] {
    return options.queues.map((option: BullModuleQueueOptions) => ({
        provide: getQueueToken(option.name),
        useValue: buildQueue(option),
    }));
}

export function createAsyncQueuesProviders(options: BullModuleAsyncOptions): Provider[] {
    const classProviders: Provider[] = [];

    return options.queues
        .map(
            (option: BullModuleQueueAsyncOptions): Provider => {
                if (option.useFactory) {
                    return {
                        provide: getQueueToken(option.name),
                        useFactory: async (...args: any[]) =>
                            buildQueue(await option.useFactory(...args)),
                        inject: option.inject || [],
                    };
                }
                if (option.useClass) {
                    classProviders.push({
                        provide: option.useClass,
                        useClass: option.useClass,
                    });
                }
                return {
                    provide: getQueueToken(option.name),
                    useFactory: async (optionFactory: BullQueueOptionsFactory) =>
                        buildQueue(await optionFactory.createBullOptions()),
                    inject: [option.useClass || option.useExisting],
                };
            },
        )
        .concat(classProviders);
}
