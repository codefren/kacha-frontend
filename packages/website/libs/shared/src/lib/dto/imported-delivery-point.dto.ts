import {
    IsString,
    validate,
    ValidateNested,
    IsNotEmpty,
    ArrayNotEmpty,
    IsJSON,
    ArrayMinSize,
    IsDefined,
    MinLength,
    MaxLength,
    IsOptional,
    Min,
    IsInt,
    Max,
    IsNumber,
    IsCurrency,
    IsBoolean,
} from 'class-validator';
import { Type, Exclude, Transform } from 'class-transformer';
import { IsGreaterThan } from '../validators/is.greater-than';
import { ValidatorErrors } from './validator-errors-as-string';
import { start } from 'repl';

export const ImportedDeliveryPointDtoErrors = {
    id: (
        constraint: string,
        id: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `El ID ${extraInformation.id} y nombre ${
            extraInformation.name
        } `;
        switch (error) {
            case 'isDefined':
                return (
                    'El punto de entrega de la posición ' +
                    extraInformation.position +
                    ' ' +
                    ValidatorErrors[error]('id')
                );
            case 'minLength':
                return startMessage + ValidatorErrors[error](1);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](50);
            case 'isString':
                return (
                    `Error en el cliente en la posición ${extraInformation.position}` +
                    ValidatorErrors[error]('id')
                );
        }
    },
    address: (
        constraint: {},
        address: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La dirección de entrega ${address}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'minLength':
                return startMessage + ValidatorErrors[error](2);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](200);
            case 'isString':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('address')
                );
        }
    },
    coordinates: (
        constraint: {},
        coordinatesValidator: any,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        let result = '';
        let first = true;
        for (let coordinatesValidatorSegment of coordinatesValidator.children) {
            if (first) {
                first = false;
            } else {
                result += '<br>';
            }
            const error = Object.keys(coordinatesValidatorSegment.constraints)[0];
            const step =
                coordinatesValidatorSegment.property === 'longitude'
                    ? 'longitud'
                    : 'latitud';
            const startMessage = `La ${step} de las coordenadas introducidas, del ID ${
                extraInformation.id
            } y nombre ${extraInformation.name}, `;
            const min = step === 'longitud' ? -180 : -90;
            const max = step === 'longitud' ? 180 : 90;
            switch (error) {
                case 'min':
                    result += startMessage + ValidatorErrors[error](min);
                    break;
                case 'max':
                    result += startMessage + ValidatorErrors[error](max);
                    break;
                case 'isInt':
                    let name = 'coordinates.' + step;
                    result +=
                        `Error en el cliente con ID ${extraInformation.id} y nombre ${
                            extraInformation.name
                        }. ` + ValidatorErrors[error](name as any);
                    break;
            }
        }
        return result;
    },
    name: (
        constraint: {},
        name: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `El nombre ${name}, del ID ${extraInformation.id}, `;
        switch (error) {
            case 'minLength':
                return startMessage + ValidatorErrors[error](2);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](150);
            case 'isString':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('name')
                );
        }
    },

    deliveryZoneId: (
        constraint: {},
        deliveryZoneId: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La ruta ${deliveryZoneId}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'minLength':
                return startMessage + ValidatorErrors[error](1);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](50);
            case 'isString':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('deliveryZoneId')
                );
        }
    },
    email: (
        constraint: {},
        email: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        console.log(error);
        const startMessage = `La ruta ${email}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'minLength':
                return startMessage + ValidatorErrors[error](1);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](100);
        }
    },
    deliveryWindow: (
        constraint: {},
        deliveryWindowValidator: any,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        let result = '';
        let first = true;
        for (let deliveryWindowValidatorSegment of deliveryWindowValidator.children) {
            if (first) {
                first = false;
            } else {
                result += '<br>';
            }

            const error = Object.keys(deliveryWindowValidatorSegment.constraints)[0];

            const step =
                deliveryWindowValidatorSegment.property === 'start' ? 'inicio' : 'final';

            const startMessage = `El ${step} de la ventana de entrega, del ID ${
                extraInformation.id
            } y nombre ${extraInformation.name}, `;

            switch (error) {
                case 'min':
                    result += startMessage + ValidatorErrors[error](-1);
                    break;
                case 'max':
                    result += startMessage + ValidatorErrors[error](24 * 3600 - 1);
                    break;
                case 'isGreaterThan':
                    result += `La hora de apertura (${
                        deliveryWindowValidatorSegment.target.start
                    }), del ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }, es superior a la hora de cierre (${
                        deliveryWindowValidatorSegment.target.end
                    }). La hora de apertura nunca puede ser superior a la hora de cierre`;
                    break;
                case 'isInt':
                    let name = 'deliveryWindow.' + step;
                    result +=
                        `Error en el cliente con ID ${extraInformation.id} y nombre ${
                            extraInformation.name
                        }. ` + ValidatorErrors[error](name as any);
                    break;
            }
        }
        return result;
    },
    demand: (
        constraint: {},
        demand: number,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La demanda ${demand}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'min':
                return startMessage + ValidatorErrors[error](0);
            case 'isInt':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('demand')
                );
        }
    },
    volumetric: (
        constraint: {},
        volumetric: number,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La volumétrica ${volumetric}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'min':
                return startMessage + ValidatorErrors[error](0);
            case 'isInt':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('volumetric')
                );
        }
    },
    serviceTime: (
        constraint: {},
        serviceTime: number,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `El tiempo de servicio ${serviceTime}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'min':
                return startMessage + ValidatorErrors[error](0);
            case 'max':
                return startMessage + ValidatorErrors[error](24 * 3600 - 1);
            case 'isInt':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('serviceTime')
                );
        }
    },

    priority: (
        constraint: {},
        priority: number,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La prioridad ${priority}, del ID ${
            extraInformation.id
        } y nombre ${extraInformation.name}, `;
        switch (error) {
            case 'min':
                return startMessage + ValidatorErrors[error](0);
            case 'max':
                return startMessage + ValidatorErrors[error](3);
            case 'isInt':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('priority')
                );
        }
    },

    deliveryNotes: (
        constraint: {},
        deliveryNotes: string,
        extraInformation?: {
            position?: number;
            id?: string;
            name?: string;
        },
    ) => {
        const error = Object.keys(constraint)[0];
        const startMessage = `La nota introducida, del ID ${extraInformation.id} y nombre ${
            extraInformation.name
        }, `;
        switch (error) {
            case 'minLength':
                return startMessage + ValidatorErrors[error](1);
            case 'maxLength':
                return startMessage + ValidatorErrors[error](1000);
            case 'isString':
                return (
                    `Error en el cliente con ID ${extraInformation.id} y nombre ${
                        extraInformation.name
                    }. ` + ValidatorErrors[error]('deliveryNotes')
                );
                break;
        }
    },
};

export class ImportedProductsDeliveryPointArrayDto {
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ImportedProductsDeliveryPointDto)
    deliveryPoints: ImportedProductsDeliveryPointDto;
}

export class ImportedDeliveryPointArrayDto {
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ImportedDeliveryPointDto)
    deliveryPoints: ImportedDeliveryPointDto[];
}

export class ImportedProductsDeliveryPointDto {
    @IsDefined()
    @MinLength(1)
    @MaxLength(50)
    id: string;

    @IsOptional()
    @MinLength(1)
    @MaxLength(50)
    deliveryNoteCode;

    @IsDefined()
    @Min(0)
    @IsInt()
    taxPercent: number;

    @IsDefined()
    @Type(() => Products)
    products: Products;
}

export class ImportedDeliveryPointDto {
    @IsDefined()
    @MinLength(1)
    @MaxLength(50)
    id: string;

    @IsOptional()
    @MinLength(2)
    @MaxLength(200)
    address?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Coordinates)
    coordinates: Coordinates;

    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    name?: string;

    @IsOptional()
    @MinLength(1)
    @MaxLength(50)
    deliveryZoneId?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => TimeInterval)
    deliveryWindow?: TimeInterval;

    @IsOptional()
    @Min(0)
    demand?: number;

    @IsOptional()
    volumetric?: number;

    @IsOptional()
    @Min(0)
    @Max(24 * 3600 - 1)
    @IsInt()
    serviceTime?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(3)
    priority: number;

    @IsOptional()
    @MinLength(1)
    @MaxLength(1000)
    deliveryNotes: string;

    @IsOptional()
    @MinLength(1)
    @MaxLength(1000)
    deliveryNoteCode: string;

    @IsOptional()
    taxPercent: number;

    @IsOptional()
    @IsBoolean()
    requiredSignature: boolean;

    @IsOptional()
    @MinLength(0)
    @MaxLength(100)
    email: string;

    @IsOptional()
    @MinLength(0)
    @MaxLength(100)
    phoneNumber: string;

    @IsOptional()
    @IsInt()
    leadTime: number;

    @IsOptional()
    @IsInt()
    allowedDelayTime: number;

    @IsOptional()
    @IsBoolean()
    sendDeliveryNoteMail: boolean;

    @IsOptional()
    orderId?: boolean;

    @IsOptional()
    agentUserMail?: string;

    @IsOptional()
    population?: string;

    @IsOptional()
    idERP?: string;

    @IsOptional()
    deliveryType?: string;

    @IsOptional()
    orderNumber?: string;

    @IsOptional()
    service: any;

    @IsOptional()
    delayType?: string;

    @IsOptional()
    allowDelayTime?: boolean;

    @IsOptional()
    deliveryZoneSpecification: any;

    @IsOptional()
    activateDeliverySchedule: boolean;

    @IsOptional()
    deliveryScheduleDay: any;

    @IsOptional()
    postalCode: string;

    @IsOptional()
    deliveryIdentifier: string;

    @IsOptional()
    box: string;

    @IsOptional()
    nif: string;

}

export class TimeInterval {
    @IsOptional()
    @Min(-1)
    @Max(24 * 3600 - 1)
    start?: number;

    @IsOptional()
    @IsInt()
    @Min(-1)
    @Max(24 * 3600 - 1)
    @IsGreaterThan('start', {
        strict: true,
        undefined: true,
        default: true,
        specialValue: -1,
    })
    end?: number;
}

export class Coordinates {
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number;
}

export class Products {
    @MinLength(2)
    @MaxLength(150)
    name: string;

    @MinLength(2)
    @MaxLength(150)
    code: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsCurrency()
    price: number;

    @IsNumber()
    @Min(1)
    measureQuantity: number;
}
