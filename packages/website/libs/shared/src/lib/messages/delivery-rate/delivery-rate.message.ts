export class DeliveryRateMessages {
    deliveryRate_messages = {
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'order': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'price':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'minTime': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxLength' , message: 'Maximo 30 carácteres.'},
        ],
        'maxTime': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
       
    };

    getDeliveryRateMessages() {
      return this.deliveryRate_messages;
    }

}