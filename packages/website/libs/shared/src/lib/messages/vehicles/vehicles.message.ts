export class VehiclesMessages {
    vehicles_messages = {
        name: [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        userId: [
            { type: 'required', message: 'Campo requerido.' }
        ],
        registration: [
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 10 carácteres.' },
        ],
        deliveryWindowStart: [
            {
                type: 'confirmar',
                message: 'El tiempo de inicio no puede ser igual a tiempo de llegada',
            },
            {
                type: 'sutrast',
                message: 'El tiempo de inicio no puede ser mayor a tiempo de llegada',
            },
        ],
        deliveryWindowEnd: [
            {
                type: 'confirmar',
                message: 'El tiempo de llegada no puede ser igual a tiempo de inicio',
            },
            {
                type: 'sutrast',
                message: 'El tiempo de llegada no puede ser menor a tiempo de inicio',
            },
        ],
        accessories:[
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Maximo 1000 carácteres.' },
        ],
        vehicleStopType:[
            
            { type: 'min', message: 'Mínimo 2' },
            { type: 'max', message: 'Maximo 99999' },
        ],
        stopTypeId:[
            { type: 'required', message: 'Campo requerido.' }
        ],
        amount:[
            { type: 'min', message: 'Mínimo 2' },
            { type: 'max', message: 'Maximo 99999' },
        ],
        vehicleBrand:[
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        model:[
            { type: 'maxlength', message: 'Maximo 50 carácteres.' },
        ],
        frameNumber:[
            { type: 'max', message: 'Maximo 50' },
        ],
        weightLimit: [
            { type: 'min', message: 'Mínimo 1.' },
            { type: 'max', message: 'Maximo 50.' },
            { type: 'pattern', message: 'Solo se permiten números entero.' },
        ],
        tare: [
            { type: 'pattern', message: 'Solo se permiten números positivos o máximo 3 decimales' }
        ],
        mma: [
            { type: 'pattern', message: 'Solo se permiten números positivos o máximo 3 decimales' }
        ],
        usefulLoad: [
            //{ type: 'pattern', message: 'Solo se permiten números positivos o máximo 3 decimales' }
            { type: 'pattern', message: 'Solo se permiten números entero.' },
        ],
        liftGate: [
            { type: 'pattern', message: 'Solo se permiten números positivos o máximo 3 decimales' }
        ],
        length: [
            { type: 'pattern', message: 'Datos incorrectos' }
        ],
        width: [
            { type: 'pattern', message: 'Datos incorrectos' }
        ],
        tall: [
            { type: 'pattern', message: 'Datos incorrectos' }
        ],
        acquisitionShare: [
            
            { type: 'max', message: 'El importe total no puede ser mayor 999999.' },
        ],
        costToPassOn: [
           
            { type: 'max', message: 'El coste a repercutir no puede ser mayor 999999.' },
        ],
        capacity: [
            { type: 'pattern', message: 'Solo se permiten números entero.' },
        ]
    };

    getVehiclesMessages() {
        return this.vehicles_messages;
    }
}
