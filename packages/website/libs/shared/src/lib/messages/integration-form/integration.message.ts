export class IntegrationMessages {
    Integration_messages = {
        'description': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.' }
        ],

        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Máximo 300 caracteres.' }
        ],

        'dateSession': [
            { type: 'required', message: 'Campo requerido.' }
        ],
       
    }

    getIntegrationMessages() {
      return this.Integration_messages;
    }

}
