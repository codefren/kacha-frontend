import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as momentTimezone from 'moment-timezone';
import * as moment from 'moment-timezone';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})
export class ModalFiltersComponent implements OnInit {
  
  @ViewChild('integrationSessionTypeId', { static: false }) integrationId: ElementRef<HTMLElement>;
  @ViewChild('interval', { static: false }) interval: ElementRef<HTMLElement>;
  @ViewChild('favorites', { static: false }) favorites: ElementRef<HTMLElement>;

  model: any;
  model2: any;
  dateFrom: string = 'from';
  datedateTo: string = 'To';
  dateNow: NgbDateStruct;
  datemin: any;
  dateMax: any;
  disabledateto: boolean = true;
  showIntervalFiel: boolean;
  typeInterval: string = 'todas';
  today: string;

  filter: {
    integrationSessionTypeId: string,
    dateFrom: string,
    dateTo: string,
    date: string,
    favorites: 'true' | 'false' | ''
  } = {
      integrationSessionTypeId: '',
      dateFrom: '',
      dateTo: '',
      date: '',
      favorites: ''
  };

  constructor(
    public activeModal: NgbActiveModal, 
    private rendered2: Renderer2,
    private changeDetect: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    let _now = momentTimezone(new Date()).toObject();
    this.dateNow = {
        year: _now.years,
        month: _now.months + 1,
        day: _now.date,
    };
    this.datemin = {
        year: 2019,
        month: 1,
        day: 1,
    };

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

    }

    this.initMoment();
  }

  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
    this.today = this.getToday();
  }

  ChangeFilter(event) {
    let value = event.target.value;

    let id = event.target.id;

    this.validateData(value, id);
  }
  
  validateData(value: any, id: string) {
    if (id === 'interval') {
      this.checkInterval(value);

    } else {
      this.setFilter(value, id, true);
    
    }
  }

  checkInterval(value: any) {
        
    if (value === 'todas') {
      this.setFilter('', 'commercialId', false);
      this.setFilter('', 'date', false);
      this.setFilter('', 'dateTo', false);
      this.setFilter('', 'dateFrom', true);
      this.model = '';
      this.model2 = '';
      this.disabledateto = true;
    
    } else if (value === 'hoy') {
      this.setFilter(this.getToday(), 'date', false);
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
  
  setFilter(value: any, property: string, sendData?: boolean) {
      
      this.filter[property] = value;
      
      if (sendData) {
          this.changeDetect.detectChanges();
      }
  }

  showInterval(value: string) {
    if (value === 'por fecha') {
        this.showIntervalFiel = true;
    } else {
        this.showIntervalFiel = false;
    }
  }
  
  getToday() {
      return moment().format('YYYY-MM-DD');
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

    // documentacion de rendered2: https://angular.io/api/core/Renderer2
    // api de angular que manipula los objetos dom de forma segura.
    this.rendered2.setProperty( this.interval.nativeElement, 'value', 'todas' );
    this.rendered2.setProperty( this.integrationId.nativeElement, 'value', '' );
    this.rendered2.setProperty( this.favorites.nativeElement, 'value', '' );

    this.model = '';
    this.model2 = '';
    
    this.filter = {
        integrationSessionTypeId: '',
        dateFrom: '',
        dateTo: '',
        date: '',
        favorites: ''
    };

    this.showIntervalFiel = false;

    this.closeDialog();
  }

  closeDialog() {
    this.activeModal.close(this.filter);
  }

}
