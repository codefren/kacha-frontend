export class DeliveryZoneNameMessages {
    deliveryZoneName_messages = {
        'email': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'address':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'useBillingAddress':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'billingAddress':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        
        'demand':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'id':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'serviceTimeMinute':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'min' , message: 'El campo no puede ser menor que 0'},
            { type: 'max' , message: 'El campo no puede ser mayor a 60.'}
        ],
        'serviceTimeSeconds':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'min' , message: 'El campo no puede ser menor que 0.'},
            { type: 'max' , message: 'El campo no puede ser mayor a 60.'}
        ],
        'keyOpen':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'companyId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'phoneNumber': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength' , message: 'Mínimo 11 carácteres.'},
            { type: 'maxLength' , message: 'Maximo 11 carácteres.'},
            { type: 'invalidPhone', message: 'Teléfono invalido en españa' },
        ],
        'nif': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidCompanyId', message: 'DNI incorrecto.' },
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'name': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxLength' , message: 'Maximo 50 carácteres.'}
        ],
        'deliveryZoneId':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'isActive': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'deliveryWindowStart': [
            {
                type: 'confirmar',
                message: 'La Hora desde no puede ser igual a la Hora hasta',
            },
            {
                type: 'sutrast',
                message: 'La Hora desde no puede ser mayor a la Hora hasta',
            },
        ],
        'deliveryWindowEnd': [
            {
                type: 'confirmar',
                message: 'La Hora hasta no puede ser igual a la Hora desde',
            },
            {
                type: 'sutrast',
                message: 'La Hora hasta no puede ser menor a la Hora desde',
            },
        ],
        'deliveryWindowVisitStart': [
            {
                type: 'confirmar',
                message: 'La Hora desde no puede ser igual a la Hora hasta',
            },
            {
                type: 'sutrast',
                message: 'La Hora desde no puede ser mayor a la Hora hasta',
            },
        ],
        'deliveryWindowVisitEnd': [
            {
                type: 'confirmar',
                message: 'La Hora hasta no puede ser igual a la Hora desde',
            },
            {
                type: 'sutrast',
                message: 'La Hora hasta no puede ser menor a la Hora desde',
            },
        ],
        'coordinatesLatitude': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' }
        ],
        'coordinatesLongitude': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' }
        ],
        'fiscalName': [
           
            { type: 'minlength' , message: 'Mínimo 1 carácteres.'},
            { type: 'maxlength' , message: 'Maximo 30 carácteres.'},
        ],
        'accountingCode': [
           
            { type: 'minlength' , message: 'Mínimo 1 carácteres.'},
            { type: 'maxlength' , message: 'Maximo 30 carácteres.'},
        ],
        'specialConditions': [
           
            { type: 'minlength' , message: 'Mínimo 1 carácteres.'},
            { type: 'maxlength' , message: 'Maximo 255 carácteres.'},
        ],
        'specialRate': [
           
            { type: 'min' , message: 'El campo no puede ser menor que 0'},
            { type: 'max' , message: 'El campo no puede ser mayor a 99999.'}
        ],
        'maximumUnpaid': [
           
            { type: 'min' , message: 'El campo no puede ser menor que 0'},
            { type: 'max' , message: 'El campo no puede ser mayor a 99999.'}
        ],
        'created_at': [
           
            {
                type: 'confirmar',
                message: 'La Fecha alta no puede ser mayor a Fecha baja',
            },
        ],
        'disabled_at': [
           
            {
                type: 'confirmar',
                message: 'La  Fecha baja no puede menor a Fecha alta',
            },
        ],
    };

    getDeliveryZoneNameMessages() {
      return this.deliveryZoneName_messages;
    }

}