export class MeasureMessages {
    measure_messages = {
        
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'code': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 1 caracter.'},
            { type: 'maxlength' , message: 'Maximo 30 carácteres.'}
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'allowFloatQuantity': [
            {  type: 'required', message: 'campo requerido' }
        ]
       
    };

    getMeasureMessages() {
      return this.measure_messages;
    }

}