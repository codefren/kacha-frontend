import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-parcel-scan-package-setting',
  templateUrl: './parcel-scan-package-setting.component.html',
  styleUrls: ['./parcel-scan-package-setting.component.scss']
})
export class ParcelScanPackageSettingComponent implements OnInit {

  companyPreferencesPackage: any;

  constructor(
    private toastService: ToastService,
    private _translate: TranslateService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this.loadingService.showLoading();

    this.backendService.get('company_preference_package').pipe(take(1)).subscribe((data)=>{

      this.companyPreferencesPackage = data.data;

      this.loadingService.hideLoading();

      this.detectChanges.detectChanges();
      

    }, error => {
      

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeGeneral(Event: any, id: any){

    

     this.loadingService.showLoading();
  
      let data ={
  
         [id]: Event
      
      };

      this.backendService.post('company_preference_package', data).pipe(take(1)).subscribe((data)=>{
  
  
        this.companyPreferencesPackage = data.data;

        this.loadingService.hideLoading();
  
        this.toastService.displayWebsiteRelatedToast(
          this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        );
  
        this.detectChanges.detectChanges();

      }, error => {
        
        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
    }

    changeGeneralAlbaran(Event: any, id: any){

    
      switch (id) {


          case 'allowVerifcationProductScanner':

            this.companyPreferencesPackage.allowVerifcationProductScanner = Event;

          
            break;
      
        default:
          break;
      }

      console.log( this.companyPreferencesPackage,'  this.companyPreferencesPackage')
      this.loadingService.showLoading();

  
   
       let data ={
   
          [id]: Event
       
       };
 
       this.backendService.post('company_preference_package',  this.companyPreferencesPackage).pipe(take(1)).subscribe((data)=>{
   
   
         this.companyPreferencesPackage = data.data;
 
         this.loadingService.hideLoading();
   
         this.toastService.displayWebsiteRelatedToast(
           this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
         );
   
         this.detectChanges.detectChanges();
 
       }, error => {
         
         this.loadingService.hideLoading();
   
         this.toastService.displayHTTPErrorToast(error.status, error.error.error);
       });
     }

}
