export class DocumentMessages {
    document_messages = {
        
        'name':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 100 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        'date': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'document': [
            { type: 'required', message: 'Campo requerido.' }
        ]
    };

    getDocumentMessages() {
      return this.document_messages;
    }

}