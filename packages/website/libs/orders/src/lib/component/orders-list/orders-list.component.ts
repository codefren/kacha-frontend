import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    Renderer2,
    ViewChild,
    ElementRef,
} from '@angular/core';
import * as moment from 'moment-timezone';
import {
    NgbDateStruct,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '@optimroute/backend';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
} from '../../../../../shared/src/lib/util-functions/date-format';
import { environment } from '@optimroute/env/environment';
import { OrdersModalSearchClientComponent } from '../orders-form/orders-modal-search-client/orders-modal-search-client.component';
import { ModalPrintOrdersComponent } from './modal-print-orders/modal-print-orders.component';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmModalComponent } from '../orders-form/confirm-modal/confirm-modal.component';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { WebSocketService } from '../../products.websocket';
import { Subject } from 'rxjs';
import { ModalFiltersComponent } from '../modal-filters/modal-filters.component';
declare var $: any;

@Component({
    selector: 'easyroute-orders-list',
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class OrdersListComponent implements OnInit {
    @ViewChild('interval', { static: false }) interval: ElementRef<HTMLElement>;
    @ViewChild('commercialId', { static: false }) commercialId: ElementRef<HTMLElement>;
    @ViewChild('statusOrderId', { static: false }) statusOrderId: ElementRef<HTMLElement>;

    table: any;

    companyClient: any = [];

    clientName: any;

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

    filter: Filter = {
        commercialId: '',
        statusOrderId: '',
        deliveryPointId: [],
        dateFrom: '',
        dateTo: '',
        date: '',
        deliveryTomorrow:'',
        deliveryFromTomorrow: this.getToday(true)
    };

    nextDay: boolean = false;

    refreshTime: number = environment.refresh_datatable_assigned;

    timeInterval: any;

    showInfoDetail: boolean = true;

    informativeOrderSummary: any;

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
    ) {}

    ngOnInit() {
        this.ws.connect();

        this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            if (data) {
                this.table.ajax.reload();
                this.getResument();
            }
        });
        this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((data) => {
            /* this.refreshTime =
                data.refreshTime !== null && data.refreshTime > 0
                    ? data.refreshTime * 1000
                    : this.refreshTime; */

            // dia siguiente
            this.nextDay = data.assignedNextDay;

            /* this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
            this.datemin = moment()
                .startOf('year')
                .format('YYYY-MM-DD hh:mm');
            
            this.initMoment();
            if (this.isAdmin() || this.isCommercialAgent()) {
                this.getStatus();
            }
            this.cargar(); */
        });
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
        this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
        this.datemin = moment()
            .startOf('year')
            .format('YYYY-MM-DD hh:mm');

        this.initMoment();
        if (this.isAdmin() || this.isCommercialAgent()) {
            this.getStatus();
        }
        this.getResument();
        this.cargar();
    }

    initMoment() {
        moment()
            .tz('Europe/Madrid')
            .format();
        this.today = this.getToday(this.nextDay);
    }

    getToday(nextDay: boolean = false) {
        if (nextDay) {
            return moment(new Date().toISOString())
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }

        return moment(new Date().toISOString()).format('YYYY-MM-DD');
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

    filterOpen() {
        const modal = this._modalService.open(ModalFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-filter-orders',
        });
        this.filter.deliveryPointId = [];
        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                if (data) {
                    console.log(data, 'order.filter');
                    this.filter = data;
                    this.getResument();
                    this.cargar();
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
            this.setFilter(this.getToday(this.nextDay), 'date', false);
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
            let profile = {
                assigned: element,
                dateAssigned: element,
                orderId: element,
                user: {
                    id: element.user.id,
                    name: element.user.name,
                    surname: element.user,
                },
            };
            return profile;
        });
        /* return profile
            .map((element) => {
                return element;
            })
            .join(', '); */
    }

    cargar() {
        if (this.table) {
            this.table.clear(); // limpia la tabla sin destruirla
        }

        console.log(this.filter);

        let url =
            environment.apiUrl +
            'order_datatables?date=' +
            this.filter.date +
            '&dateFrom=' +
            this.filter.dateFrom +
            '&dateTo=' +
            this.filter.dateTo +
            '&deliveryPointId=' +
            this.filter.deliveryPointId +
            '&deliveryTomorrow=' +
            this.filter.deliveryTomorrow +
            '&commercialId=' +
            this.filter.commercialId +
            '&deliveryFromTomorrow='+
            this.filter.deliveryFromTomorrow +
            '&statusOrderId=' +
            this.filter.statusOrderId;

        console.log(url);
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#orders';
        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            order: [4, 'desc'],
            columnDefs: [{ targets: 5, type: 'date' }],
            stateSaveParams: function(settings, data) {
                data.search.search = '';
            },
            initComplete: function(settings, data) {
                settings.oClasses.sScrollBody = '';
            },
            cache: false,
            lengthMenu: [50, 100],
            dom: `
                <'row'
                    <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                    <'col-sm-3 col-md-2 col-xl-1 col-12'
                        <'row p-0 justify-content-md-end justify-content-center'B>
                    >
                >
                <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
                <"top-button-hide"><t>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
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
                    data: 'created_by_user',
                    title: this._translate.instant('COMPANIES.CREATED_BY'),
                    render: (data, type, row) => {
                        return data !== '' ? data : 'No disponible';
                    },
                },
                {
                    data: 'user_seller',
                    title: 'Asignado',
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                { data: 'code', title: this._translate.instant('ORDERS.ORDERS_LIST.CODE') },
                {
                    data: 'delivery_point.name',
                    title: this._translate.instant('ORDERS.ORDERS_LIST.CLIENTS'),
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
                    data: 'created_at',
                    title: this._translate.instant('COMPANIES.CREATED_AT'),
                    render: (data, type, row) => {
                        return moment(new Date(data)).format('DD/MM/YYYY HH:mm:ss');
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
                    data: 'observations',
                    visible: false,
                    title: this._translate.instant('ORDERS.ORDERS_FORM.OBSERVATIONS'),
                    render: (data, type, row) => {
                        let description = data;
                        if (description != null && description.length > 80) {
                            description = description.substr(0, 79) + '...';
                        } else {
                            return data !== null ? data : 'No disponible';
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            description +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'status_order.name',
                    title: this._translate.instant('GENERAL.STATE_ORDER'),
                    render: (data, type, row) => {
                        let varClass = '';

                        if (data === 'Entregada') {
                            varClass = 'green';
                        }

                        if (data === 'Asignado') {
                            varClass = '';
                        }

                        return (
                            '<div class="text-center warning ' +
                            varClass +
                            '">' +
                            data +
                            '</div>'
                        );
                    },
                },
                {
                    data: 'status_preparation',
                    visible: true,
                    searchable: false,
                    title: this._translate.instant('ORDERS.ORDERS_LIST.STATUS_PREPARATOR'),
                    render: (data, type, row) => {
                        // console.log( data );
                        if (!data) {
                            return '<span class="text-center">no disponible</span>';
                        }

                        return `<span class="text-center">${data.name}</span>`;
                    },
                },
                {
                    data: 'discountsApplied',
                    visible: true,
                    title: this._translate.instant('ORDERS.ORDERS_LIST.DISCOUNTS_APPLIED'),
                    render: (data, type, row) => {
                        
                        if (data >0 ) {
                            return `
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `;
                        } else {
                            return `
                            <div class="justify-content-center row reset">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `;
                        }
                    },
                },
                {
                    data: 'lastOrderTotal',
                    visible: true,
                    title: 'Último importe',
                    sortable: false,
                    searchable: false,
                    render: (data, type, row) => {
                        if (data && data > 0) {
                            return `<span class="text-center">${data +
                                environment.MONEY_SYMBOL}</span>`;
                        } else {
                            return `<span class="text-center"></span>`;
                        }
                    },
                },
                {
                    data: 'total',
                    visible: true,
                    title: 'Importe',
                    render: (data, type, row) => {
                        return `<span class="text-center">${data +
                            environment.MONEY_SYMBOL}</span>`;
                    },
                },
                {
                    data: 'fromApp',
                    visible: true,
                    title: this._translate.instant('ORDERS.APP'),
                    render: (data, type, row) => {
                        if (data == '1') {
                            return `
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `;
                        } else {
                            return `
                            <div class="justify-content-center row reset">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `;
                        }
                    },
                },
                {
                    data: 'sentFtp',
                    visible: true,
                    title: this._translate.instant('ORDERS.SENT_FTP'),
                    render: (data, type, row) => {
                        if (data == true) {
                            return `
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `;
                        } else {
                            return `
                            <div class="justify-content-center row reset">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `;
                        }
                    },
                },
                {
                    data: 'order_assigned_count',
                    visible: false,
                    searchable: false,
                    title: 'Preparador',
                    render: (data, type, row) => {
                        if (data > 0) {
                            return `
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `;
                        } else {
                            return `
                            <div class="justify-content-center d-flex flex-row">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `;
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones += `
                                <div class="text-center editar">
                                    <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                                </div>
                            `;

                        return botones;
                    },
                },
            ],
        });
        $('.dataTables_filter').html(`
            <div class="d-flex justify-content-md-end justify-content-center mr-xl-2">
                <div class="input-group datatables-input-group-width">
                    <input 
                        id="search" 
                        type="text" 
                        class="form-control 
                        pull-right input-personalize-datatable" 
                        placeholder="Buscar"
                        style="max-width: initial;"
                    >
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
        this.detail(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            //that.Router.navigate(['orders/', data.id]);
            that.Router.navigate([`/orders/orders-list/${data.id}`]);
        });
    }

    detail(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.detail', function() {
            let data = table.row($(this).parents('tr')).data();
            that.Router.navigate([`/orders/detail-order/${data.id}`]);
        });
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

                    this.changeDetect.detectChanges();

                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    clearSearch() {
        this.rendered2.setProperty(this.interval.nativeElement, 'value', 'todas');
        this.rendered2.setProperty(this.commercialId.nativeElement, 'value', '');
        this.rendered2.setProperty(this.statusOrderId.nativeElement, 'value', '');

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
            deliveryFromTomorrow: this.getToday(true)
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

    sendFtp() {
        const modal = this._modalService.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message = this._translate.instant('ORDERS.SEND_FTP');
        modal.result.then((data) => {
            if (data) {
                this.stateEasyrouteService
                    .sendOrdersFtp()
                    .pipe(take(1))
                    .subscribe(
                        (resp) => {
                            // console.log(resp);
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
    print() {
        console.log('abri modal');
        const modal = this._modalService.open(ModalPrintOrdersComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message = this._translate.instant(
            'ORDERS.ORDERS_PRINT.PRINT_REPORT',
        );
        modal.result.then((data) => {
            if (data) {
                this.stateEasyrouteService.sendOrdersFtp().subscribe(
                    (resp) => {
                        // console.log(resp);
                        // this.cargar();
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
   

    redirectPreferencesOrders() {
        this.Router.navigateByUrl('/preferences?option=orders');
    }

    getResument() {
        let data = {
            commercialId: this.filter.commercialId,
            statusOrderId: this.filter.statusOrderId,
            dateFrom: this.filter.dateFrom,
            dateTo: this.filter.dateTo,
            date: this.filter.date,
            deliveryTomorrow: this.filter.deliveryTomorrow,
            deliveryFromTomorrow: this.filter.deliveryFromTomorrow 
        };
        this.showInfoDetail = false;

        this.stateEasyrouteService
            .getInformativeOrderSummary(data)
            .pipe(take(1))
            .subscribe(
                (data: any) => {
                    console.log(data.orders, 'data');
                    this.informativeOrderSummary = data.orders;

                    this.showInfoDetail = true;
                },
                (error) => {
                    this.showInfoDetail = true;
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }
    decimal(numb) {
        /* con esta funcion muestra el valor con formato de espaa */
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(numb);

        /* let nf = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
         return nf.format(numb);  */
    }

    openPdf(){
        console.log('abrir descargar productos');
    }

    openImportOrders(){
        console.log('abrir importar productos');
    }

    redirectPreparation(){
        this.Router.navigate(['orders/preparation']);
    }

    redirectHistorialPreparation(){
        this.Router.navigate(['orders/historical-preparation']);
    }
    openSetting(){
        this.Router.navigateByUrl('/preferences?option=order');
    }
}
