import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyOrdersListComponent } from './component/my-orders-list/my-orders-list.component';
import { MyOrdersFormComponent } from './component/my-orders-form/my-orders-form.component';
import { MyOrdersModalConfirmationComponent } from './component/my-orders-form/my-orders-modal-confirmation/my-orders-modal-confirmation.component';
import { MyOrdersModalSearchClientComponent } from './component/my-orders-form/my-orders-modal-search-client/my-orders-modal-search-client.component';
import { MyOrdersModalSearchProductsComponent } from './component/my-orders-form/my-orders-modal-search-products/my-orders-modal-search-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
          {
            path: '',
            component: MyOrdersListComponent,
          },
          {
            path: ':my_orders_id',
            component: MyOrdersFormComponent
          }
          
        ]),
        TranslateModule.forChild(),
      ],
    declarations: [MyOrdersListComponent, MyOrdersFormComponent, MyOrdersModalConfirmationComponent, MyOrdersModalSearchClientComponent, MyOrdersModalSearchProductsComponent],
  entryComponents:[MyOrdersListComponent, MyOrdersFormComponent, MyOrdersModalConfirmationComponent, MyOrdersModalSearchClientComponent, MyOrdersModalSearchProductsComponent],
  providers: [
    DatePipe
  ]
})
export class MyOrdersModule {}
