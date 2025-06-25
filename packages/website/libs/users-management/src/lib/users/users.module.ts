import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '@optimroute/shared';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { UsersTableComponent } from './users-table/users-table.component';
import { UserCreationDialogComponent } from './users-table/user-creation-dialog/user-creation-dialog.component';
import { UsersService } from './users.service';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings'
import { NgxMaskModule } from 'ngx-mask';
import { UsersFormComponent } from './users-table/users-form/users-form.component';
import { RouterModule } from '@angular/router';
import { UsersConfirmDialogComponent } from './users-table/users-confirm-dialog/users-confirm-dialog.component';
import { ModalFiltersComponent } from './users-table/modal-filters/modal-filters.component';
import { ModaIncidentDetailComponent } from './users-table/moda-incident-detail/moda-incident-detail.component';
import { UserDetailComponent } from './users-table/user-detail/user-detail.component';
import { ModalMaxUsersComponent } from './users-table/modal-max-users/modal-max-users.component';
import { UserModalConfirmDocumentComponent } from './users-table/user-modal-confirm-document/user-modal-confirm-document.component';
import { UserModalDocumentComponent } from './users-table/user-modal-document/user-modal-document.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersGenericInformationComponent } from './users-table/users-form/users-generic-information/users-generic-information.component';
import { UsersCarnetsComponent } from './users-table/users-form/users-carnets/users-carnets.component';
import { UsersHoursComponent } from './users-table/users-form/users-hours/users-hours.component';
import { UsersDocumentationComponent } from './users-table/users-form/users-documentation/users-documentation.component';
import { UsersCostsComponent } from './users-table/users-form/users-costs/users-costs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalAvatarComponent } from './users-table/users-form/modal-avatar/modal-avatar.component';
import { ModalBadImportComponent } from './users-table/modal-bad-import/modal-bad-import.component';
import { ModalDownloadUsersComponent } from './users-table/modal-download-users/modal-download-users.component';

@NgModule({
    declarations: [
        UsersComponent,
        UsersTableComponent,
        UserCreationDialogComponent,
        UsersFormComponent,
        UserDetailComponent,
        UsersConfirmDialogComponent, 
        ModalFiltersComponent, 
        ModaIncidentDetailComponent, 
        ModalMaxUsersComponent,
        UserModalConfirmDocumentComponent,
        UserModalDocumentComponent,
        UsersGenericInformationComponent,
        UsersCarnetsComponent,
        UsersHoursComponent,
        UsersDocumentationComponent,
        UsersCostsComponent,
        ModalAvatarComponent,
        ModalBadImportComponent,
        ModalDownloadUsersComponent
    ],
    imports: [
        StateEasyrouteModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        StateProfileSettingsModule,
        NgxMaskModule.forChild(),
        RouterModule.forChild([
            { path: 'users/:id', component: UsersFormComponent },
            {
                path: 'users/:id/me/:me',
                component: UsersFormComponent
            },
            {
                path: 'users/:id/me/:me/:redirect',
                component: UsersFormComponent
            },
            {
                path: 'users/detail/:id',
                component: UserDetailComponent
            },
            {
                path: 'users/detail/:id/me/:me',
                component: UserDetailComponent
            }
    
        ])
    ],
    entryComponents: [
        UserCreationDialogComponent, 
        UsersConfirmDialogComponent, 
        ModalFiltersComponent, 
        ModaIncidentDetailComponent, 
        ModalMaxUsersComponent,
        UserModalConfirmDocumentComponent,
        UserModalDocumentComponent,
        ModalAvatarComponent,
        ModalDownloadUsersComponent
        
    ],
    providers: [UsersService]
})
export class UsersModule { }
