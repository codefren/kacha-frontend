import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PreparationComponent } from './preparation/preparation.component';
import { PreparationModule } from './preparation/preparation.module';
import { OrderComponent } from './order.component';
import { HistoricalComponent } from './historical/historical.component';
import { HistoricalModule } from './historical/historical.module';
import { ModuleOrdersComponent } from './component/module-orders.component';
import { ModuleOrdersModule } from './component/module-orders.module';
import { HistoricalOrdersModule } from './historical-orders/historical-orders.module';
import { HistoricalOrdersComponent } from './historical-orders/historical-orders.component';
import { ModalGeneralFiltersComponent } from './modal-general-filters/modal-general-filters.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    PreparationModule,
    HistoricalModule,
    HistoricalOrdersModule,
    ModuleOrdersModule,
    RouterModule.forChild([
      {
          path: '',
          component: OrderComponent,
          children: [
              { path: '', redirectTo: 'orders-list', pathMatch: 'full' },
              {
                  path: 'orders-list',
                  component: ModuleOrdersComponent,
              },
              { 
                path: 'preparation', component: PreparationComponent },
              {
                path: 'historical-preparation', component: HistoricalComponent
              },
              {
                path: 'historical-orders', component: HistoricalOrdersComponent
              },
          ],
      },
  ]),
  TranslateModule.forChild(),
  ],
  declarations: [OrderComponent, ModalGeneralFiltersComponent],
  entryComponents: [ModalGeneralFiltersComponent]
})
export class OrdersModule {}
