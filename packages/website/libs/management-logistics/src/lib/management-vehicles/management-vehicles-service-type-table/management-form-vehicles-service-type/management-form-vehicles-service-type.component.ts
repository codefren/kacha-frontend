import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { CategoryMessages } from '../../../../../../shared/src/lib/messages/category/category.message';
import { SubCategoryInterface } from '../../../../../../backend/src/lib/types/sub-category.type';
import { CategoryInterface } from '../../../../../../backend/src/lib/types/category.type';
import { VehiclesServiceType } from '../../../../../../backend/src/lib/types/vehicles-service-type';
declare var $: any;
declare function init_plugins();

@Component({
  selector: 'easyroute-management-form-vehicles-service-type',
  templateUrl: './management-form-vehicles-service-type.component.html',
  styleUrls: ['./management-form-vehicles-service-type.component.scss']
})
export class ManagementFormVehiclesServiceTypeComponent implements OnInit {

  data: any;

  titleTranslate: string;

  vehicleServiceTypeForm: FormGroup;

  vehiclesServiceType: VehiclesServiceType;


  sub_category_messages: any;

  loadingCategory: string = 'success';



  showCode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private authLocal: AuthLocalService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this._activatedRoute.params.subscribe(params => {

      this.loading.showLoading();

      if (params['id'] !== 'new') {


        this.stateEasyrouteService.getVehiclesServiceType(params['id']).subscribe(
          (data: any) => {

            this.loading.hideLoading();

            this.vehiclesServiceType = data.data;

            this.validaciones(this.vehiclesServiceType);

          },
          (error) => {
            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
        );



      } else {

        this.loading.hideLoading();

        this.vehiclesServiceType = new VehiclesServiceType();

        this.validaciones(this.vehiclesServiceType);
      }

    });
  }

  validaciones(vehiclesServiceTypes: VehiclesServiceType) {

    this.vehicleServiceTypeForm = this.fb.group({
      name: [vehiclesServiceTypes.name, [Validators.required]],
      code: [vehiclesServiceTypes.code, [Validators.maxLength(30)]],
      isActive: [vehiclesServiceTypes.isActive, [Validators.required]],
    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();


  }



  isFormInvalid(): boolean {
    return !this.vehicleServiceTypeForm.valid;
  }



  changeActive() {

    if (this.vehiclesServiceType.isActive == true) {

      this.vehiclesServiceType.isActive = false;

      this.vehicleServiceTypeForm.controls['isActive'].setValue(this.vehiclesServiceType.isActive);

    } else if (this.vehiclesServiceType.isActive == false) {

      this.vehiclesServiceType.isActive = true;

      this.vehicleServiceTypeForm.controls['isActive'].setValue(this.vehiclesServiceType.isActive);

    }

  }

  createVehiclesServiceType() {

    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
        this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.vehiclesServiceType.id && this.vehiclesServiceType.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.UpdateVehiclesServiceType(this.vehiclesServiceType.id, this.vehicleServiceTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this._router.navigate(['management-logistics/vehicles/servies-type']);

        }, (error) => {

          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;

        });

      } else {

        this.loading.showLoading();

        this.stateEasyrouteService.createVehiclesServiceType(this.vehicleServiceTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this._router.navigate(['management-logistics/vehicles/servies-type']);
          

        }, (error) => {

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

  searchIncidentCode(){
    
    this.showCode = false;

    $("#tooltip").tooltip('hide');


    setTimeout(() => {
        this.stateEasyrouteService
        .getVehiclesServiceTypeAutoCompleteCode()
        .subscribe(
            (data: any) => {
               this.vehicleServiceTypeForm
               .get('code')
               .setValue(data.code);
               this.vehicleServiceTypeForm.get('code').updateValueAndValidity();

               this.showCode = true;

               this.changeDetectorRef.detectChanges();

               this.setTimeoutFuntion();
            },
            (error) => {
                this.showCode = true;
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 500);

}

setTimeoutFuntion() {
  setTimeout(() => {
      init_plugins();
  }, 500);
}




}
