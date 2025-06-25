import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import * as Redis from 'ioredis';
import * as _ from 'lodash';
import { description, name, version } from '../../package.json';
import { Log } from '../shared/logger';

export interface EnvConfig {
    [key: string]: string;
}

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().default('local'),

    PORT: Joi.number().default(9000),

    REDIS_URL: Joi.string()
        .uri({
            scheme: 'redis',
        })
        .default((context: any) => `redis://localhost:6379?db=0`, 'redis url'),

    // ERROR TRACKING

    SENTRY_DSN: Joi.string().uri({
        scheme: ['https'],
    }),

    LOG_LEVEL: Joi.string()
        .valid(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
        .optional(),
});

export class Config {
    public get logLevel() {
        if (this.envConfig.LOG_LEVEL) {
            return this.envConfig.LOG_LEVEL;
        } else {
            return this.isLocal ? 'debug' : 'warn';
        }
    }

    public get environment() {
        return this.envConfig.NODE_ENV;
    }

    public get isProduction() {
        return this.environment === 'production';
    }

    public get isDevelopment() {
        return this.environment === 'development';
    }

    public get isLocal() {
        return this.environment === 'local';
    }

    public get projectName() {
        return _.capitalize(name);
    }

    public get version() {
        return version;
    }

    public get projectDescription() {
        return description;
    }

    public get processConcurrency() {
        return parseInt(this.envConfig.PROCESS_CONCURRENCY);
    }

    private readonly envConfig: EnvConfig;
    public redisClient: any;
    private redisSubscriber: any;

    constructor() {
        dotenv.config();

        this.envConfig = this.transform(this.validateInput(process.env));

        this.redisClient = new Redis(this.envConfig.REDIS_URL);
        this.redisSubscriber = new Redis(this.envConfig.REDIS_URL);
    }

    public createBullQueueOptions(queueName: string) {
        return {
            name: queueName,
            options: {
                createClient: (type: string) => {
                    switch (type) {
                        case 'client':
                            return this.redisClient;
                        case 'subscriber':
                            return this.redisSubscriber;
                        default:
                            return new Redis(this.envConfig.REDIS_URL);
                    }
                },
            },
        };
    }

    public createSentryOptions() {
        return {
            dsn: this.envConfig.SENTRY_DSN,
            release: this.version,
            environment: this.environment,
            enabled: !this.isLocal,
        };
    }

    private transform(envConfig: EnvConfig) {
        return envConfig;
    }

    private validateInput(envConfig: EnvConfig): EnvConfig {
        const { error, value: validatedEnvConfig } = Joi.validate(
            envConfig,
            envVarsSchema,
            { allowUnknown: true, stripUnknown: true },
        );

        if (error) {
            Log.error(`config validation error ${error.message}`);
            process.exit(1);
        }

        return validatedEnvConfig;
    }

    public get port() {
        return parseInt(this.envConfig.PORT);
    }
}

export const config = new Config();
