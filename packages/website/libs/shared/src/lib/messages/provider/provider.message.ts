export class ProvidersMessages {
    provider_messages = {
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 1 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 255 carácteres.'}
        ],
        'providerTypeId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'providerAssigmentTypeId':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'contactPerson': [
            { type: 'maxlength' , message: 'Maximo 255 carácteres.'},
        ],
        'email': [
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'phoneNumber': [
            { type: 'minlength', message: 'Mínimo 5 carácteres.' },
            { type: 'maxlength', message: 'Maximo 30 carácteres.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en ' },
        ],
    };

    getProvidersMessages() {
      return this.provider_messages;
    }

}