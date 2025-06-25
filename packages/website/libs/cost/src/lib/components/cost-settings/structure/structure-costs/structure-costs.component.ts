import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-structure-costs',
  templateUrl: './structure-costs.component.html',
  styleUrls: ['./structure-costs.component.scss']
})
export class StructureCostsComponent implements OnInit {

  structureData: any[] = [];

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

    this.backendService.get('company_structure_cost').pipe(take(1)).subscribe((data)=>{

      this.structureData = data.data;

      this.loadingService.hideLoading();

      this.detectChanges.detectChanges();
      

    }, error => {
      

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  addOthers() {
   let data = {

    name:'',

    price:0,

    reviewDate:''

   };

   this.structureData.push(data);

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


    if (data.name && data.price && data.reviewDate) {
   
      this.backendService.post( 'company_structure_cost', data).pipe(take(1))

      .subscribe((data)=>{
  
        this.toastService.displayWebsiteRelatedToast('Concepto creado');
  
        this.load();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
    }

   

  }

  updateConcept(data: any){

    if (data.name && data.price && data.reviewDate !='' ) {
      
      this.backendService.put( 'company_structure_cost/' + data.id, data).pipe(take(1))

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
        .delete('company_structure_cost/' + data.id)
        .pipe(take(1))
        .subscribe(
            (response) => {

                this.structureData.splice(index, 1);

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

      this.structureData.splice(index, 1);

      this.detectChanges.detectChanges();

    }
  }

}
