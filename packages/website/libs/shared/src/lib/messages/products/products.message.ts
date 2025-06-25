export class ProductsMessages {
    products_messages = {
        
        'code':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'description':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'categoryId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'price':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'taxPercent':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'endPromotionDate': [
            { type: 'confirmar', message: 'La fecha hasta debe ser mayor o igual a la fecha desde' }
        ],
        'valoration': [
            { type: 'required', message: 'Campo requerido' },
            { type: 'min', message: 'Mínimo 0.1' },
            { type: 'max', message: 'Máximo 99999' }
        ],
        'subCategoryId': [
            { type: 'required', message: 'Campo requerido' }
        ],
        'filterId':[
            { type: 'required', message: 'Campo requerido' }
        ],
        'estimatedWeightPerUnit': [
            { type: 'min', message: 'Mínimo 0.001' },
            { type: 'max', message: 'El peso medio por unidad no puede ser mayor a 999.' },
            { type: 'pattern', message: 'El peso medio por unidad debe tener máximo 3 decimales.' }
        ],
        'freeField' : [
            { type: 'maxlength', message: 'Máximo 255 caracteres' }
        ]
    };

    getProductsMessages() {
      return this.products_messages;
    }

}