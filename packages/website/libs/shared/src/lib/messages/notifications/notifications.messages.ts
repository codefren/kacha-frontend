export class NotificationMessages {

  validationMessages = {
    preferencesMailIntegrationError: [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' },
    ],
    preferencesMailBreakdown: [
      { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
    ],
    preferencesMailClientClosed: [
      { type: 'email', message: 'Debe tener el formato abcd@gmail.com' }
    ],
    preferencesMailClientWithoutBuy: [
      { type: 'email', message: 'Debe tener el formato abcd@gmail.com' }
    ],
    email: [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'email', message: 'Debe tener el formato abcd@gmail.com.' }
    ],
  };
  
  getValidationMessages() {
    return this.validationMessages;
  }
}