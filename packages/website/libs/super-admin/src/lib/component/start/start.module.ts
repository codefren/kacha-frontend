import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartListComponent } from './start-list/start-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { StartComponent } from './start.component';
import { ModalFiltersStartComponent } from './start-list/modal-filters-start/modal-filters-start.component';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      
      {
        path: 'start',
        component: StartListComponent,
      },
   
    ]),
    TranslateModule.forChild(),
  ],
  declarations: [
    StartComponent,
    StartListComponent,
    ModalFiltersStartComponent
  ],
  entryComponents:[
    ModalFiltersStartComponent,

]
})
export class StartModule { }
