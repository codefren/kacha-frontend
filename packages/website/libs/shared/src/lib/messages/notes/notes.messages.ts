export class NotesMessages {
    note_messages = {
        
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Máximo 50 caracteres.'}
        ],
        'title': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Máximo 50 caracteres.'}
        ],
        'userSellerId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'description':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.'},
            { type: 'maxlength' , message: 'Máximo 2000 caracteres.'}
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'isDeleted': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'observation':[
            { type: 'minlength', message: 'Mínimo 10 caracteres.'},
            { type: 'maxlength' , message: 'Máximo 200 caracteres.'}
        ]
       
    };

    getNotesMessages() {
      return this.note_messages;
    }

}