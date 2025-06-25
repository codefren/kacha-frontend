import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagenmentFranchiseComponent } from './managenment-franchise.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EditFranchiseComponent } from './edit-franchise/edit-franchise.component';

import { CreateFranchiseComponent } from './create-franchise/create-franchise.component';
import { ConfirmCreateFranchiseComponent } from './create-franchise/confirm-create-franchise/confirm-create-franchise.component';
import { ModalEditFranchiseComponent } from './franchise-management/modal-edit-franchise/modal-edit-franchise.component';
import { ModalConfirmationComponent } from './franchise-management/modal-confirmation/modal-confirmation.component';
import { FranchiseManagementComponent } from './franchise-management/franchise-management.component';
import { SharedModule } from '@optimroute/shared';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  imports: [
    CommonModule,
        FormsModule,
        SharedModule,
        NgbModule,
        ReactiveFormsModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
          {
            path: 'store',
            component: ManagenmentFranchiseComponent,
          },
          {
            path: 'store/:id',
            component: EditFranchiseComponent
          }
        ]),
        TranslateModule.forChild(),
  ],
  declarations: [
    FranchiseManagementComponent, 
    CreateFranchiseComponent, 
    ConfirmCreateFranchiseComponent, 
    ModalEditFranchiseComponent, 
    ModalConfirmationComponent, 
    EditFranchiseComponent,
    ManagenmentFranchiseComponent
],
entryComponents: [ 
    ConfirmCreateFranchiseComponent, 
    ModalEditFranchiseComponent,
    ModalConfirmationComponent]
})
export class ManagenmentFranchiseModule { }
