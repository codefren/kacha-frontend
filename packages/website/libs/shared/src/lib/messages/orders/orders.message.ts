export class OrdersMessages {
    orders_messages = {
        
        'orderDate': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'interval':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 500 carácteres.'}
        ],
        'observations':[
            { type: 'maxLength' , message: 'Maximo 2000 carácteres.'}
        ],
        'userSellerId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'province': [
            { type: 'required', message: 'Campo requerido.' }
        ],
    };

    getOrdersMessages() {
      return this.orders_messages;
    }

}