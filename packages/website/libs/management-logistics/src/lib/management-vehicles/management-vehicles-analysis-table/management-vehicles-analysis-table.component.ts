import { ModalViewPdfGeneralComponent } from './../../../../../shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, FilterState, Profile } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { DurationPipe, ToastService, objectToString, dateToObject, getStartOf, getEndOf, getToday } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment-timezone';

declare var $: any;


@Component({
  selector: 'easyroute-management-vehicles-analysis-table',
  templateUrl: './management-vehicles-analysis-table.component.html',
  styleUrls: ['./management-vehicles-analysis-table.component.scss']
})
export class ManagementVehiclesAnalysisTableComponent implements OnInit {
  
  table: any;
  timeInterval: any;

  refreshTime: number = environment.refresh_datatable_assigned;

  filter: FilterState = {
      name: 'vehicle_analysis',
      values: {
          isActive: 'true',
          //dateFrom: getToday(), //this.getToday(),
          //dateTo: getToday(), //this.getToday(),
      },
  };

  profile: Profile;
  unsubscribe$ = new Subject<void>();

  change: string = 'vehicle-analysis';

  showCode: boolean = false;
  totalizedDate: any;

  /* hoveredDate: NgbDate | null = null;
    fromDate: NgbDateStruct | null;
	toDate: NgbDateStruct | null; */

  constructor(
    private router: Router,
    private _modalService: NgbModal,
    private backend: BackendService,
    private _translate: TranslateService,

    public authLocal: AuthLocalService,
    private durationPipe: DurationPipe,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    private facadeProfile: ProfileSettingsFacade,
    public zoneFacade: StateDeliveryZonesFacade,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
  ) { }

  ngOnInit() {

      /* this.fromDate = dateToObject(getToday());
      this.toDate = dateToObject(getToday()); */

      this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {

        if (loaded) {

            this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data) => {

                this.profile = data;

                const filters = await this.stateFilters.filters$
                    .pipe(take(1))
                    .toPromise();

                this.filter = filters.find((x) => x.name === 'vehicle_analysis')
                    ? filters.find((x) => x.name === 'vehicle_analysis')
                    : this.filter;

                /* if (this.filter.values.dateFrom && this.filter.values.dateTo) {

                    this.fromDate = dateToObject(this.filter.values.dateFrom);
            
                    this.toDate = dateToObject(this.filter.values.dateTo);
                }  */

                this.loadTotalizedDate();

                this.detectChanges.detectChanges();

            });
        }
    });
    
  }

  /* informacion de cuadros */
  loadTotalizedDate() {

    this.showCode = false;

    this.backend
        .post('vehicle_analysis_totalized', this.filter.values )
        .pipe(
            take(1)).subscribe(
    
                (resp: any) => {
    
                    this.totalizedDate = null;
    
                    this.totalizedDate = resp;
    
                    this.showCode = true;

                    try {
                        this.cargar();

                        this.editar('#vehicleAnalysis tbody', this.table);
    
                        this.detectChanges.detectChanges();
                    } catch (error) {
                        
                    }
                    
                   

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

  ngOnDestroy(): void {
    this.table.destroy();
  }

  redirectTo(){
    this.router.navigate(['management-logistics/vehicles']);
  }

  openPdf() {

    let url = 'vehicle_analysis_pdf?' +

    /* (this.filter.values.dateFrom != '' ? '&dateFrom=' +
        this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') + */

    (this.filter.values.isActive != '' ? '&isActive=' +
        this.filter.values.isActive : '');

    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
  
        backdropClass: 'modal-backdrop-ticket',
    
        centered: true,
    
        windowClass:'modal-view-pdf',
    
        size:'lg'
    
      });

  
      modal.componentInstance.url = url;
  
      modal.componentInstance.title = this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.VEHICLES_ANALYSIS');
  }
  
  openCsv() {
      
    let url ='vehicle_analysis_excel?' +

    /* (this.filter.values.dateFrom != '' ? '&dateFrom=' +
     this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') + */
    
    (this.filter.values.isActive != '' ? '&isActive=' +
        this.filter.values.isActive : '');
    
    return this.backend.getAnalysisClientList(url).then((data: string)=>{ })
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
  
    }
    this.detectChanges.detectChanges();
  }

  decimal(numb) {

    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numb);
   
  }


  cargar() {
    if (this.table) {
        this.table.clear();
        this.table.state.clear();
    }

    let url =  environment.apiUrl + 'vehicle_analysis_datatables?' +

    /* (this.filter.values.dateFrom != '' ? '&dateFrom=' +
        this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') + */

    (this.filter.values.isActive != '' ? '&isActive=' +
        this.filter.values.isActive : '');


    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#vehiclesAnalysis';
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
              <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                  <'row reset align-items-center'
                      <'col-sm-6 col-md-6 col-xl-6 col-6 p-xl-0'l>
                      <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                  >
              >
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
              data: 'isActive',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.STATUS'),
              render: (data, type, row) => {
                let status = data ? 'Activo': 'Inactivo';
                return (
                    '<span data-toggle="tooltip" data-placement="top">' +
                      status +
                    '</span>'
                );
              },
              
            },
            {
              data: 'name',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.NAME'),
            },
            {
              data: 'registration',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.REGISTRATION'),
            },
            {
              data: 'driver',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.ASSIGNED_DRIVER'),
              render: (data, type, row) => {
                  if (data == null || data == 0) {
                      return '<span class="text center" aria-hidden="true"> No disponible</span>';
                  } else {
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +'">' + data +'</span>'
                      );
                  }
              },
            },
            {
              data: 'exit',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.DEPARTURES'),
            },
            /* {
              data: 'km',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.KM'),
              render: (data, type, row) => {
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    this.formatUnidadKm(data) +
                    '">' +
                    this.formatUnidadKm(data) +
                    '</span>'
                );
              },
            }, */
            {
              data: 'refueling',
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.REFUELING'),
              render: (data, type, row) => {

                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    data +
                    '">' +
                    data +
                    '</span>'
                );
                
              },
            },
            {
              data: 'cost',
              visible: this.validateCost(),
              title: this._translate.instant('VEHICLES.VEHICLES_ANALYSIS.COST'),
              render: (data, type, row) => {
               
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' + this.formatEuro(data) + '">' + this.formatEuro(data) + '</span>'
                );
               /*  if (data) {
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
                } */
              },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                //title: this._translate.instant('GENERAL.ACTIONS'),
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
          that.router.navigate([`management-logistics/vehicles/analysis/${data.id}`]);
      });
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

  // Para la fecha
  /* getToday(nextDay: boolean = false) {
    if (nextDay) {
        return moment(new Date().toISOString())
            .add(1, 'day')
            .format('YYYY-MM-DD');
    }

    return moment(new Date().toISOString()).format('YYYY-MM-DD');
  } */
  
  /* onDateSelection(date: NgbDate) {
  
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
    
          this.loadTotalizedDate();
    
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
  } */
  
  /* validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {
    
      const parsed = this.formatter.parse(input);
    
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    
  } */
  
  formatUnidadKm(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity) + ' ' + 'km';
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

  }
  
}
