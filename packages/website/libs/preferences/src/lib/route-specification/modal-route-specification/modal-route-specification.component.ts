import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { DeliverySpecificationType, VehiclesServiceType } from '@optimroute/backend';
import { CategoryMessages, LoadingService, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

declare function init_plugins();
declare var $: any;

@Component({
  selector: 'easyroute-modal-route-specification',
  templateUrl: './modal-route-specification.component.html',
  styleUrls: ['./modal-route-specification.component.scss']
})
export class ModalRouteSpecificationComponent implements OnInit {
  
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
    public activeModal: NgbActiveModal,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

 
  ngOnInit() {

    this.load();

  }

  load() {

    if (this.data && this.data.id >0) {

      this.deliveryZoneSpecificationType = this.data;

      this.validaciones(this.deliveryZoneSpecificationType);

    } else {

      this.deliveryZoneSpecificationType = new VehiclesServiceType();

      this.validaciones(this.deliveryZoneSpecificationType);

    }

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
          
          this.activeModal.close(true);

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

          this.activeModal.close(true);

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

  close(){
    this.activeModal.close(false);

  }

}
