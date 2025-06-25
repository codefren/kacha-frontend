import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillListComponent } from './component/bill-list/bill-list.component';
import { BillFormComponent } from './component/bill-form/bill-form.component';
import { SharedModule } from '@optimroute/shared';
import { StateFilterStateFacade } from 'libs/filter-state/src/lib/+state/filter-state.facade';
import { BillSettingsComponent } from './component/bill-settings/bill-settings.component';
import { ModalSearchClientComponent } from './component/bill-list/modal-search-client/modal-search-client.component';
import { ControlOfInvoicesComponent } from './component/bill-settings/control-of-invoices/control-of-invoices.component';
import { BillNoticesComponent } from './component/bill-settings/bill-notices/bill-notices.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: BillListComponent,
            },
            {
                path: 'settings',
                component: BillSettingsComponent,
            },
            {
                path: ':bill_id',
                component: BillFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    providers: [DatePipe, StateFilterStateFacade],
    
    declarations: [
        BillListComponent, 
        BillFormComponent, 
        BillSettingsComponent, 
        ModalSearchClientComponent, ControlOfInvoicesComponent, BillNoticesComponent
    ],
    entryComponents :[
        ModalSearchClientComponent
    ]
})
export class BillsModule {}
