import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BackendService, FilterState } from '@optimroute/backend';
import { take, filter } from 'rxjs/operators';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { TranslateService } from '@ngx-translate/core';
import { CustomDatepickerI18n, Language, MomentDateFormatter, dateToObject, getEndOf, getStartOf, objectToString } from '../../../../../shared/src/lib/util-functions/date-format';
import { LoadingService, ModalOpenClientsComponent, ToastService } from '@optimroute/shared';
import { Router } from '@angular/router';
import * as moment from 'moment';
declare var $: any;


@Component({
  selector: 'easyroute-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class ChatListComponent implements OnInit, OnChanges {

  @Input('selectTap') selectTap: any;

  selectTapDataUser: any = 0;

  @Output('selectList') selectList = new EventEmitter<any>();

  @Output('userSelect') userSelect = new EventEmitter<any>();

  @Output('filters') filters = new EventEmitter<any>();

  selectFilter: boolean = false;

  filter: FilterState = {
    name: 'chat',
    values: {
      dateFrom: getStartOf(),
      dateTo: getEndOf(),
      status: '',
      userId: '',
    }
  };

  fromDate: NgbDateStruct | null;

  toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  selectDateUser: boolean = false;

  @Input('chats') chats: any[];

  userAgendFilter: any = [];

  chatFilter : any;

  userChatList: any[];

  totalUser: number = 0;




  constructor(
    private calendar: NgbCalendar,
    private toastService: ToastService,
    public detectChange: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    public zoneFacade: StateDeliveryZonesFacade,
    public formatter: NgbDateParserFormatter,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private router: Router,
  ) { }


  trackByItems(index: number, item: any): number{
    return item.id
  }

  ngOnInit() {

    this.loadFilters();

  }


  ngOnChanges(changes: SimpleChanges) {
    setTimeout(()=>{
      this.detectChange.detectChanges();
      this.setBadgets();
    }, 100);

    this.chatFilter = this.chats;

  }

  async loadFilters() {

    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'chat') ? filters.find(x => x.name === 'chat') : this.filter;

    if (this.filter.values.dateFrom && this.filter.values.dateTo) {

      this.fromDate = dateToObject(this.filter.values.dateFrom);

      this.toDate = dateToObject(this.filter.values.dateTo);

    } else {

      this.fromDate = dateToObject(getStartOf()); //this.calendar.getToday();

      this.toDate = dateToObject(getEndOf()); //this.calendar.getToday();

    }

    this.setUserChatList();

  }

  setUserChatList() {
    setTimeout(() => {
        this.backendService
            .get('users_rol_chat_list')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.userChatList = data;
                    this.detectChange.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error,
                        error.error.error,
                    );
                },
            );
    }, 500);
  }

  lastMessage(item) {
    const last = item.messages.length;

    return item.messages[last - 1];
  }

  getUserTo(item) {

    let user;
    user = item.users.find(x => x.isDrive == true)

    if(user && user.name){
        return user.name + ' ' + user.surname;
      } else {
        return '';
    }
  }

  getUserThird(item) {

    let $user1 = item.users[0].name + ' ' + item.users[0].surname;
    let $user2 = item.users[1].name + ' ' + item.users[1].surname;

    return $user1 + ' - ' + $user2;

  }

  getUserMe(item) {

    let userMee;

    userMee = item.users.find(x => x.me == true);

    if (userMee) {

      return true;

    } else {

      return false;
    }

  }

  getUserColor(item) {

    let user;
    if  (item.status && item.status === 'request'){

      user = item.users.find(x => x.from == true);
    } else {

      user = item.users.find(x => x.me == false)
    }

    return user.color;


  }

  getUserImg(item) {

    let userImg;

    userImg = item.users.find(x => x.me == false);

    if ( userImg.urlImage) {

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

  changeChat(event: any) {

    if(event._id != 'new'){
      let index = this.chats.findIndex(x => x._id === 'new');
      if(index > -1) this.chats.splice(index, 1);
    }


    this.selectTap = event._id;

    this.selectList.emit(event);

    this.detectChange.detectChanges();

  }

  changeChatDatauser(event: any) {
    this.selectTapDataUser = event.id;
    this.selectTap = event.id;
    this.selectList.emit(event);

    this.detectChange.detectChanges();

  }

  selectUserToChat(event: any){

    this.selectChatFilterDateUser(true);

    event.from = true;

    this.userSelect.emit(event);

  }

  selectChatFilter(value: boolean) {

    this.selectFilter = !value;

    setTimeout(()=>{
      this.detectChange.detectChanges();
      this.setBadgets();
    }, 100);

  }

  /* Para las fechas */

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {

      this.fromDate = date;

      this.filter = {
        ...this.filter,
        values: {
          ...this.filter.values,
          dateFrom: objectToString(date),
        }
      }

      this.stateFilters.add(this.filter);


    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {

      this.toDate = date;

      this.filter = {
        ...this.filter,
        values: {
          ...this.filter.values,
          dateTo: objectToString(date),
        }

      }

      this.stateFilters.add(this.filter);

    } else {

      this.filter = {
        ...this.filter,
        values: {
          ...this.filter.values,
          dateFrom: objectToString(date),
          dateTo: objectToString(date)
        }
      }


      this.toDate = null;

      this.fromDate = date;

      this.stateFilters.add(this.filter);

    }
  }

  isHovered(date: NgbDate) {

    return (

      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)

    );

  }

  isInside(date: NgbDate) {

    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);

  }

  isRange(date: NgbDate) {

    return (

      date.equals(this.fromDate) ||

      (this.toDate && date.equals(this.toDate)) ||

      this.isInside(date) ||

      this.isHovered(date)

    );
  }

  validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {

    const parsed = this.formatter.parse(input);

    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;

  }

  /* Fin para las fechas */



  changeFilterGeneral(event: any) {

    let value = event.target.value;

    let name = event.target.name;

    this.setFilter(value, name, true);

  }

  setFilter(value: any, property: string, sendData?: boolean) {

    this.filter = {
      ...this.filter,
      values: {
        ...this.filter.values,
        [property]: value
      }
    }

    this.stateFilters.add(this.filter);

    this.applyFilter(this.filter);

  }

  selectChatFilterDateUser(value: boolean) {

    if (this.selectFilter) return

    this.selectDateUser = !value;

    if (this.selectDateUser) this.getUserChatList('');

    if(!this.selectDateUser) setTimeout(()=>{
      this.setBadgets();
    }, 100);

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

  scrollBottom(){
    $('.chat-overflow').scrollTop($('.chat-overflow')[0].scrollHeight);
  }


  //Agenda de user chofer

  getUserChatList(search) {

    this.loadingService.showLoading();

    const url = 'users_rol_chat_list' + ( search !== '' ? '?searchName=' + search : '' );

    this.backendService.get(url).pipe(take(1)).subscribe(({data}) => {

      this.convertToAgend(data);

      this.detectChange.detectChanges();

      this.loadingService.hideLoading();

    }, error => {

      this.loadingService.hideLoading();
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
  }

  diffHours(datetime){

    return moment().diff(moment(datetime), 'd');
  }

  convertToAgend(users: any) {

    const array: any = [];

    this.totalUser = 0;

    users.forEach((user: any) => {
      if(! user.me ) {

        if (array.find(x => x.initial === user.name.substr(0, 1).toUpperCase())) {

          array.find(x => x.initial === user.name.substr(0, 1).toUpperCase()).users.push(user);

        } else {

          array.push({
            initial: user.name.substr(0, 1).toUpperCase(),
            users: [user]
          });

        }

        this.totalUser += 1;

      }

    });

    this.userAgendFilter = array;

  }

  searchChatUser(filter: any) {


    if (filter && filter.trim() !== '' && filter.length > 2) {

      this.getUserChatList(filter);

    } else if (filter.trim() == '') {

      this.getUserChatList('');

    }

  }

  // Filtro de chat por opción buscar
  filterUser(filter:any) {


    if (filter && filter.trim() !== '' && filter.length > 2) {

      this.chatFilter = this.chats.filter((item) => {

        return item.users.find((user) => {

          const name = user.name + ' ' + user.surname;

          if (name.toLowerCase().includes(filter)) {
            return true;
          } else {
            return false;
          }

        }) !== undefined;

      });

      setTimeout(()=>{
        this.setBadgets();
      }, 100);

    } else {

      this.chatFilter = this.chats;

      setTimeout(()=>{
        this.setBadgets();
      }, 100);

    }

  }

  applyFilter(filter: any) {

    this.filters.emit(filter);

    this.selectFilter = false;
    this.selectDateUser = false;

    //this.chatFilter = this.chats;

  }


  clearSearch() {

    this.filter = {
      ...this.filter,
      values: {
        ...this.filter.values,
        dateFrom: getStartOf(),
        dateTo: getEndOf(),
        status: '',
        userId: '',
      }

    }

    this.stateFilters.add(this.filter);

    this.loadFilters();

    this.applyFilter(this.filter);

    this.selectFilter = false;
    this.selectDateUser = false;

  }

  openSetting() {

    //this.router.navigate(['chat/settings']);

    this.router.navigateByUrl('/preferences?option=chatStorage');
  }

}
