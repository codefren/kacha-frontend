import { AuthLocalService } from './../../../../../auth-local/src/lib/auth-local.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ModalCheckCostComponent, ToastService } from '@optimroute/shared';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
declare var $: any;


declare function init_plugins();
@Component({
  selector: 'easyroute-chat-talks',
  templateUrl: './chat-talks.component.html',
  styleUrls: ['./chat-talks.component.scss']
})
export class ChatTalksComponent implements OnInit, OnChanges {

  @Input('chat') chat: any;

  messageText: any;

  userMe: any;

  @Output() message = new EventEmitter<string>();
  @Output('end') end = new EventEmitter<any>();
  @Output('assign') assign = new EventEmitter<any>();
  @Output('img') img = new EventEmitter<any>();
  @Output('accept') accept = new EventEmitter<any>();
  @Output('reject') reject = new EventEmitter<any>();
  acceptChat: boolean = false;

  showRejec: boolean = false;

  constructor(
    private router: Router,
    private _translate: TranslateService,
    public changeDetectorRef: ChangeDetectorRef,
    private _modalService: NgbModal,
    private toastService: ToastService,
    public authLocal: AuthLocalService,
    private backend: BackendService,
    private loading: LoadingService,
    private _profileSettingsFacade: ProfileSettingsFacade,
  ) { }

  ngOnInit() {
       setTimeout(()=>{
            init_plugins();

            $(document).on('inserted.bs.tooltip', function(e) {

                var tooltip = $(e.target).data('bs.tooltip');

                $(tooltip.tip).addClass($(e.target).data('tooltip-custom-classes'));

            });

        }, 1000);

        this._profileSettingsFacade.profile$.pipe(take(1)).subscribe(
          (resp) => {
              this.userMe = resp;
          },
          (error) => {
              console.log(error);
          },
      );
  }

  ngOnChanges() {
    setTimeout(() => {
      init_plugins();
      this.changeDetectorRef.detectChanges();
      this.setBadgets();
      if (this.chat != undefined) {
        this.scrollBottom();
      }
    }, 100)



  }

  isMeSendMessage(id: number) {

    if(this.chat.users.find(x => x.id === id)){

     return this.chat.users.find(x => x.id === id).me;

    } else if(this.chat && this.chat.usersReject && this.chat.usersReject(x => x.id === id)) {


      return this.chat.usersReject.find(x => x.id === id).me;

    } else {


      return false;

    }

  }

  isMe(id: number) {
    if(this.chat.users.find(x => x.id === id)){
        return this.chat.users.find(x => x.id === id).from;
    }

    return false;

  }

  sendData() {

    if (!this.validateTrim(this.messageText)) {

      this.message.emit(this.messageText);
      this.messageText = '';

    }

  }

  validateTrim(messageText: string){

    if (messageText && messageText.trim() && messageText.length > 0) {

      return false

    }

    return true

  }

  redirectClient(value: any) {
    this.router.navigate([`/management/clients/${value}`]);
  }

  getUserTo(item) {

    if(!item){
        return '';
    }
    let user;

    if (item.status && item.status === 'request') {

      user = item.users.find(x => x.from == true);

    } else {

      user = item.users.find(x => x.me == false)
    }

    if(user && user.name){
      return user.name + ' ' + user.surname;
    } else {
      return '';
    }

  }

  getUserColor(item) {

    let user;

    if (item.status && item.status === 'request') {

      user = item.users.find(x => x.from == true);

    } else {

      user = item.users.find(x => x.me == false)
    }

    return user.color;
  }

  getUserFrom(item){

    if(item && item.users){
      let user = item.users.find(x => x.from == true);

      return  `${user.name} ${user.surname}`
    } else {
      return '';
    }

  }

  getDriver(item) {
    if(item && item.users){
      let user = item.users.find(x => x.isDrive == true);

      return  `${user.name} ${user.surname}`
    } else {
      return '';
    }

  }

  getResponse(item) {
    if(item && item.users){
      let user = item.users.find(x => x.isDrive == false);

      return  `${user.name} ${user.surname}`
    } else {
      return '';
    }

  }

  openModalDelete(selected: any) {

    const modal = this._modalService.open(ModalCheckCostComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass: 'modal-cost',

      size: 'md'

    });

    modal.componentInstance.title = this._translate.instant('CHAT.END_CHAT');

    modal.componentInstance.Subtitle = this._translate.instant('CHAT.SUBTITLE');

    modal.componentInstance.message = this._translate.instant('CHAT.MESSAGE');

    modal.componentInstance.accept = this._translate.instant('CHAT.END_CHAT');

    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.result.then(
      (data) => {
        if (data) {

          this.end.emit(this.chat);

        }
      },
      (reason) => {

      },
    );
  }

  openModalAcept(selected?: any) {

    const modal = this._modalService.open(ModalCheckCostComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass: 'modal-cost',

      size: 'md'

    });

    modal.componentInstance.title = this._translate.instant('CHAT.ACCEPT_CHAT');

    modal.componentInstance.Subtitle = this._translate.instant('CHAT.ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THE_CHAT');

    modal.componentInstance.message = this._translate.instant('CHAT.TEXT_ACCEPT');

    modal.componentInstance.accept = this._translate.instant('CHAT.YES_ACCEPT_CHAT');

    modal.result.then(
      (data) => {
        if (data) {
          this.accept.emit(this.chat);
        }
      },
      (reason) => {

      },
    );
  }

  assignMeModalAcept() {

    const modal = this._modalService.open(ModalCheckCostComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass: 'modal-cost',

      size: 'md'

    });

    modal.componentInstance.title = this._translate.instant('CHAT.ASSSIGN_ME_CHAT');

    modal.componentInstance.Subtitle = this._translate.instant('CHAT.ARE_YOU_SURE_YOU_WANT_TO_ASSIGN_THE_CHAT') + this.getDriver(this.chat);

    modal.componentInstance.message = this._translate.instant('CHAT.ASSIGN_ACCEPT') + this.getResponse(this.chat);

    modal.componentInstance.accept = this._translate.instant('CHAT.YES_ASSIGN_CHAT');

    modal.result.then(
      (data) => {
        if (data) {
          this.assign.emit(this.chat);
        }
      },
      (reason) => {

      },
    );
  }

  openModalReject(selected?: any) {

    const modal = this._modalService.open(ModalCheckCostComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass: 'modal-cost',

      size: 'md'

    });

    modal.componentInstance.title = this._translate.instant('CHAT.REJECT_CHAT');

    modal.componentInstance.Subtitle = this._translate.instant('CHAT.TEXT_REJECT');

    modal.componentInstance.message = this._translate.instant('CHAT.TEXT_REJECT1');

    modal.componentInstance.accept = this._translate.instant('CHAT.YES_REJECT_CHAT');

    modal.componentInstance.cssStyle = 'btn btn-general-rejects';

    modal.result.then(
      (data) => {
        if (data) {

          this.reject.emit(this.chat);

        }
      },
      (reason) => {

      },
    );
  }

  setBadgets() {
    const that = this;
    $('.title-name-chat-open').each(function (index) {
      $(this).text(that.getUserTo(that.chat));
      var hue = $(this).attr('color');
      var pastel = 'hsl(' + hue + ', 100%, 75.5%)';
      $(this).nameBadge({
        border: {
          color: '#343435',
          width: 0
        },
        colors: [pastel],
        text: '#555',
        size: 46,
        margin: 5,
        middlename: true,
        uppercase: true
      });
    });
  }

  showDate(data?: any) {
    return moment().format('DD/MM/YYYY');
  }
  showHourse(hours?: any) {
    return moment().format('HH:mm');
  }

  scrollBottom() {
    $('.chat-overflow').scrollTop($('.chat-overflow')[0].scrollHeight);
  }

  initMoment(){
    return moment().locale('es').tz('Europe/Madrid');
  }

  formataMont(date: any){
    return moment(date).format('DD MMM').replace('sep.','Sep.');
  }
  formaDateChat(date: any){

    return moment(date).format('HH:mm');
  }

  formatDate(date: any){
    return moment(date).format('DD/MM/YYYY');
  }

  getUserImg(item) {

    let userImg;

    userImg = item.users.find(x => x.me == false);

    if (userImg.urlImage) {

      return userImg.urlImage;

    }

  }

  getUserImgValidate(item) {

    let userImg;

    userImg = item.users.find(x => x.me == false);

    if (userImg && userImg.urlImage && userImg.urlImage !='default.png') {

      return true;

    }

    return false;

  }

  fileChanceEvent(event:any){


    let imageError = null;

    if (event.target.files && event.target.files[0]) {

      // Size Filter Bytes
      const max_size = 3000000;

      const allowed_types = ['image/png', 'image/jpeg'];

      const max_height = 300;

      const max_width = 300;


      // si la imagen es mayor a 3b

      if (event.target.files[0].size > max_size) {

         imageError = 'Tamaño máximo permitido ' + max_size / 1000 / 1000 + 'Mb';

         this.toastService.displayWebsiteRelatedToast(imageError),

         this._translate.instant('GENERAL.ACCEPT');

         $("input[type='file']").val('');
          //this.removeImage();
        return false;
      }

      if (!_.includes(allowed_types, event.target.files[0].type)) {

         imageError = 'Formatos permitidos ( JPG | PNG )';

         this.toastService.displayWebsiteRelatedToast(imageError),

         this._translate.instant('GENERAL.ACCEPT');

         $("input[type='file']").val('');

        return false;
      }



      this.img.emit(event.target.files[0]);


      $("input[type='file']").val('');


  }

  }

  haveChat() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles()
            .find((role) => role === 1 || role === 2 || role === 14  || role === 18) !== undefined
        : false;
  }

  getUserMe(item) {

    let userMee;

    userMee = item.users.find(x => x.id ==  this.userMe.userId);

    if (userMee) {

      return true;

    } else {

      return false;

    }

  }

  getUserThird(item) {

    let $user1 = item.users[0].name + ' ' + item.users[0].surname;
    let $user2 = item.users[1].name + ' ' + item.users[1].surname;

    return $user1 + ' - ' + $user2;

  }

  getUserReject(item){

    let userMee;

    if ( item && item.usersReject) {

      userMee = item.usersReject.find(x => x.me == true);

    }

    if (userMee) {

      return true;

    } else {

      return false;

    }

  }

  isAdmin() {
    return this.authLocal.getRoles()
        ? this.authLocal
            .getRoles()
            .find((role) => role === 1 || role === 2 || role === 3 || role === 8) !== undefined
        : false;
  }


  getUserRejectChat(item){

    let existUser = false;

    if ((item && item.usersReject)) {

      if (item && item.usersReject && item.usersReject.find(x => x.id == this.userMe.userId) ) {

        existUser = true;

      }

      return existUser

    }


  }



  dataReject() {

    if ( this.chat && this.chat.usersReject) {
      const last = this.chat.usersReject.length;

      return  this.chat.usersReject[last - 1];

    } else {

       return '';

    }

  }


  getUserExit(item){

    let existUser = false;

    if ((item && item.usersReject) || item.users) {

      if (item && item.usersReject && item.usersReject.find(x => x.id == this.userMe.userId)
      || item.users.find(x => x.id == this.userMe.userId)) {

        existUser = true;

      }

      return existUser

    }

  }


}
