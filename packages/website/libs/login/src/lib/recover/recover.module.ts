import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverComponent } from './recover.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AuthLocalModule } from '@optimroute/auth-local';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [RecoverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    AuthLocalModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
  ],
  exports: [RecoverComponent]
})
export class RecoverModule { }
