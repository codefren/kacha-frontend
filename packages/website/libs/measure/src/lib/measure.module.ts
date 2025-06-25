import { NgModule } from '@angular/core';
import { MeasureComponent } from './measure.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MeasureListComponent } from './component/measure-list/measure-list.component';
import { MeasureFormComponent } from './component/measure-form/measure-form.component';
import { MeasureModalActiveComponent } from './component/measure-list/measure-modal-active/measure-modal-active.component';

@NgModule({
    declarations: [MeasureComponent, MeasureListComponent, MeasureFormComponent, MeasureModalActiveComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MeasureListComponent,
            },
            {
                path: ':measure_id',
                component: MeasureFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    exports: [MeasureComponent, MeasureListComponent, MeasureFormComponent],
    providers: [DatePipe],
    entryComponents: [MeasureComponent, MeasureListComponent, MeasureFormComponent, MeasureModalActiveComponent],
})
export class MeasureModule {}
