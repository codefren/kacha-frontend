import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { VehiclesServiceType } from '../../../../../../../../backend/src/lib/types/vehicles-service-type';
import { StateEasyrouteService } from '../../../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../../../../shared/src/lib/services/loading.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../../../auth-local/src/lib/auth-local.service';
import { CategoryMessages } from '../../../../../../../../shared/src/lib/messages/category/category.message';
import { StateUsersService } from '../../../../../../../../state-users/src/lib/state-users.service';
import { sliceMediaString } from 'libs/shared/src/lib/util-functions/string-format';
import { take } from 'rxjs/operators';
import { BackendService } from '../../../../../../../../backend/src/lib/backend.service';
declare var $: any;
@Component({
  selector: 'easyroute-modal-add-vehicle-type',
  templateUrl: './modal-add-vehicle-type.component.html',
  styleUrls: ['./modal-add-vehicle-type.component.scss']
})
export class ModalAddVehicleTypeComponent implements OnInit {

  data: any;

  titleTranslate: string;

  vehicleTypeForm: FormGroup;

  vehiclesServiceType: VehiclesServiceType;


  sub_category_messages: any;

  loadingCategory: string = 'success';


  licenseList: any [] = [];


  showServiceType: boolean = true;

  constructor(
    private fb: FormBuilder,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private authLocal: AuthLocalService,
    private service: StateUsersService,
    private backendService: BackendService,
    public activeModal: NgbActiveModal,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
    
  }

  load() {
    

      if (this.data && this.data.id >0) {

        this.getCompanyVehicle(this.data);


      } else {

        this.loading.hideLoading();

        this.vehiclesServiceType = new VehiclesServiceType();

        this.validaciones(this.vehiclesServiceType);
      }

    
  }

  getCompanyVehicle(data:any) {

    this.showServiceType = false;

    this.stateEasyrouteService.getVehiclesCompanyVehicleTypeService(data.id).pipe(take(1)).subscribe(({ data }) => {

        this.vehiclesServiceType = data;

        this.validaciones(this.vehiclesServiceType);

    });
}



  validaciones(vehiclesServiceTypes: VehiclesServiceType) {

    this.vehicleTypeForm = this.fb.group({

      name: [vehiclesServiceTypes.name, [Validators.required]],

      licenses: this.fb.array([]),

    });

    let sub_category_messages = new CategoryMessages();

    this.sub_category_messages = sub_category_messages.getCategoryMessages();

    this.getServiceTypeVehicle();



  }

  getServiceTypeVehicle() {

    this.showServiceType = false;

    this.service.loadVehiclesLicenseServiceType().pipe(take(1)).subscribe(({ data }) => {

        this.showServiceType = true;

        this.licenseList = data;


        this.addFilter();
    });
  }

   /* funcion de agregar filtros */

   addFilter() {
  
      this.licenseList.map((o, i) => {
  
          let control: FormControl;
  
          if ( this.vehiclesServiceType && this.vehiclesServiceType.licenses.length > 0) {
            
  
              control = new FormControl(
  
                this.vehiclesServiceType.licenses.find((x) => x.id === o.id) !=
  
                      undefined,
              );
  
          } else {
  
              control = new FormControl(false);
  
          }
  
          (this.vehicleTypeForm.controls.licenses as FormArray).push(
              control,
          );
         
      });
  }

  //para obener los campos y mandar a crear o actualizar

  getFilterVAlue() {
  
    let selectedFilterIds: any;
  
    if (this.licenseList && this.licenseList.length > 0) {
  
        selectedFilterIds = this.vehicleTypeForm.value.licenses
  
            .map((v, i) => (v ? this.licenseList[i].id : null))
  
            .filter((v) => v !== null);
    }
  
    return selectedFilterIds;
  }


  sliceString(text: string) {
  
    return sliceMediaString(text, 24, '(min-width: 960px)');
  
  }
  
  isFormInvalid(): boolean {
    return !this.vehicleTypeForm.valid;
  }



  createVehiclesServiceType() {

    const formValues = this.vehicleTypeForm.value;

    formValues.licenses = this.getFilterVAlue();


    if (this.isFormInvalid()) {

      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),

        this.translate.instant('GENERAL.ACCEPT');

    } else {

      if (this.vehiclesServiceType.id && this.vehiclesServiceType.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.updateVehiclesCompanyVehicleTypeServiceType(this.vehiclesServiceType.id, this.vehicleTypeForm.value).pipe(take(1)).subscribe((data: any) => {

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

        this.stateEasyrouteService.createVehiclesCompanyVehicleTypeServiceType(this.vehicleTypeForm.value).pipe(take(1)).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          //this._router.navigate(['management-logistics/vehicles/servies-type']);
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

  deleteService(send:any){

    this.backendService.delete('company_vehicle_type/'+ send.id).pipe(take(1)).subscribe((data)=>{

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
