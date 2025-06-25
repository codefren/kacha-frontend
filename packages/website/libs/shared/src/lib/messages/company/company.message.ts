export class CompanyMessages {
    company_messages = {
        'streetAddress': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 100 caracteres.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.' }
        ],
        'country': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        'zipCode': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'serviceTypeId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        'city': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        'billingEmail': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'province': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 50 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        'nif': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidCompanyId', message: 'DNI incorrecto.' }
        ],
        'phone': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        'vehicles': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'max', message: 'Máximo 100 usuarios.' },
            { type: 'min', message: 'Mínimo 1 usuarios.' }
        ],
        'startDemoDate': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'endDemoDate': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'confirmar', message: 'Fecha inicial debe ser menor a fecha Final.' }
        ],
        'password_confirmation': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'confirmar', message: 'Las contraseñas no coinciden.' }
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'termsAccepted': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'acceptPrivacyPolicy':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'email': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'email_confirmation': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'confirmar', message: 'Los correos no coinciden.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'stripeMonthlyPrice': [
            { type: 'max', message: 'Máximo 999999.' },
            { type: 'min', message: 'Mínimo 0' }
        ],
        'urlPartnerType': [
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'required', message: 'Campo requerido.' },
        ],
        'logotypePartner': [
            { type: 'required', message: 'Campo requerido.' },
        ]
    }

    getCompanyMessages() {
      return this.company_messages;
    }

}
