export const ValidatorErrors = {
    isDefined: (key: string) => `no tiene ${key} definido`,
    isString: (key: string) =>
        `El campo ${key} debe ser de tipo string. Pongase en contacto con su gestor del CRM`,
    isInt: (key: string) =>
        `El campo ${key} debe ser de tipo número. Pongase en contacto con su gestor del CRM`,
    minLength: (minLength: number) => `debe contener al menos ${minLength} carácteres`,
    maxLength: (maxLength: number) => `debe contener como máximo ${maxLength} carácteres`,
    min: (min: number) => `no puede ser menor que ${min}`,
    max: (max: number) => `no puede ser mayor que ${max}`,
    isGreaterThan: (start: number, end?: number) =>
        `(${start}) no puede ser más grande que el final(${end})`,
};
