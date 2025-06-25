import { dateToObject, ModalViewPdfGeneralComponent, objectToString } from '@optimroute/shared';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import * as _ from 'lodash';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { DurationPipe } from '../../../../../shared/src/lib/pipes/duration.pipe';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { NavigationExtras, Router } from '@angular/router';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { take } from 'rxjs/operators';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { Profile } from '@optimroute/backend';
import { Subject } from 'rxjs';
import * as moment from 'moment-timezone';

declare var $: any;




@Component({
  selector: 'easyroute-management-clients-analysis-table',
  templateUrl: './management-clients-analysis-table.component.html',
  styleUrls: ['./management-clients-analysis-table.component.scss']
})
export class ManagementClientsAnalysisTableComponent implements OnInit {

  table: any;
    timeInterval: any;

    refreshTime: number = environment.refresh_datatable_assigned;

    filter: FilterState = {
        name: 'analysis',
        values: {
            deliveryZoneId: '',
            filter:'',
            year:''
        },
    };

    change: string = 'analysis';

    zones: Zone[];

    profile: Profile;
    unsubscribe$ = new Subject<void>();

    showCode: boolean = false;
    totalizedDate: any;

    showZones: boolean = true;

    hoveredDate: NgbDate | null = null;
	fromDate: NgbDateStruct | null;
	toDate: NgbDateStruct | null;

    years: number[] = [];

    constructor(
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private backend: BackendService,
        private durationPipe: DurationPipe,
        private toastService: ToastService,
        private _modalService: NgbModal,
        private router: Router,
        private detectChanges: ChangeDetectorRef,
        private stateFilters: StateFilterStateFacade,
        private facadeProfile: ProfileSettingsFacade,
        public zoneFacade: StateDeliveryZonesFacade,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter
    ) { }

    ngOnInit() {

        this.fromDate = this.calendar.getToday();
    	this.toDate = this.calendar.getToday();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {

            if (loaded) {

                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data) => {

                    this.profile = data;

                    const filters = await this.stateFilters.filters$
                        .pipe(take(1))
                        .toPromise();

                    this.filter = filters.find((x) => x.name === 'analysis')
                        ? filters.find((x) => x.name === 'analysis')
                        : this.filter;

                    /* if (this.filter.values.dateFrom && this.filter.values.dateTo) {

                        this.fromDate = dateToObject(this.filter.values.dateFrom);

                        this.toDate = dateToObject(this.filter.values.dateTo);
                    } 
 */
                    this.detectChanges.detectChanges();

                    this.backend.timeoutToken().subscribe(
                        (data) => {

                            this.getZone();

                        },
                        (error) => {
                            this.backend.Logout();
                        },
                    );
                });
            }
        });

        const year = +moment().format('YYYY');

        console.log(year);
    
        for (let index = year - 4; index <= year; index++) {
          this.years.push(index);
          
        }

        console.log(this.years, 'años lleno');
    }

    ngOnDestroy(): void {
      this.table.destroy();
    }

    openPdf() {
        const modal = this._modalService.open( ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass:'modal-view-pdf',

            size:'lg'

          });

          let url = 'delivery_point_analysis_pdf';

          url += this.filter.values.year ? '?year=' + this.filter.values.year : '';
/* 
          url += this.filter.values.dateFrom ? '?dateFrom=' + this.filter.values.dateFrom : '';

          url += this.filter.values.dateTo ? '&dateTo=' + this.filter.values.dateTo : '';

          url += this.filter.values.deliveryZoneId ? '&deliveryZoneId=' + this.filter.values.deliveryZoneId : ''; */

          modal.componentInstance.url = url;

          modal.componentInstance.title = this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.CUSTOMER_ANALYSIS');
    }

    openCsv() {

        let url ='delivery_point_analysis_excel?' +

        (this.filter.values.year != '' ? '&year=' +
        this.filter.values.year : '');

       /*  (this.filter.values.dateFrom != '' ? '&dateFrom=' +
        this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
            this.filter.values.dateTo : '') +

            (this.filter.values.filter != '' ? '&filter=' +
            this.filter.values.filter : '') +

        (this.filter.values.deliveryZoneId != '' ? '&deliveryZoneId=' +
        this.filter.values.deliveryZoneId : ''); */


        return this.backend.getAnalysisClientList(url).then((data: string)=>{ })
    }

    getZone(){
        this.zoneFacade.loadAll();
        this.loadTotalizedDate()
        this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{



            if(loaded) {
                this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
                    this.zones = data.filter(x => x.isActive === true);
                });
            }
        })
    }

    /* informacion de cuadros */
    loadTotalizedDate() {

        this.showCode = false;

        this.backend
            .post('delivery_point_analysis_totalized', {year: this.filter.values.year} )
            .pipe(
                take(1)).subscribe(

                    (resp: any) => {

                        this.totalizedDate = null;

                        this.totalizedDate = resp;

                        this.showCode = true;

                        this.cargar();
                        
                        this.editar('#clientsAnalysis tbody', this.table);

                        this.detectChanges.detectChanges();

                    },
                    (error) => {
                        this.showCode = true;

                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
    }

    cargar() {
        if (this.table) {
            this.table.clear();
            this.table.state.clear();
        }

        let url =  environment.apiUrl + 'delivery_point_analysis_datatables?' +

        (this.filter.values.year != '' ? '&year=' +
        this.filter.values.year : '');


       /*  (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
            this.filter.values.dateTo : '') +

            (this.filter.values.filter != '' ? '&filter=' +
            this.filter.values.filter : '') +

        (this.filter.values.deliveryZoneId != '' ? '&deliveryZoneId=' +
            this.filter.values.deliveryZoneId : ''); */

      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#clientsAnalysis';
      this.table = $(table).DataTable({
          destroy: true,
          serverSide: true,
          processing: true,
          stateSave: false,
          cache: false,
          paging: true,
          stateSaveParams: function(settings, data) {
              data.search.search = '';
          },
          lengthMenu: [50, 100],
          ajax: {
              method: 'GET',
              url: url,
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: tok,
              },
              error: (xhr, error, thrown) => {
                  let html = '<div class="container" style="padding: 10px;">';
                  html +=
                      '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                  html +=
                      '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                  html += '</div>';

                  $('#clients_processing').html(html);

                  $('#refrescar').click(() => {
                      this.cargar();
                  });
              },
          },
          dom: `
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
              <"top-button-hide"><t>
              <'row reset'
              <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'p>
          >
          `,
          headerCallback: (thead, data, start, end, display) => {
              $('.buttons-collection').html(
                  '<i class="far fa-edit"></i>' +
                      ' ' +
                      this._translate.instant('GENERAL.SHOW/HIDE'),
              );
          },
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
          columns: [
              {
                data: 'id',
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.CODE'),
              },
              {
                  data: 'typology_name',
                  sortable: true,
                  //searchable: false,
                  title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.TYPOLOGY'),
                  className: 'dt-body-center',
                  render: (data, type, row) => {
                    let botones = '';

                    if (data != null) {

                        botones += `
                            <div class="text-center">
                                ${data}
                            </div>
                        `;

                    } else {
                        botones += `
                        <div class="text-center">
                        </div>
                        `;
                    }

                    return botones;
                },
              },
              {
                  data: 'name',
                  title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.CLIENT'),
                  render: (data, type, row) => {
                      let id = data;
                      if (id.length > 30) {
                          id = id.substr(0, 29) + '...';
                      }
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          id +
                          '</span>'
                      );
                  },
              },
              {
                  data: 'address',
                  title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.ADDRESS'),
                  render: (data, type, row) => {
                      let id = data;
                      if (id.length > 30) {
                          id = id.substr(0, 29) + '...';
                      }
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          id +
                          '</span>'
                      );
                  },
              },
              {
                data: 'delivered',
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DELIVERIES'),
              },
              {
                data: 'avgServiceTime',
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.AVERAGE_DOWNLOAD'),
                render: (data, type, row) => {

                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        this.durationPipe.transform(data) +
                        '">' +
                        this.durationPipe.transform(data) +
                        '</span>'
                    );

                },
              },
              {
                data: 'totalCost',
                visible: this.validateCost(),
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.COST'),
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
                            '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + '' + '</span>'
                        );
                    }

                },
              },
              {
                  data: 'total_bill',
                  title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.INVOICE'),
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
                            '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + '' + '</span>'
                        );
                    }

                },
              },
              {
                data: 'avgPorcentageLogistic',
                visible: this.validateCost(),
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.LOGISTICS_PERCENTAGE'),
                render: (data, type, row) => {

                    if (data != 0 || data != '') {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' + this.formatLogist(data) + ' %</span>'
                        );
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + '' + '</span>'
                        );
                    }

                },
              },
              /* {
                data: 'id',
                title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.REPERCUSSION'),
                render: (data, type, row) => {

                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '"> 13 %</span>'
                    );

                },
              }, */
              {
                  data: null,
                  sortable: false,
                  searchable: false,
                  title: this._translate.instant('GENERAL.ACTIONS'),
                  className: 'dt-body-center',
                  render: () => {
                      let botones = '';
                      botones += `<div class="text-center editar">
                              <img class="point" src="assets/icons/External_Link.svg">
                          </div>`;
                      return botones;
                  },
              },
          ],
      });
      $('.dataTables_filter').html(`
          <div class="row p-0 p-0 justify-content-sm-end justify-content-center">
            <div class="input-group datatables-input-group-width mr-xl-2">
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

      this.initEvents(table + ' tbody', this.table);
    }

    validateCost(){
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

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.timeInterval = window.setInterval(() => {
            this.table.ajax.reload();
        }, this.refreshTime);
        this.editar(tbody, table);

    }

    editar(tbody: any, table: any, that = this) {

        $(tbody).on('click', 'div.editar', function() {

            let data = table.row($(this).parents('tr')).data();

            const navigationExtras: NavigationExtras = {

                state: {

                    year: that.filter.values.year,

                    
                }
            };
    
            that.router.navigate([`/management/clients/analysis/${data.id}`], navigationExtras);
        });
    }

    ChangeFilter(event) {
        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);
    }

    setFilter(value: any, property: string, sendData?: boolean) {
      this.filter = {
          ...this.filter,
          values: {
              ...this.filter.values,
              [property]: value,
          },
      };


      this.stateFilters.add(this.filter);

      if (sendData) {
          this.loadTotalizedDate();

          //this.detectChanges.detectChanges();
      }
      this.detectChanges.detectChanges();
    }

    decimal(numb) {

        //return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numb);

    }

    formatLogist(quantity) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);

    }

    getToday(nextDay: boolean = false) {
        if (nextDay) {
            return moment(new Date().toISOString())
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }

        return moment(new Date().toISOString()).format('YYYY-MM-DD');
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

            this.loadTotalizedDate();

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

            this.loadTotalizedDate();

            this.stateFilters.add(this.filter);

        } else {

            this.filter = {
                ...this.filter,
                values: {
                    ...this.filter.values,
                    dateFrom: objectToString(date),
                    dateTo:objectToString(null)
                }
            }

            //this.loadTotalizedDate();

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

    redirectTo(){
        this.router.navigate(['management/clients']);
    }

}
