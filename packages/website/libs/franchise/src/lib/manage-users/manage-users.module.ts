import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ManageUsersComponent } from './manage-users.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { ManageUserFormComponent } from './manage-user-form/manage-user-form.component';
import { UsersConfirmDialogComponent } from './manage-user-list/users-confirm-dialog/users-confirm-dialog.component';
import { ModalFiltersComponent } from '../modal-filters/modal-filters.component';



@NgModule({
  imports: [
    CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
          {
            path: 'manage-users',
            component: ManageUserListComponent,
          },
          {
            path: 'manage-users/:id',
            component: ManageUserFormComponent
          }
        ]),
        TranslateModule.forChild(),
  ] ,
  declarations: [
    ManageUsersComponent,
    ManageUserListComponent,
    ManageUserFormComponent,
    UsersConfirmDialogComponent,
    ModalFiltersComponent
  ],
  entryComponents: [
    ManageUserListComponent,
    ManageUserFormComponent,
    UsersConfirmDialogComponent,
    ModalFiltersComponent
  ]
})
export class ManageUsersModule { }
