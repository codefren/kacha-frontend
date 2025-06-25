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

export function ValidateCountry(control: AbstractControl) {
    return UtilData.getCountryCode(control.value) ? null : { invalidCountry: true };
}
