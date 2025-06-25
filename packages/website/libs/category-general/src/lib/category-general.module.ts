import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoryGeneralFormComponent } from './component/category-general-form/category-general-form.component';
import { CategoryGeneralListComponent } from './component/category-general-list/category-general-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryGeneralModalActiveComponent } from './component/category-general-list/category-general-modal-active/category-general-modal-active.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubCategoryFormComponent } from './component/sub-category-form/sub-category-form.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: CategoryGeneralListComponent,
            },
            {
                path: ':category_general_id',
                component: CategoryGeneralFormComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        CategoryGeneralListComponent,
        CategoryGeneralFormComponent,
        CategoryGeneralModalActiveComponent,
        SubCategoryFormComponent,
    ],
    entryComponents: [
        CategoryGeneralListComponent,
        CategoryGeneralFormComponent,
        CategoryGeneralModalActiveComponent,
        SubCategoryFormComponent
    ],
    providers: [DatePipe],
})
export class CategoryGeneralModule {}
