import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { RegisterThreeComponent } from './register-three/register-three.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { StateRegisterModule } from '@easyroute/state-register';
import { NgxMaskModule } from 'ngx-mask';
import { ModalTermsAcceptedComponent } from './register-three/modal-terms-accepted/modal-terms-accepted.component';
import { ModalAcceptPrivacyPolicyComponent } from './register-three/modal-accept-privacy-policy/modal-accept-privacy-policy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterSuccessfulComponent } from './register-successful/register-successful.component';


@NgModule({
  declarations: [
    RegisterThreeComponent,
    ModalTermsAcceptedComponent,
    ModalAcceptPrivacyPolicyComponent,
    RegisterSuccessfulComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    StateRegisterModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
     /*  {
        path: 'register',
        component: RegisterThreeComponent
      }, */
      /* {
        path: 'register-two',
        component: RegisterTwoComponent
      }, */
      {
        path: 'register-successful',
        component: RegisterSuccessfulComponent
      }
    ])
  ],
  entryComponents: [
    RegisterThreeComponent,
    ModalTermsAcceptedComponent,
    ModalAcceptPrivacyPolicyComponent,
    RegisterSuccessfulComponent
  ]
})
export class RegisterModule { }
