import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CategoryInterface } from 'libs/backend/src/lib/types/category.type';
import { SubCategoryFilter } from 'libs/backend/src/lib/types/sub-category-filter.type';
import { SubCategoryInterface } from 'libs/backend/src/lib/types/sub-category.type';
import { CategoryMessages } from 'libs/shared/src/lib/messages/category/category.message';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-add-filters-settings',
  templateUrl: './modal-add-filters-settings.component.html',
  styleUrls: ['./modal-add-filters-settings.component.scss']
})
export class ModalAddFiltersSettingsComponent implements OnInit {
  
  data: any;

  titleTranslate: string;

  filterForm: FormGroup;

  filter: SubCategoryFilter;

  category: CategoryInterface[];

  subCategory: SubCategoryInterface[];

  sub_category_messages: any;

  resource = '';

  loadingCategory: string = 'success';

  loadingSubcategory: string = 'success';

  title: '';

  id: any;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetect: ChangeDetectorRef,
    private loading: LoadingService,
    public dialogRef: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.getcategory();
    this.load();
  }
  load(){
    
      if ( this.id !== 'new' ) {

        this.loading.showLoading();

        this.stateEasyrouteService.getFilter(this.id).subscribe(
            (data: any) => {
                this.filter = data.data;
                
                this.validaciones(this.filter);
             
                this.loading.hideLoading();
            },
            (error) => {
                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
      }  else {

        this.filter = new SubCategoryFilter();

        this.validaciones(this.filter);
      }
      
    
  }

  validaciones( filter : SubCategoryFilter ) {

    this.filterForm = this.fb.group({
      categoryId:[filter.categoryId ? filter.categoryId :'',[Validators.required]],
      subCategoryId:[filter.subCategoryId,[Validators.required]],
      code:[filter.code, [Validators.maxLength(30)]],
      name:[filter.name,[Validators.required]],
      isActive:[filter.isActive, [Validators.required]],
    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();

  }

  
  isFormInvalid(): boolean {
    return !this.filterForm.valid;
  }

  getcategory() {
    this.loadingCategory = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getCategorysByCopmpany().subscribe(
            (data: any) => {
              this.category = data.data;

              console.log( this.category, ' this.category');

              let foundSubCategories = data.data.find(( sub_category ) => this.filter.categoryId === sub_category.id );
              
              if ( foundSubCategories ) {
                this.getSubcategory( foundSubCategories.id.toString() );
              }
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

  getSubcategory( categoryId: string = '', changeEvent = false ) {

    if ( categoryId.length == 0 ) {
      this.subCategory = [];
      return this.changeDetect.detectChanges();
    }

    this.loadingSubcategory = 'loading';

    this.stateEasyrouteService.getSubcategory( parseInt( categoryId ) )
      .pipe(
        map(({ data }) => {
    
          if ( data.length === 0 ) {
            return data;
          }

          return data.map(( subCategory ) => ({ 
            id: subCategory.id,
            categoryId: subCategory.categoryId,
            isActive: subCategory.isActive,
            name: subCategory.name
           }));
        })
      )
    .subscribe( 
      ( resp ) => {

        // vacia el campo si viene el array llega vacio o si el evento change se activa
        if ( resp.length === 0 || changeEvent ) {
          this.filterForm.get('subCategoryId').setValue('');
        }
        
        this.subCategory = resp;        
        this.loadingSubcategory = 'success';       
        this.filterForm.get('subCategoryId').updateValueAndValidity();
        this.changeDetect.detectChanges();
      },
      ( error ) => {
        this.loadingSubcategory = 'error';
        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      } 
    );
  }

  changeActive() {

    if ( this.filter.isActive == true ) {
  
      this.filter.isActive = false;
  
      this.filterForm.controls['isActive'].setValue( this.filter.isActive );
  
    } else if ( this.filter.isActive == false  ) {
  
      this.filter.isActive = true;
  
      this.filterForm.controls['isActive'].setValue( this.filter.isActive );
  
    }
  
  }

  createFilter(){
    
    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
          this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.filter.id && this.filter.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.updateFilterSubCategory(this.filter.id, this.filterForm.value).subscribe( (data: any) => {
          
          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this.dialogRef.close(true);

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

        this.stateEasyrouteService.registerFilterSubCategory(this.filterForm.value).subscribe( (data: any) => {
          
            this.loading.hideLoading();
  
            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
              this.translate.instant('GENERAL.ACCEPT')
            );
  
            this.dialogRef.close(true);
          
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

  close(value: any) {
    this.dialogRef.close(value);
  }

}
