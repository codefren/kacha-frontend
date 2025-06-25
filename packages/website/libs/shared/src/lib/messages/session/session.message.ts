export class SessionMessages {
    session_messages = {

        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'description': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.' },
            { type: 'maxlength', message: 'Máximo 1000 caracteres.' },
        ],
        'savedDate': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'start': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        
    };

    getSessionMessages() {
      return this.session_messages;
    }

}