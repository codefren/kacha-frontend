export class ZoneFranchiseMessages {
    zoneFranchise_messages = {
        
        'code':[
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 40 carácteres.'}
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 100 carácteres.'}
        ],
        'description':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 10 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'address': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 4 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 1000 carácteres.'}
        ],
        'email': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
        ],
        'phone':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido en España' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' }
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'scheduleStart':[
            {
                type: 'confirmar',
                message: 'El horario de inicio no puede ser igual al horario hasta',
            },
            {
                type: 'sutrast',
                message: 'El tiempo de inicio no puede ser mayor a tiempo hasta',
            },
        ],
        'scheduleEnd':[
            {
                type: 'confirmar',
                message: 'El horario hasta no puede ser igual al horario de inicio',
            },
            {
                type: 'sutrast',
                message: 'El horario hasta no puede ser menor al horario de inicio',
            },
        ],
        'orderLimitDay': [
            { type: 'min', message: 'Mínimo 0' },
            { type: 'max', message: 'Máximo 9999999' }
        ],
        'minPayment': [
           
            { type: 'min', message: 'Mínimo 0' },
            { type: 'max', message: 'La cantidad mínima de compra no puede ser mayor a 9999999.' },
           /*  { type: 'pattern', message: 'La cantidad mínima de compra no puede tener  3 decimales.' } */
        ],
        'prepaidPayment': [
           
            { type: 'min', message: 'Mínimo 0' },
            { type: 'max', message: 'La cantidad de prepago no puede ser mayor a 9999999.' },
           /*  { type: 'pattern', message: 'La cantidad de prepago no puede tener  3 decimales.' } */
        ],
        'quantityBuyWithoutMinimun': [

            { type: 'min', message: 'Mínimo 0.1' },
            { type: 'max', message: 'La cantidad mínima no puede ser mayor a 9999999.' },
           /*  { type: 'pattern', message: 'La cantidad mínima no puede tener  3 decimales.' } */
        ],
        'allowedRadius': [
            { type: 'required', message: 'Campo requerido' },
            { type: 'min', message: 'Mínimo 0.1' },
            { type: 'max', message: 'La distancia de alcanze en Km no puede ser mayor a 99999.' },
           // { type: 'pattern', message: 'La distancia de alcanze en Km no puede tener  3 decimales.' }
        ],
        'addressOrderRange':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 4 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 1000 carácteres.'}
        ]
    };

    getZoneFranchiseMessages() {
      return this.zoneFranchise_messages;
    }

}