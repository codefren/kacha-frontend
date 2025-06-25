import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceComponent } from './invoice.component';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      
      {
        path: 'invoice',
        component: InvoiceListComponent,
    },
    /* {
        path: 'novelty/:id',
        component: NoveltyFormComponent,
    }, */
    ]),
    TranslateModule.forChild(),
  ],
  declarations: [InvoiceComponent,InvoiceListComponent],
})
export class InvoiceModule { }
