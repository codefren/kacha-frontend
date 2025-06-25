import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './component/routes/routes.component';
import { SalesComponent } from './component/sales/sales.component';
import { CostComponent } from './component/cost/cost.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './component/dashboard.component';
import { SummaryComponent } from './component/routes/summary/summary.component';
import { DeliveryMadeComponent } from './component/routes/delivery-made/delivery-made.component';
import { TotalBillingComponent } from './component/routes/total-billing/total-billing.component';
import { TotalClientsComponent } from './component/routes/total-clients/total-clients.component';
//import { MorrisJsModule } from 'angular-morris-js';
import { ScheduleControlComponent } from './component/routes/schedule-control/schedule-control.component';
import { WebSocketService } from './dashboard.websocket';
import { TotalSaleAgentCommercialComponent } from './component/total-sale-agent-commercial/total-sale-agent-commercial.component';
import { TotalInvoicedComponent } from './component/total-sale-agent-commercial/left/total-invoiced/total-invoiced.component';
import { AppInvoicedComponent } from './component/total-sale-agent-commercial/left/app-invoiced/app-invoiced.component';
import { AppCommissionComponent } from './component/total-sale-agent-commercial/left/app-commission/app-commission.component';
import { SaleCommissionComponent } from './component/total-sale-agent-commercial/left/sale-commission/sale-commission.component';
import { NewClientComponent } from './component/total-sale-agent-commercial/left/new-client/new-client.component';
import { TotalOrdersComponent } from './component/total-sale-agent-commercial/left/total-orders/total-orders.component';
import { SummaryInvoiceComponent } from './component/total-sale-agent-commercial/rigth/summary-invoice/summary-invoice.component';
import { AppCommissionDonusComponent } from './component/total-sale-agent-commercial/rigth/app-commission-donus/app-commission-donus.component';
import { SaleCommissionDonusComponent } from './component/total-sale-agent-commercial/rigth/sale-commission-donus/sale-commission-donus.component';
import { NewClientDonusComponent } from './component/total-sale-agent-commercial/rigth/new-client-donus/new-client-donus.component';
import { TotalOrdersDonusComponent } from './component/total-sale-agent-commercial/rigth/total-orders-donus/total-orders-donus.component';
    
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        NgbModule,
        //MorrisJsModule,
        RouterModule.forChild(
            [
                { path: '', pathMatch: 'full', component: DashboardComponent },
                { path: 'TotalSale', pathMatch: 'full', component: TotalSaleAgentCommercialComponent }
                
            ]
            ),
        TranslateModule.forChild(),
    ],
    providers: [WebSocketService],
    declarations: [
        RoutesComponent, 
        SalesComponent, 
        CostComponent, 
        DashboardComponent, 
        SummaryComponent, 
        DeliveryMadeComponent, 
        TotalBillingComponent, 
        TotalClientsComponent, 
        ScheduleControlComponent, 
        TotalSaleAgentCommercialComponent, 
        TotalInvoicedComponent, 
        AppInvoicedComponent, 
        AppCommissionComponent, 
        SaleCommissionComponent, 
        NewClientComponent, 
        TotalOrdersComponent, 
        SummaryInvoiceComponent, 
        AppCommissionDonusComponent, 
        SaleCommissionDonusComponent, 
        NewClientDonusComponent, 
        TotalOrdersDonusComponent
    ],
})
export class DashboardModule {}
