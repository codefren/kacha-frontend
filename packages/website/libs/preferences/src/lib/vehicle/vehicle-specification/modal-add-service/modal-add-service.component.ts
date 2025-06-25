import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, VehiclesServiceType } from '@optimroute/backend';
import { CategoryMessages, LoadingService, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { take } from 'rxjs/operators';

declare var $: any;
declare function init_plugins();


@Component({
  selector: 'easyroute-modal-add-service',
  templateUrl: './modal-add-service.component.html',
  styleUrls: ['./modal-add-service.component.scss']
})
export class ModalAddServiceComponent implements OnInit {

  data: any;

  titleTranslate: string;

  vehicleServiceTypeForm: FormGroup;

  vehiclesServiceType: VehiclesServiceType;


  sub_category_messages: any;

  loadingCategory: string = 'success';



  showCode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private authLocal: AuthLocalService,
    public activeModal: NgbActiveModal,
    private backendService: BackendService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

 
  ngOnInit() {
    this.load();
  }

  load() {
    
      if (this.data && this.data.id >0) {

        this.vehiclesServiceType = this.data;

        this.validaciones(this.vehiclesServiceType);

      } else {

        this.loading.hideLoading();

        this.vehiclesServiceType = new VehiclesServiceType();

        this.validaciones(this.vehiclesServiceType);
      }

    
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
         
          this.activeModal.close(true);
          
        }, (error) => {

          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );

        });

      } else {

        this.loading.showLoading();

        this.stateEasyrouteService.createVehiclesServiceType(this.vehicleServiceTypeForm.value).subscribe((data: any) => {

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
  
  
  deleteService(send:any){
  
    this.backendService.delete('company_vehicle_service_type/'+ send.id).pipe(take(1)).subscribe((data)=>{
  
      this.activeModal.close(true);
  
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
      
  }

  close(){
    this.activeModal.close(false);

  }

}
