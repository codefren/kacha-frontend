import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import * as moment from 'moment-timezone';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PreferencesFacade } from '../../../../../state-preferences/src/lib/+state/preferences.facade';
import { WebSocketService } from '../../products.websocket';
import { Filter } from '../../../../../backend/src/lib/types/filter.type';
import { Language, MomentDateFormatter, CustomDatepickerI18n } from '../../../../../shared/src/lib/util-functions/date-format';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ConfirmModalComponent } from '../../../../../shared/src/lib/components/confirm-modal/confirm-modal.component';
import { ToDayTimePipe } from '../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
declare var $: any;

@Component({
  selector: 'easyroute-preparation-list',
  templateUrl: './preparation-list.component.html',
  styleUrls: ['./preparation-list.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
],
})
export class PreparationListComponent implements OnInit {

    @ViewChild('interval', { static: false }) interval: ElementRef<HTMLElement>;
    @ViewChild('commercialId', { static: false }) commercialId: ElementRef<HTMLElement>;
    @ViewChild('statusOrderId', { static: false }) statusOrderId: ElementRef<HTMLElement>;
    table: any;

    companyClient: any = [];

    clientName: any;

    agentUser: any = [];

    Estatus: any = [];

    showIntervalFiel: boolean;

    model: any;

    model2: any;

    dateFrom: string = 'from';

    datedateTo: string = 'To';

    loading: string = 'success';

    @Output() selectDate = new EventEmitter<any>();

    dateNow: any;

    datemin: any;

    dateMax: any;

    statusFilter: any;

    statusChangeFrom: number;

    statusChangeTo: number;

    disabledateto: boolean = true;

    EstatusTo: any = [];

    // datetime form
    today: string;

    filter: any = {
        userAsignedId: '',
        dateFrom: '',
        dateTo: '',
        date: this.getToday(),
    };

    nextDay: boolean = false;

    refreshTime: number = environment.refresh_datatable_assigned;

    timeInterval: any;

    private unsubscribe$ = new Subject<void>();

  constructor(
    private authLocal: AuthLocalService,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private Router: Router,
    private changeDetect: ChangeDetectorRef,
    private _modalService: NgbModal,
    private preferencesFacade: PreferencesFacade,
    private rendered2: Renderer2,
    private ws: WebSocketService,
    private dayTime: ToDayTimePipe,
  ) { }

  ngOnInit() {
    this.ws.connect();

    this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
        if(data){
            this.table.ajax.reload();
        }
    })
    this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((data) => {
            
   /*      this.refreshTime =
            data.refreshTime !== null && data.refreshTime > 0
                ? data.refreshTime * 1000
                : this.refreshTime; */

        // dia siguiente
        this.nextDay = data.assignedNextDay;
    
       /*  this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
        this.datemin = moment()
            .startOf('year')
            .format('YYYY-MM-DD hh:mm');
        
        this.initMoment();
        if (this.isAdmin() || this.isCommercialAgent()) {
            this.getStatus();
        }
        this.cargar(); */
    });
    this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
    this.datemin = moment()
        .startOf('year')
        .format('YYYY-MM-DD hh:mm');
    
    this.initMoment();
    if (this.isAdmin() || this.isCommercialAgent()) {
        this.getStatus();
    }
    this.cargar();
}

    initMoment() {
        moment()
            .tz('Europe/Madrid')
            .format();
        this.today = this.getToday( this.nextDay );
    }
    
    getToday( nextDay: boolean = false ) {
    
        if ( nextDay ) {
          return  moment(new Date().toISOString()).add( 1, 'day' ).format('YYYY-MM-DD');
        }
          
        return moment( new Date().toISOString() ).format('YYYY-MM-DD');
      }
      getCompanyClient() {
        this.stateEasyrouteService.getClient().subscribe(
            (resp: any) => {
                this.companyClient = resp.data;
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
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
        this.selectDate.emit(date);

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

            this.cargar();
        }
    }

    ChangeFilter(event) {
        let value = event.target.value;

        let id = event.target.id;

        this.validateData(value, id);
    }

    ChangeStatusFrom(event) {
        this.statusChangeTo = undefined;
        if (event.target.value && event.target.value > 0) {
            this.stateEasyrouteService
                .getStatusNext(event.target.value)
                .pipe(take(1))
                .subscribe(
                    (resp) => {
                        console.log(resp);
                        this.EstatusTo = resp.data;
                    },
                    (error) => {
                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
        } else {
            this.EstatusTo = [];
        }
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
            this.cargar();

            this.changeDetect.detectChanges();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.ws.sync.next(false);
        this.ws.desconnect();
        this.table.destroy();
    }

    returnProfileString(profiles: any): any {
        
        profiles.forEach((element) => {
           let profile ={
            assigned: element,
            dateAssigned: element,
            orderId: element,
            user: {
                id: element.user.id,
                name : element.user.name,
                surname: element.user
              }
            }
            return profile
        });
        /* return profile
            .map((element) => {
                return element;
            })
            .join(', '); */
    }


    cargar() {
        if ( this.table ) {
            this.table.clear(); // limpia la tabla sin destruirla
        }
    
        let url =
            environment.apiUrl +
            'order_preparation_datatables?date=' +
            this.filter.date +
            '&dateFrom=' +
            this.filter.dateFrom +
            '&dateTo=' +
            this.filter.dateTo +
            '&userAsignedId=' +
            this.filter.userAsignedId;
    
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#preparation';
        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            order:[ 5, 'desc'],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            initComplete : function (settings, data) {
                settings.oClasses.sScrollBody="";
             
            },
            cache: false,
            lengthMenu: [50, 100],
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
                <"top-button-hide"><'table-responsive't>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
                >
            `,
           /*  headerCallback: ( thead, data, start, end, display ) => {               
                $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
            }, */
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
                    data: 'company.name', 
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.STORE'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data +
                                '</span>'
                            );
                        }
                    },
                 },
                {
                    data: 'code',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.ORDER'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'orderDate',
                    title: this._translate.instant('ORDERS.ORDERS_LIST.DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'delivery_point.name',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.CLIENT'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data +
                                '</span>'
                            );
                        }
                    },
                },
    
                {
                    data: 'user_assigned',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.ASSIGNED'),
                    render: (data, type, row) => {
                        return data !== '' ? data : 'No disponible';
                    },
                },
                {
                    data: 'created_at',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.CHECK_IN_TIME'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else {
                            return (
                                '<span></span>'
                            );
                        }
                   
                    },
                },
                /* {
                    data: 'preparationStart',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.START_TIME'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" style="color:#afe24e;" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else {
                            return (
                                '<span> </span>'
                            );
                        }
                   
                    },
                }, */
                /* {
                    data: 'preparationEnd',
                    visible: true,
                    searchable: false,
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.END_TIME'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" style="color:#afe24e;" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else {
                            return (
                                '<span> </span>'
                            );
                        }
                        console.log(data)
                    },
                }, */
               /*  {
                    data: 'preparationTime',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.PREPARATION_TIME'),
                     render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data + " "+'min'+
                                '</span>'
                            );
                        }
                    },
                }, */
               
                /* {
                    data: 'ticket',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.TICKET'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<img class="icons-datatable point" src="assets/icons/optimmanage/ticket-gris.svg">';
                        } else {
                            return '<div class="text-center ticket"><img class="icons-datatable point" src="assets/icons/optimmanage/ticket.svg"></div>';
                        }
                    },
                }, */
                /* {
                    data: 'ticketTotal',
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.TICKET_COST'),
                    render: (data, type, row) => {
                        return data + ' €';
                    },
                }, */
                
              
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('PREPARATION.PREPARATION_LIST.DETAIL'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones +=
                            `<div class="text-center editar">
                              <i class="fas fa-eye point icon-eye-preparation"></i>
                            </div>`;
                            
                        return botones;
                    },
                },
            ]
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
    
        this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
    
            //that.Router.navigate(['preparation', data.id]);
            that.Router.navigate([`/orders/preparation/${data.id}`]);
            
        });
    }
    
    clearSearch() {
        
        this.rendered2.setProperty( this.interval.nativeElement, 'value', 'todas' );
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
            date: this.getToday(),
        };
        
        // this.filter.date = moment(new Date().toISOString()).format('YYYY-MM-DD');
        this.showIntervalFiel = false;
        this.cargar();
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

    changeStatus() {
        const modal = this._modalService.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message =
            this._translate.instant('ORDERS.GLOBAL_CHANGE_STATUS_1') +
            ' <b>' +
            this.Estatus.find((x) => +x.id === +this.statusChangeFrom).name +
            '</b> ' +
            this._translate.instant('ORDERS.GLOBAL_CHANGE_STATUS_2') +
            ' <b>' +
            this.EstatusTo.find((x) => +x.id === +this.statusChangeTo).name +
            '</b>?';
        modal.result.then((data) => {
            if (data) {
                this.stateEasyrouteService
                    .changeStatusGlobal(this.statusChangeFrom, this.statusChangeTo)
                    .subscribe(
                        (resp) => {
                            this.cargar();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }


    refresh() {
        this.table.ajax.reload();
    }

    filterOpen(){
        const modal = this._modalService.open(ModalFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-filter-orders'
        });
        this.filter.deliveryPointId = [];
        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                if (data) {
                    console.log(data);
                    this.filter = data;

                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    openPdf(){
        console.log('abrir descargar productos');
    }

    openImportOrders(){
        console.log('abrir importar productos');
    }

    redirectOrders(){
        this.Router.navigate(['orders/orders-list']);
    }

    redirectHistorialPreparation(){
        this.Router.navigate(['orders/historical-preparation']);
    }
    openSetting(){
        this.Router.navigateByUrl('/preferences?option=order');
    }
    
}
