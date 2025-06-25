import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParcelListComponent } from './components/parcel-list/parcel-list.component';
import { ParcelFormComponent } from './components/parcel-form/parcel-form.component';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';
import { PackageListComponent } from './components/parcel-form/package-list/package-list.component';
import { ToDayTimePipe } from '../../../shared/src/lib/pipes/to-day-time.pipe';
import { DurationPipe } from '../../../shared/src/lib/pipes/duration.pipe';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        FilterStateModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: ParcelListComponent,

            },
            {
                path: ':id',
                component: ParcelFormComponent,
            },
            
            { path: '**', redirectTo: 'parcel', pathMatch: 'full' },
            
        ]),
        TranslateModule.forChild(),
    ],
    providers:[DurationPipe, ToDayTimePipe],
    declarations: [
        ParcelListComponent, 
        ParcelFormComponent, 
        PackageListComponent
    ],
})
export class ParcelModule {}
