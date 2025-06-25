import { AbstractControl } from '@angular/forms';

export function isIntegerValidator(control: AbstractControl) {
    return typeof control.value === 'number' && control.value % 1 !== 0
        ? { isNotInteger: true }
        : null;
}
