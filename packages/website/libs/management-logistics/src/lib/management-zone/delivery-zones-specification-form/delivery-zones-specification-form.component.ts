import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehiclesServiceType } from '../../../../../backend/src/lib/types/vehicles-service-type';
import { Router, ActivatedRoute } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { CategoryMessages } from '../../../../../shared/src/lib/messages/category/category.message';
import { DeliverySpecificationType } from '@optimroute/backend';
declare var $: any;
declare function init_plugins();
@Component({
  selector: 'easyroute-delivery-zones-specification-form',
  templateUrl: './delivery-zones-specification-form.component.html',
  styleUrls: ['./delivery-zones-specification-form.component.scss']
})
export class DeliveryZonesSpecificationFormComponent implements OnInit {


  data: any;

  titleTranslate: string;

  deliveryZoneSpecificationTypeForm: FormGroup;

  deliveryZoneSpecificationType: DeliverySpecificationType;


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


        this.stateEasyrouteService.getDeliveryZoneSpecificationType(params['id']).subscribe(
          (data: any) => {

            this.loading.hideLoading();

            this.deliveryZoneSpecificationType = data.data;

            this.validaciones(this.deliveryZoneSpecificationType);

          },
          (error) => {
            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
        );



      } else {

        this.loading.hideLoading();

        this.deliveryZoneSpecificationType = new VehiclesServiceType();

        this.validaciones(this.deliveryZoneSpecificationType);
      }

    });
  }

  validaciones(vehiclesServiceTypes: DeliverySpecificationType) {

    this.deliveryZoneSpecificationTypeForm = this.fb.group({
      name: [vehiclesServiceTypes.name, [Validators.required]],
      code: [vehiclesServiceTypes.code, [Validators.maxLength(30)]],
      isActive: [vehiclesServiceTypes.isActive, [Validators.required]],
    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();


  }



  isFormInvalid(): boolean {
    return !this.deliveryZoneSpecificationTypeForm.valid;
  }



  changeActive() {

    if (this.deliveryZoneSpecificationType.isActive == true) {

      this.deliveryZoneSpecificationType.isActive = false;

      this.deliveryZoneSpecificationTypeForm.controls['isActive'].setValue(this.deliveryZoneSpecificationType.isActive);

    } else if (this.deliveryZoneSpecificationType.isActive == false) {

      this.deliveryZoneSpecificationType.isActive = true;

      this.deliveryZoneSpecificationTypeForm.controls['isActive'].setValue(this.deliveryZoneSpecificationType.isActive);

    }

  }

  createVehiclesServiceType() {

    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
        this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.deliveryZoneSpecificationType.id && this.deliveryZoneSpecificationType.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.UpdateDeliveryZoneSpecificationType(this.deliveryZoneSpecificationType.id, this.deliveryZoneSpecificationTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this._router.navigate(['management-logistics/delivery-zones/specification']);

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

        this.stateEasyrouteService.createDeliveryZoneSpecificationType(this.deliveryZoneSpecificationTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this._router.navigate(['/management-logistics/delivery-zones/specification']);
          

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
        .getDeliveryZoneSpecificationTypeAutoCompleteCode()
        .subscribe(
            (data: any) => {
               this.deliveryZoneSpecificationTypeForm
               .get('code')
               .setValue(data.code);
               this.deliveryZoneSpecificationTypeForm.get('code').updateValueAndValidity();

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
