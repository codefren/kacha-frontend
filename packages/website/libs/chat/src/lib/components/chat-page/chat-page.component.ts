import { ChangeDetectorRef, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { BackendService, IMessage, IUser } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import Pusher, { Channel } from 'pusher-js';
import { take, timeout } from 'rxjs/operators';
import Echo from 'laravel-echo';
import { ChatTalksComponent } from '../chat-talks/chat-talks.component';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
declare var window: any;
declare var $: any;
declare function init_plugins();

window.Pusher = require('pusher-js');
@Component({
  selector: 'easyroute-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  @ViewChild('ChatTalksComponent', { static: true, read: true }) ChatTalksComponent: ChatTalksComponent;
  @ViewChild('ChatListComponent', { static: true, read: true }) ChatListComponent: ChatListComponent;
  selectList: any;
  chats: any[] = [];
  chat: any;
  selectTap: any;
  userId: number;

  getData(data: any){
    this.chat = data;

  }

  private pusher: Pusher;

  inputMessage: string;

  messages: IMessage[] = [];

  echo: Echo;

  channel: Channel;

  userList: IUser[] = [];

  auth: IUser = JSON.parse(localStorage.getItem('user'));

  constructor(private backend: BackendService,
    private changeDetect: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    private loading: LoadingService,
    private _translate: TranslateService,
    private toastService: ToastService,
    private facade: ProfileSettingsFacade) {
    this.echo = backend.getSockets();
   }

  async ngOnInit() {
    //this.loadChats();
    this.loadFilters();

    const userId = await this.facade.userId$.pipe(take(1)).toPromise();
    this.userId = userId;
    const company = JSON.parse(localStorage.getItem('company'));
    this.echo.private('channel-chat.'+ company.id + '.' + userId)
        .listen('.chat.event', ({message}) => {

          let index = this.chats.findIndex(x => x._id === message[0]._id);
          if(index === -1){
            this.chats.push(message[0]);
          } else {

            if(message[0].status === 'close'){
              this.chats[index] = message[0];
              this.chat = this.chats[index];
            } else if(message[0].status === 'reject'){
              this.chat = this.chats[0];
            } else {
              this.chats[index].messages.push(message[0]);
              if(this.chat._id === message[0]._id){
                this.chat = this.chats[index];
                setTimeout(()=>{
                  this.changeDetect.detectChanges();
                  this.scrollBottom();
                  init_plugins();
                }, 100)
              }
            }

          }
          setTimeout(()=>{
            this.changeDetect.detectChanges();
            this.setBadgets();
          }, 100)

        });

    this.echo.join(`channel-chat`)
    .here((users) => {
      this.userList = users;
    })
    .joining((user) => {
        this.userList.push(user);
    })
    .leaving((user) => {
        this.userList = this.userList.filter(async (userL) => {
          const userId = await this.facade.userId$.pipe(take(1)).toPromise();
          const company = JSON.parse(localStorage.getItem('company'));
          this.echo.private('channel-chat.'+ company.id + '.' + userId).stopListening('.chat.event');

        });
    });


  }

  async ngOnDestroy() {
    this.echo.leave('channel-chat');
    this.echo.leaveAllChannels();
   /*  const userId = await this.facade.userId$.pipe(take(1)).toPromise();
    const company = JSON.parse(localStorage.getItem('company'));
    this.echo.private('channel-chat.'+ company.id + '.' + userId).stopListening('.chat.event'); */
  }

  acceptChat(chat){
    const data = {
      _id: chat._id
    }

    this.backend.post('message/accept', data).pipe(take(1)).subscribe(({ data }) => {
      this.chat = data;
      let index = this.chats.findIndex(x => x._id === data._id);
      this.chats[index] = data;
      setTimeout(()=>{
        this.changeDetect.detectChanges();
        this.scrollBottom();
      }, 100)
    });
  }

  rejectChat(chat){

    const data = {
      _id: chat._id
    }


    this.backend.post('message/reject', data).pipe(take(1)).subscribe(({ data }) => {


      this.chat = data;

      let index = this.chats.findIndex(x => x._id === data._id);

      this.chats[index] = data;

      setTimeout(()=>{

        this.changeDetect.detectChanges();

      }, 100)

    });

  }

  assign(chat){
    const data = {
        _id: chat._id
      }

      this.backend.post('message/assign_chat', data).pipe(take(1)).subscribe(({ data }) => {

        this.chat = data;

        let index = this.chats.findIndex(x => x._id === data._id);

        this.chats[index] = data;

        setTimeout(()=>{

          this.setBadgets();
          this.changeDetect.detectChanges();

        }, 100)

      });
  }


  sendMessage(message){

    let to = this.chat.users.find(x => x.me === false);


    const sockets = this.echo.socketId();
    this.backend.postChat('message/send', sockets , {
      message,
      to: to.id,
      id: this.chat._id === 'new' ? undefined : this.chat._id,
      color: this.chat._id === 'new' ? this.chat.users[0].color : undefined
    }).pipe(take(1)).subscribe((resp: any) => {
        let search = this.chat._id  === 'new' ? 'new' : resp.data._id;
        let index = this.chats.findIndex(x => x._id === search);
        this.chats[index] =  resp.data;
        this.chat = resp.data;
        this.changeDetect.detectChanges();
        this.scrollBottom();
      });
  }

  sendUploadImg(image){

    let to = this.chat.users.find(x => x.me === false);

    let UploadImg: FormData = new FormData();

    UploadImg.append('chatImage', image, image.name);

    UploadImg.append('to', to.id);

    if (this.chat._id != 'new') {
      UploadImg.append('id', this.chat._id === 'new' ? undefined : this.chat._id);
    }

    UploadImg.append('color', this.chat._id === 'new' ? this.chat.users[0].color : undefined);



    this.loading.showLoading();

    this.backend.postFile('message/attach_image', UploadImg).pipe(take(1)).subscribe(( resp :any) => {



      let search = this.chat._id  === 'new' ? 'new' : resp.data._id;
      let index = this.chats.findIndex(x => x._id === search);
      this.chats[index] =  resp.data;
      this.chat = resp.data;
      this.changeDetect.detectChanges();
      this.scrollBottom();

      this.loading.hideLoading();

      this.toastService.displayWebsiteRelatedToast(

        'Imagen agregada satisfactoriamente.',

        this._translate.instant('GENERAL.ACCEPT'),

    );

      $("input[type='file']").val('');

    },  (error: any) => {

      $("input[type='file']").val('');

      this.loading.hideLoading();

      this.toastService.displayHTTPErrorToast(error.error.code, error.error);
  });
  }

  async loadFilters() {

    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    let filter: any = filters.find(x => x && x.name === 'chat') ? filters.find(x => x.name === 'chat') : '';

    this.loadChats(filter.values);

  }

  loadChats(filter?: any) {

    let url: string = 'chat?';

    if (filter) {
      url = url +

      (filter.dateFrom != '' ? '&dateFrom=' +
       filter.dateFrom : '') +

      (filter.dateTo != '' ? '&dateTo=' +
          filter.dateTo : '') +

      (filter.status != '' ? '&status=' +
          filter.status : '')+

      (filter.userId != '' ? '&userId=' +
          filter.userId : '');

    }

    this.backend.get(url).pipe(take(1)).subscribe(({ data }) => {

      this.chats = data;

      if (this.chats[0] && this.chats[0]._id) {

        this.chat = this.chats[0];

      } else {

        this.chat = null;
      }

      this.changeDetect.detectChanges();
    });
  }

  getEmiteChats(event: any) {

    this.loadChats(event.values)

  }

  scrollBottom(){
    $('.chat-overflow').scrollTop($('.chat-overflow')[0].scrollHeight);
  }


  selectUserToChat(event: any){

    let index = this.chats.findIndex( x => x._id === 'new');
    if(index >= 0){
      this.chats.splice(index, 1);
    }

     let chat  = this.chats.find( x => x.users.find( y => y.id === event.id) !== undefined && x.status === 'open');

     if(chat && this.isMe(this.userId)){

      this.selectTap = chat._id;
      this.getData(chat);

     } else {

      let element  ={
        users: [
          {...event,
            color: Math.floor(Math.random() * 360),
            me: false
          }],
        status: 'new',
        messages: [],
        _id: 'new'
      };

      this.chats.push(element);
      this.selectTap = element._id;
      this.getData(element);
    }

  }

  isMe(id: number) {
    return this.chat.users.find(x => x.id === id);
  }

  endChat(event){

    this.backend.delete('chat/' + event._id).pipe(take(1)).subscribe(({data})=>{

      this.chat = data;

      let index = this.chats.findIndex(x => x._id === data._id);

      this.chats[index] =  data;

      setTimeout(()=>{
        this.changeDetect.detectChanges();
        this.scrollBottom();
      }, 100)
    })

  }

  setBadgets() {
    $('.title-name-chat').each(function (index) {
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

}
