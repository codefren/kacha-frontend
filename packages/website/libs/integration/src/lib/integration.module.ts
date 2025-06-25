import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IntegrationComponent } from './integration/integration.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { AuthLocalModule } from '../../../auth-local/src/lib/auth-local.module';
import { FormIntegrationComponent } from './integration/form-integration/form-integration.component';
import {
    NgbModule,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { FormIntegrationModule } from './integration/form-integration/form-integration.module';
import { TranslateModule } from '@ngx-translate/core';
import { DurationPipe } from '../../../shared/src/lib/pipes/duration.pipe';
import { ModalGeneratorRouteComponent } from './integration/modal-generator-route/modal-generator-route.component';
import { MomentDateFormatter, CustomDatepickerI18n, Language } from '@optimroute/shared';
import { ModalIntegrationFavoritesComponent } from './integration/modal-integration-favorites/modal-integration-favorites.component';
import { ModalFiltersComponent } from './integration/modal-filters/modal-filters.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormIntegrationModule,
        NgbModule,
        AuthLocalModule,
        RouterModule.forChild([
            {
                path: '',
                component: IntegrationComponent,

                /*    children: [
                    { path: '**', redirectTo: 'integration', pathMatch: 'full' },
                    {
                        path: 'integration/form/:id',
                        component: FormIntegrationComponent,
                    } ,
                    {
                        path: 'form',
                        component: FormIntegrationComponent,
                    } 
                ] */
            },
            /* {
                path: 'form',
                component: FormIntegrationComponent,
            }, */
            {
                path: ':id',
                component: FormIntegrationComponent,
            },
            { path: '**', redirectTo: 'integration', pathMatch: 'full' },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        IntegrationComponent,
        FormIntegrationComponent,
        ModalGeneratorRouteComponent,
        ModalIntegrationFavoritesComponent,
        ModalFiltersComponent,
    ],
    exports: [FormIntegrationComponent, ModalGeneratorRouteComponent],
    entryComponents: [
        FormIntegrationComponent, 
        ModalGeneratorRouteComponent,  
        ModalIntegrationFavoritesComponent,
        ModalFiltersComponent],
    providers: [
        DatePipe,
        DurationPipe,
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class IntegrationModule {}
