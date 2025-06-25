export class CompanyProfileMessages {
    companyProfileMessages = {
        billingEmail: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        name: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
        ],
        country: [{ type: 'required', message: 'Campo requerido.' }],
        city: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
        ],
        zipCode: [{ type: 'required', message: 'Campo requerido' }],
        streetAdress: [
            { type: 'required', message: 'Campo requerido' },
            { type: 'minlength', message: 'Minimo 10 caracteres' },
            { type: 'pattern', message: 'Formato invalido.' },
        ],
        province: [{ type: 'required', message: 'Campo requerido.' }],
        createdBy: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        serviceTypeId: [{ type: 'required', message: 'Campo requerido' }],
        currencyId: [{ type: 'required', message: 'campo requerido' }],
       /*  nif: [{ type: 'required', message: 'campo requerido' }] */
       nif: [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'invalidCompanyId', message: 'DNI incorrecto.' }
        ],
        phone: [
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxlength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
        ],
    };

    getCompanyProfileMessages() {
        return this.companyProfileMessages;
    }
}
