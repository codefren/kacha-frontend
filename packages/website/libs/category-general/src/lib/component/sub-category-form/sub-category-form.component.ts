import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubCategoryInterface } from '../../../../../backend/src/lib/types/sub-category.type';
import { CategoryInterface } from '../../../../../backend/src/lib/types/category.type';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryMessages } from '../../../../../shared/src/lib/messages/category/category.message';

@Component({
  selector: 'easyroute-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.scss']
})
export class SubCategoryFormComponent implements OnInit {

  data: any;
  titleTranslate: string;
  subCategoryForm: FormGroup;
  subCategory: SubCategoryInterface;
  category: CategoryInterface[];
  sub_category_messages: any;
  loadingCategory: string = 'success';

  constructor(
    private fb: FormBuilder,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.validaciones(this.data.subCategory);
  }
  validaciones( subCategory : SubCategoryInterface ) {

    this.subCategoryForm = this.fb.group({
      categoryId:[subCategory.categoryId,[Validators.required]],
      code:[subCategory.code, [Validators.maxLength(30)]],
      name:[subCategory.name,[Validators.required]],
      isActive:[subCategory.isActive, [Validators.required]],
    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();

    this.getcategory();

  }

  closeDialog(value: any) {
    this.activeModal.close(value);
  }
  
  isFormInvalid(): boolean {
    return !this.subCategoryForm.valid;
  }

  getcategory() {
    this.loadingCategory = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getCategorys().subscribe(
            (data: any) => {
                this.category = data.data;

                this.loadingCategory = 'success';
            },
            (error) => {
                this.loadingCategory = 'error';

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }
  
  changeActive() {

    if ( this.data.subCategory.isActive == true ) {
  
      this.data.subCategory.isActive = false;
  
      this.subCategoryForm.controls['isActive'].setValue( this.data.subCategory.isActive );
  
    } else if ( this.data.subCategory.isActive == false  ) {
  
      this.data.subCategory.isActive = true;
  
      this.subCategoryForm.controls['isActive'].setValue( this.data.subCategory.isActive );
  
    }
  
  }

  createUpdateSubCategory(){
    
    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
          this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.data.subCategory.id && this.data.subCategory.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.updateSubCategory(this.data.subCategory.id, this.subCategoryForm.value).subscribe( (data: any) => {
          
          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this.closeDialog([true, { ok: true }]);

        }, ( error )=>{
           
          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
          return;

        });

      } else {
        
        this.loading.showLoading();

        this.stateEasyrouteService.registerSubCategory(this.subCategoryForm.value).subscribe( (data: any) => {
          
            this.loading.hideLoading();
  
            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
              this.translate.instant('GENERAL.ACCEPT')
            );
  
            this.closeDialog([true, { ok: true }]);
          
        }, (error)=>{
        
          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
          return;
    
        }); 
      }
    }

  }

}
