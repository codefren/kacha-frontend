import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalFiltersComponent } from '../component/modal-filters/modal-filters.component';
import { WebSocketService } from 'libs/state-route-planning/src/lib/web-socket.service';
import { HistoricalOrdersComponent } from './historical-orders.component';
import { HistoricalOrdersListComponent } from './historical-orders-list/historical-orders-list.component';
import { HistoricalOrdersFromComponent } from './historical-orders-from/historical-orders-from.component';
import { SharedModule } from '@optimroute/shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
          {
            path: 'historical-orders',
            component: HistoricalOrdersComponent,
          },
          {
            path: 'historical-orders/:id',
            component: HistoricalOrdersFromComponent
          }
        ]),
        TranslateModule.forChild(),
        ],
    providers: [
      DatePipe, WebSocketService
    ],
    declarations: [HistoricalOrdersComponent, HistoricalOrdersListComponent, HistoricalOrdersFromComponent],
    entryComponents: [HistoricalOrdersListComponent, HistoricalOrdersFromComponent, ModalFiltersComponent]
})
export class HistoricalOrdersModule {}
