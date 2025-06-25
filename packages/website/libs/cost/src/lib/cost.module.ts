import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostListComponent } from './components/cost-list/cost-list.component';
import { CostFormComponent } from './components/cost-form/cost-form.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalModule } from '../../../auth-local/src/lib/auth-local.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StructureComponent } from './components/cost-settings/structure/structure.component';
import { StaffComponent } from './components/cost-settings/staff/staff.component';
import { RatesComponent } from './components/cost-settings/rates/rates.component';
import { CalculationPeriodComponent } from './components/cost-settings/structure/calculation-period/calculation-period.component';
import { StructureCostsComponent } from './components/cost-settings/structure/structure-costs/structure-costs.component';
import { AutomationComponent } from './components/cost-settings/automation/automation.component';
import { TableDriversComponent } from './components/cost-list/table-drivers/table-drivers.component';
import { TableVehiclesComponent } from './components/cost-list/table-vehicles/table-vehicles.component';
import { TableUnemploymentComponent } from './components/cost-list/table-unemployment/table-unemployment.component';
import { ModalTableVehicleTicketComponent } from './components/cost-list/table-vehicles/modal-table-vehicle-ticket/modal-table-vehicle-ticket.component';
import { ModalModifyFuelComponent } from './components/cost-list/modal-modify-fuel/modal-modify-fuel.component';


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
                component: CostListComponent,

            },
            {
                path: ':id',
                component: CostFormComponent,
            },
            
            { path: '**', redirectTo: 'cost', pathMatch: 'full' },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        CostListComponent, 
        CostFormComponent, 
        StructureComponent, 
        StaffComponent, 
        RatesComponent, 
        CalculationPeriodComponent, 
        StructureCostsComponent, 
        AutomationComponent, 
        TableDriversComponent, 
        TableVehiclesComponent, 
        TableUnemploymentComponent, 
        ModalTableVehicleTicketComponent, 
        ModalModifyFuelComponent, 
    ],
    entryComponents: [
        ModalTableVehicleTicketComponent,
        ModalModifyFuelComponent
    ],
})
export class CostModule {}
