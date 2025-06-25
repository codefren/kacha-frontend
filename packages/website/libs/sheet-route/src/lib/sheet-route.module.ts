import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetRouteListComponent } from './components/sheet-route-list/sheet-route-list.component';
import { SheetRouteFormComponent } from './components/sheet-route-form/sheet-route-form.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalModule } from '../../../auth-local/src/lib/auth-local.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalCheckRoutesComponent } from './components/sheet-route-list/modal-check-routes/modal-check-routes.component';
import { AnswersFormComponent } from './components/sheet-route-form/answers-form/answers-form.component';
import { DeliveryNotesComponent } from './components/sheet-route-form/delivery-notes/delivery-notes.component';
import { SummaryComponent } from './components/sheet-route-form/summary/summary.component';
import { ModalViewTicketComponent } from './components/sheet-route-form/answers-form/modal-view-ticket/modal-view-ticket.component';
import { ModalViewReturnsComponent } from './components/sheet-route-form/summary/modal-view-returns/modal-view-returns.component';
import { ModalViewObservationsComponent } from './components/sheet-route-form/summary/modal-view-observations/modal-view-observations.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalExtraBoxesComponent } from './components/sheet-route-form/summary/modal-extra-boxes/modal-extra-boxes.component';
import { ModalIncidenciasComponent } from './components/sheet-route-form/summary/modal-incidencias/modal-incidencias.component';
import { FilterStateModule } from '@easyroute/filter-state';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        AuthLocalModule,
        ReactiveFormsModule,
        FormsModule,
        FilterStateModule,
        RouterModule.forChild([
            {
                path: '',
                component: SheetRouteListComponent,

            },
            {
                path: ':id',
                component: SheetRouteFormComponent,
            },
            
            { path: '**', redirectTo: 'sheet-route', pathMatch: 'full' },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        SheetRouteListComponent, 
        SheetRouteFormComponent,
        ModalCheckRoutesComponent,
        AnswersFormComponent,
        DeliveryNotesComponent,
        SummaryComponent,
        ModalViewTicketComponent,
        ModalViewReturnsComponent,
        ModalViewObservationsComponent,
        ModalExtraBoxesComponent,
        ModalIncidenciasComponent
    ],
    entryComponents:[
        ModalCheckRoutesComponent,
        ModalViewTicketComponent,
        ModalViewReturnsComponent,
        ModalViewObservationsComponent,
        ModalExtraBoxesComponent,
        ModalIncidenciasComponent
    ]
})
export class SheetRouteModule {}
