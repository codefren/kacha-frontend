export class UserMessages {
    user_messages = {
        email: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        email_confirmation: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'confirmar', message: 'Los correos no coinciden.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        companyId: [{ type: 'required', message: 'Campo requerido.' }],
        nationalId: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidCompanyId', message: 'DNI incorrecto.' },
            { type: 'maxLength', message: 'Maximo 50 carácteres.' },
        ],
        phone: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxLength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
        ],
        phone_user: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxLength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en' },
        ],
        name_user: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxLength', message: 'Maximo 50 carácteres.' },
        ],
        name: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        surname: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        password: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalid', message: 'Campo incorrecto.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' },
        ],
        password_confirmation: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'confirmar', message: 'Las contraseñas no coinciden.' },
        ],
        isActive: [{ type: 'required', message: 'Campo requerido.' }],
        termsAccepted: [{ type: 'required', message: 'Campo requerido.' }],
        acceptPrivacyPolicy: [{ type: 'required', message: 'Campo requerido.' }],
        country: [{ type: 'required', message: 'Campo requerido' }],
        monthlyObjective: [
            { type: 'max', message: 'Máximo 999999.' },
            { type: 'min', message: 'Mínimo 0' }
        ],
        commissionOrdersPercentage: [
            { type: 'max', message: 'Máximo 999999.' },
            { type: 'min', message: 'Mínimo 0' }
        ],
        commissionOrdersAppPercentage: [
            { type: 'max', message: 'Máximo 999999.' },
            { type: 'min', message: 'Mínimo 0' }
        ],
        
    };

    getUserMessages() {
        return this.user_messages;
    }
}
