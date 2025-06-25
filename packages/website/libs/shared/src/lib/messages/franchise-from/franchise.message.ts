export class FranchiseMessages {
    franchiseMessages = {
        name: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 1 caracteres' },
            { type: 'maxlength', message: 'Máximo 255 caracteres' },
        ],
        nif: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'invalidCompanyId', message: 'CIF incorrecto.' }
        ],
        streetAddress:[
            { type: 'required', message: 'Campo requerido' },
            { type: 'minlength', message: 'Mínimo 4 caracteres' },
            { type: 'maxlength', message: 'Máximo 1000 caracteres' },
        ],
        phone:[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        billingEmail: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        email: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        password: [
            { type: 'required', message: 'campo requerido' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        responsableName:[
            { type: 'required', message: 'campo requerido' },
            { type: 'maxlength', message: 'Máximo 255 caracteres.' },
            { type: 'minlength', message: 'Mínimo 1 caracteres.' }
        ],
        password_confirmation: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'confirmar', message: 'Las contraseñas no coinciden.' },
        ],
        scheduleStart:[
            {
                type: 'confirmar',
                message: 'El horario de inicio no puede ser igual al horario hasta',
            },
            {
                type: 'sutrast',
                message: 'El tiempo de inicio no puede ser mayor a tiempo hasta',
            },
        ],
        scheduleEnd:[
            {
                type: 'confirmar',
                message: 'El horario hasta no puede ser igual al horario de inicio',
            },
            {
                type: 'sutrast',
                message: 'El horario hasta no puede ser menor al horario de inicio',
            },
        ]
    };

    getFranchiseMessages() {
        return this.franchiseMessages;
    }
}
