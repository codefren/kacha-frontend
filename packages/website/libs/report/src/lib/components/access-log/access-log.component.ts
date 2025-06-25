import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { FilterState } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { CustomDatepickerI18n, Language, LoadingService, ModalViewPdfGeneralComponent, MomentDateFormatter, ToastService, dateToObject, getEndOf, getStartOf, objectToString } from '@optimroute/shared';
import { StateFilterStateFacade } from 'libs/filter-state/src/lib/+state/filter-state.facade';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'easyroute-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})

export class AccessLogComponent implements OnInit {

  table: any;

  filter: FilterState = {
      name: 'access_log',
      values: {
            dateFrom: getStartOf(),
            dateTo: getEndOf(),
            userId: ''
      }
  };

  timeInterval: any;

  fromDate: NgbDateStruct | null;

  toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  users: any[] = [];
  showUser: boolean = true;

  constructor(
      private router: Router,
      private _modalService: NgbModal,
      private authLocal: AuthLocalService,
      private _translate: TranslateService,
      private stateFilters: StateFilterStateFacade,
      private loadingService: LoadingService,
      private stateEasyrouteService: StateEasyrouteService,
      private toastService: ToastService,
      private calendar: NgbCalendar,
      public formatter: NgbDateParserFormatter,
      private detectChanges: ChangeDetectorRef,
  ) { }

  async ngOnInit() {

    this.fromDate = dateToObject(this.getToday());
    this.toDate = dateToObject(this.getToday());

    this.loadFilters();

  }

  getToday(nextDay: boolean = false) {
      if (nextDay) {
          return moment(new Date().toISOString())
              .add(1, 'day')
              .format('YYYY-MM-DD');
      }

      return moment(new Date().toISOString()).format('YYYY-MM-DD');
  }

  async loadFilters() {

      const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

      this.filter = filters.find(x => x.name === 'report_route') ? filters.find(x => x.name === 'report_route') : this.filter;

      /* si tienes las fechas */

      if (this.filter.values.dateFrom && this.filter.values.dateTo) {

          this.fromDate = dateToObject(this.filter.values.dateFrom);

          this.toDate = dateToObject(this.filter.values.dateTo);

      }

      this.getUsers();

  }

  /* Lista de user by company */
  getUsers() {

      this.loadingService.showLoading();

      this.showUser = false;

      this.stateEasyrouteService.getUserByCompany().pipe(take(1)).subscribe(
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

  cargar() {

      if (this.table) {
          this.table.clear(); // limpia la tabla sin destruirla
      }

      let url = environment.apiUrl + 'report_access_log_datatables?' +

          (this.filter.values.dateFrom != '' ? '&dateFrom=' +

              this.filter.values.dateFrom : '') +

          (this.filter.values.dateTo != '' ? '&dateTo=' +

              this.filter.values.dateTo : '') +

          (this.filter.values.userId != '' ? '&userId=' +

              this.filter.values.userId : '');

      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#accessLog';

      this.table = $(table).DataTable({
          destroy: true,
          processing: true,
          serverSide: true,
          stateSave: true,
          order: [5, 'desc'],
          columnDefs: [{ targets: 5, type: 'date' }],
          stateSaveParams: function (settings, data) {
              data.search.search = '';
          },
          initComplete: function (settings, data) {
              settings.oClasses.sScrollBody = '';
          },
          cache: false,
          lengthMenu: [50, 100],
          dom: `
          <'row'
              <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                  <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
              >
              <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                  <'row'
                      <'col-sm-6 col-md-6 col-xl-8 col-7 p-0 label-search'>
                      <'col-sm-6 col-md-6 col-xl-4 col-5 dt-buttons-table'>
                  >
              >
          >
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                  <'row reset align-items-center'
                      <'col-sm-6 col-md-6 col-xl-6 col-6'l>
                      <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                  >
              >
          >
          `,
          headerCallback: (thead, data, start, end, display) => {
              $('.buttons-collection').html(
                  '<img src="assets/icons/edittable.svg" class="far fa-edit">' +
                  ' ' +
                  this._translate.instant('GENERAL.SHOW/HIDE'),
              );
          },
          buttons: [
              {
                  extend: 'colvis',
                  columnText: function (dt, idx, title) {
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
                data: 'userId',
                className: 'text-aling-table',
                render: (data, type, row) => {
                   
                    return '<span class="text-center">' + data + '</span>';
                },
              },
              {
                data: 'nameUser',
                className: 'text-aling-table',
                title: this._translate.instant('GENERAL.NAME'),
                render: (data, type, row) => {
                   
                    return '<span class="text-center">' + data + '</span>';
                },
              },
              {
                data: 'surname',
                className: 'text-aling-table',
                title: this._translate.instant('GENERAL.SURNAMES'),
                render: (data, type, row) => {
                    if (data != null) {
                        return '<span class="text-center">' + data + '</span>';
                    } else {
                        return '<span class="text-center"> No disponible </span>';
                    }
                },
              },
              {
                data: 'nationalId',
                className: 'text-aling-table',
                render: (data, type, row) => {
                    if (data != null) {
                        return '<span class="text-center">' + data + '</span>';
                    } else {
                        return '<span class="text-center"> No disponible </span>';
                    }
                },
              },
              {
                data: 'email',
                className: 'text-aling-table',
                title: this._translate.instant('GENERAL.EMAIL'),
                render: (data, type, row) => {
                    return '<span class="text-center">' + data + '</span>';
                },
              },
              {
                data: 'login_at',
                className: 'text-aling-table',
                title: this._translate.instant('GENERAL.ACCESS_DATE'),
                render: (data, type, row) => {
                   
                    let date = moment(data).format('DD/MM/YYYY HH:mm')
                    
                    return '<span class="text-center">' + date + '</span>';
                  
                },
              },
          ],
      });
      $('.dataTables_filter').html(`
          <div class="d-flex justify-content-md-end justify-content-center mr-xl-2">
              <div class="input-group datatables-input-group-width mr-xl-3 mr-3">
                  <input
                      id="search"
                      type="text"
                      class="form-control search-general
                      pull-right input-personalize-datatable"
                      placeholder="Buscar"
                      style="max-width: initial;"
                  >
                  <span class="input-group-append">
                      <span class="input-group-text input-group-text-general table-append">
                          <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                      </span>
                  </span>
              </div>
          </div>
      `);

      $('#search').on('keyup', function () {
          $(table)
              .DataTable()
              .search(this.value)
              .draw();
      });

      $('.dataTables_filter').removeAttr('class');

      this.initEvents(table + ' tbody', this.table);
  }

  initEvents(tbody: any, table: any, that = this) {
      $(tbody).unbind();
      window.clearInterval(this.timeInterval);
  }

  returnsList() {
      this.router.navigate(['report']);
  }

  openModalViewPdf(){

    let url ='report_access_log_pdf?' +

      (this.filter.values.dateFrom != '' ? '&dateFrom=' +
          this.filter.values.dateFrom : '') +

      (this.filter.values.dateTo != '' ? '&dateTo=' +
          this.filter.values.dateTo : '') +

      (this.filter.values.userId != '' ? '&userId=' +
      this.filter.values.userId : '');
  
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    modal.componentInstance.title = this._translate.instant('REPORT.DOWNLOAD_ALL');

    modal.componentInstance.url = url;
  }


  // Para el manejo de la fecha
  decimal(numb) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
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
      
        this.cargar();
        
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
      
        this.cargar();
      
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
  
        this.cargar();
  
        this.toDate = null;
      
        this.fromDate = date;
      
        this.stateFilters.add(this.filter);
  
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

  ChangeFilter(event: any) {

      let value = event.target.value;

      let id = event.target.id;

      this.setFilter(value, id, true);

      //this.detectChanges.detectChanges();

  }

  setFilter(value: any, property: string, sendData?: boolean) {

      this.filter = {
          ...this.filter,
          values: {
              ...this.filter.values,
              [property]: value
          }
      }

      //this.filterDate.emit(this.filter);

      this.stateFilters.add(this.filter);

      if (sendData) {

          this.cargar();
          this.detectChanges.detectChanges();
      }
  }

}
