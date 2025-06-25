import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  costData: any[] = [];

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this.loadingService.showLoading();

    this.backendService.get('company_personal_cost').pipe(take(1)).subscribe((data)=>{

      this.costData = data.data;
    
      this.loadingService.hideLoading();

      this.detectChanges.detectChanges();
      

    }, error => {
      

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  addOthers() {

   let data ={

    name:''

   };

   this.costData.push(data);

   this.detectChanges.detectChanges();

  }

  changeConceptItem(data){


   if (data.id > 0) {

    this.updateConcept(data);

   } else {

    this.createConcept(data);

   }

  }

  createConcept(data: any){

    if (data.name) {
   
      this.backendService.post( 'company_personal_cost', data).pipe(take(1))

      .subscribe((data)=>{
  
        this.toastService.displayWebsiteRelatedToast('Concepto creado');
  
        this.load();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
    }

   

  }

  updateConcept(data: any){

    if (data.name) {
      
      this.backendService.put( 'company_personal_cost/' + data.id, data).pipe(take(1))

      .subscribe((data)=>{
  
        this.toastService.displayWebsiteRelatedToast('Concepto actualizado');
  
        this.load();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
    }

   
  }

  delete(data: any , index: any){

    if(data.id > 0) {
    
        this.backendService
        .delete('company_personal_cost/' + data.id)
        .pipe(take(1))
        .subscribe(
            (response) => {

                this.costData.splice(index, 1);

                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                this.detectChanges.detectChanges();
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.error.code,
                    error.error,
                );
            },
        );
    

    } else {

      this.costData.splice(index, 1);

      this.detectChanges.detectChanges();

    }
  }

}
