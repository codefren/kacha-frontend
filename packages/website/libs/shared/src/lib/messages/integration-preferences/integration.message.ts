export class IntegrationPreferencesMessages {
    Integration_prefereces_messages = {
        'templateName': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 255 caracteres.' }
        ],

        "readTo":[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'min', message: 'Minimo 1.' }
        ],

        'deliveryPointId': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],

        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'address': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'deliveryZoneId': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'population': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'postalCode': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'deliveryWindowStart': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'deliveryWindowEnd': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'phoneNumnber': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'email': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'demand': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'volumetric': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        'deliveryNotes': [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],


        // messages delivery

        "deliveryNoteCode":[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "code":[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "quantity": [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "price": [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "taxPercent": [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "measure": [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "deliveryNoteObservation": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "promptPayDiscountPercent": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "discountPercent": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "grossMass": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "orderNumber": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "netMass": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "observation": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ],
        "lotCode": [
            { type: 'maxlength', message: 'Máximo 10 caracteres.' },
            { type: 'pattern', message: 'Solo se puede agregar letras.' }
        ]

    }

    getIntegrationPreferencesMessages() {
      return this.Integration_prefereces_messages;
    }

}
