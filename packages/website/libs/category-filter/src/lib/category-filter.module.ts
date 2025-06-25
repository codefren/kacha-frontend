import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterFormComponent } from './component/category-filter-form/category-filter-form.component';
import { CategoryFilterListComponent } from './component/category-filter-list/category-filter-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: CategoryFilterListComponent,
            },
            {
                path: ':category_filter_id',
                component: CategoryFilterFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    exports: [CategoryFilterFormComponent, CategoryFilterListComponent],
    declarations: [CategoryFilterFormComponent, CategoryFilterListComponent],
    entryComponents:[CategoryFilterFormComponent]
    
})
export class CategoryFilterModule {}
