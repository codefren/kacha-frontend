import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import * as momentTimezone from 'moment-timezone';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
    dateNbToDDMMYYY,
} from '../../../../../shared/src/lib/util-functions/date-format';
import {
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDateStruct,
    NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../../../../../backend/src/lib/types/filter.type';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from '@optimroute/env/environment';
import { MyOrdersModalSearchClientComponent } from '../my-orders-form/my-orders-modal-search-client/my-orders-modal-search-client.component';

@Component({
    selector: 'easyroute-my-orders-list',
    templateUrl: './my-orders-list.component.html',
    styleUrls: ['./my-orders-list.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class MyOrdersListComponent implements OnInit {
    table: any;

    companyClient: any = [];

    clientName: any;

    agentUser: any = [];

    showIntervalFiel: boolean;

    model: any;

    model2: any;

    dateFrom: string = 'from';

    datedateTo: string = 'To';

    @Output() selectDate = new EventEmitter<any>();

    dateNow: NgbDateStruct;

    datemin: any;

    dateMax: any;

    disabledateto: boolean = true;

    // datetime form
    today: string;

    filter: Filter = {
        commercialId: '',
        statusOrderId: '',
        deliveryPointId: [],
        dateFrom: '',
        dateTo: '',
        date: '',
        deliveryTomorrow :''

    };

    constructor(
        private authLocal: AuthLocalService,
        private stateEasyrouteService: StateEasyrouteService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private Router: Router,
        private changeDetect: ChangeDetectorRef,
        private _modalService: NgbModal,
    ) {}

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
        this.initMoment();
        this.getAllagentuser();
        this.cargar();
    }

    initMoment() {
        momentTimezone()
            .tz('Europe/Madrid')
            .format();
        this.today = this.getToday();
    }

    getToday() {
        return momentTimezone().format('YYYY-MM-DD');
    }

    getCompanyClient() {
        this.stateEasyrouteService.getClient().subscribe(
            (resp: any) => {
                this.companyClient = resp.data;
                this.changeDetect.detectChanges();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    getAllagentuser() {
        this.stateEasyrouteService.getAllagentuser().subscribe(
            (data: any) => {
                this.agentUser = data.data;

                this.changeDetect.detectChanges();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    getDate(date: any, name: any) {
        this.selectDate.emit(date);
        if (name == 'from') {
            this.disabledateto = false;
            this.dateMax = date;
            this.filter.dateFrom = dateNbToDDMMYYY(date);
            this.changeDetect.detectChanges();
        } else {
            this.filter.dateTo = dateNbToDDMMYYY(date);
            this.cargar();
            this.changeDetect.detectChanges();
        }
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
            this.setFilter('', 'commercialId', false);
            this.setFilter('', 'deliveryPointId', false);
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

    showInterval(value: string) {
        if (value === 'por fecha') {
            this.showIntervalFiel = true;
        } else {
            this.showIntervalFiel = false;
        }
    }

    setFilter(value: any, property: string, sendData?: boolean) {
        this.filter[property] = value;
        console.log(this.filter);
        if (sendData) {
            this.cargar();
            this.changeDetect.detectChanges();
        }
    }

    ngOnDestroy() {
        this.table.destroy();
    }

    cargar() {
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
            '&statusOrderId=' +
            this.filter.statusOrderId;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        this.table = $('#my_orders').DataTable({
            destroy: true,
            processing: true,
            lengthMenu: [50, 100],
            stateSave: true,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom: `
        <'row'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
            <'col-sm-6 col-12 label-search'fr>
        >
        <"top-button-hide"B><t><ip>
      `,
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return idx + 1 + ': ' + title;
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
                    data: 'orderDate',
                    title: this._translate.instant('ORDERS.ORDERS_LIST.DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'status_order.name',
                    title: this._translate.instant('GENERAL.STATUS'),
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '';

                        botones +=
                            '<button class="btn btn-default rounded-button editar btn-datatable"><i class="fas fa-pencil-alt"></i></button>';
                        return botones;
                    },
                },
            ],
        });
        this.editar('#my_orders tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'button.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that.Router.navigate(['my-orders', data.id]);
        });
    }

    addclient() {
        const modal = this._modalService.open(MyOrdersModalSearchClientComponent, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
        });

        modal.result.then(
            (data) => {
                if (data) {
                    console.log('datos cuando el modal cierra', data);
                    this.filter.deliveryPointId = data.id;
                    this.clientName = data.name;
                    console.log(this.filter, 'datos del filtros');
                    //this.filter.deliveryPointId.push(deliveryPointId);
                    this.changeDetect.detectChanges();

                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    clearSearch() {
        this.filter = {
            commercialId: '',
            statusOrderId: '',
            deliveryPointId: [],
            dateFrom: '',
            dateTo: '',
            date: '',
            deliveryTomorrow:''
        };
        this.cargar();
    }
}
