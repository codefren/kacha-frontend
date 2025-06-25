import { Directive, Input } from '@angular/core';
import {
    NG_VALIDATORS,
    Validator,
    AbstractControl,
    ValidatorFn,
    FormGroup,
    ValidationErrors,
} from '@angular/forms';

export const ValidateCompanyId = (country: string) => (control: AbstractControl) => {
    if (control.value == null) { return; }
    const id = control.value.toString();
    if (!id) { return null; }
    let valid = true;
    switch (country) {
        case 'España':
            valid = validateCIF(id) || validateDNI(id);
    }
    return valid ? null : { invalidCompanyId: true };
};

/*
 * Tiene que recibir el cif sin espacios ni guiones
 */function validateCIF(cif): boolean {
    if (!cif || cif.length !== 9) {
        return false;
    }

    let letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let digits = cif.substr(1, cif.length - 2);
    let letter = cif.substr(0, 1);
    let control = cif.substr(cif.length - 1);
    let sum = 0;
    let i;
    let digit;

    if (!letter.match(/[A-Z]/)) {
        return false;
    }

    for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);

        if (isNaN(digit)) {
            return false;
        }

        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = parseInt(''+(+digit / 10)) + (digit % 10);
            }

            sum += digit;
        } else {
            sum += digit;
        }
    }

    sum %= 10;
    if (sum !== 0) {
        digit = 10 - sum;
    } else {
        digit = sum;
    }

    if (letter.match(/[ABEH]/)) {
        return String(digit) === control;
    }
    if (letter.match(/[NPQRSW]/)) {
        return letters[digit] === control;
    }

    
    return String(digit) === control || letters[digit] === control;
    
}

/*
 * Tiene que recibir el dni sin espacios ni guiones
 * Esta funcion es llamada
 */
function validateDNI(dni): boolean {
    var numero, sub, letra;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if(expresion_regular_dni.test(dni) === true){
        numero = dni.substr(0,dni.length-1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        sub = dni.substr(dni.length-1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero+1);
        if (letra != sub) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        }else{
            //alert('Dni correcto');
            return true;
        }
    }else{
        //alert('Dni erroneo, formato no válido');
        return false;
    }
}
