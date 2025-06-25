import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import * as moment from 'moment-timezone';
import { environment } from '@optimroute/env/environment';
import { take } from 'rxjs/operators';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})
export class ModalFiltersComponent implements OnInit {

  @ViewChild('userAsignedId', { static: false }) userAsignedId: ElementRef<HTMLElement>;

  constructor(
    public activeModal: NgbActiveModal, 
    private preferencesFacade: PreferencesFacade,
    private stateUsersService: StateUsersService,
    private rendered2: Renderer2,
    private _toastService: ToastService
  ) { }

  loading: string = 'success';
  preparer: any = [];

  filter: any = {
    userAsignedId: '',
    dateFrom: '',
    dateTo: '',
    date: this.getToday(),
  };

  showIntervalFiel: boolean;

  model: any;
  model2: any;

  dateFrom: string = 'from';
  datedateTo: string = 'To';
  disabledateto: boolean = true;
  nextDay: boolean = false;
  dateNow: any;
  today: string;
  datemin: any;
  refreshTime: number = environment.refresh_datatable_assigned;
  dateMax: any;

  typeInterval: string = 'hoy';

  ngOnInit() {

    if(this.filter.date != ''){
      this.typeInterval = 'hoy'
    } else if (this.filter.date === '' && this.filter.dateFrom === '' && this.filter.dateFrom === ''){
      this.typeInterval = 'todas'
    } else {
      this.typeInterval = 'por fecha'
      this.showIntervalFiel = true;
      this.disabledateto = false;
      this.model = {
        day: +moment(this.filter.dateFrom).format('D'),
        month: +moment(this.filter.dateFrom).format('M'),
        year: +moment(this.filter.dateFrom).format('YYYY'),
      };
      this.model2 = {
        day: +moment(this.filter.dateTo).format('D'),
        month: +moment(this.filter.dateTo).format('M'),
        year: +moment(this.filter.dateTo).format('YYYY'),
      };

      console.log(this.model2);
    }
    
    this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((data) => {
                
      this.refreshTime =
          data.refreshTime !== null && data.refreshTime > 0
              ? data.refreshTime * 1000
              : this.refreshTime;

      // dia siguiente
      this.nextDay = data.assignedNextDay;
  
      this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
      this.datemin = moment()
          .startOf('year')
          .format('YYYY-MM-DD hh:mm');
      
      this.initMoment();

    });

    this.getPreparer()
  }

  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
    this.today = this.getToday( this.nextDay );
}

  closeDialog() {
    this.activeModal.close(this.filter);
  }

  ChangeFilter(event) {
    let value = event.target.value;

    let id = event.target.id;

    this.validateData(value, id);
  }

  validateData(value: any, id: string) {
    console.log(value, id);
    if (id === 'interval') {
        this.checkInterval(value);
    } else if (id === 'dateFrom' || id === 'dateTo') {
        //this.checkDateInterval( value, id );
    } else {
        this.setFilter(value, id, true);
    }
  }

  checkInterval(value: any) {
    if (value === 'todas') {
        this.setFilter('', 'date', false);
        this.setFilter('', 'dateTo', false);
        this.setFilter('', 'dateFrom', true);
        this.model = '';
        this.model2 = '';
        this.disabledateto = true;
    } else if (value === 'hoy') {
        this.setFilter(this.getToday( this.nextDay ), 'date', false);
        this.setFilter('', 'dateTo', false);
        this.setFilter('', 'dateFrom', true);
        this.model = '';
        this.model2 = '';
        this.disabledateto = true;
    } else {
        this.setFilter('', 'date', false);
    }

    this.showInterval(value);
  }

  getToday( nextDay: boolean = false ) {

    if ( nextDay ) {
      return  moment(new Date().toISOString()).add( 1, 'day' ).format('YYYY-MM-DD');
    }
      
    return moment( new Date().toISOString() ).format('YYYY-MM-DD');
  }

  showInterval(value: string) {
    if (value === 'por fecha') {
        this.showIntervalFiel = true;
    } else {
        this.showIntervalFiel = false;
    }
  }

  setFilter(value: any, property: string, sendData?: boolean) {
      this.filter[property] = value;

      if (sendData) {
          // this.cargar();
      }
  }

  getDate(date: any, name: any) {
    if (name == 'from') {
        this.disabledateto = false;

        this.dateMax = date;

        this.filter.dateFrom = moment(
            `${date.year}-${date.month
                .toString()
                .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
        ).format('YYYY-MM-DD');
    } else {
        this.filter.dateTo = moment(
            `${date.year}-${date.month
                .toString()
                .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
        ).format('YYYY-MM-DD');
    }
  }

  clearSearch() {
    this.rendered2.setProperty( this.userAsignedId.nativeElement, 'value', '' );

    this.model = '';
    this.model2 = '';

    this.filter = {
      userAsignedId: '',
      dateFrom: '',
      dateTo: '',
      date: this.getToday(),
    };

    this.closeDialog();
  }

  getPreparer() {
    this.loading = 'loading';

    setTimeout(() => {
        this.stateUsersService.getUsersPreparer().subscribe(
            (data: any) => {

              this.loading = 'success';

              this.preparer = data.data;

            },
            (error) => {
                this.loading = 'error';

                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }


}
