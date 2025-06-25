export class PlanMessages {
    plan_messages = {
        'planId': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'setup': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength' , message: 'Mínimo es el establecido en el detalle.'},
            { type: 'maxLength' , message: 'Maximo es el establecido en el detalle.'}
        ],
        'vehicleMonthPrice': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'monthPrice': [
            { type: 'required', message: 'Campo requerido.' }
        ],
    };

    getPlanMessages() {
      return this.plan_messages;
    }

}