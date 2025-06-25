export class DeliveryZoneMessages {
    deliveryZone_messages = {
        'id': [
            { type: 'required', message: 'Campo requerido.' },
        ],
        'name':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'color':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'settingsDeliveryScheduleStart':[
            { type: 'required', message: 'Campo requerido.' },
        ],
        'settingsDeliveryScheduleEnd':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'order':[
            { type: 'required', message: 'Campo requerido.' },
        ],
        
    };

    getDeliveryZoneMessages() {
      return this.deliveryZone_messages;
    }

}