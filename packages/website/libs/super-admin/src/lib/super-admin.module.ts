
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminCompaniesListComponent } from './component/super-admin-companies-list/super-admin-companies-list.component';
import { SuperAdminCompaniesFormComponent } from './component/super-admin-companies-form/super-admin-companies-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoveltyComponent } from './component/novelty/novelty.component';
import { UserComponent } from './component/user/user.component';
import { NoveltyModule } from './component/novelty/novelty.module';
import { UserModule } from './component/user/user.module';
import { IncidentFormComponent } from './component/super-admin-companies-form/incident-form/incident-form.component';
import { ModalAddIncidentComponent } from './component/super-admin-companies-form/incident-form/modal-add-incident/modal-add-incident.component';
import { RateFormComponent } from './component/super-admin-companies-form/rate-form/rate-form.component';
import { NgxMaskModule } from 'ngx-mask';
import { CompaniesDialogFormComponent } from './component/super-admin-companies-list/companies-dialog-form/companies-dialog-form.component';
import { DemoDialogComponent } from './component/super-admin-companies-list/demo-dialog/demo-dialog.component';
import { ActiveDialogComponent } from './component/super-admin-companies-list/active-dialog/active-dialog.component';
import { ActiveDialogModuleComponent } from './component/super-admin-companies-form/rate-form/active-dialog-module/active-dialog-module.component';
import { IncidentModalConfirmComponent } from './component/super-admin-companies-form/incident-form/incident-modal-confirm/incident-modal-confirm.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { IncidentModalViewComponent } from './component/super-admin-companies-form/incident-form/incident-modal-view/incident-modal-view.component';
import { CompaniesFormComponent } from './component/super-admin-companies-form/companies-form/companies-form.component';
import { RateModalConfirmComponent } from './component/super-admin-companies-form/rate-form/rate-modal-confirm/rate-modal-confirm.component';
import { RateModalDocumentComponent } from './component/super-admin-companies-form/rate-form/rate-modal-document/rate-modal-document.component';
import { ModalFiltersCompaniesComponent } from './component/super-admin-companies-list/modal-filters-companies/modal-filters-companies.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { InvoiceModule } from './component/invoice/invoice.module';
import { ModalConfirmPhoneComponent } from './component/super-admin-companies-form/companies-form/modal-confirm-phone/modal-confirm-phone.component';
import { ModalPhoneComponent } from './component/super-admin-companies-form/companies-form/modal-phone/modal-phone.component';
import { StartModule } from './component/start/start.module';
import { StartComponent } from './component/start/start.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NoveltyModule,
        UserModule,
        SharedModule,
        InvoiceModule,
        StartModule,
        ReactiveFormsModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            { path: '', redirectTo: 'start', pathMatch: 'full' },
            {
                path: 'company',
                component: SuperAdminCompaniesListComponent,
            },
            {
                path: 'company/:companie_id',
                component: SuperAdminCompaniesFormComponent,
            },
            {
                path: 'user',
                component: UserComponent,
            },
            {
                path: 'novelty',
                component: NoveltyComponent,
            },
            {
                path: 'invoice',
                component: InvoiceComponent,
            },
            {
                path: 'start',
                component: StartComponent,
            }
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        SuperAdminCompaniesListComponent, 
        SuperAdminCompaniesFormComponent, 
        IncidentFormComponent, 
        ModalAddIncidentComponent, 
        RateFormComponent,
        ActiveDialogComponent,
        CompaniesDialogFormComponent,
        DemoDialogComponent,
        ActiveDialogModuleComponent,
        IncidentModalConfirmComponent,
        IncidentModalViewComponent,
        CompaniesFormComponent,
        RateModalConfirmComponent,
        RateModalDocumentComponent,
        ModalFiltersCompaniesComponent,
        ModalPhoneComponent,
        ModalConfirmPhoneComponent,
        
    ],
    entryComponents:[
        ModalAddIncidentComponent,
        ActiveDialogComponent,
        CompaniesDialogFormComponent,
        DemoDialogComponent,
        ActiveDialogModuleComponent,
        IncidentModalConfirmComponent,
        IncidentModalViewComponent,
        RateModalConfirmComponent,
        RateModalDocumentComponent,
        ModalFiltersCompaniesComponent,
        ModalConfirmPhoneComponent,
        ModalPhoneComponent

    ]
})
export class SuperAdminModule {}
