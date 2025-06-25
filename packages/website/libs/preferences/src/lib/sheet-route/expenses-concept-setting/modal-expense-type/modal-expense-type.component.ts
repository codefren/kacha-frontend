import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-expense-type',
  templateUrl: './modal-expense-type.component.html',
  styleUrls: ['./modal-expense-type.component.scss']
})
export class ModalExpenseTypeComponent implements OnInit {

  data: any;
  
  ExpenseTypeForm: FormGroup;

  actions: any;

  providerList: any;

  concepList: any;

  showProvidersType: boolean = true;

  showProviders: boolean = true;

  showConcept: boolean = true;

  providersType: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private backendService: BackendService,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
  
    this.getProvidersTypeList();

    this.form();
  }
  

  form(){
    this.ExpenseTypeForm = this.fb.group({

      expenseTypeId: ['', [Validators.required]],

      providerId: [{value: '', disabled: true},[Validators.required]],

      providerTypeConceptId: [{value: '', disabled: true} ,[Validators.required]],
     
    });
  }

  getProvidersTypeList(){

    this.showProvidersType = false;

    this.backendService.get('provider_type_active_list').pipe(take(1)).subscribe((data)=>{

      this.providersType = data.data;

      this.showProvidersType = true;
  
      this.detectChanges.detectChanges();
  
      }, error => {
        
       this.showProvidersType = true;
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }


  close(){
    this.activeModal.close(false);

  }

  changeForm(event:any){


    let value = event.target.value;

      if (this.ExpenseTypeForm.get('expenseTypeId').value !='') {

        this.getProvidersType(value);

      } else {
        this.ExpenseTypeForm.get('providerId').disable();
      }
   
  }

  changeFormSupplier(event:any){

    let value = event.target.value;

    if( this.ExpenseTypeForm.get('expenseTypeId').value !=''){

      this.getProvidersConcept(value);

    } else {

      this.ExpenseTypeForm.get('providerTypeConceptId').disable();

    }
   
  }

  /* buscar provedor dado el tipo */

  getProvidersType(providerId: any){

    this.showProviders = false;

    this.backendService.post('providers_by_type',{  providerTypeId:providerId}).pipe(take(1)).subscribe((data)=>{

      this.providerList = data.data;

      this.ExpenseTypeForm.get('providerId').enable();

      this.ExpenseTypeForm.get('providerId').setValue('');

      this.ExpenseTypeForm.get('providerId').updateValueAndValidity();

      this.showProviders = true;

      this.detectChanges.detectChanges();

  
      }, error => {

        this.showProviders = true;
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  ///concept

  getProvidersConcept(providerId: any){


    this.showConcept = false;

    this.backendService.post('provider_type_concept_by_provider',{ providerId : providerId}).pipe(take(1)).subscribe((data)=>{

      this.concepList = data.data;

      this.ExpenseTypeForm.get('providerTypeConceptId').enable();

      this.ExpenseTypeForm.get('providerTypeConceptId').setValue('');

      this.ExpenseTypeForm.get('providerTypeConceptId').updateValueAndValidity();

      this.showConcept = true;

      this.detectChanges.detectChanges();
  
      }, error => {

        this.showConcept = true;
        
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }


  submit(){
    
    if (this.ExpenseTypeForm.valid) {

      let data ={

        providerId: this.ExpenseTypeForm.value.providerId,

        providerTypeConceptId:this.ExpenseTypeForm.value.providerTypeConceptId
      }

      
      this.backendService.post('route_sheet_concept_preference', data).pipe(take(1)).subscribe((data)=>{

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
      );

        this.activeModal.close(true);
    
        }, error => {
  
          this.showConcept = true;
        
    
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }
  }

  deleteForm(){
    console.log('para eliminar')
  }

}
