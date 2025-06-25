export class PartnersMessages {
    partners_messages = {
        
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'cif': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidCompanyId', message: 'DNI incorrecto.' }
        ],
        'email':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 5 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'},
            { type: 'confirmar', message: 'Los correos no coinciden.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        'phone':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxlength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en españa' },
        ],
        'address': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 carácteres.' },
            { type: 'maxlength', message: 'Maximo 1000 carácteres.' },
        ],
        'population': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 50 carácteres.'}
        ],
        'postalCode': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 50 carácteres.'}
        ],

        'email_user': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'minlength', message: 'Mínimo 5 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'},
            { type: 'confirmar', message: 'Los correos no coinciden.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        'name_user': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 40 carácteres.'}
        ],
        'surname': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 40 carácteres.'}
        ],
        'phone_user': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 carácteres.' },
            { type: 'maxlength', message: 'Maximo 11 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en españa' },
        ],
        'password': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalid', message: 'Campo incorrecto.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' },
            { type: 'maxlength' , message: 'Maximo 40 carácteres.'}
        ],
        'password_confirmation': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' },
            { type: 'maxlength' , message: 'Maximo 40 carácteres.'},
            { type: 'confirmar', message: 'Las contraseñas no coinciden.' },
        ],
    };

    getPartnersMessages() {
      return this.partners_messages;
    }

}