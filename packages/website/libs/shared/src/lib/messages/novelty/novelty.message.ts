export class NoveltyMessages {
    novelty_messages = {
        
        'title': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'descripcion': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 1000 carácteres.'}
        ],
        'url':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 1000 carácteres.'}
        ],
        
    };

    getNoveltyMessages() {
      return this.novelty_messages;
    }

}