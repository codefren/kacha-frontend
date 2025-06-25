import { take } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatePreferencesService } from '../../../../state-preferences/src/lib/state-preferences.service';
import { LoadingService } from '../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { sliceMediaString } from '../../../../shared/src/lib/util-functions/string-format';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationMessages } from '@optimroute/shared';
import { BackendService, Profile } from '@optimroute/backend';
import { AuthLocalService } from '@optimroute/auth-local';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
declare var $;
@Component({
  selector: 'easyroute-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  companyPreferenceMaintenance: any ={
    allowComentary: '',
    allowImages: '',
    showVerificationStateCheck: ''
  };

  MaintenanceVehicleStateType: any;

  MaintenancePreferenceVehicleStateType: any;

  MaintenanceReviewType: any;

  MaintenancePreferenceReview: any

  show: boolean = true;
  
  commentApp = [];

  integrationSendList =[];

  hidden: boolean = false;

  notificationsForm: FormGroup;
  validationMessages = new NotificationMessages().getValidationMessages();
  ERRORS_IN_INTEGRATION: string;

  orderNotifications: FormGroup;

  activeMultiStore: boolean = false;

  data: any;

  profile: Profile;

  companyPreferenceNotification: any = {
    showReceiveExpirationNotices: false,
    notifyThirtyDaysBefore: false,
    notifyFifteenDaysBefore: false,
    notifySevenDaysBefore: false,
    notifyOneDayBefore: false,
  };

  showNotice: boolean = true;


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

  showErrorEmail: boolean = false;


  constructor(
    private fb: FormBuilder,
    private service: StatePreferencesService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    public authLocal: AuthLocalService,
    public facadeProfile: ProfileSettingsFacade,

  ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) {
          this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
            this.profile = data;

            this.changeDetectorRef.detectChanges();
          });
      }
    });


    this.getIntegrationSendEmail();

    this.getCompanyPreferenceMaintenance();

    this.getNotices();

    this.getCompanyPreferenceMaintenanceBills();

    this.ERRORS_IN_INTEGRATION = this.translate.instant(
      'PREFERENCES.MESSAGE.ERRORS_IN_INTEGRATION',
    );

    this.backendService.get('user/me').pipe(take(1)).subscribe(
      (resp) => {
          this.data = resp.preferences.notification;
          console.log(this.data, 'notification')
          const { notification } = resp.preferences;
          
          this.activeMultiStore = resp.company.active_modules.find((x: any) => x.id === 2) ? true : false;
          this.initForm(notification);
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

  }

  initForm(notification: any) {
    
    this.notificationsForm = this.fb.group({
        preferencesMailIntegrationError: [
            notification.integrationError === null ? '' : notification.integrationError,
            [Validators.email, Validators.required],
        ],
        preferencesMailBreakdown: [
            notification.breakdown === null ? '' : notification.breakdown,
            [Validators.email],
        ],
        preferencesMailClientClosed: [
            notification.clientClosed === null ? '' : notification.clientClosed,
            [Validators.email],
        ],
        preferencesMailClientWithoutBuy: [
            notification.clientWithoutBuy === null ? '' : notification.clientWithoutBuy,
            [Validators.email],
        ],
    });

    this.orderNotifications = this.fb.group({
        orderNotificationMail: [
            notification.orderNotificationMail === null
                ? ''
                : notification.orderNotificationMail,
            [Validators.email, Validators.required],
        ],
    });

    this.changeDetectorRef.detectChanges();

  }

  /* Listar los toogle  */
  getCompanyPreferenceMaintenance(){

    this.loadingService.showLoading();

    this.service.getCompanyPreferenceNotification().pipe( take(1) )
      .subscribe(
        ({ data }) => {

          this.loadingService.hideLoading(); 

          this.commentApp = data; 

       //   this.getMaintenanceVehicleStateType();
    
         
        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  async addOthers(value){
    if(value && value != '' && value.length > 0){

      let data = {
        notificationMail:value
      }

      await this.loadingService.showLoading();

      this.service.createCommentsApp(data).pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.commentApp.push(data);
          
          //this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast('Correo agregado');

         
        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
    }
  }
  
  async deleteCommentary(index: number, data: any){
    
      await this.loadingService.showLoading();

      this.service.deleteCommentsApp(data.id).pipe( take(1) )
      .subscribe(

        ({ data }) => {
          
          
          this.commentApp.splice(index, 1)
          
          //this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast('Correo eliminado satisfactoriamente');

         
        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
    
  }

  validateEmil(enteredEmail:any){

    let mail_format = /\S+@\S+\.\S+/;  

    if (enteredEmail && enteredEmail.value === '') {
      return null;
    }
   
    return mail_format.test(enteredEmail);
   
  }

  sliceString(text: string) {
    return sliceMediaString(text, 35, '(min-width: 960px)');
  }

  updateNotifications() {
    const {
        preferencesMailBreakdown,
        preferencesMailClientClosed,
        preferencesMailClientWithoutBuy,
        preferencesMailIntegrationError,
    } = this.notificationsForm.value;

    const data = {
        preferences: {
            mail: {
                mailBreakDown: preferencesMailBreakdown,
                clientWithoutBuy: preferencesMailClientWithoutBuy,
                integrationError: preferencesMailIntegrationError,
                clientClosed: preferencesMailClientClosed,
            },
        },
    };

    // change for the state if is ready
    this.service.updateNofitications(data).subscribe(
        (resp) => {
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant(
                    'PREFERENCES.NOTIFICATIONS.UPDATE_NOTIFICATIONS',
                ),
                this.translate.instant('GENERAL.ACCEPT'),
            );
        },
        (error) =>
            this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );
  }

  submitOrderNotification() {
    const { orderNotificationMail } = this.orderNotifications.value;

    const data = {
        preferences: {
            mail: {
                orderNotificationMail: orderNotificationMail,
            },
        },
    };

    // change for the state if is ready
    this.service.updateNofitications(data).subscribe(
        (resp) => {
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant(
                    'PREFERENCES.NOTIFICATIONS.UPDATE_NOTIFICATIONS',
                ),
                this.translate.instant('GENERAL.ACCEPT'),
            );
        },
        (error) =>
            this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );
  }

  activatePreferencesEmailIntegration(event:any){
  
    const data = {
      preferences: {
          mail: {
            notifyIntegrationError: event
          },
      },
    };
  
    this.service.updateNofitications(data).pipe( take(1) ).subscribe(
    
      (resp) => {
    
        console.log(resp, 'respuesta llena del servicio')
    
        this.data = resp.preferences.notification;
    
          this.toastService.displayWebsiteRelatedToast(
    
              this.translate.instant(
    
                  'PREFERENCES.NOTIFICATIONS.UPDATE_NOTIFICATIONS',
    
              ),
    
              this.translate.instant('GENERAL.ACCEPT'),
          );
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );
  
  }

  getIntegrationSendEmail(){
  
    this.backendService.get('company_preference_integration').pipe(take(1)).subscribe(
      (resp) => {
        
          this.integrationSendList = resp.data;
  
  //        this.changeDetectorRef.detectChanges();
        
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );
  
  }

  async createIntegrationSendEmail(value: any){
  
    if(value && value != '' && value.length > 0){
  
      let data = {
  
        integrationEmail:value
  
      }
  
      await this.loadingService.showLoading();
  
      this.service.createIntegrationEmail(data).pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.integrationSendList.push(data);
          
          this.changeDetectorRef.detectChanges();
  
          this.loadingService.hideLoading();
  
          this.toastService.displayWebsiteRelatedToast('Correo agregado');
  
         
        } ,
        ( error ) => {
  
          this.loadingService.hideLoading();
  
          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
    }
  
  }

  updateIntegrationSendEmail(data: any){
    
  }

  async  deleteIntegrationSendEmail(index: number, data: any){
    
    await this.loadingService.showLoading();
  
    this.service.deleteIntegrationEmail(data.id).pipe( take(1) )
    .subscribe(
  
      ({ data }) => {
        
        
        this.integrationSendList.splice(index, 1)
        
        this.changeDetectorRef.detectChanges();
  
        this.loadingService.hideLoading();
  
        this.toastService.displayWebsiteRelatedToast('Correo eliminado satisfactoriamente');
  
       
      } ,
      ( error ) => {
  
        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )
  
  }

  hideMultidelegation() {

    if (!this.isAdminGlobal() && this.activeMultiStore &&
        this.profile.company && 
        this.profile.company.hideMultidelegation) {

        return false;

      } 
  
    return true;
      
  }
  
  isAdminGlobal() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
          : false;
  }

  /* notice */

  getNotices(){

    this.loadingService.showLoading();

    this.show= false;

    this.backendService.get('company_preference_notification').pipe(take(1)).subscribe(({data})=>{

      this.loadingService.hideLoading();

      this.companyPreferenceNotification = data;

      this.show = true;

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.loadingService.hideLoading();

      this.show = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

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

    this.loadingService.showLoading();

    this.backendService.post('company_preference_notification', data).pipe(take(1)).subscribe(({data})=>{
      
      this.companyPreferenceNotification = data;

       this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.loadingService.hideLoading();
      
      this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast( error.status, error.error.error );
     });
    
   }

   /* activar notificaiones bills */

   getCompanyPreferenceMaintenanceBills(){

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

       this.changeDetectorRef.detectChanges();
       
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
