export class MergeRecordMessages {
    mergeRecord_messages = {
        'name': [
            { type: 'required', message: 'Campo requerido.' },
        ],
        'phone':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'address':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'zipCode':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        'population':[
            { type: 'required', message: 'Campo requerido.' }
        ],
        
    };

    getMergeRecordMessages() {
      return this.mergeRecord_messages;
    }

}