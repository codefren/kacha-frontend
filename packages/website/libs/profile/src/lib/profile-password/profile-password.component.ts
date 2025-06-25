import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { PasswordMessages, ToastService } from '@optimroute/shared';

import { ProfileService } from '../profile.service';

@Component({
    selector: 'easyroute-profile-password',
    templateUrl: './profile-password.component.html',
    styleUrls: ['./profile-password.component.scss'],
})
export class ProfilePasswordComponent implements OnInit {

    changePasswordForm: FormGroup;
    passwordMessages: any;

    constructor(
        private fb: FormBuilder,
        private _profile: ProfileService,
        private toastService: ToastService,
        private _translate: TranslateService
    ) {  }

    ngOnInit() {
        this.changePasswordInit();
    }

    changePassword() {
        if (this.changePasswordForm.valid) {
            this._profile.changePassword(this.changePasswordForm.value).subscribe(
                (data: any) => {
                    this.changePasswordForm.reset();
                    this.toastService.displayWebsiteRelatedToast(
                        'Se actualizo con éxito la contraseña',
                        this._translate.instant('GENERAL.ACCEPT')
                        
                    );
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.status, error.error);
                },
            );
        }
    }

    changePasswordInit() {
        this.changePasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
            current_password: ['', [Validators.required, Validators.minLength(8)]],
        });
  
        this.changePasswordForm.controls['password_confirmation'].setValidators([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
            this.ConfirmarPassword.bind(this.changePasswordForm),
        ]);

        const validationsMessagesPassword = new PasswordMessages();
        this.passwordMessages = validationsMessagesPassword.getPasswordMessages();
    }

    ConfirmarPassword(control: FormControl): { [s: string]: boolean } {
        let formulario: any = this;
    
        if (control.value !== formulario.controls['password'].value) {
            return {
                confirmar: true,
            };
        }
    
        return null;
    }
}
