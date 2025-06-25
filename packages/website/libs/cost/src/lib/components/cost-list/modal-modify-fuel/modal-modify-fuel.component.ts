import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-modify-fuel',
  templateUrl: './modal-modify-fuel.component.html',
  styleUrls: ['./modal-modify-fuel.component.scss']
})
export class ModalModifyFuelComponent implements OnInit {

  vehicleFuelForm: FormGroup;

  month = [];

  selectMonth: any ='';
  selectYear: any ='';

  showVehicles: boolean = true;

  /* showProvidersType: boolean = true; */
  showProviders: boolean = true;
  showConcept: boolean = true;

  vehicleList: any []=[];   // Listado de vehículos
  providerList: any[][] = []; //Listado de proveedores
  conceptList: any[][] = []; //Listado concepto de proveedores

  
  
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private backendService: BackendService,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    for (let index = 1; index < 13; index++) {

      this.month.push(index);

    };

    this.validation();

  }

  getYear() {
    const year = new Date().getFullYear();
    let min = year - 1;
    let max = year + 3;
    const years = [];
    for (let index = min; index < max; index++) {
      years.push(index);
    }
    return years
  }

  validation() {

    this.vehicleFuelForm = this.fb.group({
      conceptVehicleFuel: new FormArray([]),
    });

    this.getSelectVehicle();

  }

  get conceptVehicleFuel() {

    if (this.vehicleFuelForm)
      return this.vehicleFuelForm.get('conceptVehicleFuel') as FormArray;

  }

  getSelectVehicle() {

    this.showVehicles = false;

    this.backendService.get('vehicle_list_Active').pipe(take(1)).subscribe((data) => {

      this.vehicleList = data.data;

      this.showVehicles = true;

      this.changeDetector.detectChanges();

      this.getSelectProvider();

    }, error => {

      this.showVehicles = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  getSelectProvider() {

    this.showProviders = false;

    this.backendService.post('providers_by_type', { providerTypeId: 1 }).pipe(take(1)).subscribe((data) => {

      this.providerList[1] = data.data;

      this.showProviders = true;

      this.addStructure();

      this.changeDetector.detectChanges();

    }, error => {

      this.showProviders = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  addStructure() {
  
    let send = this.vehicleList.map((data) => ({
      
      vehicleId: data.id,
      registration: data.registration,
      name: data.name,
      provider: this.providerList,
      quantity: 0,
      import: 0,
    }));

    this.addConceptVehicleFuelList(send);

    this.showVehicles = true;
     
    this.changeDetector.detectChanges();
  }

  addConceptVehicleFuelList(data: any) {

    const concept = new FormGroup({
      vehicleId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      registration: new FormControl('', [Validators.required]),

      providerTypeId: new FormControl(1),
      providerId: new FormControl(''),
      providerTypeConceptId: new FormControl({ value: '', disabled: true }),
      quantity: new FormControl ('', [Validators.pattern("^[0-9]*$"), Validators.min(1)]),
      import: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    });

    this.conceptVehicleFuel.push(concept);
  
    /* if (data.length > 0) {

      data.map((o, i) => {
  
          const concept = new FormGroup({
            vehicleId: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).vehicleId),
            name: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).name),
            registration: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).registration),
  
            providerTypeId: new FormControl(1),
            providerId: new FormControl(''),
            providerTypeConceptId: new FormControl({ value: '', disabled: true }),
            quantity: new FormControl ('', [Validators.pattern("^[0-9]*$"), Validators.min(1)]),
            import: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          });
  
          this.conceptVehicleFuel.push(concept);
  
      });
    } */

    this.changeDetector.detectChanges();

  }

  changeSelectProvider(value: any, data: any, index: any, target: any) {

    if (data.value.providerId > 0) {

      this.getSelectConcept(data.value.providerId, index);

    } else {

      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').setValue('');
      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').disable();
      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').updateValueAndValidity();

    }

  }

  getSelectConcept(providerId: number, index: any) {

    this.showConcept = false;

    this.backendService.post('provider_type_concept_by_provider', { providerId: providerId }).pipe(take(1)).subscribe((data) => {

      this.conceptList[providerId] = data.data;
      
      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').setValue('');
      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').enable();
      this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').updateValueAndValidity();

      this.showConcept = true;

      this.changeDetector.detectChanges();

    }, error => {

      this.showConcept = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectConcept(value: any, data: any, index: any, target: any) {

    if (data.value.providerTypeConceptId > 0) {

      let price = this.conceptList[data.value.providerId].find((x: any) => x.id === Number(data.value.providerTypeConceptId)).price;
      
      this.conceptVehicleFuel.controls[index].get('quantity').setValue(1);
      this.conceptVehicleFuel.controls[index].get('quantity').updateValueAndValidity();

      this.conceptVehicleFuel.controls[index].get('import').setValue(price);
      this.conceptVehicleFuel.controls[index].get('import').updateValueAndValidity();

    } 

  }


  deleteVehicleInsurancelist(data: any, index: number = null) {


    if (this.conceptVehicleFuel.controls.length > 1) {

      (<FormArray>this.vehicleFuelForm.controls.conceptVehicleFuel).removeAt(index);

    }
  
   /* old era para limpiar todos los registros */

    /* this.conceptVehicleFuel.controls[index].get('vehicleId').setValue('');
    this.conceptVehicleFuel.controls[index].get('vehicleId').updateValueAndValidity();
    

    this.conceptVehicleFuel.controls[index].get('name').setValue('');
    this.conceptVehicleFuel.controls[index].get('name').updateValueAndValidity();

    this.conceptVehicleFuel.controls[index].get('registration').setValue('');
    this.conceptVehicleFuel.controls[index].get('registration').updateValueAndValidity();

    this.conceptVehicleFuel.controls[index].get('providerId').setValue('');
    this.conceptVehicleFuel.controls[index].get('providerId').updateValueAndValidity();

    this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').setValue('');
    this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').disable();
    this.conceptVehicleFuel.controls[index].get('providerTypeConceptId').updateValueAndValidity();

    this.conceptVehicleFuel.controls[index].get('quantity').setValue('');
    this.conceptVehicleFuel.controls[index].get('quantity').updateValueAndValidity();

    this.conceptVehicleFuel.controls[index].get('import').setValue('');
    this.conceptVehicleFuel.controls[index].get('import').updateValueAndValidity(); */

    this.changeDetector.detectChanges();

   // this.vehicleFuelForm.updateValueAndValidity();


  }


  submit() {

    let sendCostVehicle = this.vehicleFuelForm.value.conceptVehicleFuel.filter( (x: any)=> x.providerId > 0 && x.providerTypeConceptId > 0 
                        && x.quantity > 0 && x.import > 0)

    let sentData = {
      mount: this.selectMonth,
      year: this.selectYear,
      costVehicleArray : sendCostVehicle
    }

    this.backendService.post('cost_vehicle_array_store', sentData).pipe(take(1)).subscribe((data) => {

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.REGISTRATION'),

        this.translate.instant('GENERAL.ACCEPT'),
    );

    this.activeModal.close(true);

    }, error => {

      this.showVehicles = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  validateData(){

    return this.vehicleFuelForm.value.conceptVehicleFuel.find( (x: any)=> x.providerId > 0 && x.providerTypeConceptId > 0 
            && x.quantity > 0 && x.import > 0) ? true : false;

  }

  close() {

    this.activeModal.close(false);

  }

  addFullVehicle(){
   
    const concept = new FormGroup({

      vehicleId: new FormControl('', [Validators.required]),

      name: new FormControl('', [Validators.required]),

      registration: new FormControl('', [Validators.required]),

      providerTypeId: new FormControl(1, [Validators.required]),

      providerId: new FormControl('', [Validators.required]),

      providerTypeConceptId: new FormControl({ value: '', disabled: true }, [Validators.required]),

      quantity: new FormControl ('', [Validators.pattern("^[0-9]*$"), Validators.min(1)]),

      import: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),

    });

    this.conceptVehicleFuel.push(concept);

    this.changeDetector.detectChanges();

    
 
  }

  changeSelectVehicleIdOfName(value: any, data: any, index: any, target: any) {

    console.log({value: value, data: data, index, target: target}, 'console.log llegada de changeSelectVehicleIdOfName');

    let vehicleName = this.vehicleList.find(x => x.id == value);

    if (vehicleName) {

      this.conceptVehicleFuel.controls[index].get('vehicleId').setValue(vehicleName.id);

      this.conceptVehicleFuel.controls[index].get('name').setValue(vehicleName.name);

  
      this.conceptVehicleFuel.controls[index].get('vehicleId').updateValueAndValidity();

      this.conceptVehicleFuel.controls[index].get('name').updateValueAndValidity();

    } else {

      this.conceptVehicleFuel.controls[index].get('vehicleId').setValue('');

      this.conceptVehicleFuel.controls[index].get('name').setValue('');

      this.conceptVehicleFuel.controls[index].get('vehicleId').updateValueAndValidity();

      this.conceptVehicleFuel.controls[index].get('name').updateValueAndValidity();
    }

  

  }

}
