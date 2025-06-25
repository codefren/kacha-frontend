import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserFormPartnersComponent } from './user-form-partners/user-form-partners.component';
import { UserListPartnersComponent } from './user-list-partners/user-list-partners.component';
import { UserDetailPartnersComponent } from './user-detail-partners/user-detail-partners.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModaIncidentDetailComponent } from './moda-incident-detail/moda-incident-detail.component';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { UserModalConfirmDocumentComponent } from './user-modal-confirm-document/user-modal-confirm-document.component';
import { UserModalDocumentComponent } from './user-modal-document/user-modal-document.component';
import { UsersConfirmDialogComponent } from './users-confirm-dialog/users-confirm-dialog.component';

@NgModule({
 
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      
      {
        path: 'user',
        component: UserListPartnersComponent,
    },
    {
        path: 'user/:id',
        component: UserFormPartnersComponent,
    },
    {
      path: 'users/detail/:id',
      component: UserDetailPartnersComponent
    },
    ]),
    TranslateModule.forChild(),
  ],
  declarations: [
    UserComponent, 
    UserFormPartnersComponent, 
    UserListPartnersComponent, 
    UserDetailPartnersComponent, 
    ModaIncidentDetailComponent, 
    ModalFiltersComponent, 
    UserModalConfirmDocumentComponent, 
    UserModalDocumentComponent, 
    UsersConfirmDialogComponent
  ],
  entryComponents:[
    ModaIncidentDetailComponent, 
    ModalFiltersComponent, 
    UserModalConfirmDocumentComponent, 
    UserModalDocumentComponent, 
    UsersConfirmDialogComponent
  ]
})
export class UserModule { }
