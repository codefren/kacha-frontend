import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SharedModule,
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
} from '@optimroute/shared';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { CompaniesComponent } from './companies.component';
import { CompaniesTableComponent } from './companies-table/companies-table.component';
import { CompaniesDialogFormComponent } from './companies-table/companies-dialog-form/companies-dialog-form.component';
import { DemoDialogComponent } from './companies-table/demo-dialog/demo-dialog.component';
import { ActiveDialogComponent } from './companies-table/active-dialog/active-dialog.component';
import {
    NgbModule,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { CompaniesFormComponent } from './companies-form/companies-form.component';
import { RouterModule } from '@angular/router';
import { ActiveDialogModuleComponent } from './companies-form/active-dialog-module/active-dialog-module.component';
@NgModule({
    declarations: [
        CompaniesComponent,
        CompaniesTableComponent,
        CompaniesDialogFormComponent,
        DemoDialogComponent,
        ActiveDialogComponent,
        CompaniesFormComponent,
        ActiveDialogModuleComponent,
    ],
    imports: [
        CommonModule,
        StateEasyrouteModule,
        SharedModule,
        NgbModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            {
                path: 'companies/:id',
                component: CompaniesFormComponent,
            },
            {
                path: 'companiesMe/:id/me/:me',
                component: CompaniesFormComponent,
            },
        ]),
    ],
    entryComponents: [
        CompaniesFormComponent,
        CompaniesDialogFormComponent,
        DemoDialogComponent,
        ActiveDialogComponent,
        ActiveDialogModuleComponent,
    ],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class CompaniesModule {}
