import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import * as Bull from 'bull';
import { BullQueueProcessor } from './bull.types';

export interface BullModuleQueueOptions {
  name?: string;
  options?: Bull.QueueOptions;
  processors?: BullQueueProcessor[];
}
export interface BullModuleOptions {
  queues: BullModuleQueueOptions[];
}

export interface BullQueueOptionsFactory {
  createBullOptions(): Promise<BullModuleQueueOptions> | BullModuleQueueOptions;
}

export interface BullModuleQueueAsyncOptions {
  name?: string;
  useExisting?: Type<BullQueueOptionsFactory>;
  useClass?: Type<BullQueueOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<BullModuleQueueOptions> | BullModuleQueueOptions;
  inject?: any[];
}

export interface BullModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  queues: BullModuleQueueAsyncOptions[];
}
