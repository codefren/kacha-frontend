import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsFormComponent } from './component/products-form/products-form.component';
import { ProductsListComponent } from './component/products-list/products-list.component';
import { ProductsModalAddCategoryComponent } from './component/products-form/products-modal-add-category/products-modal-add-category.component';
import { ProductsModalConfirmComponent } from './component/products-form/products-modal-confirm/products-modal-confirm.component';
import { ProductsModalMeasureComponent } from './component/products-form/products-modal-measure/products-modal-measure.component';
import { ProductsModalProductPriceConfirmComponent } from './component/products-form/products-modal-product-price-confirm/products-modal-product-price-confirm.component';
import { ProductsModalActiveComponent } from './component/products-list/products-modal-active/products-modal-active.component';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { AsignProductsFranchiseComponent } from './component/asign-products-franchise/asign-products-franchise.component';
import { ModalFiltersComponent } from './component/products-list/modal-filters/modal-filters.component';
import { SharedModule } from '@optimroute/shared';
import { PromotionsListComponent } from './component/promotions-list/promotions-list.component';
import { PromotionsFormComponent } from './component/promotions-form/promotions-form.component';
import { FilterStateModule } from '@easyroute/filter-state';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        StateProfileSettingsModule,
        SharedModule,
        FilterStateModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProductsListComponent
            },
            {
                path: 'products-user',
                component: ProductsFormComponent
            },
            {
                path: 'promotions',
                component: PromotionsListComponent
            },
            {
                path: 'promotions/:promotions_id',
                component: PromotionsFormComponent
            },
            {
                path: ':products_id',
                component: ProductsFormComponent
            },
            {
                path: ':products_id/categoryId/:id',
                
                component: ProductsFormComponent
            },
        ]),
        TranslateModule.forChild()
    ],
    declarations: [
        ProductsFormComponent, 
        ProductsListComponent, 
        ProductsModalAddCategoryComponent, 
        ProductsModalConfirmComponent, 
        ProductsModalMeasureComponent, 
        ProductsModalProductPriceConfirmComponent, 
        ProductsModalActiveComponent, 
        AsignProductsFranchiseComponent, 
        ModalFiltersComponent,
        PromotionsListComponent,
        PromotionsFormComponent,
    ],
    entryComponents: [
        ProductsListComponent, 
        ProductsFormComponent, 
        ProductsModalActiveComponent, 
        ProductsModalConfirmComponent, 
        ProductsModalMeasureComponent, 
        ProductsModalProductPriceConfirmComponent, 
        ProductsModalAddCategoryComponent, 
        AsignProductsFranchiseComponent, 
        ModalFiltersComponent,
        PromotionsListComponent,
        PromotionsFormComponent,
    ],
    providers:[DatePipe]
})
export class ProductsModule {}
