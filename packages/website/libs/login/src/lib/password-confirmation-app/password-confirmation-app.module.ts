import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordConfirmationAppComponent } from './password-confirmation-app.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@optimroute/shared';
import { AuthLocalModule } from '@optimroute/auth-local'

@NgModule({
  declarations: [PasswordConfirmationAppComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    AuthLocalModule
  ],
  exports: [PasswordConfirmationAppComponent]
})
export class PasswordConfirmationAppModule { }
