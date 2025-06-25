import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getEndOf, getStartOf } from '../../../../../shared/src/lib/util-functions/date-format';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { take, takeUntil } from 'rxjs/operators';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { Router } from '@angular/router';
import { BackendService, Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalViewPdfGeneralComponent } from '@optimroute/shared';
@Component({
  selector: 'easyroute-report-cost-effectiveness',
  templateUrl: './report-cost-effectiveness.component.html',
  styleUrls: ['./report-cost-effectiveness.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ReportCostEffectivenessComponent implements OnInit {

    filter: FilterState = {
      name: 'report_cost',
      values: {
        deliveryZoneId: '',
        //year: '',
        dateFrom: getStartOf(), //this.getToday(),
        dateTo: getEndOf(), 
      }
  };

  zones: Zone[]; 

  showUser: boolean = true;

  showZones: boolean = true;

  min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

  fromDate: NgbDateStruct | null = dateToObject(moment(getStartOf()).format('YYYY-MM-DD'));

  toDate: NgbDateStruct | null = dateToObject(moment(getEndOf()).format('YYYY-MM-DD'));

  hoveredDate: NgbDate | null = null;


  dateSearchFrom: FormControl = new FormControl(dateToObject(getToday()));

  profile: Profile;
  unsubscribe$ = new Subject<void>();
  placement = 'bottom';
  constructor(
    private router: Router,
    private detectChange: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    private stateRoutePlanningService: StateRoutePlanningService,
    private facadeProfile: ProfileSettingsFacade,
    private _translate: TranslateService,
    private _modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private backend: BackendService
  ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }
    });

    this.getAssigned();
  }

  getAssigned() {

    this.showZones = false;

    this.backend.post('route_planning/route/assigned_by_range', this.filter.values)
      .pipe(take(1))
        .subscribe((data) => {

            this.zones = data.data;

            this.showZones = true;

            this.detectChange.detectChanges();

        });
  }

  getToday(nextDay: boolean = false) {
    if (nextDay) {
        return moment(new Date().toISOString())
            .add(1, 'day')
            .format('YYYY-MM-DD');
    }

    return moment(new Date().toISOString()).format('YYYY-MM-DD');
  }

  changeroutePlanningRouteId(event: any){
  
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
            deliveryZoneId: ''
        }
      }

      this.stateFilters.add(this.filter);      

      this.getAssigned();

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
   
  }

  returnsList(){
    this.router.navigate(['report']);
  }

  moduleCost(){
    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {

        return true;
        
    } else {

        return false;

    }
  }

  openDonwloadPdf() {

    let url ='report_productivity_download?' +
    
    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
      this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') +
        
    (this.filter.values.deliveryZoneId != '' ? '&deliveryZoneId=' +
        this.filter.values.deliveryZoneId : '');
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });
  
    modal.componentInstance.title = this._translate.instant('REPORT.COST_EFFECTIVENESS.REPORT_COST_EFFECTIVENESS');
  
    modal.componentInstance.url = url;
  
  }

  validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {

    const parsed = this.formatter.parse(input);
  
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  
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
                deliveryZoneId: '',
                dateTo: objectToString(date),
            }
        
        }
      
      
        this.stateFilters.add(this.filter);
  
    } else {
  
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                deliveryZoneId: '',
                dateFrom: objectToString(date),
                dateTo:objectToString(null)
            }
        }
  
  
        this.toDate = null;
      
        this.fromDate = date;
      
        this.stateFilters.add(this.filter);
  
    }

    this.getAssigned();
  }
  
  

}
