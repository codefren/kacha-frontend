export class DeliveryNoteMessages {
    deliveryNoteMessages = {
        name: [
            { type: 'minlength', message: 'Mínimo 2 caracteres' },
            { type: 'maxlength', message: 'Máximo 100 caracteres' },
        ],
        nif: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'invalidCompanyId', message: 'CIF incorrecto.' }
        ],
        countryCode: [
            { type: 'minlength', message: 'Mínimo 2 caracteres' },
            { type: 'maxlength', message: 'Máximo 50 caracteres' },
        ],
        country: [
            { type: 'minlength', message: 'Mínimo 2 caracteres' },
            { type: 'maxlength', message: 'Máximo 50 caracteres' },
        ],
        streetAddress:[
            { type: 'minlength', message: 'Mínimo 10 caracteres' },
            { type: 'maxlength', message: 'Máximo 1000 caracteres' },
        ],
        province:[
            { type: 'required', message: 'campo requerido' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        zipCode:[
            { type: 'required', message: 'campo requerido' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        phone:[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        billingEmail: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ]
       
    };

    getDeliveryNoteMessages() {
        return this.deliveryNoteMessages;
    }
}
