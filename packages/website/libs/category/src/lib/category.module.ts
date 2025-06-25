import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoryFormComponent } from './component/category-form/category-form.component';
import { CategoryListComponent } from './component/category-list/category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryListModalActiveComponent } from './component/category-list/category-list-modal-active/category-list-modal-active.component';
import { ModalEditSubCategoryComponent } from './component/category-form/modal-edit-sub-category/modal-edit-sub-category.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: CategoryListComponent,
            },
            {
                path: ':category_id',
                component: CategoryFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    exports: [CategoryListComponent, CategoryFormComponent, CategoryListModalActiveComponent],
    providers: [DatePipe],
    entryComponents: [
        CategoryListComponent,
        CategoryFormComponent,
        CategoryListModalActiveComponent,
        ModalEditSubCategoryComponent
    ],
    declarations: [
        CategoryFormComponent,
        CategoryListComponent,
        CategoryListModalActiveComponent,
        ModalEditSubCategoryComponent,
    ],
})
export class CategoryModule {}
