export class ProfileMessages {
    profileMessages = {
        name: [
            { type: 'required', message: 'campo requerido' },
            { type: 'minlength', message: 'minimo 2 caracteres' },
            { type: 'maxlength', message: 'maximo 50 caracteres' },
            { type: 'pattern', message: 'Formato invalido.' },
        ],
        surname: [
            { type: 'required', message: 'campo requerido' },
            { type: 'minlength', message: 'minimo 2 caracteres' },
            { type: 'maxlength', message: 'maximo 50 caracteres' },
            { type: 'pattern', message: 'Formato invalido.' },
        ],
        phone: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxlength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
        ],
        nationalId: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidCompanyId', message: 'DNI incorrecto.' },
            { type: 'maxlength', message: 'maximo 50 caracteres' },
        ],
    };

    getUserMessages() {
        return this.profileMessages;
    }
}
