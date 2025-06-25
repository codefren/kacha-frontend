import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageZoneListComponent } from './manage-zone-list/manage-zone-list.component';
import { ManageZoneFormComponent } from './manage-zone-form/manage-zone-form.component';
import { ManageZoneComponent } from './manage-zone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalAddCompanyFranchiseComponent } from './manage-zone-form/modal-add-company-franchise/modal-add-company-franchise.component';
import { ModalZoneCompanyFranchiseDeleteComponent } from './manage-zone-form/modal-zone-company-franchise-delete/modal-zone-company-franchise-delete.component';
import { NgxMaskModule } from 'ngx-mask';
import { ModalAddRidersComponent } from './manage-zone-form/modal-add-riders/modal-add-riders.component';





@NgModule({
 
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: 'zone',
        component: ManageZoneListComponent,
      },
      {
        path: 'zone/:id',
        component: ManageZoneFormComponent
      }
    ]),
  ],
  declarations: [
    ManageZoneComponent,
    ManageZoneListComponent,
    ManageZoneFormComponent,
    ModalAddCompanyFranchiseComponent,
    ModalZoneCompanyFranchiseDeleteComponent,
    ModalAddRidersComponent,
  ],
    entryComponents:[
      ModalAddCompanyFranchiseComponent ,
      ModalZoneCompanyFranchiseDeleteComponent,
      ModalAddRidersComponent
    ]
})
export class ManageZoneModule { }
