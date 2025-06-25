import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@optimroute/shared';
import { ManagementAssociatedCompaniesTableComponent } from './management-associated-companies-table/management-associated-companies-table.component';
import { ManagementAssociatedCompaniesComponent } from './management-associated-companies.component';
import { ManagementAssociatedCompaniesFormComponent } from './management-associated-companies-table/management-assiociated-companies-form/maganement-associated-companies-form.component';
import { ActiveDialogComponent } from './management-associated-companies-table/active-dialog/active-dialog-component';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { ModalFiltersComponent } from './management-associated-companies-table/modal-filters/modal-filters.component';

@NgModule({
  declarations: [ 
    ManagementAssociatedCompaniesComponent, 
    ManagementAssociatedCompaniesTableComponent, 
    ManagementAssociatedCompaniesFormComponent, 
    ActiveDialogComponent, ModalFiltersComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: 'associated-companies',
        component: ManagementAssociatedCompaniesTableComponent
      },
      {
        path: 'associated-companies/:id',
        component: ManagementAssociatedCompaniesFormComponent
      }
    ]),
  ],
  entryComponents: [ 
    ManagementAssociatedCompaniesComponent, 
    ManagementAssociatedCompaniesFormComponent, 
    ManagementAssociatedCompaniesTableComponent,
    ActiveDialogComponent,
    ModalFiltersComponent
  ]
})
export class ManagementAssociatedCompaniesModule { }
