export class PasswordMessages {
    passwordMessages = {
        password: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalid', message: 'Campo incorrecto.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' },
        ],
        password_confirmation: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'confirmar', message: 'Las contraseñas no coinciden.' },
        ],
        current_password: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalid', message: 'Campo incorrecto.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' },
        ],
    };

    getPasswordMessages() {
        return this.passwordMessages;
    }
}
