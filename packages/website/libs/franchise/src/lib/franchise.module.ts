import { WebSocketService } from './../../../orders/src/lib/products.websocket';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FranchiseComponent } from './franchise.component';
import { RouterModule } from '@angular/router';
import { SharedModule, ToDayTimePipe, DistancePipe } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { FranchiseManagementComponent } from './components/franchise-management/franchise-management.component';
import { CreateFranchiseComponent } from './components/create-franchise/create-franchise.component';
import { ConfirmCreateFranchiseComponent } from './components/create-franchise/confirm-create-franchise/confirm-create-franchise.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditFranchiseComponent } from './components/franchise-management/modal-edit-franchise/modal-edit-franchise.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmationComponent } from './components/franchise-management/modal-confirmation/modal-confirmation.component';
import { NgxMaskModule } from 'ngx-mask';
import { EditFranchiseComponent } from './components/edit-franchise/edit-franchise.component';

import { SummaryOrdersComponent } from './summary-orders/summary-orders.component' 
//import { SummaryDeliveriesComponent } from './summary-deliveries/summary-deliveries.component';

import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { ManagenmentFranchiseComponent } from './components/managenment-franchise.component';
import { ManagenmentFranchiseModule } from './components/managenment-franchise.module';
//import { ModalConfirmComponent } from './summary-deliveries/modal-confirm/modal-confirm.component';
import { PreparationFormComponent } from './summary-orders/preparation-form/preparation-form.component';
//import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
//import { SummaryPreparationComponent } from './summary-preparation/summary-preparation.component';
//import { FormPreparationDetailsComponent } from './summary-preparation/form-preparation-details/form-preparation-details.component';
import { ManageZoneComponent } from './manage-zone/manage-zone.component';
import { ManageZoneModule } from './manage-zone/manage-zone.module';
import { DurationPipe } from '../../../shared/src/lib/pipes/duration.pipe';
import { ModalFiltersComponent } from './summary-orders/modal-filters/modal-filters.component';


@NgModule({
    imports: [
        SharedModule,
        NgbModule,
        CommonModule,
        ReactiveFormsModule,
        StateProfileSettingsModule,
        ManageZoneModule,
        ManageUsersModule,
        ManagenmentFranchiseModule,
        NgbModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            { path: '', redirectTo: 'store', pathMatch: 'full' },
            {
                path: 'zone',
                component: ManageZoneComponent,
            },

            {
                path: 'store',
                component: ManagenmentFranchiseComponent,
            },
            {
                path: 'manage-users',
                component: ManageUsersComponent
            },
            {
                path: 'summary-orders',
                component: SummaryOrdersComponent
            },
            /* {
                path :'summary-preparation',
                component:SummaryPreparationComponent
            }, */
            /* {
                path: 'summary-deliveries',
                component: SummaryDeliveriesComponent
            }, */
            {
                path: 'summary-orders/:id',
                component: PreparationFormComponent
            },
           /*  {
                path: 'summary-preparation/:id',
                component: FormPreparationDetailsComponent
            } */
           /*  {
                path: ':franchise_id',
                component: EditFranchiseComponent,
            }, */
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        FranchiseComponent, 
       /*  FranchiseManagementComponent, 
        CreateFranchiseComponent, 
        ConfirmCreateFranchiseComponent, 
        ModalEditFranchiseComponent, 
        ModalConfirmationComponent, 
        EditFranchiseComponent, */ 
        SummaryOrdersComponent,
        PreparationFormComponent,
        ModalFiltersComponent,
       // ManageZoneComponent
    ],
   /*  entryComponents: [ 
        ConfirmCreateFranchiseComponent, 
        FranchiseManagementComponent, 
        ModalEditFranchiseComponent ,
        ModalConfirmationComponent,
        ModalConfirmComponent
    ]*/
    entryComponents: [ ModalFiltersComponent ],
    providers: [
        ToDayTimePipe, 
        DistancePipe,
        DatePipe,
        DurationPipe,
        WebSocketService
    ],
})
export class FranchiseModule {}
