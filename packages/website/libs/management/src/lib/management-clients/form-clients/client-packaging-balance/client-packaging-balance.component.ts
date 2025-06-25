import { ToastService } from './../../../../../../shared/src/lib/services/toast.service';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangeBoxesComponent } from './modal-change-boxes/modal-change-boxes.component';
import { CustomDatepickerI18n, Language, MomentDateFormatter, dateToObject, getToday, getYearToToday, objectToString } from 'libs/shared/src/lib/util-functions/date-format';
import { FormControl } from '@angular/forms';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { LoadingService } from '@optimroute/shared';
declare var $: any;
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '@optimroute/auth-local';
import { dayTimeAsStringToSeconds } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { Point } from 'libs/backend/src/lib/types/point.type';
@Component({
  selector: 'easyroute-client-packaging-balance',
  templateUrl: './client-packaging-balance.component.html',
  styleUrls: ['./client-packaging-balance.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ClientPackagingBalanceComponent implements OnInit, OnChanges {

  @Input() idParam: any;

  @Input('point') point: Point;

  dateSearchFrom: FormControl = new FormControl(dateToObject(getYearToToday()));
    
  dateSearchTo: FormControl = new FormControl(dateToObject(getToday()));

  fromDate: NgbDateStruct | null;

	toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  subtraYearDate: any = dateToObject(getYearToToday());

  filter: any = {
    from: getYearToToday(),
    to: getToday(),
    userId: '',
    delayTimeOnDelivery:''
  };

  users: any[] = [];

  showUser: boolean = true;

  tableclientAnalysisPackaging: any;

  constructor(
    private _modalService: NgbModal,
    private calendar: NgbCalendar, 
    private toastService: ToastService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef,
    public formatter: NgbDateParserFormatter,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
   
  }

  ngOnChanges() {

    this.fromDate = this.subtraYearDate;

    
    this.toDate = this.calendar.getToday();

    this.initMoment();

    this.getUsers();
    
  }
  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
  }
  

  getUsers() {
    
    this.loadingService.showLoading();

    this.showUser = false;

    this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
        (data: any) => {

            this.users = data.data;

            this.showUser = true;

            this.cargar();

            this.loadingService.hideLoading();

        },
        (error) => {

          this.showUser = true;

            this.loadingService.hideLoading();

            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

}

  openModalEnva(){
  
    const modal = this._modalService.open(ModalChangeBoxesComponent, {
      backdropClass: 'modal-backdrop-ticket',
      windowClass:'modal-view-Roadmap',
      size:'md',
      backdrop: 'static'
    });
    
    modal.componentInstance.actions ='new';

    modal.componentInstance.id= this.idParam;

    modal.componentInstance.pendingContainers = this.point.pendingContainers;

    modal.result.then(
      (data) => {
       
        if (data[0]) {

            this.point.pendingContainers = data[1];

            this.detectChanges.detectChanges();
      
        }
      },
      (reason) => {
      },
    ); 

  }

  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
    
        this.fromDate = date;
        this.filter.from = objectToString( date );
        
        this.cargar();
    
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
    
        this.toDate = date;
        this.filter.to = objectToString( date );
        
        this.cargar();
    
    } else {
    
        this.filter.from = objectToString( date );

        this.filter.to = objectToString( date );

        this.toDate = null;
        
        this.fromDate = date;
        
    }
    
}

validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {
  
    const parsed = this.formatter.parse(input);
  
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  
}

isRange(date: NgbDate) {
  
    return (
  
      date.equals(this.fromDate) ||
  
      (this.toDate && date.equals(this.toDate)) ||
  
      this.isInside(date) ||
  
      this.isHovered(date)
  
    );
}

isHovered(date: NgbDate) {
  
    return (
  
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
  
    );
  
}

isInside(date: NgbDate) {
  
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  
}

 /* Cargar tabla Registro de servicios */
 cargar() {

  if (this.tableclientAnalysisPackaging) {
      this.tableclientAnalysisPackaging.clear();
      this.tableclientAnalysisPackaging.state.clear();
  }

  let table = '#clientAnalysisTablePackaging';
  
  let url = environment.apiUrl + 'delivery_point_analysis_datatables/'+ this.idParam;
  
  url += this.filter.from ? '?from=' +  this.filter.from : '';
  
  url += this.filter.to ? '&to=' +  this.filter.to : '';
  
  url += this.filter.userId ? '&userId=' +  this.filter.userId : '';
  
  let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
  
  this.tableclientAnalysisPackaging = $(table).DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: false,
      cache: false,
      stateSaveParams: function (settings, data) {
          data.search.search = "";
      },
      lengthMenu: [50, 100],
      order: [0, 'desc'],
      dom: `
          <'row'
              <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'>
              <'col-sm-4 col-lg-2 col-12 label-search'>
          >
          <'row p-0 reset'
              <'offset-sm-6 offset-lg-6 offset-5'>
              <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
          >
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
          >
      `,
      buttons: [
          {
              extend: 'colvis',
              text: this._translate.instant('GENERAL.SHOW/HIDE'),
              columnText: function(dt, idx, title) {
                  return title;
              },
          },
      ],
      language: environment.DataTableEspaniol,
      ajax: {
          method: 'GET',
          url: url,
          headers: {
              'Content-Type': 'application/json',
              Authorization: tok,
          },
          error: (xhr, error, thrown) => {
              let html = '<div class="container" style="padding: 30px;">';
              html +=
                  '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
              html +=
                  '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
              html += '</div>';
  
              $('#companies_processing').html(html);
  
              $('#refrescar').click(() => {
                  this.cargar();
              });
          },
      },
      columns: [
          {
              data: 'signatureTime',
              title: this._translate.instant('PACKAGING_BALANCE.TRAVEL_DATE'),
              render: (data, type, row) => {
                  if(data){
  
                  return moment(data).format('DD/MM/YYYY');
                  } else {
                  return (
                      '<span data-toggle="tooltip" data-placement="top" title="' +
                      data +
                      '">' +
                      name +
                      '</span>'
                  );
                  }
  
  
              },
          },
          {
            data: 'driver_name',
            title: this._translate.instant('PACKAGING_BALANCE.DRIVERS'), 
            render: (data, type, row) => {
                let name = data;
                if (name.length > 30) {
                    name = name.substr(0, 29) + '...';
                }
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    data +
                    '">' +
                    name +
                    '</span>'
                );
            },
        },
          {
              data: 'devolutionBoxes',
              title: this._translate.instant('PACKAGING_BALANCE.CONTAINERS_DELIVERED'),
              render: (data, type, row) => {
  
                return (
                    '<span class="" data-toggle="tooltip" data-placement="top">' + data + '</span>'
                );

              },
  
          },
          {
              data: 'deliveredBoxes',
              title: this._translate.instant('PACKAGING_BALANCE.COLLECTED_PACKAGIND'),
              render: (data, type, row) => {
                return (
                    '<span class="" data-toggle="tooltip" data-placement="top">' + data + '</span>'
                );
  
              },
          },
          /* {
              data: 'serviceTimeClient',
              title: this._translate.instant('PACKAGING_BALANCE.BALANCE'),
              orderable: false,
              render: (data, type, row) => {
                return (
                    '<span class="" data-toggle="tooltip" data-placement="top">' + '20' + '</span>'
                );
              },
          }, */
         
       
         /*  {
              data: 'totalprice',
              title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.BILLING'),
              render: (data, type, row) => {
  
                  if (data) {
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          this.decimal(data) +
                          '</span>'
                      );
                  } else {
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + this._translate.instant('GENERAL.WITHOUT_DELIVERY_NOTE') + '</span>'
                      );
                  }
  
              },
          }, */
         /*  {
              data: null,
              sortable: false,
              searchable: false,
              orderable:false,
              title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DETAIL'),
                  render: (data, type, row) => {
                      let botones = '';
                      botones += `
                              <div class="text-center editar">
                                  <img class="point" src="assets/icons/External_Link.svg">
                              </div>
                          `;
  
                      return botones;
                  },
          } */
      ],
  
  });
  
  $('.dataTables_filter').html(`
      <div class="row p-0 justify-content-sm-end justify-content-center">
          <div class="input-group">
              <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
              <span class="input-group-append">
                  <span class="input-group-text table-append">
                      <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                  </span>
              </span>
          </div>
      </div>
  `);
  $('#search').on('keyup', function() {
      $(table)
          .DataTable()
          .search(this.value)
          .draw();
  });
  
  $('.dataTables_filter').removeAttr('class');
  //this.editar('#clientAnalysisTablePackaging tbody', this.tableclientAnalysis);
  
}

decimal(numb) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
}

ChangeFilter(event: any) {
    
  let value = event.target.value;

  let id = event.target.id;

  this.setFilter(value, id, true);
}

setFilter(value: any, property: string, sendData?: boolean) {

  this.filter = {
      ...this.filter,
  
          ...this.filter,
          [property]: value,
  
  };
  
  //this.filterDate.emit(this.filter);
  
  if (sendData) {
  
      this.cargar();
  
      this.detectChanges.detectChanges();
  }
}

}
