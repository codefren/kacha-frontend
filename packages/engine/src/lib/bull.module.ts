import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { BullModuleAsyncOptions, BullModuleOptions } from './bull.interfaces';
import { createAsyncQueuesProviders, createQueuesProviders } from './bull.providers';

@Global()
@Module({})
export class BullModule {
    public static forRoot(options: BullModuleOptions): DynamicModule {
        const providers: any[] = createQueuesProviders(options);
        return {
            module: BullModule,
            providers,
            exports: providers,
        };
    }

    public static forRootAsync(options: BullModuleAsyncOptions): DynamicModule {
        const providers: Provider[] = createAsyncQueuesProviders(options);
        return {
            imports: options.imports,
            module: BullModule,
            providers,
            exports: providers,
        };
    }
}
