import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {
  
  companyPreferenceNotification: any = {
    showReceiveExpirationNotices: false,
    notifyThirtyDaysBefore: false,
    notifyFifteenDaysBefore: false,
    notifySevenDaysBefore: false,
    notifyOneDayBefore: false,
  };

  show: boolean = true;

  constructor(
    private backend: BackendService,
    private toast: ToastService,
    private loading: LoadingService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getNotices();
  }

  getNotices(){

    this.loading.showLoading();

    this.show= false;

    this.backend.get('company_preference_notification').pipe(take(1)).subscribe(({data})=>{

      this.loading.hideLoading();

      this.companyPreferenceNotification = data;

      this.show = true;

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.loading.hideLoading();

      this.show = true;

      this.toast.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  changeCompanyPreferenceNotification(name :string, event: any){
  
    this.companyPreferenceNotification[name] = event;

    let data ={

      showReceiveExpirationNotices: this.companyPreferenceNotification.showReceiveExpirationNotices ? this.companyPreferenceNotification.showReceiveExpirationNotices: false,

      notifyThirtyDaysBefore: this.companyPreferenceNotification.notifyThirtyDaysBefore ? this.companyPreferenceNotification.notifyThirtyDaysBefore: false,

      notifyFifteenDaysBefore: this.companyPreferenceNotification.notifyFifteenDaysBefore ? this.companyPreferenceNotification.notifyFifteenDaysBefore :false,

      notifySevenDaysBefore: this.companyPreferenceNotification.notifySevenDaysBefore ? this.companyPreferenceNotification.notifySevenDaysBefore: false,

      notifyOneDayBefore: this.companyPreferenceNotification.notifyOneDayBefore ? this.companyPreferenceNotification.notifyOneDayBefore: false,

    }

    this.backend.post('company_preference_notification', data).pipe(take(1)).subscribe(({data})=>{
      
      this.companyPreferenceNotification = data;

       this.toast.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });
    
   }

}
