import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-modal-add-cost-vehicle',
  templateUrl: './modal-add-cost-vehicle.component.html',
  styleUrls: ['./modal-add-cost-vehicle.component.scss']
})
export class ModalAddCostVehicleComponent implements OnInit {

  vehicleFuelForm: FormGroup;

  showProvidersType: boolean = true;
 

  month = [];

  showVehicles: boolean = true;

  vehicleList: any []=[];   /* LIST OF VEHICLES ACTIVE */

  providerTypeId: any;

  providerId: any;

  providerTypeConceptId: any;

  listVechiclesend : any [] = [];

  selectMonth: any ='';

  selectYear: any ='';

  patterValidator: boolean = false;
  
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
 
      this.addStructure();

    }, error => {

      this.showVehicles = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  addStructure() {
     
     let send = this.vehicleList.map((image) => ({
        vehicleId: image.id,
        name: image.name,
        registration: image.registration,
        providerTypeId: this.providerTypeId,
        providerId: this.providerId,
        providerTypeConceptId: this.providerTypeConceptId,
        quantity: 0,
        import: 0,
      }));

      this.addConceptVehicleFuelList(send);

      this.showVehicles = true;
      
      this.changeDetector.detectChanges();

  }

  addConceptVehicleFuelList(data: any) {
  
    if (data.length > 0) {

      data.map((o, i) => {

        const concept = new FormGroup({
          vehicleId: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).vehicleId),
          name: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).name),
          registration: new FormControl(data.find((x: any) => x.vehicleId === o.vehicleId).registration),

          providerTypeId: new FormControl(this.providerTypeId),
          providerId: new FormControl(this.providerId),
          providerTypeConceptId: new FormControl(this.providerTypeConceptId),
          quantity: new FormControl ('', [Validators.pattern("^[0-9]*$"), Validators.min(1)]),
          import: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        });

        this.conceptVehicleFuel.push(concept);
  
      });
    }

    this.changeDetector.detectChanges();

  }



  submit(){

    let findArry = this.vehicleFuelForm.value.conceptVehicleFuel.filter( (x: any)=> x.quantity > 0 && x.import > 0)

    let sendMap = findArry.map((data) => ({
      
      vehicleId: data.vehicleId,

      providerTypeId: this.providerTypeId,

      providerId: this.providerId,

      providerTypeConceptId: this.providerTypeConceptId,

      quantity: data.quantity,

      import: data.import
    
    }))

   
    let sentData ={

      mount: this.selectMonth,

      year: this.selectYear,

      costVehicleArray : sendMap
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

  validateImport(){
    
    return  this.vehicleFuelForm.value.conceptVehicleFuel.find((x) => x.quantity > 0 && x.import > 0) ? true : false;

  }

  close() {

    this.activeModal.close(false);

  }

 /*  changeQuantity(value: any, data: any, index: any, target: any) {

    this.conceptVehicleFuel.controls[index].get('quantity').setValidators([Validators.pattern("^[0-9]*$"), Validators.min(1)])
    this.conceptVehicleFuel.controls[index].get('quantity').updateValueAndValidity();

    console.log(this.conceptVehicleFuel.controls)

  } */

}
