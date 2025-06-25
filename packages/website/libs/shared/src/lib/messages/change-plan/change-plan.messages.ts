export class ChangePlanMessages {
    changePlanMessages = {
        planId: [
            { type: 'required', message: 'campo requerido' }
        ],
        vehicles: [
            { type: 'required', message: 'campo requerido' },
            { type: 'max', message: 'Máximo 30 vehículos' },
            { type: 'min', message: 'Minimo 1 vehículo' }
        ],

        monthPrice: [
            { type: 'required', message: 'Campo requerido' }
        ]
    }

    getChangePlanMessages() {
        return this.changePlanMessages;
    }
}