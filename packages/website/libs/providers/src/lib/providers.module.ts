import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@optimroute/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProviderListComponent } from './components/provider-list/provider-list.component';
import { ProviderFormComponent } from './components/provider-form/provider-form.component';
import { ModalProviderActiveComponent } from './components/provider-list/modal-provider-active/modal-provider-active.component';

import { FilterStateModule } from '@easyroute/filter-state';
import { ModalAddCostVehicleComponent } from './components/provider-form/modal-add-cost-vehicle/modal-add-cost-vehicle.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule,
        FilterStateModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProviderListComponent
            },
            {
                path: ':provider_id',
                component: ProviderFormComponent
            },
        ]),
    ],
    declarations: [
        ProviderListComponent, 
        ProviderFormComponent,
        ModalProviderActiveComponent,
        ModalAddCostVehicleComponent
    ],
    entryComponents: [
        ModalProviderActiveComponent,
        ModalAddCostVehicleComponent
    ],
})

export class ProvidersModule {}
