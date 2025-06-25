import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevolutionListComponent } from './devolution-list/devolution-list.component';
import { DevolutionFormComponent } from './devolution-form/devolution-form.component';
import { SharedModule } from '../../../../shared/src/lib/shared.module';
import { RouterModule } from '@angular/router';
import { DevolutionComponent } from './devolution.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSearchClientComponent } from './devolution-list/modal-search-client/modal-search-client.component';
import { ModalViewDetailComponent } from './devolution-list/modal-view-detail/modal-view-detail.component';



@NgModule({
  
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
        NgbModule,
        ReactiveFormsModule,
    RouterModule.forChild([

      {
        path: 'devolution/:id',
        component: DevolutionFormComponent
      }
    ]), 
  ],
  declarations: [
    DevolutionComponent,
    DevolutionListComponent, 
    DevolutionFormComponent, 
    ModalSearchClientComponent, 
    ModalViewDetailComponent
  ],
  exports :[
    DevolutionListComponent
  ],
  entryComponents: [
    ModalSearchClientComponent,
    ModalViewDetailComponent
  ]
})
export class DevolutionModule { }
