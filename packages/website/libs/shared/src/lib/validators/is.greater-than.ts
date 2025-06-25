import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as _ from 'lodash';

interface IsGreaterThanOptions {
    strict?: boolean;
    undefined?: boolean;
    default?: boolean;
    specialValue?: number;
}

export function IsGreaterThan(
    property: string,
    options: IsGreaterThanOptions,
    validationOptions?: ValidationOptions,
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isGreaterThan',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (value === undefined || relatedValue === undefined) {
                        return options.undefined;
                    } else if (
                        options.specialValue &&
                        (value === options.specialValue ||
                            relatedValue === options.specialValue)
                    ) {
                        return options.default;
                    } else if (options.strict) {
                        return value > relatedValue;
                    } else {
                        return value >= relatedValue;
                    }
                },

                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    const value = args.value;
                    if (value === null || relatedValue === null) {
                        return `${propertyName} or ${relatedPropertyName} cannot be null`;
                    } else if (options.strict) {
                        return (
                            `${propertyName} has to be strictly greater than ` +
                            `${relatedPropertyName}`
                        );
                    } else {
                        return (
                            `${propertyName} has to be greater than ` +
                            `${relatedPropertyName}`
                        );
                    }
                },
            },
        });
    };
}
