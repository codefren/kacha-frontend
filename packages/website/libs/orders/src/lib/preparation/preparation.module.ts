import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PreparationListComponent } from './preparation-list/preparation-list.component';

import { PreparationComponent } from './preparation.component';
import { PreparationFormComponent } from './preparation-form/preparation-form.component';
import { WebSocketService } from '../../../../state-route-planning/src/lib/web-socket.service';
import { ToDayTimePipe } from '../../../../shared/src/lib/pipes/to-day-time.pipe';
import { ModalFiltersComponent } from './preparation-list/modal-filters/modal-filters.component';
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
            path: 'preparacion',
            component: PreparationComponent,
        },
        {
            path: 'preparation/:id',
            component: PreparationFormComponent,
        },
          
        ]),
        TranslateModule.forChild(),
        ],
    declarations: [
        PreparationComponent,
        PreparationListComponent, 
        PreparationFormComponent, 
        ModalFiltersComponent
    ],
    entryComponents: [
        PreparationListComponent,
        PreparationFormComponent,
        ModalFiltersComponent
    ],
    providers: [
        DatePipe, WebSocketService,
        ToDayTimePipe
      ],
})
export class PreparationModule {}
