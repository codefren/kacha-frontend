export class CompanyAffiliatedMessages {
  company_messages = {
    'streetAddress': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'maxlength', message: 'Máximo 1000 caracteres.' },
        { type: 'minlength', message: 'Mínimo 10 caracteres.' }
    ],
    'countryCode': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'maxlength', message: 'Máximo 50 caracteres.' },
        { type: 'minlength', message: 'Mínimo 2 caracteres.' }
    ],
    'zipCode': [
        { type: 'required', message: 'Campo requerido.' }
    ],
    'serviceTypeId': [
        { type: 'required', message: 'Campo requerido.' }
    ],
    'name': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'maxlength', message: 'Máximo 50 caracteres.' },
        { type: 'minlength', message: 'Mínimo 2 caracteres.' }
    ],
    'city': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'maxlength', message: 'Máximo 50 caracteres.' },
        { type: 'minlength', message: 'Mínimo 2 caracteres.' }
    ],
    'billingEmail': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
    ],
    'province': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'maxlength', message: 'Máximo 50 caracteres.' },
        { type: 'minlength', message: 'Mínimo 2 caracteres.' }
    ],
    'nif': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'invalidCompanyId', message: 'DNI incorrecto.' }
    ],
    'phone': [
        { type: 'required', message: 'Campo requerido.' },
        { type: 'invalidPhone', message: 'Teléfono invalido en ' },
        { type: 'maxlength', message: 'Máximo 11 caracteres.' },
        { type: 'minlength', message: 'Mínimo 8 caracteres.' }
    ],
  }

  getCompanyMessages() {
    return this.company_messages;
  }
}