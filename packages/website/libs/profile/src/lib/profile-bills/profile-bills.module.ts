import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModule, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule, Language, MomentDateFormatter, CustomDatepickerI18n } from '@optimroute/shared';

import { MyInvoicesComponent } from '../profile-invoicing/my-invoices/my-invoices.component';
import { ProfileBillsComponent } from './profile-bills.component';

@NgModule({
    declarations: [
        MyInvoicesComponent,
        ProfileBillsComponent
    ],
    imports: [
        SharedModule, 
        NgbModule
    ],
    providers: [
        DatePipe, 
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
    ]
})
export class ProfileBillsModule {}
