import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-bills-notices',
  templateUrl: './bills-notices.component.html',
  styleUrls: ['./bills-notices.component.scss']
})
export class BillsNoticesComponent implements OnInit {

  companyPreferenceBill: any ={
    showChargeInApp: '',
    allowDriver: '',
    allowCommercial: '',
    cashCharge:'',
    cardCharge:'',
    allowDontCharge:'',
    allowBillNotification:'',
    emailBillNotification:''
  };

  show: boolean = true;

  showErrorEmail: boolean = false;

  constructor(
    private service: StatePreferencesService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
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
       
         this.companyPreferenceBill = data;
         this.toastService.displayWebsiteRelatedToast(
           this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
           this.translate.instant('GENERAL.ACCEPT'),
       );

       this.detectChanges.detectChanges();
       
       } ,
       ( error ) => {

         this.loadingService.hideLoading();

         this.show = true;

         this.toastService.displayHTTPErrorToast( error.status, error.error.error );

       }
     )
   
   }

   changeCompanyPreferenceEmail(name :string, event){
  
  
    if (this.validateEmail(event)) {
     
     return; 

    } else {

      this.changeCompanyPreferenceBill(name, event) ;
    }
   
   }

   validateEmail(value: any){

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(value)) {

        return this.showErrorEmail = false;

    } else {

      
      return this.showErrorEmail = true;

    }

    
   }


}
