import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@optimroute/shared'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthLocalModule } from '@optimroute/auth-local'
import { RecoverComponent } from './recover/recover.component';
import { RecoverModule } from './recover/recover.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { TermsComponent } from './terms/terms.component';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { RegisterModule } from './register/register.module';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { VerifyMiwigoAccountComponent } from './verify-miwigo-account/verify-miwigo-account.component';
import { PasswordConfirmationAppComponent } from './password-confirmation-app/password-confirmation-app.component';


@NgModule({
    imports: [CommonModule,
        SharedModule,
        ReactiveFormsModule,
        AuthLocalModule,
        RecoverModule,
        RegisterModule,
        FormsModule,
        ResetPasswordModule,
        StateProfileSettingsModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginComponent
            },
            {
                path: 'recover',
                component: RecoverComponent
            },
            {
                path: 'reset-password/:token',
                component: ResetPasswordComponent
            },
            {
                path: 'reset-password/:client/:token',
                component: ResetPasswordComponent
            },
            {
                path: 'verification_token/:token',
                component: VerifyAccountComponent
            },
            {
                path: 'miwigo/verification_token/:token',
                component: VerifyMiwigoAccountComponent
            },
            {
                path: 'terms',
                component: TermsComponent
            },
            {
                path: 'miwigo/password-confirmation-app',
                component: PasswordConfirmationAppComponent
            },
        ]),
        
    ],
    declarations: [LoginComponent, TermsComponent, VerifyAccountComponent, VerifyMiwigoAccountComponent, PasswordConfirmationAppComponent],
})
export class LoginModule {}
