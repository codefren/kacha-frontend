import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { CustomDatepickerI18n, Language, MomentDateFormatter, objectToString } from '../../util-functions/date-format';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'easyroute-modal-apply-renting-cost',
  templateUrl: './modal-apply-renting-cost.component.html',
  styleUrls: ['./modal-apply-renting-cost.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class ModalApplyRentingCostComponent implements OnInit {

  vehicleRetingCostForm: FormGroup;

  showVehicles: boolean = true;

  vehicleList: any []=[];



  constructor(
    
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private backendService: BackendService,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.validation();

  }

  validation() {

    this.vehicleRetingCostForm = this.fb.group({
      conceptVehicleRentingCost: new FormArray([]),
    });

    this.getSelectVehicle();

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

  get conceptVehicleRentingCost() {

    if (this.vehicleRetingCostForm)
      return this.vehicleRetingCostForm.get('conceptVehicleRentingCost') as FormArray;

  }

  addStructure() {
     
    let send = this.vehicleList.map((data) => ({

      id: data.id,
      registration: data.registration,
      acquisitionShare: 0,
      acquisitionDateCost: '',
      endDate: '',

     }));

     this.addConceptVehicleRentingCost(send);

     this.showVehicles = true;
     
     this.changeDetector.detectChanges();

 }

 addConceptVehicleRentingCost(data: any) {
 
   if (data.length > 0) {

     data.map((o, i) => {

       const concept = new FormGroup({
         id: new FormControl(data.find((x: any) => x.id === o.id).id),
         registration: new FormControl(data.find((x: any) => x.id === o.id).registration),
         acquisitionShare: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
         acquisitionDateCost: new FormControl (null),
         endDate: new FormControl (null),
       });

       this.conceptVehicleRentingCost.push(concept);
 
     });
   }

   this.changeDetector.detectChanges();

 }


 deleteVehicleRentingCost(data: any, index: number = null) {

  this.conceptVehicleRentingCost.controls[index].get('acquisitionShare').setValue('');
  this.conceptVehicleRentingCost.controls[index].get('acquisitionShare').updateValueAndValidity();

  this.conceptVehicleRentingCost.controls[index].get('acquisitionDateCost').setValue(null);
  this.conceptVehicleRentingCost.controls[index].get('acquisitionDateCost').updateValueAndValidity();

  this.conceptVehicleRentingCost.controls[index].get('endDate').setValue(null);
  this.conceptVehicleRentingCost.controls[index].get('endDate').updateValueAndValidity();

  this.changeDetector.detectChanges();

 }

 submit(){

   let findArry = this.vehicleRetingCostForm.value.conceptVehicleRentingCost.filter( (x: any)=> x.acquisitionShare > 0 && x.acquisitionShare > 0)

   let sendMap = findArry.map((data: any) => ({
     
     id: data.id,

     registration: data.registration,

     acquisitionShare:  data.acquisitionShare,

     acquisitionDateCost: data.acquisitionDateCost ? objectToString(data.acquisitionDateCost): null,

     endDate: data.endDate ? objectToString(data.endDate) : null
   
   }))
  
   let sentData ={
    loadRentingArray : sendMap
   }

   this.backendService.post('vehicle_cost_reting_to_hand', sentData).pipe(take(1)).subscribe((data) => {

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
   
   return  this.vehicleRetingCostForm.value.conceptVehicleRentingCost.find((x: any) => x.acquisitionShare > 0 && x.acquisitionShare > 0) ? true : false;

 }

  close() {

    this.activeModal.close(false);

  }

}
