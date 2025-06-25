import { NgModule } from '@angular/core';
import { ProfileInvoicingComponent } from './profile-invoicing.component';
import { SharedModule, Language, MomentDateFormatter, CustomDatepickerI18n } from '@optimroute/shared';
import { SubscriptionStatusComponent } from './subscription-status/subscription-status.component';
import { DatePipe } from '@angular/common';
import { NgbModule, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { PayMethodComponent } from './pay-method/pay-method.component';
import { FormCardComponent } from './pay-method/form-card/form-card.component';
import { ConfirmDefaultCardComponent } from './pay-method/confirm-default-card/confirm-default-card.component';
import { ConfirmModalComponent } from './subscription-status/confirm-modal/confirm-modal.component';
import { ModalInfoPlanComponent } from './subscription-status/modal-info-plan/modal-info-plan.component';
@NgModule({
    declarations: [
        ProfileInvoicingComponent,
        SubscriptionStatusComponent,
        PayMethodComponent,
        FormCardComponent,
        ConfirmDefaultCardComponent,
        ConfirmModalComponent,
        ModalInfoPlanComponent
    ],
    imports: [SharedModule, NgbModule],
    providers: [DatePipe, Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
    ],
    entryComponents: [
        FormCardComponent,
        ConfirmDefaultCardComponent,
        ConfirmModalComponent,
        ModalInfoPlanComponent
    ],
})
export class ProfileInvoicingModule { }
