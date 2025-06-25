import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-chat-storage-setting',
  templateUrl: './chat-storage-setting.component.html',
  styleUrls: ['./chat-storage-setting.component.scss']
})
export class ChatStorageSettingComponent implements OnInit {

  companyPreferenceChat: any = {
    storageDay: '',
  };

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getCompanyPreferenceChat()

  }

  getCompanyPreferenceChat() {

    this.loadingService.showLoading();

    this.backendService.get('company_preference_chat').pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceChat = data;

      this.loadingService.hideLoading();

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  changeCompanyPreferenceChat(name :string, event: any) {

    this.companyPreferenceChat[name] = event;

    let data ={

      storageDay: this.companyPreferenceChat.storageDay ? this.companyPreferenceChat.storageDay : 2,

    }

    this.backendService.post('company_preference_chat', data).pipe(take(1)).subscribe(({data})=>{
      
      this.companyPreferenceChat = data;

       this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast( error.status, error.error.error );

     });
    
  }

}
