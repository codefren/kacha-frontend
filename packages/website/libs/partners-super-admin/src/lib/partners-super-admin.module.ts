import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CompanyFormComponent } from './component/company/company-form/company-form.component';
import { CompanyListComponent } from './component/company/company-list/company-list.component';
import { UserComponent } from './component/user/user.component';
import { UserModule } from './component/user/user.module';
import { ModalFiltersCompaniesComponent } from './component/company/company-list/modal-filters-companies/modal-filters-companies.component';
import { ActiveDialogComponent } from './component/company/company-list/active-dialog/active-dialog.component';
import { CompaniesDialogFormComponent } from './component/company/company-list/companies-dialog-form/companies-dialog-form.component';
import { DemoDialogComponent } from './component/company/company-list/demo-dialog/demo-dialog.component';
import { IncidentFormComponent } from './component/company/company-form/incident-form/incident-form.component';
import { RateFormComponent } from './component/company/company-form/rate-form/rate-form.component';
import { CompaniesPartnersFormComponent } from './component/company/company-form/companies-partners-form/companies-partners-form.component';
import { ModalConfirmPhoneComponent } from './component/company/company-form/companies-partners-form/modal-confirm-phone/modal-confirm-phone.component';
import { ModalPhoneComponent } from './component/company/company-form/companies-partners-form/modal-phone/modal-phone.component';
import { IncidentModalConfirmComponent } from './component/company/company-form/incident-form/incident-modal-confirm/incident-modal-confirm.component';
import { IncidentModalViewComponent } from './component/company/company-form/incident-form/incident-modal-view/incident-modal-view.component';
import { ModalAddIncidentComponent } from './component/company/company-form/incident-form/modal-add-incident/modal-add-incident.component';
import { ActiveDialogModuleComponent } from './component/company/company-form/rate-form/active-dialog-module/active-dialog-module.component';
import { RateModalConfirmComponent } from './component/company/company-form/rate-form/rate-modal-confirm/rate-modal-confirm.component';
import { RateModalDocumentComponent } from './component/company/company-form/rate-form/rate-modal-document/rate-modal-document.component';
import { SharedModule } from '@optimroute/shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        UserModule,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                component: CompanyListComponent,
            },
            {
                path: ':companie_id',
                component: CompanyFormComponent,
            },
            {
                path: 'user',
                component: UserComponent,
            },
            
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        CompanyFormComponent, 
        CompanyListComponent, 
        ModalFiltersCompaniesComponent, 
        ActiveDialogComponent, 
        CompaniesDialogFormComponent, 
        DemoDialogComponent, 
        IncidentFormComponent, 
        RateFormComponent, 
        CompaniesPartnersFormComponent, 
        ModalConfirmPhoneComponent, 
        ModalPhoneComponent, 
        IncidentModalConfirmComponent, 
        IncidentModalViewComponent, 
        ModalAddIncidentComponent, 
        ActiveDialogModuleComponent, 
        RateModalConfirmComponent, 
        RateModalDocumentComponent
    ],
    entryComponents:[
        ModalFiltersCompaniesComponent,
        ActiveDialogComponent, 
        CompaniesDialogFormComponent, 
        DemoDialogComponent,
        ModalConfirmPhoneComponent, 
        ModalPhoneComponent,
        IncidentModalConfirmComponent, 
        IncidentModalViewComponent, 
        ModalAddIncidentComponent, 
        ActiveDialogModuleComponent, 
        RateModalConfirmComponent, 
        RateModalDocumentComponent
    ]
})
export class PartnersSuperAdminModule {}
