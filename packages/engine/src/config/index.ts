import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import * as Redis from 'ioredis';
import * as _ from 'lodash';
import { description, name, version } from 'package.json';
import { Log } from 'src/shared/logger';

export interface EnvConfig {
    [key: string]: string;
}

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().default('local'),
    REDIS_URL: Joi.string()
        .uri({
            scheme: 'redis',
        })
        .default((context: any) => `redis://localhost:6379?db=0`, 'redis url'),

    // ERROR TRACKING

    SENTRY_DSN: Joi.string().uri({
        scheme: ['https'],
    }),

    // QUEUE PROCESSING

    PROCESS_CONCURRENCY: Joi.number()
        .min(1)
        .default(1),

    EXECUTABLE_PATH: Joi.string(),

    OSRM_HOST: Joi.string().default('dev.osrm.polpoo.com'),

    LOG_LEVEL: Joi.string()
        .valid(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
        .optional(),

    CLIENT_ID: Joi.string().default('1'),

    CLIENT_SECRET: Joi.string().default('tT96kecNtYVf92dvRfQ1Ikj6sjsx5tKZzaCCpHun'),

    GRANT_TYPE: Joi.string().default('client_credentials'),

    URL_AUTH: Joi.string().default('oauth/token_client'),

    URL_PERSIST: Joi.string().default('route-planning/route/persist'),

    BACKEND_URL: Joi.string().default('http://localhost:8000/api/'),
});

export class Config {
    public get logLevel() {
        if (this.envConfig.LOG_LEVEL) {
            return this.envConfig.LOG_LEVEL;
        } else {
            return this.isLocal ? 'debug' : 'warn';
        }
    }

    public get backendConfig() {
        return (
            this.envConfig.BACKEND_URL ||
            (this.isProduction
                ? 'https://dev.restapi.optimroute.com/api/'
                : 'http://localhost:8000/api/')
        );
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

    public get osrmHost() {
        return this.envConfig.OSRM_HOST;
    }

    public get grantType() {
        return this.envConfig.GRANT_TYPE;
    }

    public get clientSecret() {
        return this.envConfig.CLIENT_SECRET;
    }

    public get clientId() {
        return this.envConfig.CLIENT_ID;
    }
    public get urlAuth() {
        return this.envConfig.URL_AUTH;
    }

    public get urlPersist() {
        return this.envConfig.URL_PERSIST;
    }

    private readonly envConfig: EnvConfig;
    private redisClient: any;
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

    public get executablePath() {
        return this.envConfig.EXECUTABLE_PATH;
    }
}

export const config = new Config();
