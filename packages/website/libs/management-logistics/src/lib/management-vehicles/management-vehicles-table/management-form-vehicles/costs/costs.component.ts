import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ConfirmModalComponent, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehiclesMessages } from '../../../../../../../shared/src/lib/messages/vehicles/vehicles.message';
@Component({
  selector: 'easyroute-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss']
})
export class CostsComponent implements OnInit, OnChanges {

  @Input('data') data: any;
  @Output('vehiclesOut')
  vehiclesOut: EventEmitter<any> = new EventEmitter();


  typeAcquisition = [];
  formAcquisition: FormGroup;

  showProvidersType: boolean = true;
  showProviders: boolean = true;
  showConcept: boolean = true;

  vehicleInsuranceForm: FormGroup;
  providerTypeList: any = []; // Listado tipos de proveedores
  providerList: any[][] = []; //Listado de proveedores
  conceptList: any[][] = []; //Listado concepto de proveedores
  vehicleInsuranceList: any = []; //Listado de los que lleva cargado el vehicle
  otherMonthlyExpensesUser: any = []; //Listado de los que lleva cargado el usuario
  providerTypeListExpense: any = []; // Listado tipos de proveedores para otros gatos
  vehicles_messages: any;

  companyPreferenceCoste: any = {
    allowApplyAnnualCost: false,
    divideCostIntoTwelveMonths:false,
    lowerCostOnceYear: false,

  };

  constructor(private backendService: BackendService,
    private toastService: ToastService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private modal: NgbModal,
  ) { }

  ngOnInit() { 
 
  }

  ngOnChanges() {
   
    console.log(this.data, 'data input')
   
    this.loadAcquisition();
    this.getProvidersTypeList();
    this.getProvidersTypeListExpense();
    this.validation();
    
  }

  loadAcquisition() {
    this.backendService.get('type_acquisition').pipe(take(1)).subscribe(({ data }) => {
      this.typeAcquisition = data;
      this.changeDetector.detectChanges();
    })
  }

  validation() {

    this.formAcquisition = new FormGroup({
      'acquisitionDateCost': new FormControl(this.data ? this.data.acquisitionDateCost : ''),
      'typeAcquisitionId': new FormControl(this.data ? this.data.typeAcquisitionId : ''),
      'acquisitionShare': new FormControl(this.data ? this.data.acquisitionShare : '', [Validators.max(999999)]),
      'endDate': new FormControl(this.data ? this.data.endDate : ''),
      'costToPassOn': new FormControl(this.data ? this.data.costToPassOn : '', [Validators.max(999999)]),
      'approximateCostKm': new FormControl(this.data ? this.data.approximateCostKm : ''),
      'actualCostKm': new FormControl({value: this.data ? this.data.actualCostKm : '', disabled: true})
    });


    let vehicles_messages = new VehiclesMessages();
    this.vehicles_messages = vehicles_messages.getVehiclesMessages();

    this.vehicleInsuranceForm = this.fb.group({
      conceptVehicleInsurance: new FormArray([]),
      conceptOtherMonthlyExpenses:new FormArray([])
    });

    this.loadVehicleInsurancelist();

    this.loadOtherMonthlyExpensesUserlist();

    this.loadPreferencesCost();

  }

  updateVehicle() {

    this.data = {
      id: this.data.id,
      userId: this.data.userId,
      acquisitionDateCost: this.formAcquisition.value.acquisitionDateCost,
      typeAcquisitionId: this.formAcquisition.value.typeAcquisitionId,
      acquisitionShare: this.formAcquisition.value.acquisitionShare,
      endDate: this.formAcquisition.value.endDate,
      costToPassOn: this.formAcquisition.value.costToPassOn,
      approximateCostKm: this.formAcquisition.value.approximateCostKm,
    }

    this.backendService.put('vehicle/' + this.data.id, this.data).pipe(take(1)).subscribe((data) => {


      this.vehiclesOut.emit(data.data)

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translate.instant('GENERAL.ACCEPT')
      );
    }, error => {
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    })
  }


  /* Seguros de vehículo */

  loadVehicleInsurancelist() {
    this.backendService.get('vehicle_insurance_cost_list/' + this.data.id).pipe(take(1)).subscribe(({ data }) => {
      this.vehicleInsuranceList = data;

      if (data && data.length > 0) {
        data.forEach((element, index) => {
          const concept = new FormGroup({
            id: new FormControl(element.id),
            vehicleId: new FormControl(this.data.id),
            providerTypeId: new FormControl(element.providerTypeId),
            providerId: new FormControl({ value: element.providerId, disabled: true }),
            providerTypeConceptId: new FormControl({ value: element.providerTypeConceptId, disabled: true }),
            price: new FormControl({ value: element.price, disabled: true }),
          });

          this.getSelectProvider(element.providerTypeId, index);
          this.getSelectConcept(element.providerId, index);
          
          this.conceptVehicleInsurance.push(concept);
          this.conceptVehicleInsurance.controls[index].get('price').enable();
          this.conceptVehicleInsurance.controls[index].get('price').updateValueAndValidity();

          this.changeDetector.detectChanges();
        })
      }
      this.changeDetector.detectChanges();
    })
  }

  getProvidersTypeList() {

    this.showProvidersType = false;

    this.backendService.get('provider_type_for_vehicle').pipe(take(1)).subscribe((data) => {

      this.providerTypeList = data.data;

      this.showProvidersType = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showProvidersType = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeSelectProviderType(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0) {

      if (data.value.providerTypeId > 0) {

        this.getSelectProvider(data.value.providerTypeId, index);

      }

    }

  }

  getSelectProvider(providerTypeId: number, index: any) {

    this.showProviders = false;

    this.backendService.post('providers_by_type', { providerTypeId: providerTypeId }).pipe(take(1)).subscribe((data) => {

      this.providerList[providerTypeId] = data.data;

      this.conceptVehicleInsurance.controls[index].get('providerId').enable();
      this.conceptVehicleInsurance.controls[index].get('providerId').updateValueAndValidity();

      this.showProviders = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showProviders = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectProvider(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0) {

      if (data.value.providerId > 0) {

        this.getSelectConcept(data.value.providerId, index);

      }

    }
  }

  getSelectConcept(providerId: number, index: any) {

    this.showConcept = false;

    this.backendService.post('provider_type_concept_by_provider', { providerId: providerId }).pipe(take(1)).subscribe((data) => {

      this.conceptList[providerId] = data.data;

      this.conceptVehicleInsurance.controls[index].get('providerTypeConceptId').enable();
      this.conceptVehicleInsurance.controls[index].get('providerTypeConceptId').updateValueAndValidity();

      this.showConcept = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showConcept = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectConcept(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0) {

      if (data.value.providerTypeConceptId > 0) {

        let price = this.conceptList[data.value.providerId].find((x: any) => x.id === Number(data.value.providerTypeConceptId)).price;

        this.conceptVehicleInsurance.controls[index].get('price').enable();
        this.conceptVehicleInsurance.controls[index].get('price').setValue(price);
        this.conceptVehicleInsurance.controls[index].get('price').updateValueAndValidity();

        if (data.value.id > 0) {

          this.editVehicleInsurancelist(data.value, index);

        } else {

          this.addVehicleInsurancelist(data.value, index);

        }

      }

    }

  }

  deleteVehicleInsurancelist(data: any, index: number = null) {

    if (data.value.id > 0) {
      const modal = this.modal.open(ConfirmModalComponent, {
        size: 'xs',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
      });

      modal.componentInstance.message = "¿Está seguro de eliminar?";
      modal.componentInstance.cssParrafo = true;

      modal.result.then((resp) => {
        if (resp) {
          this.backendService.delete('vehicle_insurance_cost/' + data.value.id).pipe(take(1)).subscribe((data) => {
            this.conceptVehicleInsurance.controls.splice(index, 1);
            this.changeDetector.detectChanges();
          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          })
        }
      });

    } else {

      this.conceptVehicleInsurance.controls.splice(index, 1);

      this.changeDetector.detectChanges();

    }

  }

  addConceptVehicleInsurancelist() {

    const concept = new FormGroup({
      id: new FormControl(0),
      vehicleId: new FormControl(this.data.id),
      providerTypeId: new FormControl(''),
      providerId: new FormControl({ value: '', disabled: true }),
      providerTypeConceptId: new FormControl({ value: '', disabled: true }),
      price: new FormControl({ value: 0, disabled: true }),
    });

    this.conceptVehicleInsurance.push(concept);

    this.changeDetector.detectChanges();

  }

  get conceptVehicleInsurance() {

    if (this.vehicleInsuranceForm)
      return this.vehicleInsuranceForm.get('conceptVehicleInsurance') as FormArray;

  }

  changeImporteProvider(value: any, data: any, index: any) {

    if (this.data.id > 0) {

      if (data.value.id > 0) {

        this.editVehicleInsurancelist(data.value, index);

      } else {

        this.addVehicleInsurancelist(data.value, index);

      }

    }

  }

  editVehicleInsurancelist(data: any, index: any) {

    const value = this.conceptVehicleInsurance.controls[index].value;
    this.backendService.put('vehicle_insurance_cost/' + value.id, value).pipe(take(1)).subscribe((data) => {
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );
    }, error => {
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  addVehicleInsurancelist(data: any, index: any) {

    const value = this.conceptVehicleInsurance.controls[index].value;
    this.backendService.post('vehicle_insurance_cost', value).pipe(take(1)).subscribe(({ data }) => {
      this.conceptVehicleInsurance.controls[index].get('id').setValue(data.id)
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.REGISTRATION'),
        this.translate.instant('GENERAL.ACCEPT')
      );
    }, error => {
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  redirect() {
    this.router.navigate([`/providers`]);
  }

  /* otros gatos adicionales */

  loadPreferencesCost() {

    this.backendService.get('company_preference_cost').pipe(take(1)).subscribe(({ data }) => {

      this.companyPreferenceCoste = data;

      console.log( this.companyPreferenceCoste, ' this.companyPreferenceCoste');

      this.changeDetector.detectChanges();

    }, (error) => {
      
      this.toastService.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });

  }



  getProvidersTypeListExpense() {

    this.showProvidersType = false;

    this.backendService.get('provider_type_other_expenses_vehicle').pipe(take(1)).subscribe((data) => {

      this.providerTypeListExpense = data.data;

      this.showProvidersType = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showProvidersType = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  loadOtherMonthlyExpensesUserlist() {

    this.backendService.get('other_monthly_expenses_vehicle_list/' + this.data.id).pipe(take(1)).subscribe(({ data }) => {

      this.otherMonthlyExpensesUser = data;

      if (data && data.length > 0) {

        data.forEach((element, index) => {

          const concept = new FormGroup({

            id: new FormControl(element.id),

            vehicleId: new FormControl(this.data.id),

            providerTypeId: new FormControl(element.providerTypeId),

            providerId: new FormControl({ value: element.providerId, disabled: true }),

            providerTypeConceptId: new FormControl({ value: element.providerTypeConceptId, disabled: true }),

            price: new FormControl({ value: element.price, disabled: true }),

            new: new FormControl(false),

            paymentType: new FormControl(element.paymentType),

          });

          this.getSelectProviderExpense(element.providerTypeId, index);

          this.getSelectConceptExpense(element.providerId, index);

          this.conceptOtherMonthlyExpenses.push(concept);

          this.conceptOtherMonthlyExpenses.controls[index].get('price').enable();

          this.conceptOtherMonthlyExpenses.controls[index].get('price').updateValueAndValidity();

          this.changeDetector.detectChanges();

        })
      }
      this.changeDetector.detectChanges();
    })
  }

  addConceptOtherMonthlyExpenses() {

    const concept = new FormGroup({

      id: new FormControl(0),

      vehicleId: new FormControl(this.data.id),

      providerTypeId: new FormControl(''),

      providerId: new FormControl({ value: '', disabled: true }),

      providerTypeConceptId: new FormControl({ value: '', disabled: true }),

      price: new FormControl({ value: 0, disabled: true }),

      paymentType:new FormControl('1'),

    });

    this.conceptOtherMonthlyExpenses.push(concept);

    this.changeDetector.detectChanges();

  }

  get conceptOtherMonthlyExpenses() {

    if (this.vehicleInsuranceForm)
      return this.vehicleInsuranceForm.get('conceptOtherMonthlyExpenses') as FormArray;

  }

  editOtherMonthlyExpenses(data: any, index: any) {

    const value = this.conceptOtherMonthlyExpenses.controls[index].value;

    this.backendService.put('other_monthly_expenses_vehicle/' + value.id, value).pipe(take(1)).subscribe((data) => {

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  addOtherMonthlyExpenses(data: any, index: any) {

    const value = this.conceptOtherMonthlyExpenses.controls[index].value;

    this.backendService.post('other_monthly_expenses_vehicle', value).pipe(take(1)).subscribe(({ data }) => {

      this.conceptOtherMonthlyExpenses.controls[index].get('id').setValue(data.id)

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('CONFIGURATIONS.REGISTRATION'),

        this.translate.instant('GENERAL.ACCEPT')

      );

    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
    
  }


  changeSelectProviderTypeExpense(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0) {

      if (data.value.providerTypeId > 0) {

        this.getSelectProviderExpense(data.value.providerTypeId, index);

      }

    }

  }

  getSelectProviderExpense(providerTypeId: number, index: any) {

    this.showProviders = false;
    
    let sentData = {

      providerTypeId: providerTypeId,
  
      providerAssigmentTypeId : 1
  
    }

    this.backendService.post('providers_by_type', sentData).pipe(take(1)).subscribe((data) => {

      this.providerList[providerTypeId] = data.data;

      this.conceptOtherMonthlyExpenses.controls[index].get('providerId').enable();
      this.conceptOtherMonthlyExpenses.controls[index].get('providerId').updateValueAndValidity();

      this.showProviders = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showProviders = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectProviderExpense(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0) {

      if (data.value.providerId > 0) {

        this.getSelectConceptExpense(data.value.providerId, index);

      }

    }
  }

  getSelectConceptExpense(providerId: number, index: any) {

    this.showConcept = false;

    this.backendService.post('provider_type_concept_by_provider', { providerId: providerId }).pipe(take(1)).subscribe((data) => {

      this.conceptList[providerId] = data.data;

      this.conceptOtherMonthlyExpenses.controls[index].get('providerTypeConceptId').enable();
      this.conceptOtherMonthlyExpenses.controls[index].get('providerTypeConceptId').updateValueAndValidity();

      this.showConcept = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showConcept = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectConceptExpense(value: any, data: any, index: any, target: any) {

    if (this.data.id > 0 && value) {

      if (data.value.providerTypeConceptId > 0) {

        let price = this.conceptList[data.value.providerId].find((x: any) => x.id === Number(data.value.providerTypeConceptId)).price;

        this.conceptOtherMonthlyExpenses.controls[index].get('price').enable();
        this.conceptOtherMonthlyExpenses.controls[index].get('price').setValue(price);
        this.conceptOtherMonthlyExpenses.controls[index].get('price').updateValueAndValidity();

        if (data.value.id > 0) {

          this.editOtherMonthlyExpenses(data.value, index);

        } else {

          this.addOtherMonthlyExpenses(data.value, index);

        }

      }

    }

  }

  deleteOtherMonthlyExpense(data: any, index: number = null) {

    if (data.value.id > 0) {
      const modal = this.modal.open(ConfirmModalComponent, {
        size: 'xs',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
      });

      modal.componentInstance.message = "¿Está seguro de eliminar?";

      modal.result.then((resp) => {
        if (resp) {
          this.backendService.delete('other_monthly_expenses_vehicle/' + data.value.id).pipe(take(1)).subscribe((data) => {
            this.conceptOtherMonthlyExpenses.controls.splice(index, 1);
            this.changeDetector.detectChanges();
          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          })
        }
      });


    } else {

      this.conceptOtherMonthlyExpenses.controls.splice(index, 1);

      //  this.loadAll()

      this.changeDetector.detectChanges();

    }

  }
  /* end otros gatos adicionales */

  redirectProviders(){
    this.router.navigate([`/providers`]);
  }

  changeImporteProviderExpense(value: any, data: any, index: any) {

    if (this.data.id > 0) {

      if (data.value.id > 0) {

        this.editOtherMonthlyExpenses(data.value, index);

      } else {

        this.addOtherMonthlyExpenses(data.value, index);

      }

    }

  }

}
