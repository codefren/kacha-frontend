import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { StatePreferencesService } from '../../../../state-preferences/src/lib/state-preferences.service';
import { LoadingService } from '../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-company-preferece-bill',
  templateUrl: './company-preferece-bill.component.html',
  styleUrls: ['./company-preferece-bill.component.scss']
})
export class CompanyPrefereceBillComponent implements OnInit {
  companyPreferenceBill: any ={
    showChargeInApp: '',
    allowDriver: '',
    allowCommercial: '',
    cashCharge:'',
    cardCharge:'',
    allowDontCharge:''
  };

  show: boolean = true;
  

  constructor( 
    private service: StatePreferencesService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService
    ) { }

  ngOnInit() {
    this.getCompanyPreferenceMaintenance();
  }

  getCompanyPreferenceMaintenance(){

    this.loadingService.showLoading();

    this.show= false;

    this.service.getCompanyPreferenceBill().pipe( take(1) )
      .subscribe(
        ({ data }) => {

          this.loadingService.hideLoading(); 

          this.companyPreferenceBill = data; 

          this.show= true;

          console.log(this.companyPreferenceBill, 'bill')
     
        } ,
        ( error ) => {
          this.show= true;
          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  changeCompanyPreferenceBill(name :string, event){
  
    this.companyPreferenceBill[name] = event;
    
     this.service.updateCompanyPreferenceBill(this.companyPreferenceBill).pipe( take(1) )
     .subscribe(
       ({ data }) => {
       
         this.companyPreferenceBill=data;
         this.toastService.displayWebsiteRelatedToast(
           this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
           this.translate.instant('GENERAL.ACCEPT'),
       );
         
       } ,
       ( error ) => {
         this.loadingService.hideLoading();
         this.show= true;
         this.toastService.displayHTTPErrorToast( error.status, error.error.error );
       }
     )
   
   }
}
