export class CategoryMessages {
    category_messages = {
        'categoryId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'subCategoryId':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'code': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength' , message: 'Maximo 30 carácteres.'},
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'timeStart':[
            {
                type: 'confirmar',
                message: 'El tiempo desde no puede ser igual al tiempo hasta',
            },
            {
                type: 'sutrast',
                message: 'El tiempo desde no puede ser mayor al tiempo hasta',
            },
        ],
        'timeEnd':[
            {
                type: 'confirmar',
                message: 'El tiempo hasta no puede ser igual al tiempo desde',
            },
            {
                type: 'sutrast',
                message: 'El tiempo hasta no puede ser menor al tiempo desde',
            },
        ]
       
    };

    getCategoryMessages() {
      return this.category_messages;
    }

}