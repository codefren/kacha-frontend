import { LoadingComponent } from './../../../../../../../../apps/easyroute/src/app/component/loading/loading.component';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { Router } from '@angular/router';
@Component({
    selector: 'easyroute-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

    @Input() idParan: any;

    maintenaceForm: FormGroup;

    suplementsList: any = [];

    suplementList: any = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private backend: BackendService,
        private loading: LoadingService,
        private translate: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        private toast: ToastService
        ) { }


    digitaAccesories = [];

    loadDigitaAccesories = [];

    materialAccessories = [];

    loadmaterialAccessories =[];

    mandatoryReviews = [];

    loaddMandatoryReviews = [];
    

    ngOnInit() {

       this.load();

       this.loadDigitalAccessories();

       this.loadMaterialAccessories();

       this.loadMandatoryReviews();
       
    }

    load(){
        this.validaciones();
        this.getCompanySupplementList();
    }

    /* select suplement */
    getCompanySupplementList(){
        this.backend.get('company_supplement_list').pipe(take(1)).subscribe(({data})=>{
            this.suplementList = data;
           
            this.changeDetectorRef.detectChanges();
        }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }



    /* complementos digitales */

    loadDigitalAccessories() {

      this.loading.showLoading();

        this.backend.get('company_digital_complement_list').pipe(take(1)).subscribe(({data})=>{

            this.digitaAccesories = data;

            this.getLoadDigitalAccessories();

            this.loading.hideLoading();

            this.changeDetectorRef.detectChanges();

        },(error) => {
          this.loading.hideLoading();
          this.toast.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      });
        
    }

    getLoadDigitalAccessories() {

      this.backend.get('vehicle_digital_complement_list/' + this.idParan).pipe(take(1)).subscribe(({data})=>{

          this.loadDigitaAccesories = data;
          
          this.changeDetectorRef.detectChanges();

      }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }

  
    /* para buscar el valor y mostrarlo */

    getReturnValue(data:any){
      return this.loadDigitaAccesories.find( x => x.companyDigitalComplementId === data.id) ? this.loadDigitaAccesories.find( x => x.companyDigitalComplementId === data.id).value :'';
    }

    /* para crear o editar*/

     digitalComplement( value:any, data: any ,index: number){


      let dataform = _.cloneDeep(data);

      let send ={

        vehicleId : this.idParan,

        value : value,
  
        companyDigitalComplementId : data.id
  
      }

      if(value && value.length > 0){
      
        this.backend.post('vehicle_digital_complement', send).pipe(take(1)).subscribe((response) => {
  
          this.getLoadDigitalAccessories();
    
          this.toast.displayWebsiteRelatedToast(
        
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
  
            this.translate.instant('GENERAL.ACCEPT'),
  
        );
      
            this.changeDetectorRef.detectChanges();
      
          },(error) => {
            this.toast.displayHTTPErrorToast(error.error.code, error.error);
            this.changeDetectorRef.detectChanges();
        },)
      }


    }

    /* end complementos digitales */

    /* complementos digitales */

    loadMaterialAccessories() {

      this.backend.get('company_material_complement_list').pipe(take(1)).subscribe(({data})=>{

          this.materialAccessories = data;

          this.getLoadMaterialAccessories();

          this.changeDetectorRef.detectChanges();

      }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }

    getLoadMaterialAccessories() {
  
      this.backend.get('vehicle_material_complement_list/' + this.idParan).pipe(take(1)).subscribe(({data})=>{
  
          this.loadmaterialAccessories = data;
          
          this.changeDetectorRef.detectChanges();
  
      }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }

    /* para buscar el valor y mostrarlo */

    getReturnValueMaterial(data:any){
      return this.loadmaterialAccessories.find( x => x.companyMaterialComplementId === data.id) ? this.loadmaterialAccessories.find( x => x.companyMaterialComplementId === data.id).value :'';
    }

    /* para crear o editar*/

     materialComplement( value:any, data: any ,index: number){


      let send ={

        vehicleId : this.idParan,

        value : value,
  
        companyMaterialComplementId : data.id
  
      }

      if (value && value.length > 0) {

        this.backend.post('vehicle_material_complement', send).pipe(take(1)).subscribe((response) => {

          this.getLoadMaterialAccessories();
    
          this.toast.displayWebsiteRelatedToast(
        
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
  
            this.translate.instant('GENERAL.ACCEPT'),
  
        );
      
            this.changeDetectorRef.detectChanges();
      
          },(error) => {
            this.toast.displayHTTPErrorToast(error.error.code, error.error);
            this.changeDetectorRef.detectChanges();
        },)
      }

 
    }

    /* end complementos digitales */

    /* Revisiones obligatorias */

    loadMandatoryReviews() {

        this.backend.get('company_mandatory_review_list').pipe(take(1)).subscribe(({data})=>{

            this.mandatoryReviews = data;

            this.getLoadMandatoryReviewss();

            this.changeDetectorRef.detectChanges();

        }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }

    getLoadMandatoryReviewss() {
  
      this.backend.get('vehicle_mandatory_review_list/' + this.idParan).pipe(take(1)).subscribe(({data})=>{
  
          this.loaddMandatoryReviews = data;
          
          this.changeDetectorRef.detectChanges();
  
      }, error => this.toast.displayHTTPErrorToast(error.status, error.error.error));
    }

    /* para buscar el valor y mostrarlo */

    getReturnValueMandatory(data:any){
      return this.loaddMandatoryReviews.find( x => x.companyMandatoryReviewId === data.id) ? this.loaddMandatoryReviews.find( x => x.companyMandatoryReviewId === data.id).value :'';
    }
  
    /* para crear o editar*/

      mandatoryReviewss( value:any, data: any ,index: number){


      let send ={

        vehicleId : this.idParan,

        value : value,
  
        companyMandatoryReviewId : data.id
  
      }

      if(value && value.length > 0){
        
        this.backend.post('vehicle_mandatory_review', send).pipe(take(1)).subscribe((response) => {

          this.getLoadMandatoryReviewss();
    
          this.toast.displayWebsiteRelatedToast(
        
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
  
            this.translate.instant('GENERAL.ACCEPT'),
  
        );
      
            this.changeDetectorRef.detectChanges();
      
          },(error) => {
  
            this.toast.displayHTTPErrorToast(error.error.code, error.error);
  
            this.changeDetectorRef.detectChanges();
  
        },)
      }


    }
  

    /* end Revisiones obligatorias */

   

    /* Formulario de suplmentos */

    validaciones() {
    
        this.maintenaceForm = this.fb.group({
    
          concepts: new FormArray([]),
    
        });
    
        this.getVehicleSupplementlist();
    
    }

    /* llenar si esta cargado los datos  */

      getVehicleSupplementlist(){

        this.backend.get(`vehicle_supplement_list/`+ this.idParan).pipe(take(1)).subscribe(
    
          ({ data }) => {
    
            this.suplementsList = data;
    
            this.getChargingConcepts();
    
    
            this.changeDetectorRef.detectChanges();
    
    
          },
          (error) => {
              this.toast.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
      }

      getChargingConcepts(){

        this.suplementsList.forEach((item) => {
    
          const concept = new FormGroup({
    
            id: new FormControl(item.id),
    
            vehicleId: new FormControl(item.vehicleId),

            date: new FormControl(item.date),
    
            companySupplementId: new FormControl(item.companySupplementId),
    
          });
    
          this.concepts.push(concept);
    
        });
    
      }

     /* agregar suplementos */

      addConcept() {

        const concept = new FormGroup({
          id: new FormControl(0),
          vehicleId: new FormControl(this.idParan),
          companySupplementId: new FormControl(''),
          date: new FormControl(''),
       
        });
        
        this.concepts.push(concept); 
    
        this.changeDetectorRef.detectChanges();
     
      }
    
      get concepts (){
    
        return this.maintenaceForm.get('concepts') as FormArray;
    
      }

      /* validación del select */

      existConcept(companySupplementId: number){

        return this.concepts.value.find(x => Number(x.companySupplementId) === companySupplementId) ? true : false;
      }

      /* cambiar el select de suplementos */

      changeSelect(value:any, data: any, index: any ,target: any) {
   

        if( this.idParan > 0) {
    
          if(data.value.id > 0){
    
            this.editProvideTypeConcept(data.value, index);
    
          } else {
    
            this.addProvideTypeConcept(data.value, index);
    
          }
    
        }
      }
    
      /* editar editar suplementos */

      editProvideTypeConcept(data: any, index: any){
    
        if (data.companySupplementId && data.date) {
          this.backend
          .put('vehicle_supplement/' + data.id, data)
          .pipe(take(1))
          .subscribe(
              (response) => {
      
                this.concepts.controls[index].get('id').setValue( response.data.id);
      
                this.concepts.controls[index].get('date').setValue( response.data.date);
      
                this.concepts.controls[index].get('companySupplementId').setValue( response.data.companySupplementId);
      
                this.toast.displayWebsiteRelatedToast(
      
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      
                    this.translate.instant('GENERAL.ACCEPT'),
      
                );
      
                this.changeDetectorRef.detectChanges();
              },
              (error) => {
                  this.toast.displayHTTPErrorToast(error.error.code, error.error);
                  this.changeDetectorRef.detectChanges();
              },
          );
        }
    
      }

      /* añadir suplementos */

      addProvideTypeConcept(data: any, index: any) {
    
        let dataform = _.cloneDeep(data);
    
        if (data.companySupplementId && data.date) {
    
          this.backend.post('vehicle_supplement', dataform).pipe(take(1)).subscribe((response) => {
    
            this.concepts.controls[index].get('id').setValue( response.data.id);
    
    
            this.concepts.controls[index].get('date').setValue( response.data.date);
    
            this.concepts.controls[index].get('companySupplementId').setValue( response.data.companySupplementId);
    
            this.toast.displayWebsiteRelatedToast(
    
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
    
              this.translate.instant('GENERAL.ACCEPT'),
    
          );
      
            this.changeDetectorRef.detectChanges();
      
          },(error) => {
            this.toast.displayHTTPErrorToast(error.error.code, error.error);
            this.changeDetectorRef.detectChanges();
        },)
        }
    
       
      }

      /* cambiar fecha de suplementos */
      changeDate(value:any, data: any, index: any){

        if(this.idParan> 0) {
    
          if(data.value.id > 0){
    
            this.editProvideTypeConcept(data.value, index);
    
          } else {
    
            this.addProvideTypeConcept(data.value, index);
    
          }
    
        }
    
      }

      /* eliminar suplementos */
      deleteSupplement(data: any, index: number = null){

        if(data.value.id > 0) {
        
            this.backend
            .delete('vehicle_supplement/' + data.value.id)
            .pipe(take(1))
            .subscribe(
                (response) => {
    
                    this.concepts.controls.splice(index, 1);
    
                    this.toast.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
    
                    this.load()
    
                    this.changeDetectorRef.detectChanges();
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                },
            );
         
    
        } else {
    
          this.concepts.controls.splice(index, 1);
    
         // this.loadAll()
    
          this.changeDetectorRef.detectChanges();
    
        }
    
      }


      redirectSettingsVehicles(value: any){

        //this.router.navigate([`/management-logistics/vehicles/settings/${this.idParan}/${value}`]);
        this.router.navigateByUrl(`/preferences?option=${value}`);
      }
    
     

}
