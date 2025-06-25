import { NgModule } from '@angular/core';
import { MeasureGeneralComponent } from './measure-general.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MeasureGeneralListComponent } from './component/measure-general-list/measure-general-list.component';
import { MeasureGeneralFormComponent } from './component/measure-general-form/measure-general-form.component';

@NgModule({
  declarations: [MeasureGeneralComponent, MeasureGeneralListComponent, MeasureGeneralFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
          path: '',
          component: MeasureGeneralListComponent
      },
      {
        path: ':measure_general_id',
        component: MeasureGeneralFormComponent
      }
    ]),
    TranslateModule.forChild()
  ],
  exports: [MeasureGeneralComponent, MeasureGeneralListComponent, MeasureGeneralFormComponent],
  providers: [DatePipe],
  entryComponents:[MeasureGeneralComponent, MeasureGeneralListComponent, MeasureGeneralFormComponent]
})
export class MeasureGeneralModule { }
