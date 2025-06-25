import { Directive, Input } from '@angular/core';
import {
    NG_VALIDATORS,
    Validator,
    AbstractControl,
    ValidatorFn,
    FormGroup,
    ValidationErrors,
} from '@angular/forms';
import { UtilData } from './util-data';
declare var validator;

export const ValidatePhone = (country: string) => (control: AbstractControl) => {
    const countryCode = UtilData.getCountryCode(country);
    let valid = false;
    if (countryCode) {
        if (!control.value) return null;
        const formattedPhone = control.value.toString().replace(/\s/g, '');
        if (formattedPhone.lenght === 0) return null;
        const locales = UtilData.getLocalesFromCountry(countryCode);
        valid = validator.isMobilePhone(formattedPhone, locales);
    }
    return valid ? null : { invalidPhone: true };
};
