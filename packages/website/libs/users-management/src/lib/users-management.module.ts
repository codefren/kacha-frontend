import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersManagementComponent } from './users-management.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { UsersComponent } from './users/users.component';
import { UsersModule } from './users/users.module';
import { StateUsersModule } from '@optimroute/state-users';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { CompaniesComponent } from './companies/companies.component';
import { CompaniesModule } from './companies/companies.module';
import { StateCompaniesModule } from '@optimroute/state-companies';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
    imports: [CommonModule,
    SharedModule,
    UsersModule,
    CompaniesModule,
    StateUsersModule,
    StateCompaniesModule,
    StateProfileSettingsModule,
    NgbModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
        {
            path: '',
            component: UsersManagementComponent,
            children: [
                { path: '', redirectTo: 'companies', pathMatch: 'full' },
                { path: 'users', component: UsersComponent },
                { path: 'companies', component: CompaniesComponent },
                {
                    path: 'companiesMe', component: CompaniesComponent, data: { me: true }
                }
            ],
        },
    ]),
    TranslateModule.forChild(),],
    
    declarations: [UsersManagementComponent],
})
export class UsersManagementModule {}
