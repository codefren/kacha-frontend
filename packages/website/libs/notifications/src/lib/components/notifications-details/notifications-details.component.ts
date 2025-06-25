import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService, ConfirmModalComponent, ModaSendNotificationComponent, ToDayTimePipe } from '@optimroute/shared';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-notifications-details',
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.scss']
})
export class NotificationsDetailsComponent implements OnInit, OnDestroy {

  notificationsDetails: any;

  subscribe: any;

  delected: boolean = false;

  unsubscribe$ = new Subject<void>();

  @Input() notificationId: any;

  @Output('showDatas')

  showDatas: EventEmitter<any> = new EventEmitter();

  constructor(
    private Router: Router,
    private toast: ToastService,
    private _modalService: NgbModal,
    private loading: LoadingService,
    private backend: BackendService,
    private _translate: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private stateEasyrouteService: StateEasyrouteService,

      ) { }

  ngOnInit() {
    this.subscribe = this._activatedRoute.data
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: any) => {
        this.delected = data.delected ? data.delected : false;
        this.load();
    });
   
    this.initMoment();
  }

  initMoment() {
    momentTimezone()
        .tz('Europe/Madrid')
        .format();
}

   load() {

        this.stateEasyrouteService.getNotification(this.notificationId).subscribe(

          (data: any) => {
           
            this.notificationsDetails = data.data;

            this._changeDetectorRef.detectChanges();
            
          },(error) => {

            return  this.toast.displayHTTPErrorToast(error.status, error.error.error);
          });

  }



  formatDate(date: string){
    return moment(date).format('DD/MM/YYYY');
  }

  formaHour(hour: string){
    return moment(hour).format('HH:mm');
  }

  public dateLast(date: string) {

   moment.locale(this._translate.getDefaultLang());

   return moment(date).format('dddd, DD MMM HH:mm');
    
  }


  public TimerOld(date: string){
    
    /* 
    *  Nota: startOf resetea el valor de la hora a las 12:00 am
    *  console.log( moment(date).startOf('hour') );
    *
    *  fromNow permite obtener la unidad tiempo transcurrido desde el punto indicado 
    *  hasta el momento actual
    */

    return moment(date).fromNow().replace( this._translate.instant('GENERAL.IN'), this._translate.instant('GENERAL.DOES')); 
  }

  deleted(){

    const modal = this._modalService.open(ConfirmModalComponent, {
      size: 'xs',
      backdropClass: 'customBackdrop',
      centered: true,
      backdrop: 'static',
  });
  modal.componentInstance.message = this._translate.instant('PREFERENCES.NOTIFICATIONS.DELETE_NOTIFICATIONS');

  modal.result.then(async (data) => {
      if (data) {

          await this.loading.showLoading();
          this.backend.post('company_notification_delete', {
              id: [this.notificationsDetails.id]
          }).pipe(take(1)).subscribe(() => {
            this.toast.displayWebsiteRelatedToast(
              this._translate.instant('PREFERENCES.NOTIFICATIONS.NOTIFICATION_DELETED'),
              this._translate.instant('GENERAL.ACCEPT'),
          );
              this.loading.hideLoading();
              if (this.delected) {
                this.Router.navigate(['notifications/delected']);
              
              } else {
                this.Router.navigate(['notifications']);
              }
             
          }, error => {
              this.loading.hideLoading();
              this.toast.displayHTTPErrorToast(error.status, error.error.error);
          });
      }

  })
  }

  async markRead(){
   
    await this.loading.showLoading();
        this.backend.post('company_notification_mark_not_read', {
            id: [this.notificationsDetails.id]
        }).pipe(take(1)).subscribe(() => {
           
            this.loading.hideLoading();

            if (this.delected) {
              this.Router.navigate(['notifications/delected']);
            
            } else {
              this.Router.navigate(['notifications']);
            }

      

        }, error => {

            this.loading.hideLoading();
            this.toast.displayHTTPErrorToast(error.status, error.error.error);
        });
    
  }

  sendMail(){

      const modal = this._modalService.open(ModaSendNotificationComponent, {
        size: 'xs',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
        windowClass:'modal-send-notification',
    });

    modal.componentInstance.title = this._translate.instant('NOTIFICATIONS.RESEND_NOTIFICATION');
    modal.componentInstance.message = this._translate.instant('NOTIFICATIONS.RESEND_NOTIFICATION_MESSAGE');

    modal.result.then(async (data) => {
        if (data) {

          let send ={
            companyNotificationId: this.notificationsDetails.id,
            email:data.email
          }
  
            await this.loading.showLoading();
            this.backend.post(`company_send_notification_mail`, send
            ).pipe(take(1)).subscribe((data) => {
              console.log(data, 'data');
              this.toast.displayWebsiteRelatedToast(
                this._translate.instant('PREFERENCES.NOTIFICATIONS.MAIL_SENT_SUCCESSFULLY'),
                this._translate.instant('GENERAL.ACCEPT'),
            );
                this.loading.hideLoading();

            }, error => {
                this.loading.hideLoading();
                this.toast.displayHTTPErrorToast(error.status, error.error.error);
            });
        }
  
    })
  }

  timeFormat(time: any){
    //return  this.dayTime.transform(time, false, false);
  }

  returnsNotifications(){
    console.log('volver a notificaciones');
    let data ={
      showData :'list',
      deleted:this.delected
    }
    
    this.showDatas.emit( data );
  }
 
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscribe.unsubscribe(); 
  }

}
