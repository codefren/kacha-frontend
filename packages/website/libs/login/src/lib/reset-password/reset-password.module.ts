import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@optimroute/shared';
import { AuthLocalModule } from '@optimroute/auth-local'

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    AuthLocalModule
  ],
  exports: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
