export class DirectionsMessages {
    directions_messages = {
        
        'address':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'coordinatesLatitude': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' }
        ],
        'coordinatesLongitude': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' }
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 30 caracteres.' }
        ],
        'phone': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Formato invalido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido' },
        ]
    };

    getDirectionsMessages() {
      return this.directions_messages;
    }

}