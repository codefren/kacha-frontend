import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-modal-apply-salary-cost',
  templateUrl: './modal-apply-salary-cost.component.html',
  styleUrls: ['./modal-apply-salary-cost.component.scss']
})
export class ModalApplySalaryCostComponent implements OnInit {

  userSalaryCostForm: FormGroup;

  showUsers: boolean = true;

  userList: any []=[];



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

    this.userSalaryCostForm = this.fb.group({
      conceptUserSalaryCost: new FormArray([]),
    });

    this.getSelectUser();

  }

  getSelectUser() {

    this.showUsers = false;

    this.backendService.get('users_list?me=true&showActive=true').pipe(take(1)).subscribe((data) => {

      console.log(data);
      this.userList = data;
 
      this.addStructure();

    }, error => {

      this.showUsers = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  get conceptUserSalaryCost() {

    if (this.userSalaryCostForm)
      return this.userSalaryCostForm.get('conceptUserSalaryCost') as FormArray;

  }

  addStructure() {
     
    let send = this.userList.map((data) => ({

       id: data.id,

       nationalId: data.nationalId,

       grossSalary: 0,

     }));

     this.addConceptUserSalaryCost(send);

     this.showUsers = true;
     
     this.changeDetector.detectChanges();

 }

 addConceptUserSalaryCost(data: any) {
 
   if (data.length > 0) {

     data.map((o, i) => {

       const concept = new FormGroup({
         id: new FormControl(data.find((x: any) => x.id === o.id).id),
         nationalId: new FormControl(data.find((x: any) => x.id === o.id).nationalId),
         grossSalary: new FormControl ('',  [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
       });

       this.conceptUserSalaryCost.push(concept);
 
     });
   }

   this.changeDetector.detectChanges();

 }


 deleteUserSalaryCost(data: any, index: number = null) {

  this.conceptUserSalaryCost.controls[index].get('grossSalary').setValue('');
  this.conceptUserSalaryCost.controls[index].get('grossSalary').updateValueAndValidity();

  this.changeDetector.detectChanges();

 }

 submit(){

   let findArry = this.userSalaryCostForm.value.conceptUserSalaryCost.filter( (x: any)=> x.grossSalary > 0 && x.grossSalary > 0)

   let sendMap = findArry.map((data) => ({
     
     id: data.id,

     nationalId: data.nationalId,

     grossSalary: data.grossSalary
   
   }))
  
   let sentData ={
    loadSalaryArray : sendMap
   }

   this.backendService.post('user_load_salary_to_hand', sentData).pipe(take(1)).subscribe((data) => {

     this.toastService.displayWebsiteRelatedToast(

       this.translate.instant('GENERAL.REGISTRATION'),

       this.translate.instant('GENERAL.ACCEPT'),
   );

   this.activeModal.close(true);

   }, error => {

     this.showUsers = true;

     this.toastService.displayHTTPErrorToast(error.status, error.error.error);
   });

 }

 validateImport(){
   
   return  this.userSalaryCostForm.value.conceptUserSalaryCost.find((x: any) => x.grossSalary > 0 && x.grossSalary > 0) ? true : false;

 }

  close() {

    this.activeModal.close(false);

  }

}
