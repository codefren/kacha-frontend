import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoveltyListComponent } from './novelty-list/novelty-list.component';
import { NoveltyFormComponent } from './novelty-form/novelty-form.component';
import { NoveltyComponent } from './novelty.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      
      {
        path: 'novelty',
        component: NoveltyListComponent,
    },
    {
        path: 'novelty/:id',
        component: NoveltyFormComponent,
    },
    ]),
    TranslateModule.forChild(),
  ],
  declarations: [NoveltyComponent,NoveltyListComponent, NoveltyFormComponent],
})
export class NoveltyModule { }
