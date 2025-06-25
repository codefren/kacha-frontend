import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubCategoryFilter } from 'libs/backend/src/lib/types/sub-category-filter.type';
import { CategoryMessages } from 'libs/shared/src/lib/messages/category/category.message';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

@Component({
  selector: 'easyroute-modal-edit-sub-category-settings',
  templateUrl: './modal-edit-sub-category-settings.component.html',
  styleUrls: ['./modal-edit-sub-category-settings.component.scss']
})
export class ModalEditSubCategorySettingsComponent implements OnInit {

  data: any;

  filterForm: FormGroup;

  filter: SubCategoryFilter;

  sub_category_messages: any;

  constructor(
    private fb: FormBuilder,
    private loading: LoadingService,
    private stateEasyrouteService: StateEasyrouteService,
    private translate: TranslateService,
    private toastService: ToastService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){
    this.filter = this.data;
    this.validaciones(this.data);

  }

  validaciones( filter : SubCategoryFilter ) {

    this.filterForm = this.fb.group({
      code:[filter.code, [Validators.maxLength(30), Validators.required]],
      name:[filter.name,[Validators.required]],

    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();

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

            this.closeDialog([true, { ok: true }]);
         // this._router.navigate(['category-filter']);

        }, ( error )=>{
           
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

  isFormInvalid(): boolean {
    return !this.filterForm.valid;
  }

  closeDialog(value: any) {
    this.activeModal.close(value);
}

}
