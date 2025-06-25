import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-control-of-invoices',
  templateUrl: './control-of-invoices.component.html',
  styleUrls: ['./control-of-invoices.component.scss']
})
export class ControlOfInvoicesComponent implements OnInit {

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

    this.show = false;

    this.service.getCompanyPreferenceBill().pipe( take(1) )
      .subscribe(
        ({ data }) => {

          this.loadingService.hideLoading(); 

          this.companyPreferenceBill = data; 

          this.show = true;

        } ,
        ( error ) => {

          this.show = true;

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

         this.show = true;

         this.toastService.displayHTTPErrorToast( error.status, error.error.error );

       }
     )
   
   }

}
