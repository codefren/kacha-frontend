import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { UserMessages } from '../../../../../../../shared/src/lib/messages/user/user.message';

@Component({
  selector: 'easyroute-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss']
})
export class ModalChangePasswordComponent implements OnInit {

  form: FormGroup;
  usuario_messages: any;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.validatciones();
  }

  validatciones(){
    this.form = this.fb.group(
      {
        
        password: ['', [Validators.required , Validators.minLength(8)]],
        password_confirmation: [''],
      }
    );

    this.form.controls.password_confirmation.setValidators([
      Validators.required,
      Validators.minLength(8),
      this.confirmarPassword.bind( this.form )
    ]);

    this.usuario_messages = new UserMessages().getUserMessages();
  }
  

  confirmarPassword( control: FormControl ): {  [s: string ]: boolean } {

    const formulario: any = this;
  
    if ( control.value !== formulario.controls.password.value ) {
  
      return {
        confirmar: true
      };
  
    }
  
    return null;
  }

  close(){
    this.activeModal.close(false);
  }
  submit (){
    this.activeModal.close(this.form.value );
  }

}
