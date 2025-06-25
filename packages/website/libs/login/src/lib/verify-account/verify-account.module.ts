import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAccountComponent } from './verify-account.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    NgxMaskModule.forChild(),
    /* RouterModule.forChild([
      {
        path: 'verification_token',
        component: VerifyAccountComponent
      }
    ]) */
  ],
  entryComponents:[]
})
export class VerifyAccountModule { }
