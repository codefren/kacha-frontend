import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-chat-sending-setting',
  templateUrl: './chat-sending-setting.component.html',
  styleUrls: ['./chat-sending-setting.component.scss']
})
export class ChatSendingSettingComponent implements OnInit {

  companyPreferenceChat: any = {
    allowChatSending: false,
  };

  sendData: any[] = [];

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCompanyPreferenceChat();
  }

  getCompanyPreferenceChat(){

    this.loadingService.showLoading();

    this.backendService.get('company_preference_chat').pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceChat = data;

      if (this.companyPreferenceChat.allowChatSending) {

        this.load();
        
      }

      this.loadingService.hideLoading();

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  load() {

    this.loadingService.showLoading();

    this.backendService.get('company_preference_chat_email').pipe(take(1)).subscribe(({data})=>{

      this.sendData = data;

      this.loadingService.hideLoading();

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  changeCompanyPreferenceChat(name :string, event: any){

    this.companyPreferenceChat[name] = event;

    let data = {

      allowChatSending: this.companyPreferenceChat.allowChatSending ? this.companyPreferenceChat.allowChatSending: false,

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

  //Proceso de enviar correos

  addSendEmail() {

    let data = {
      chatEmail: '',
    };
 
    this.sendData.push(data);

    this.changeDetectorRef.detectChanges();
  
  }

  changeConceptItem(data: any){

    if (data.id > 0) {
 
     this.updateData(data);
 
    } else {
 
     this.createData(data);
 
    }
 
  }
 
  createData(data: any) {

    if (data.chatEmail) {
    
       this.backendService.post( 'company_preference_chat_email', data).pipe(take(1))
 
       .subscribe((data)=>{
   
         this.toastService.displayWebsiteRelatedToast('Correo electrónico creado');
   
         this.load();
   
       }, error => {
   
         this.toastService.displayHTTPErrorToast(error.status, error.error.error);
   
       });

    } 
 
  }
 
  updateData(data: any){
 
    if (data.chatEmail) {
       
       this.backendService.put( 'company_preference_chat_email/' + data.id, data).pipe(take(1))
 
       .subscribe((data)=>{
   
         this.toastService.displayWebsiteRelatedToast('Correo electrónico actualizado');
   
         this.load();
   
       }, error => {
   
         this.toastService.displayHTTPErrorToast(error.status, error.error.error);
   
       });
    }
    
  }
 
  delete(data: any , index: any){
 
     if(data.id > 0) {
     
         this.backendService
         .delete('company_preference_chat_email/' + data.id)
         .pipe(take(1))
         .subscribe(
             (response) => {
 
                 this.sendData.splice(index, 1);
 
                 this.toastService.displayWebsiteRelatedToast(
                     this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                     this.translate.instant('GENERAL.ACCEPT'),
                 );
 
                 this.changeDetectorRef.detectChanges();
             },
             (error) => {
                 this.toastService.displayHTTPErrorToast(
                     error.error.code,
                     error.error,
                 );
             },
         );
 
     } else {
 
       this.sendData.splice(index, 1);
 
       this.changeDetectorRef.detectChanges();
 
    }

  }

  validateEmail(enteredEmail:any){

    let mail_format = /\S+@\S+\.\S+/;  

    if (enteredEmail && enteredEmail.value === '') {
      
      return null;
    }
   
    return mail_format.test(enteredEmail);
   
  }


}
