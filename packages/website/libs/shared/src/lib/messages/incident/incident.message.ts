export class IncidentMessages {
    incident_messages = {
        
        'erpName':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength' , message: 'Mínimo 2 carácteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'erpEmail': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'pattern', message: 'Formato invalido.' },
            { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
        ],
        'erpResponsable': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength' , message: 'Mínimo 2 carácteres.'},
            { type: 'maxlength' , message: 'Maximo 100 carácteres.'}
        ],
        'phoneErp': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'invalidPhone', message: 'Teléfono invalido' },
            { type: 'maxlength', message: 'Máximo 11 caracteres.' },
            { type: 'minlength', message: 'Mínimo 8 caracteres.' }
        ],
        'code': [
            { type: 'required', message: 'campo requerido' },
            { type: 'min', message: 'Minimo 1' },
            { type: 'maxlength', message: 'Máximo 30' }
        ],
        'contactTypeId': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.'},
            { type: 'maxlength', message: 'Máximo 100 caracteres.' },
        ],
        'date': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'time': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'clientName': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Máximo 100 caracteres.' }
        ],
        'title': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Máximo 100 caracteres.' }
        ],
        'description': [
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Máximo 1000 caracteres.' }
        ],
        'duration': [
            { type: 'required', message: 'Campo requerido.' }
        ],
        'incidentSolution':[
            { type: 'required', message: 'Campo requerido.' },
            { type: 'minlength', message: 'Mínimo 2 caracteres.' },
            { type: 'maxlength', message: 'Máximo 1000 caracteres.' }
        ]
    };

    getIncidentMessages() {
      return this.incident_messages;
    }

}
