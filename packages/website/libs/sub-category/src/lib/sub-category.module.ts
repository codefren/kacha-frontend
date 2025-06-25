import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SubCategoryListComponent } from './component/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './component/sub-category-form/sub-category-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalEditSubCategoryComponent } from './component/sub-category-form/modal-edit-sub-category/modal-edit-sub-category.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: SubCategoryListComponent,
            },
            {
                path: ':sub_category_id',
                component: SubCategoryFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    exports: [SubCategoryListComponent, SubCategoryFormComponent],
    declarations: [SubCategoryListComponent, SubCategoryFormComponent, ModalEditSubCategoryComponent],
    entryComponents: [SubCategoryFormComponent, ModalEditSubCategoryComponent]
})
export class SubCategoryModule {}
