import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import * as moment from 'moment-timezone';
import { OrdersModalSearchClientComponent } from '../orders-form/orders-modal-search-client/orders-modal-search-client.component';
import { environment } from '@optimroute/env/environment';
import { take } from 'rxjs/operators';
import { Language, MomentDateFormatter, CustomDatepickerI18n } from '../../../../../shared/src/lib/util-functions/date-format';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
],
})
export class ModalFiltersComponent implements OnInit {

  @ViewChild('interval', { static: false }) interval: ElementRef<HTMLElement>;
  @ViewChild('commercialId', { static: false }) commercialId: ElementRef<HTMLElement>;
  @ViewChild('statusOrderId', { static: false }) statusOrderId: ElementRef<HTMLElement>;


  constructor(public activeModal: NgbActiveModal, 
    private authLocal: AuthLocalService,
    private _modalService: NgbModal,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private preferencesFacade: PreferencesFacade,
    private rendered2: Renderer2) { }
  agentUser: any = [];
  loading: string = 'success';
  Estatus: any = [];
  companyClient: any = [];
  clientName: any;

  filter: Filter = {
    commercialId: '',
    statusOrderId: '',
    deliveryPointId: [],
    dateFrom: '',
    dateTo: '',
    date: '',
    deliveryTomorrow:'',
    deliveryFromTomorrow:''
  };


  showIntervalFiel: boolean;

  model: any;

  model2: any;

  dateFrom: string = 'from';

  datedateTo: string = 'To';
  disabledateto: boolean = true;
  nextDay: boolean = false;
  statusFilter: any;
  dateNow: any;
  today: string;
  datemin: any;
  refreshTime: number = environment.refresh_datatable_assigned;
  dateMax: any;

  typeInterval: string = 'hoy';

  ngOnInit() {

    console.log(this.filter,' this.filter')

    if(this.filter.date != ''){
      this.typeInterval = 'hoy'
    } else if(this.filter.deliveryTomorrow != ''){
      this.typeInterval = 'mañana'
    }else if(this.filter.deliveryFromTomorrow != ''){
      this.typeInterval = 'desdeMa'
    }
     else if (this.filter.date === '' && this.filter.dateFrom === '' && this.filter.dateFrom === ''){
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

      console.log(this.model, 'model');
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
          .subtract('year', 1)
          .startOf('year')
          .format('YYYY-MM-DD hh:mm');
      
          this.datemin ={
            day: +moment(this.datemin).format('D'),
            month: +moment(this.datemin).format('M'),
            year: +moment(this.datemin).format('YYYY'),
          };

          console.log(this.datemin, 'this.datemin')
      this.initMoment();
      if (this.isAdmin() || this.isCommercialAgent()) {
          this.getAllAgentUser();
          this.getStatus();
      }

    });
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

  getAllAgentUser() {
    this.loading = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getAllagentuser().subscribe(
            (data: any) => {
                this.agentUser = data.data;

                this.loading = 'success';
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


  validateData(value: any, id: string) {

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
        this.setFilter('', 'deliveryTomorrow', false);
        this.setFilter('', 'deliveryFromTomorrow', true);
        this.model = '';
        this.model2 = '';
        this.disabledateto = true;
    } else if (value === 'hoy') {
        console.log(value, 'value')
        this.setFilter(this.getToday(), 'date', false);
        this.setFilter('', 'dateTo', false);
        this.setFilter('', 'dateFrom', true);
        this.setFilter('', 'deliveryTomorrow', false);
        this.setFilter('', 'deliveryFromTomorrow', true);
        this.model = '';
        this.model2 = '';
        this.disabledateto = true;
    } else if(value === 'mañana'){
      this.setFilter('', 'date', false);
      this.setFilter('', 'dateTo', false);
      this.setFilter('', 'dateFrom', false);
      this.setFilter(this.getToday( true ), 'deliveryTomorrow', true);
      this.setFilter('', 'deliveryFromTomorrow', true);
      this.model = '';
      this.model2 = '';
      this.disabledateto = true;
    } else if (value === 'desdeMa'){
      console.log('If desdeMa');
      this.setFilter('', 'date', false);
      this.setFilter('', 'dateTo', false);
      this.setFilter('', 'dateFrom', false);
      this.setFilter('', 'deliveryTomorrow', true);
      this.setFilter(this.getToday( true ), 'deliveryFromTomorrow', true);
      this.model = '';
      this.model2 = '';
      this.disabledateto = true;
    } else {
      this.setFilter('', 'deliveryTomorrow', false);
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

  isAdmin() {
    let value =
        this.authLocal.getRoles() !== null
            ? this.authLocal
                  .getRoles()
                  .find(
                      (role) =>
                          role === 1 ||
                          role === 2 ||
                          role === 3 ||
                          role === 8 ||
                          role === 9,
                  ) !== undefined
            : false;
    return value;
  }

  isCommercialAgent(): boolean {
    return this.authLocal.getRoles() !== null
        ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
        : false;
  }

  addclient() {
    const modal = this._modalService.open(OrdersModalSearchClientComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
    });

    modal.result.then(
        (data) => {
            if (data) {
                this.filter.deliveryPointId = data.id;

                this.clientName = data.name;

            }
        },
        (reason) => {},
    );
  }

  getStatus() {
    this.loading = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getStatus().subscribe(
            (data: any) => {
                this.statusFilter = '';

                this.Estatus = data.data;

                this.loading = 'success';
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
    this.rendered2.setProperty( this.interval.nativeElement, 'value', 'hoy' );
    this.rendered2.setProperty( this.commercialId.nativeElement, 'value', '' );
    this.rendered2.setProperty( this.statusOrderId.nativeElement, 'value', '' );

    this.model = '';
    this.model2 = '';

    this.filter = {
        commercialId: '',
        statusOrderId: '',
        deliveryPointId: [],
        dateFrom: '',
        dateTo: '',
        date: '',
        deliveryTomorrow:'',
        deliveryFromTomorrow:this.getToday(true)
    };
    
    this.showIntervalFiel = false;

    this.closeDialog();
}


}
