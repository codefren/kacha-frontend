import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponentComponent } from './components/report-component/report-component.component';
import { ReportRoutesComponent } from './components/report-routes/report-routes.component';
import { DetailsComponent } from './components/report-routes/details/details.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalFilterDownloadComponent } from './components/report-routes/modal-filter-download/modal-filter-download.component';
import { ReportCostEffectivenessComponent } from './components/report-cost-effectiveness/report-cost-effectiveness.component';
import { SummaryCostEffectivenessComponent } from './components/report-cost-effectiveness/summary-cost-effectiveness/summary-cost-effectiveness.component';
import { CostComparisonComponent } from './components/report-cost-effectiveness/cost-comparison/cost-comparison.component';
import { RouteCostSummaryComponent } from './components/report-cost-effectiveness/route-cost-summary/route-cost-summary.component';
import { TypeRoutesComponent } from './components/report-cost-effectiveness/type-routes/type-routes.component';
import { ComparativeRouteHoursComponent } from './components/report-cost-effectiveness/comparative-route-hours/comparative-route-hours.component';
import { KmComparisonComponent } from './components/report-cost-effectiveness/km-comparison/km-comparison.component';
import { AnnualComparisonComponent } from './components/report-cost-effectiveness/annual-comparison/annual-comparison.component';
import { ReportDataUpdateComponent } from './components/report-data-update/report-data-update.component';
import { SummaryDataUpdateComponent } from './components/report-data-update/summary-data-update/summary-data-update.component';
import { SummaryOfUpdatesComponent } from './components/report-data-update/summary-of-updates/summary-of-updates.component';
import { UpdateDataComparisonComponent } from './components/report-data-update/update-data-comparison/update-data-comparison.component';
import { ModalOpenClientsComponent } from './components/report-data-update/modal-open-clients/modal-open-clients.component';
import { ToDayTimePipe } from '../../../shared/src/lib/pipes/to-day-time.pipe';
import { DurationPipe } from '../../../shared/src/lib/pipes/duration.pipe';
import { StatePreferencesModule } from '../../../state-preferences/src/lib/state-preferences.module';
import { OrderByPipe } from 'libs/shared/src/lib/pipes/order-by.pipe';
import { UpdateOfUpdateComponent } from './components/report-data-update/update-of-update/update-of-update.component';
import { ControlDocumentComponent } from './components/control-document/control-document.component';
import { ModalFilterDownloadControlComponent } from './components/control-document/modal-filter-download-control/modal-filter-download-control.component';
import { ControlDocumentDetailComponent } from './components/control-document/control-document-detail/control-document-detail.component';
import { AccessLogComponent } from './components/access-log/access-log.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        FilterStateModule,
        StatePreferencesModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportComponentComponent

            },
            {
                path: 'route',
                component: ReportRoutesComponent,
            },
            {
                path: 'control-Documents',
                component: ControlDocumentComponent,
            },
            {
                path: 'cost-effectiveness',
                component: ReportCostEffectivenessComponent,
            },
            {
                path: 'data-update',
                component: ReportDataUpdateComponent,
            },
            {
                path: 'access-log',
                component: AccessLogComponent,
            },
            {
                path: 'route/:id',
                component: DetailsComponent,
            },
            {
                path: 'control-Documents/:id',
                component: ControlDocumentDetailComponent,
            },
            
            { path: '**', redirectTo: 'report', pathMatch: 'full' },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        ReportComponentComponent, 
        ReportRoutesComponent, 
        DetailsComponent, 
        ModalFilterDownloadComponent, 
        ReportCostEffectivenessComponent, 
        SummaryCostEffectivenessComponent, 
        CostComparisonComponent, 
        RouteCostSummaryComponent, 
        TypeRoutesComponent, 
        ComparativeRouteHoursComponent, 
        KmComparisonComponent, 
        AnnualComparisonComponent,
        ModalOpenClientsComponent,
        SummaryDataUpdateComponent,
        SummaryOfUpdatesComponent,
        UpdateDataComparisonComponent,
        ReportDataUpdateComponent,
        UpdateOfUpdateComponent,
        ControlDocumentComponent,
        ModalFilterDownloadControlComponent,
        ControlDocumentDetailComponent,
        AccessLogComponent
    ],
    entryComponents:[
        ModalFilterDownloadComponent,
        ModalOpenClientsComponent,
        ModalFilterDownloadControlComponent
    ],
    providers:[DurationPipe, ToDayTimePipe, OrderByPipe],
})
export class ReportModule {}
