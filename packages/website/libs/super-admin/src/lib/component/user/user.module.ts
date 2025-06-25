import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserComponent } from './user.component';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component'
import { NgxMaskModule } from 'ngx-mask';
import { UsersConfirmDialogComponent } from './users-confirm-dialog/users-confirm-dialog.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ModaIncidentDetailComponent } from './moda-incident-detail/moda-incident-detail.component';
import { UserModalDocumentComponent } from './user-modal-document/user-modal-document.component';
import { UserModalConfirmDocumentComponent } from './user-modal-confirm-document/user-modal-confirm-document.component';

@NgModule({
 
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      
      {
        path: 'user',
        component: UserListComponent,
    },
    {
        path: 'user/:id',
        component: UserFormComponent,
    },
    {
      path: 'users/detail/:id',
      component: UserDetailComponent
    },
    ]),
    TranslateModule.forChild(),
  ],
  declarations: [
    UserComponent,
    UserListComponent, 
    UserFormComponent, 
    ModalFiltersComponent,
    UsersConfirmDialogComponent, 
    UserDetailComponent,
    ModaIncidentDetailComponent,
    UserModalDocumentComponent,
    UserModalConfirmDocumentComponent
  ],
  entryComponents: [
    ModalFiltersComponent,
    UsersConfirmDialogComponent, 
    UserDetailComponent,
    ModaIncidentDetailComponent,
    UserModalDocumentComponent,
    UserModalConfirmDocumentComponent
  ]
})
export class UserModule { }
