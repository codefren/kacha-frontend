import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WebSocketService } from '../products.websocket';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersModalConfirmationComponent } from './orders-form/orders-modal-confirmation/orders-modal-confirmation.component';
import { OrdersModalSearchClientComponent } from './orders-form/orders-modal-search-client/orders-modal-search-client.component';
import { OrdersModalSearchProductsComponent } from './orders-form/orders-modal-search-products/orders-modal-search-products.component';
import { ConfirmModalComponent } from './orders-form/confirm-modal/confirm-modal.component';
import { ModalPrintOrdersComponent } from './orders-list/modal-print-orders/modal-print-orders.component';

import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { ModuleOrdersComponent } from './module-orders.component';
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
        path: 'orders-list',
        component: ModuleOrdersComponent,
      },
      {
          path: 'orders-list/:id',
          component: OrdersFormComponent,
      },
    ]),
    TranslateModule.forChild(),
    ],
    declarations: [
      ModuleOrdersComponent,
      OrdersFormComponent, 
      OrdersListComponent, 
      OrdersModalConfirmationComponent, 
      OrdersModalSearchClientComponent, 
      OrdersModalSearchProductsComponent, 
      ConfirmModalComponent, 
      ModalPrintOrdersComponent, 
      ModalFiltersComponent,
    ],
    entryComponents:[
      OrdersListComponent, 
      OrdersFormComponent, 
      OrdersModalSearchClientComponent, 
      OrdersModalSearchProductsComponent, 
      OrdersModalConfirmationComponent, 
      ConfirmModalComponent, 
      ModalPrintOrdersComponent, 
      ModalFiltersComponent, 
    ],
    providers: [
      DatePipe, WebSocketService
    ]
})
export class ModuleOrdersModule { }
