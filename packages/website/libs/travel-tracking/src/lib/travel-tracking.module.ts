import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelTrackingListComponent } from './components/travel-tracking-list/travel-tracking-list.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalCreateRetainerRouteComponent } from './components/travel-tracking-list/modal-create-retainer-route/modal-create-retainer-route.component';
import { ModalCreateClientsComponent } from './components/travel-tracking-list/modal-create-clients/modal-create-clients.component';
import { TravelRouteListComponent } from './components/travel-route-list/travel-route-list.component';
import { ToDayTimePipe } from '../../../shared/src/lib/pipes/to-day-time.pipe';
import { DistancePipe } from '../../../shared/src/lib/pipes/distance.pipe';
import { TravelRouteDetailsComponent } from './components/travel-route-details/travel-route-details.component';
import { ServiceInformationComponent } from './components/travel-route-details/service-information/service-information.component';
import { DeliveryNoteDetailComponent } from './components/travel-route-details/delivery-note-detail/delivery-note-detail.component';
import { ModalChangeDriverComponent } from './components/travel-route-list/modal-change-driver/modal-change-driver.component';
import { ModalChangeVehicleComponent } from './components/travel-route-list/modal-change-vehicle/modal-change-vehicle.component';
import { ModalConfirmEndrouteComponent } from './components/travel-route-list/modal-confirm-endroute/modal-confirm-endroute.component';
import { ModalRoutesComponent } from './components/travel-route-list/modal-routes/modal-routes.component';
import { ModalPostponedComponent } from './components/travel-route-details/service-information/modal-postponed/modal-postponed.component';
import { ModalShowLoadsComponent } from './components/travel-route-list/modal-show-loads/modal-show-loads.component';
import { ModalEndRoutesComponent } from './components/travel-route-list/modal-end-routes/modal-end-routes.component';
import { BillsComponent } from './components/travel-route-details/bills/bills.component';
import { ModalRepostajeComponent } from './components/travel-route-list/modal-repostaje/modal-repostaje.component';
import { ModalRepostajeTravelComponent } from './components/travel-tracking-list/modal-repostaje-travel/modal-repostaje-travel.component';
import { ModalCreateRetainerRouteInsideComponent } from './components/travel-route-list/modal-create-retainer-route-inside/modal-create-retainer-route-inside.component';
import { ModalEditCostActualComponent } from './components/travel-route-list/modal-edit-cost-actual/modal-edit-cost-actual.component';
import { ModalAddTemplateComponent } from './components/travel-tracking-list/modal-add-template/modal-add-template.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        FilterStateModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: TravelTrackingListComponent,

            },
            {
                path: ':id',
                component: TravelRouteListComponent,
            },
            {
                path: ':id/details/:id',
                component: TravelRouteDetailsComponent,
            },
            {
                path: ':id/details/:id/:redirect',
                component: TravelRouteDetailsComponent,
            },
            { path: '**', redirectTo: 'travel-tracking', pathMatch: 'full' },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        TravelTrackingListComponent, 
        ModalCreateRetainerRouteComponent, 
        ModalCreateClientsComponent, 
        TravelRouteListComponent, 
        TravelRouteDetailsComponent,
        ServiceInformationComponent, 
        DeliveryNoteDetailComponent,
        ModalChangeDriverComponent,
        ModalChangeVehicleComponent,
        ModalConfirmEndrouteComponent,
        ModalRoutesComponent,
        ModalPostponedComponent,
        ModalShowLoadsComponent,
        ModalEndRoutesComponent,
        BillsComponent,
        ModalRepostajeComponent,
        ModalRepostajeTravelComponent,
        ModalCreateRetainerRouteInsideComponent,
        ModalEditCostActualComponent,
        ModalAddTemplateComponent
    ],
    entryComponents: [
        ModalCreateRetainerRouteComponent,
        ModalCreateClientsComponent,
        ModalChangeDriverComponent,
        ModalChangeVehicleComponent,
        ModalConfirmEndrouteComponent,
        ModalRoutesComponent,
        ModalPostponedComponent,
        ModalShowLoadsComponent,
        ModalEndRoutesComponent,
        ModalRepostajeComponent,
        ModalRepostajeTravelComponent,
        ModalCreateRetainerRouteInsideComponent,
        ModalEditCostActualComponent,
        ModalAddTemplateComponent
    ],
    providers: [ToDayTimePipe, DistancePipe ]
})
export class TravelTrackingModule {}
