import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HistoricalComponent } from './historical.component';
import { HistoricalPreparationFormComponent } from './historical-preparation-form/historical-preparation-form.component';
import { HistoricalPreparationListComponent } from './historical-preparation-list/historical-preparation-list.component';
import { ModalFiltersComponent } from '../component/modal-filters/modal-filters.component';
import { WebSocketService } from 'libs/state-route-planning/src/lib/web-socket.service';
import { TicketModalComponent } from './ticket-modal/ticket-modal.component';
import { SharedModule } from '@optimroute/shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([
          {
            path: 'historical-preparation',
            component: HistoricalComponent,
          },
          {
            path: 'historical-preparation/:id',
            component: HistoricalPreparationFormComponent
          }
        ]),
        TranslateModule.forChild(),
        ],
    providers: [
      DatePipe, WebSocketService
    ],
    declarations: [
      HistoricalComponent,
      HistoricalPreparationListComponent,
      HistoricalPreparationFormComponent, 
      TicketModalComponent
    ],
    entryComponents: [
      HistoricalPreparationListComponent,
      HistoricalPreparationFormComponent,
      ModalFiltersComponent,
      TicketModalComponent
    ]
})
export class HistoricalModule {}
