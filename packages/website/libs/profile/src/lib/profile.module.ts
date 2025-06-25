import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileBillsModule } from './profile-bills/profile-bills.module';
import { ProfileInvoicingModule } from './profile-invoicing/profile-invoicing.module';
import { SharedModule } from '@optimroute/shared';

import { StateCompaniesModule } from '@optimroute/state-companies';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';

import { CardModuleComponent } from './profile-modules/card-module/card-module.component';
import { ModalModulesComponent } from 'libs/shared/src/lib/components/modal-modules/modal-modules.component';
import { ProfileBillsComponent } from './profile-bills/profile-bills.component';
import { ProfileComponent } from './profile.component';
import { ProfileInvoicingComponent } from './profile-invoicing/profile-invoicing.component';
import { ProfileModulesComponent } from './profile-modules/profile-modules.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

import { ProfileService } from './profile.service';

import { AdministrativeGuard, InvoiceGuard } from '@optimroute/auth-local';

import { NgxMaskModule } from 'ngx-mask';
import { ProfileMenuModule } from '../../../../apps/easyroute/src/app/layout/profile-menu/profile-menu.module';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { OpenModuleModalComponent } from './profile-modules/card-module/open-module-modal/open-module-modal.component';
import { StripeConnectComponent } from './stripe-connect/stripe-connect.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProfileInvoicingModule,
        ProfileBillsModule,
        ProfileMenuModule,
        StateEasyrouteModule,
        StateProfileSettingsModule,
        StateCompaniesModule,
        ReactiveFormsModule,
        NgbModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                component: ProfileComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'settings',
                        pathMatch: 'full',
                    },
                    {
                        path: 'settings',
                        component: ProfileSettingsComponent,
                    },
                    {
                        path: 'modules',
                        component: ProfileModulesComponent,
                    },
                    {
                        path: 'invoicing',
                        component: ProfileInvoicingComponent,
                        canActivate: [AdministrativeGuard, InvoiceGuard],
                    },
                    {
                        path: 'bills',
                        component: ProfileBillsComponent,
                        canActivate: [AdministrativeGuard],
                    },
                    {
                        path: 'password',
                        component: ProfilePasswordComponent,
                    },
                    {
                        path: 'stripe_connect',
                        component: StripeConnectComponent,
                        canActivate: [AdministrativeGuard],
                    },
                    {
                        path: 'invoicing/:error',
                        redirectTo: 'invoicing',
                        pathMatch: 'full',
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
    ],
    providers: [
        ProfileService],
    declarations: [
        CardModuleComponent,
        ProfileComponent,
        ProfileModulesComponent,
        ProfileSettingsComponent,
        ProfilePasswordComponent,
        OpenModuleModalComponent,
        StripeConnectComponent,
    ],
    entryComponents: [
        CardModuleComponent,
        ModalModulesComponent,
        OpenModuleModalComponent,
        ProfileModulesComponent,
    ],
    exports: [
        ProfileModulesComponent
    ],
})
export class ProfileModule { }
