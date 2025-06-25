import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DurationPipe, SharedModule } from '@optimroute/shared';
import { ManagementComponent } from './management.component';
import { StateVehiclesModule } from '@optimroute/state-vehicles';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { TranslateModule } from '@ngx-translate/core';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { UsersModule, UsersComponent, CompaniesModule, CompaniesComponent  } from '@optimroute/users-management'
import { StateUsersModule } from '@optimroute/state-users'
import { StateCompaniesModule } from '@optimroute/state-companies'
import { ManagementClientsComponent } from './management-clients/management-clients.component';
import { ManagementClientsModule } from './management-clients/management-clients.module';
import { StatePointsModule } from '@easyroute/state-points'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManagementAssociatedCompaniesComponent } from './management-associated-companies/management-associated-companies.component';
import { ManagementAssociatedCompaniesModule } from './management-associated-companies/management-associated-companies.module';



@NgModule({
    imports: [
        CommonModule,
        StateVehiclesModule,
        StateDeliveryZonesModule,
        StateEasyrouteModule,
        StateProfileSettingsModule,
        SharedModule,
        ManagementClientsModule,
        ManagementAssociatedCompaniesModule,
        UsersModule,
        StateUsersModule,
        CompaniesModule,
        StateCompaniesModule,
        StatePointsModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManagementComponent,
                children: [
                    { path: '', redirectTo: 'delivery-zones', pathMatch: 'full' },
                    {
                        path: 'users', component: UsersComponent, data: { me: true }
                    },
                    {
                        path: 'companies', component: CompaniesComponent, data: { me: true }
                    },
                    {
                        path: 'clients', component: ManagementClientsComponent
                    },
                    {
                        path: 'associated-companies', component: ManagementAssociatedCompaniesComponent
                    }
                ],
            },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [ManagementComponent],
    providers: [],
})
export class ManagementModule {}
