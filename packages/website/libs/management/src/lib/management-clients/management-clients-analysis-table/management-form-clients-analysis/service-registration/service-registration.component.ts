import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import * as moment from 'moment-timezone';
declare var $: any;
import * as _ from 'lodash';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { dayTimeAsStringToSeconds } from '../../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getYearToToday, getYearToTodayFilter } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDayTimePipe } from '../../../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
@Component({
  selector: 'easyroute-service-registration',
  templateUrl: './service-registration.component.html',
  styleUrls: ['./service-registration.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ServiceRegistrationComponent implements OnInit {


    dateSearchFrom: FormControl = new FormControl(dateToObject(getYearToToday()));
    
    dateSearchTo: FormControl = new FormControl(dateToObject(getToday()));
    
    tableclientAnalysis: any;
    tableDriverHaveServedClientTable: any;
    
    @Input() clientAnalysis: any;
    
    @Input() idClient: any;

    @Input() filterYear: any;
    
    img: any;
    
    filter: any = {
        from: getYearToToday(),
        to: getToday(),
        userId: '',
        delayTimeOnDelivery:''
    };
    
    
    @Output('filterDate')
    filterDate: EventEmitter<any> = new EventEmitter();
    
    profile: Profile;
    unsubscribe$ = new Subject<void>();

    users: any[] = [];
    showUser: boolean = true;

    showCode: boolean = false;
    totalized: any;


    fromDate: NgbDateStruct | null;

	toDate: NgbDateStruct | null;

    hoveredDate: NgbDate | null = null;

    subtraYearDate: any = dateToObject(getYearToToday());
    

    scroll: number = 0;

    constructor(
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private Router: Router,
        private toastService: ToastService,
        private backendService: BackendService,
        private detectChanges: ChangeDetectorRef,
        public facadeProfile: ProfileSettingsFacade,
        private loadingService: LoadingService,
        private stateEasyrouteService: StateEasyrouteService,
        private calendar: NgbCalendar, 
        public formatter: NgbDateParserFormatter
    ) { }
    
  ngOnInit() { }

  ngOnChanges() {

    console.log(this.filterYear, 'filterYear Service');

    if(this.clientAnalysis){

        if (this.filterYear && this.filterYear.year) {

            this.fromDate = dateToObject(this.filterYear.year +'-01-01' );

            this.filter.from = this.filterYear.year +'-01-01';

            if (moment().format('YYYY') === this.filterYear.year) {

                this.toDate = this.calendar.getToday();

                this.filter.to = getToday();

            } else {

                this.toDate =  dateToObject(this.filterYear.year +'-12-31');

                this.filter.to = this.filterYear.year +'-12-31';
            }

        

            let data = {
            from :  this.filter.from,
            to :  this.filter.to
            }
            console.log(data, 'data emit');
            this.filterDate.emit( this.filter);
        
            
        } else {

            this.fromDate = this.subtraYearDate;

    
            this.toDate = this.calendar.getToday();
        }

       

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
    
                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {

                        console.log(data)
    
                        this.profile = data;
                    });
            }
        });

        this.initMoment();

        this.loadTotalized();

        this.moveALL();

    }

  }

    initMoment() {
        moment()
            .tz('Europe/Madrid')
            .format();
    }

   /* informacion de cuadros */
    loadTotalized() {

        this.showCode = false;
    
        this.backendService
    
            .post('delivery_point_analysis_totalized/'+ this.idClient, this.filterYear )
            .pipe(
                take(1)).subscribe(
    
                    (resp: any) => {
    
                        this.totalized = null;
    
                        this.totalized = resp;

                        this.showCode = true;
    
                        this.detectChanges.detectChanges();
                        
                        this.getUsers();
                        
    
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

    /* Lista de chofer */
    getUsers() {
    
        this.loadingService.showLoading();
    
        this.showUser = false;
    
        this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
            (data: any) => {
    
                this.users = data.data;
    
                this.showUser = true;

                this.cargarDriverHaveServedClient();

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

    /* Chóferes que han servido a este cliente */
    cargarDriverHaveServedClient() {

        if (this.tableDriverHaveServedClientTable) {
            this.tableDriverHaveServedClientTable.clear();
            this.tableDriverHaveServedClientTable.state.clear();
        }
    
        let table = '#driverHaveServedClientTable';
        
        let url = environment.apiUrl + 'driver_have_served_client_datatables/'+ this.idClient ;

        url += this.filterYear && this.filterYear.year? '?year=' +  this.filterYear.year : '';
        
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        
        this.tableDriverHaveServedClientTable = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: false,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            lengthMenu: [50, 100],
            order: [0, 'asc'],
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
                    data: 'driver_name',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DRIVER'),
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
                    data: 'totalService',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.SERVICES'),
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
                    data: 'totalDelay',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DELAY'),
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
                    data: 'averageServiceTimeClient',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.AVERAGE_SERVICE_'),
                    orderable: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTimeAlterne(data, false);
                    },
                },
                {
                    data: 'totalPrice',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.INVOICED'),
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
                                '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + this._translate.instant('GENERAL.FOR_FREE') + '</span>'
                            );
                        }
        
                    },
                }
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
        this.editar('#driverHaveServedClientTable tbody', this.tableclientAnalysis);
        
    }

    /* Cargar tabla Registro de servicios */
    cargar() {

        if (this.tableclientAnalysis) {
            this.tableclientAnalysis.clear();
            this.tableclientAnalysis.state.clear();
        }
    
        let table = '#clientAnalysisTable';
        
        let url = environment.apiUrl + 'delivery_point_analysis_datatables/'+ this.idClient;
        
        url += this.filter.from ? '?from=' +  this.filter.from : '';
        
        url += this.filter.to ? '&to=' +  this.filter.to : '';
        
        url += this.filter.userId ? '&userId=' +  this.filter.userId : '';
        
        url += this.filter.delayTimeOnDelivery ? '&delayTimeOnDelivery=' +  this.filter.delayTimeOnDelivery : '';

        //url += this.filterYear && this.filterYear.year? '&year=' +  this.filterYear.year : '';
        
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        
        this.tableclientAnalysis = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: false,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            lengthMenu: [50, 100],
            order: [0, 'asc'],
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
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DATE'),
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
                    data: 'driverArrivalTime',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.HOUR'),
                    render: (data, type, row) => {
        
        
                        let arrivalTime = dayTimeAsStringToSeconds(
                            moment(data).format('HH:mm'),
                        );
        
        
                        if (arrivalTime < 0)
                            return data ? moment(data).format('HH:mm') : '';
        
                        let varClass = '';
        
        
                        if (
                            arrivalTime < row.deliveryWindowStart
                        ) {
                            varClass = 'blue';
                        }
        
                        if (arrivalTime > row.deliveryWindowEnd) {
                            varClass = 'red';
                        }
        
                        if (arrivalTime > row.deliveryWindowStart && arrivalTime < row.deliveryWindowEnd) {
                            varClass = 'green'
                        }
        
                        if (varClass.length > 0) {
                            return (
                                '<span>' +moment(data).format('HH:mm') +'</span>'
                            );
                        } else {
                            return data ? moment(data).format('HH:mm') : '';
                        }
                    },
        
                },
                {
                    data: 'driver_name',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DRIVER'),
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
                    data: 'delayTimeOnDelivery',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.DELIVERY'),
                    render: (data, type, row) => {
                        if (data) {
                            return (
                                '<span class="font-retras" data-toggle="tooltip" data-placement="top">' + this._translate.instant('GENERAL.LATE') + '</span>'
                            );
        
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" >' + this._translate.instant('GENERAL.ON_TIME') +'</span>'
                            );
                        }
                    },
                },
                {
                    data: 'serviceTimeClient',
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.SERVICE'),
                    orderable: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTimeAlterne(data, false);
                    },
                },
               
                {
                    data: 'cost',
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
                                '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + this._translate.instant('GENERAL.FOR_FREE') + '</span>'
                            );
                        }
        
                    },
                },
                {
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
                },
                {
                    data: 'porcentageLogistic',
                    visible: this.validateCost(),
                    title: this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.LOGISTICS_PERCENTAGE'),
                    render: (data, type, row) => {
                        
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' + this.formatLogist(data) + ' %</span>'
                        );
        
                    },
                },
                {
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
                }
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
        this.editar('#clientAnalysisTable tbody', this.tableclientAnalysis);
        
    }

    dateFormat(data: any) {
        return secondsToAbsoluteTimeAlterne(data, false);
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
    
    validateModuleBill(){
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 11)) {

            return true;

        } else {

            return false;
        }
    }

    editar(tbody: any, table: any, that = this) {
    
      $(tbody).unbind();
    
      $(tbody).on('click', '.editar', function() {
    
          let data = table.row($(this).parents('tr')).data();
          
          that.Router.navigate([`/travel-tracking/${data.routeId}/details/${data.routePlanningRouteDeliveryPointId}/analysis-client`]);
    
      });
    }

    returnsHour(date: any){
        if (date) {
          return moment(date).format('HH:mm');
        } else {
          return '----'
        }
    }

    decimal(numb) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
    }

    formatLogist(quantity) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);
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

            this.filterDate.emit(this.filter);
        
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
        
        this.filterDate.emit(this.filter);
        
        if (sendData) {
        
            this.loadTotalized();
        
            this.detectChanges.detectChanges();
        }
    }

    moveToLeft(){

        this.scroll = this.scroll - 350 <= 0 ? 0 : this.scroll - 350;
    
        console.log(this.scroll, 'tamañano');
    
        $( "#scroller" ).scrollLeft( this.scroll );
      }
      
      moveToRight(){
        
        var scroll = $("#scroller" ).get(0).scrollWidth;
        
    
        if (this.scroll <= 800) {
    
            this.scroll = this.scroll + 300 >= scroll ? scroll : this.scroll + 300;
            
        } else {
            return
            
        }
    
    
        $( "#scroller" ).scrollLeft( this.scroll );
       
    
    
        
      }
    
      moveALL(){
    
        const slider: any = document.querySelector('.items');
    
    
        let isDown = false;
    
        let startX :   any;
    
        let scrollLeft : any;
    
        slider.addEventListener('mousedown', (e: any) => {
    
            isDown = true;
    
            slider.classList.add('active');
    
            startX = e.pageX - slider.offsetLeft;
    
            scrollLeft = slider.scrollLeft;
    
          });
    
          slider.addEventListener('mouseleave', () => {
    
            isDown = false;
    
            slider.classList.remove('active');
    
          });
    
          slider.addEventListener('mouseup', () => {
    
            isDown = false;
    
            slider.classList.remove('active');
    
          });
    
          slider.addEventListener('mousemove', (e: any) => {
    
    
            if(!isDown) return;
    
            e.preventDefault();
    
            const x = e.pageX - slider.offsetLeft;
    
            const walk = (x - startX) * 3; //scroll-fast
    
            slider.scrollLeft = scrollLeft - walk;
    
            
          });
      }

}
