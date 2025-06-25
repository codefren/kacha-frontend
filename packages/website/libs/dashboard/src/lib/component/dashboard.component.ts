import { getToday } from '@optimroute/shared';
import { Component, OnInit, ChangeDetectorRef, OnChanges, } from '@angular/core';
import { Language, MomentDateFormatter, CustomDatepickerI18n, objectToString, dateToObject } from '../../../../shared/src/lib/util-functions/date-format';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { WebSocketService } from '../dashboard.websocket';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StateEasyrouteService } from '../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../shared/src/lib/services/toast.service';
import { AuthLocalService } from '../../../../auth-local/src/lib/auth-local.service';
declare var $: any;
@Component({
  selector: 'easyroute-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class DashboardComponent implements OnInit, OnChanges {

  change = {
    route: 'route',
    cost: 'cost',
    sales: 'sales'
  };

  default = 'route';

  from: string = getToday();
  //date: string = getToday();
  date: string = getToday();

  updateNumber = 0;

  dateSearchFrom: FormControl = new FormControl(dateToObject(getToday()));

  dateSearchTo: FormControl = new FormControl(dateToObject(getToday()));

  commercialUser: any = [];

  loadingUserList: string = 'success';

  commercialId: number = null;


  filterSelect: string = 'week';

  value: string = 'week';
  
  private unsubscribe$ = new Subject<void>();

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct | null = null;

  dateFrom: string = null;

  dateTo: string = null;



  constructor(
    private detectChanges: ChangeDetectorRef,
    private ws: WebSocketService,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    public authLocal: AuthLocalService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
  ) { }

  ngOnInit() {
   
    this.updateNumber = 0;
    this.ws.connect();

        this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
            if (data) {
                this.updateNumber += 1;
                this.detectChanges.detectChanges();
            }
        });

       
        //this.getUserCommercial();
       // console.log(this.validateDirector(), 'valicion de DIrector')
  }

  ngOnChanges() {
  
  }

  changePage(name: string) {

    this.default = this.change[name];

    if (this.default ==='route') {
      //console.log('if si es route')
     this.date = getToday();

     this.dateSearchFrom.setValue(dateToObject(this.date));

    } else{
     
     //console.log('else si es route')

     this.getUserCommercial();

     this.date = null;

     this.dateSearchFrom.setValue(null);
    
    }

    this.detectChanges.detectChanges();

  }

  changeDate(name: string, dataEvent: NgbDate) {

    if (name == 'date') {

      this.from = objectToString(dataEvent);

      this.date = this.from;

      this.filterSelect = null;

      this.dateFrom = null;

      this.dateTo = null;
      
             
       //this.value ='';


      this.detectChanges.detectChanges();
    }

  }


  lessDate() {
   
    if (this.default ==='sales' &&  !this.date) {
      this.date = getToday();
    }

    this.filterSelect = null;

    this.date = moment(this.date).subtract(1,'d').format('YYYY-MM-DD');

    this.dateSearchFrom.setValue(dateToObject(this.date));

    this.detectChanges.detectChanges();
  }
  addDate() {

    if (this.default ==='sales' &&  !this.date) {

      this.date = getToday();

    }

    this.filterSelect = null;
    
    this.date = moment(this.date).add(1,'d').format('YYYY-MM-DD');

    this.dateSearchFrom.setValue(dateToObject(this.date));

    this.detectChanges.detectChanges();

  }

  getUserCommercial() {
    this.loadingUserList = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getAllagentuser().pipe(take(1)).subscribe(
            (data: any) => {
                this.loadingUserList = 'success';
                this.commercialUser = data.data;
            },
            (error) => {

                this.loadingUserList = 'error';
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }

  getAll(event: any) {
  
    
    switch (event) {

        case "week":


           
            this.filterSelect = 'week';

            this.value ='week';

            this.date = null;
            
            this.dateFrom = null;

            this.dateTo = null;

            this.fromDate = null;
            
            this.toDate = null;

            this.dateSearchFrom.setValue(null);

            //this.detectChanges.detectChanges();
            break;

        case "month":

            this.filterSelect = 'month';

            this.value ='month';

            this.date = null;

            this.dateFrom = null;

            this.dateTo = null;

            this.fromDate = null;
            
            this.toDate = null;

            this.dateSearchFrom.setValue(null);
            //this.detectChanges.detectChanges();
            break;

        case "day":

            this.filterSelect = 'day';

            this.value ='day';
      
            this.date = null;

            this.dateFrom = null;

            this.dateTo = null;

            this.fromDate = null;

            this.toDate = null;

            this.dateSearchFrom.setValue(null);
           
            //this.detectChanges.detectChanges();

            break;

            case 'null':

              this.filterSelect = '';
             
              this.value ='day';
             
              break;

            case "":

              this.filterSelect = '';
             
              this.value ='';
             
              break;

      
        default:
            break;
    }

    //this.load();

  }

  selectComercial(event: any){
  
    this.commercialId = event;

    //this.date = null;

  }

  validateDirector(){
    return this.authLocal.getRoles()
    ? this.authLocal
        .getRoles()
        .find((role) => role === 9 || role === 1 || role === 2 || role === 10) !== undefined
    : false;
  }

  validateAgenteCommercial(){
    return this.authLocal.getRoles()
    ? this.authLocal
        .getRoles()
        .find((role) =>  role === 9 || role === 1 || role === 2 ) !== undefined
    : false;
  }


  onDateSelection(date: NgbDate , ngbDatepicker: any) {


      if (!this.fromDate && !this.toDate) {

        this.fromDate = date;

        if (this.filterSelect ==='week') {

          this.selectWeek(date);

        } else {

          this.selectMonth(date);

        }

        ngbDatepicker.close();

      } else if (this.fromDate && this.toDate ) {

        this.toDate = date;

        if (this.filterSelect ==='week') {
          this.selectWeek(date);
        } else {
          this.selectMonth(date);
        }
        
        ngbDatepicker.close();

      } else {

        
        this.dateTo = null;

        this.toDate = null;

        this.fromDate = null;

        //this.filterSelect = null;

        this.dateFrom = null;

        this.fromDate = date;
      }
    
    
  }

  /* select dia ubica el dia y el ultimo de esa semana */

  selectWeek(date: NgbDate){
    
    let startWeek = moment(objectToString(date)).startOf('isoWeek');

    let endWeek = moment(objectToString(date)).endOf('isoWeek');

    this.dateFrom = startWeek.format('YYYY-MM-DD');

    this.dateTo = endWeek.format('YYYY-MM-DD');

    this.fromDate = {
      year: +startWeek.format('YYYY'),
      month: +startWeek.format('MM'),
      day: +startWeek.format('DD')
    };

    this.toDate = dateToObject(this.dateTo);
  }

  /* ubica el mes si selecciona cualquier dia manda el 1 y el ultimo */
  selectMonth(date: NgbDate){
    
    let startWeek = moment(objectToString(date)).startOf('month');

    let endWeek = moment(objectToString(date)).endOf('month');

    this.dateFrom = startWeek.format('YYYY-MM-DD');

    this.dateTo = endWeek.format('YYYY-MM-DD');

    this.fromDate = {
      year: +startWeek.format('YYYY'),
      month: +startWeek.format('MM'),
      day: +startWeek.format('DD')
    };

    this.toDate = dateToObject(this.dateTo);
  }
 

  isHovered(date: NgbDate) {
    
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { 
    
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
   }

  isRange(date: NgbDate) {
   
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  

}
