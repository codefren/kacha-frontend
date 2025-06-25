import { DevolutionModule } from './devolution/devolution.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelComponent } from './control-panel.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@optimroute/shared'
import { AssignedRoutesComponent } from './assigned-routes/assigned-routes.component';

import { AssignedRoutesModule } from './assigned-routes/assigned-routes.module';
import { AuthLocalModule } from '@optimroute/auth-local'
import { HistoryRoutesModule } from './history-routes/history-routes.module';
import { HistoryRoutesComponent } from './history-routes/history-routes.component';
import { DeliveryDetailsComponent } from './assigned-routes/delivery-details/delivery-details.component';
import { DevolutionComponent } from './devolution/devolution.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AssignedRoutesModule,
        HistoryRoutesModule,
        DevolutionModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        AuthLocalModule,
        RouterModule.forChild([
            {
                path: '',
                component: ControlPanelComponent,
                children: [
                    { path: '', redirectTo: 'devolution', pathMatch: 'full' },
                   /*  {
                        path: 'assigned',
                        component: AssignedRoutesComponent
                    },
                    {
                        path: 'history',
                        component: HistoryRoutesComponent,
                    }, */
                    {
                        path: 'devolution',
                        component: DevolutionComponent,
                    }
                ]
            }
        ]),
    ],
    declarations: [ControlPanelComponent],


})
export class ControlPanelModule {}
