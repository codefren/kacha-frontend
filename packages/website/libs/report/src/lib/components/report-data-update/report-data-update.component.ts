import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { NgbDateStruct, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { dateToObject, getToday, objectToString, Language, MomentDateFormatter, CustomDatepickerI18n, getStartOf, getEndOf } from '../../../../../shared/src/lib/util-functions/date-format';
import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { take, takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { TranslateService } from '@ngx-translate/core';
import { ModalOpenClientsComponent } from './modal-open-clients/modal-open-clients.component';
import { ModalViewPdfGeneralComponent } from 'libs/shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
@Component({
  selector: 'easyroute-report-data-update',
  templateUrl: './report-data-update.component.html',
  styleUrls: ['./report-data-update.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ReportDataUpdateComponent implements OnInit {

  filter: FilterState = {
    name: 'report_data_update',
    values: {
      dateFrom: getStartOf(), //this.getToday(),
      dateTo: getEndOf(), 
      deliveryPointId:'',
      userId:'',
      deliveryZoneId:'',
      nameClient:'',
      deliveryPointUpdateStatusId:'',
      deliveryPointUpdateTypeId:''
    }
};

filters: FilterState = {
  name: 'report_data_update',
  values: {
    dateFrom: getStartOf(), //this.getToday(),
    dateTo: getEndOf(), 
    deliveryPointId:'',
    userId:'',
    deliveryZoneId:'',
    nameClient:'',
    deliveryPointUpdateStatusId:'',
    deliveryPointUpdateTypeId:''
  }
};

zones: Zone[]; 

showUser: boolean = true;

showZones: boolean = true;

min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

dateSearchFrom: FormControl = new FormControl(dateToObject(getToday()));

profile: Profile;

usersVehicles: any []=[];

showUserDriver: boolean = false;

zone: Zone[];

fromDate: NgbDateStruct | null;

toDate: NgbDateStruct | null;

hoveredDate: NgbDate | null = null;

placement = 'bottom';

deliveryPointUpdateTypeList: any [] = [];

showTypeList: boolean = false;

constructor(
  private router: Router,
  private calendar: NgbCalendar, 
  public formatter: NgbDateParserFormatter,
  private _modalService: NgbModal,
  private _translate: TranslateService,
  private _toastService: ToastService,
  private detectChange: ChangeDetectorRef,
  private stateFilters: StateFilterStateFacade,
  private stateEasyrouteService: StateEasyrouteService,
  public zoneFacade: StateDeliveryZonesFacade,
) { this.loadFilters(); }

ngOnInit() {
 
}

async loadFilters() {
  
  const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

  this.filter = filters.find(x => x && x.name === 'report_data_update') ? filters.find(x => x.name === 'report_data_update') : this.filter;

  if (this.filter.values.dateFrom && this.filter.values.dateTo) {

    this.fromDate = dateToObject(this.filter.values.dateFrom);

    this.toDate = dateToObject(this.filter.values.dateTo);
    
  } else {
    this.fromDate = dateToObject(getStartOf()); //this.calendar.getToday();
    this.toDate = dateToObject(getEndOf()); //this.calendar.getToday();
  }



  this.getZone();

}
getZone(){

  this.zoneFacade.loadAll();

  this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{

      if(loaded){

          this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
              this.zone = data.filter(x => x.isActive === true);
             
              
          });
          
      }
  })
  this.getDriver();
}

getDriver() {

  this.showUserDriver = false;

  this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
      (data: any) => {

         this.usersVehicles = data.data;

         this.showUserDriver = true;
         
     
      this.detectChange.detectChanges();

      },
      (error) => {

        this.showUserDriver = true;

          this._toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  this.getDeliveryPointType();

}

getDeliveryPointType() {

  this.showTypeList = false;

  this.stateEasyrouteService.getDeliveryPointUpdateType().pipe(take(1)).subscribe(
      (data: any) => {

      this.deliveryPointUpdateTypeList = data.data;

      this.showTypeList = true;
        
      this.detectChange.detectChanges();

      },
      (error) => {

        this.showTypeList = true;

          this._toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );

}





getToday(nextDay: boolean = false) {
  if (nextDay) {
      return moment(new Date().toISOString())
          .add(1, 'day')
          .format('YYYY-MM-DD');
  }

  return moment(new Date().toISOString()).format('YYYY-MM-DD');
}

changeFilterGeneral(event: any){

  let value = event.target.value;

  let id = event.target.id;
  
  this.setFilter(value, id, true);

}

changeYear(event: any){

  let value = event.target.value;

  let id = event.target.id;
  
  this.setFilter(value, id, true);

}


changeDate( name: string, dataEvent: NgbDate ) {

  if (name == 'from') {

    this.filter = {

      ...this.filter,

      values: {

          ...this.filter.values,

          dateDeliveryStart: objectToString( dataEvent ),
          routePlanningRouteId: ''
      }
    }

    this.stateFilters.add(this.filter);      

  

  }
  
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

  console.log(this.filter, 'setFilter paddre');
 
}

returnsList(){
  this.router.navigate(['report']);
}



/* buscar clientes */
openClient(){
  const modal = this._modalService.open(ModalOpenClientsComponent, {
    backdropClass: 'modal-backdrop-ticket',
    centered: true,
   // windowClass:'modal-donwload-User',
    size:'xl'
});

modal.componentInstance.title = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT');
modal.componentInstance.message = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT_MESSAGE');
modal.componentInstance.etiqueta = 'json';

modal.result.then(
    (data) => {
            
      if (data) {

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                deliveryPointId: data.id,
                nameClient: data.name
            },
        };
  
        this.stateFilters.add(this.filter);

        this.detectChange.detectChanges();

      }    
    },
    (reason) => {
      
    },
); 
}

/* limpiar clientes */

clearClient(){

  this.filter = {
      ...this.filter,
      values: {
          ...this.filter.values,
          deliveryPointId: '',
          nameClient: ''
      },
  };

  this.stateFilters.add(this.filter);

  this.detectChange.detectChanges();
    
}

/* date */

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
              dateTo:objectToString(date)
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


openDonwloadPdf() {

  let url ='report_data_update_download?' +

      (this.filter.values.dateFrom != '' ? '&dateFrom=' +
          this.filter.values.dateFrom : '') +

      (this.filter.values.dateTo != '' ? '&dateTo=' +
          this.filter.values.dateTo : '') +


      (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
          this.filter.values.deliveryPointId : '') +

      (this.filter.values.userId != '' ? '&userId=' +
      this.filter.values.userId : '') +

      (this.filter.values.deliveryZoneId != '' ? '&deliveryZoneId=' +
          this.filter.values.deliveryZoneId : '');
  
  const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
    
    backdropClass: 'modal-backdrop-ticket',

    centered: true,

    windowClass:'modal-view-pdf',

    size:'lg'

  });

  modal.componentInstance.title = this._translate.instant('REPORT.DATA_UPDATE');

  modal.componentInstance.url = url;

}

getData(data: any){

  console.log(data, 'filters');
    
  this.filter = data;

}

}
