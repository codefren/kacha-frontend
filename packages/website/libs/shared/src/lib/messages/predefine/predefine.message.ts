export class PredefineMessages {
    predefine_messages = {
      
        name: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 1 caracteres.' },
            { type: 'maxlength', message: 'Maximo 100 carácteres.' },
        ],
       
        activeByCompany: [{ type: 'required', message: 'Campo requerido.' }],
       
        
    };

    getPredefineMessages() {
        return this.predefine_messages;
    }
}
