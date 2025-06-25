import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import * as moment from 'moment-timezone';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { Router } from '@angular/router';
import { ModalViewPdfGeneralComponent } from 'libs/shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take, takeUntil } from 'rxjs/operators';
import { ModalFilterDownloadComponent } from './modal-filter-download/modal-filter-download.component';
import { CustomDatepickerI18n, dateToObject, getEndOf, getStartOf, Language, LoadingService, MomentDateFormatter, objectToString, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { BackendService, Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Subject } from 'rxjs';
declare var $: any;
@Component({
    selector: 'easyroute-report-routes',
    templateUrl: './report-routes.component.html',
    styleUrls: ['./report-routes.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
    ]
})
export class ReportRoutesComponent implements OnInit {

    table: any;

    filter: FilterState = {
        name: 'report_route',
        values: {
            dateFrom: this.getToday(), //this.getToday(),
            dateTo: this.getToday(), //this.getToday(),
            userId: '',
            nameRoute: ''
        }
    };

    timeInterval: any;

    fromDate: NgbDateStruct | null;

    toDate: NgbDateStruct | null;

    hoveredDate: NgbDate | null = null;

    users: any[] = [];

    nameRoute: any[] = [];

    showUser: boolean = true;

    showRouteName: boolean = true;

    profile: Profile;

    unsubscribe$ = new Subject<void>();



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
        private facadeProfile: ProfileSettingsFacade,
        private backend: BackendService
    ) { }

    async ngOnInit() {

        this.fromDate = dateToObject(this.getToday()); //this.calendar.getToday();
        this.toDate = dateToObject(this.getToday()); //this.calendar.getToday();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {

            if (loaded) {
                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        this.profile = data;
                    });
            }

        });

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
        this.getRouteName();

    }

    /* Lista de chofer */
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

    getRouteName() {

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                nameRoute: ''
            }
        }
        this.loadingService.showLoading();

        this.showRouteName = false;

       this.backend.post('report_route_name', this.filter.values).pipe(take(1)).subscribe(
            (data: any) => {

                this.nameRoute = data.data;

                this.showRouteName = true;

                this.cargar();

                this.loadingService.hideLoading();

            },
            (error) => {

                this.showRouteName = true;

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
            this.table.state.clear();
        }

        let url = environment.apiUrl + 'report_route_datatables?' +

            (this.filter.values.dateFrom != '' ? '&dateFrom=' +

                this.filter.values.dateFrom : '') +

            (this.filter.values.dateTo != '' ? '&dateTo=' +

                this.filter.values.dateTo : '') +

            (this.filter.values.userId != '' ? '&userId=' +

                this.filter.values.userId : '') +

            (this.filter.values.nameRoute != '' ? '&nameRoute=' +

                this.filter.values.nameRoute : '');

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#reportRoute';

        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: false,
            cache: false,
            order: [5, 'desc'],
            columnDefs: [{ targets: 6, type: 'date' }],
            stateSaveParams: function (settings, data) {
                data.search.search = '';
            },
            initComplete: function (settings, data) {
                settings.oClasses.sScrollBody = '';
            },
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
                    data: 'dateDeliveryStart',
                    className: 'text-nowrap',
                    title: this._translate.instant('GENERAL.DATE'),
                    render: (data, type, row) => {
                        
                        return moment(data).format('DD/MM/YYYY');
                        
                    },
                },
                {
                    data: 'nameRoute',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.ROUTES'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                {
                    data: 'driverName',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.DRIVER'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                {
                    data: 'driverStartTime',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.INIT'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return moment(data).format('HH:mm');
                        } else {
                            return '<span class="text-center"> 00:00 </span>';
                        }
                    },
                },
                {
                    data: 'driverEndTime',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.END'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return moment(data).format('HH:mm');
                        } else {
                            return '<span class="text-center"> 00:00 </span>';
                        }
                    },
                },
                {
                    data: 'totalDelivery',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.DELIVERY'),
                    render: (data, type, row) => {
                        if (data) {
                            return data;
                        } else {
                            return '00';
                        }
                    },
                },
                {
                    data: 'totalKm',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.KM'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> 000,00 </span>';
                        }
                    },

                },
                {
                    data: 'totalInvoice',
                    className: 'text-aling-table',
                    /*  sortable: false,
                     searchable: false, */
                    title: this._translate.instant('REPORT.PAYMENT'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + data + '€' + '</span>';
                        } else {
                            return '<span class="text-center"> 00,00€ </span>';
                        }
                    },
                },

                {
                    data: 'totalDevolution',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.RETURN'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> 00 </span>';
                        }
                    },

                },
                {
                    data: 'totalIncident',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.THEY_AFFECT'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> 00 </span>';
                        }
                    },
                },
                {
                    data: 'delayTimeOnDelivery',
                    className: 'text-aling-table',
                    title: this._translate.instant('REPORT.DELAYS'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> 00 </span>';
                        }
                    },
                },
                {
                    data: 'totalOutRange',
                    title: this._translate.instant('REPORT.OUTRADIO'),
                    className:'text-center',
                    sortable: false,
                    searchable: false,
                    render: (data,type,row) =>{
                        let botones = '';

                        if(+data === 0) {
                            botones += `<div class="text-center col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>`;
                        } else {
                            botones += `<div class="text-center col">
                                            <img class="point" src="assets/icons/attachedTrue.svg">
                                        </div>`;
                        }

                        return botones;

                    }
                },
                {
                    data: 'cost',
                    visible: this.moduleCost(),
                    title: this._translate.instant('REPORT.ESTIMATED_COST'),
                    className:'text-center',
                    /* sortable: false,
                    searchable: false, */
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + this.formatEuro(data) + '</span>';
                        } else {
                            return '<span class="text-center"> 0 </span>';
                        }
                    },
                },
                {
                    data: 'realCost',
                    visible: this.moduleCost(),
                    title: this._translate.instant('REPORT.ACTUAL_COST'),
                    className:'text-center',
                    /* sortable: false,
                    searchable: false, */
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + this.formatEuro(data) + '</span>';
                        } else {
                            return '<span class="text-center"> 0 </span>';
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('PROVIDERS.EDIT'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones += `
                                <div class="text-center editar">
                                    <img class="point" src="assets/icons/External_Link.svg">
                                </div>
                            `;

                        return botones;
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
        this.editar(tbody, table);
        this.detail(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function () {
            let data = table.row($(this).parents('tr')).data();

            that.router.navigate(['report/route/', data.id]);
        });
    }

    detail(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.detail', function () {
            let data = table.row($(this).parents('tr')).data();

            // that.Router.navigate([`/orders/detail-order/${data.id}`]);
        });
    }

    returnsList() {
        this.router.navigate(['report']);
    }

    openResumemPdf() {

        let url = 'report_route_download_sumary?' +

            (this.filter.values.dateFrom != '' ? '&dateFrom=' +

                this.filter.values.dateFrom : '') +

            (this.filter.values.dateTo != '' ? '&dateTo=' +

                this.filter.values.dateTo : '') +

            (this.filter.values.userId != '' ? '&userId=' +

                this.filter.values.userId : '') +

            (this.filter.values.nameRoute != '' ? '&nameRoute=' +

                this.filter.values.nameRoute : '');

        const modal = this._modalService.open(ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass: 'modal-view-pdf',

            size: 'lg'

        });

        modal.componentInstance.title = this._translate.instant('REPORT.DOWNLOAD_REPORT');

        modal.componentInstance.url = url;

    }

    openAllPdf() {

        let url = 'report_route_download_all?' +

            (this.filter.values.dateFrom != '' ? '&dateFrom=' +

                this.filter.values.dateFrom : '') +

            (this.filter.values.dateTo != '' ? '&dateTo=' +

                this.filter.values.dateTo : '') +

            (this.filter.values.userId != '' ? '&userId=' +

                this.filter.values.userId : '') +

            (this.filter.values.nameRoute != '' ? '&nameRoute=' +

                this.filter.values.nameRoute : '');

        const modal = this._modalService.open(ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass: 'modal-view-pdf',

            size: 'lg'

        });

        modal.componentInstance.title = this._translate.instant('REPORT.DOWNLOAD_ALL');

        modal.componentInstance.url = url;

    }

    openModalFilters() {

        const modal = this._modalService.open(ModalFilterDownloadComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass: 'modal-filter-pdf ',

            size: 'md'

        });

        modal.result.then(
            (data) => {
                if (data) {

                    this.openPdfFilter(data);
                }
                else {

                }

            },
            (reason) => {

            },
        );

    }

    openPdfFilter(value: any) {

        let url ='report_route_download_personalized?' +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +

        this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +

        this.filter.values.dateTo : '') +

        (this.filter.values.userId != '' ? '&userId=' +

        this.filter.values.userId : '') +

        (value.sumary != '' ? '&sumary=' +
        value.sumary : '') +

        (value.comparative != '' ? '&comparative=' +
        value.comparative : '')+

        (value.delay != '' ? '&delay=' +
        value.delay : '') +

        (value.albaran != '' ? '&albaran=' +
        value.albaran : '') +

        (value.devolution != '' ? '&devolution=' +
        value.devolution : '') +

        (value.round != '' ? '&round=' +
        value.round : '') +

        (value.outRange != '' ? '&outRange=' +
        value.outRange : '')+

        (value.pointNoDelivered != '' ? '&pointNoDelivered=' +
        value.pointNoDelivered : '') +

        (value.productNotDelivered != '' ? '&productNotDelivered=' +
        value.productNotDelivered : '') +

        (value.costControl != '' ? '&costControl=' +
        value.costControl : '') +

        (value.refueling != '' ? '&refueling=' +
        value.refueling : '') +

        (value.boxes != '' ? '&boxes=' +
        value.boxes : '') +

        (value.bill != '' ? '&bill=' +
        value.bill : '');

        const modal = this._modalService.open( ModalViewPdfGeneralComponent, {

          backdropClass: 'modal-backdrop-ticket',

          centered: true,

          windowClass:'modal-view-pdf',

          size:'lg'

        });

        modal.componentInstance.title = this._translate.instant('REPORT.CUSTOM_DOWNLOAD');

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
            this.getRouteName();
            this.stateFilters.add(this.filter);

        }  else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {

            this.toDate = date;

            this.filter = {
                ...this.filter,
                values: {
                    ...this.filter.values,
                    dateTo: objectToString(date),
                }
            }
            this.cargar();
            this.getRouteName();
            this.stateFilters.add(this.filter);

        } else {

            this.filter = {
                ...this.filter,
                values: {
                    ...this.filter.values,
                    dateFrom: objectToString(date),
                    dateTo: objectToString(date)
                }
            }

            this.cargar();
            this.getRouteName();
            this.toDate = null;

            this.fromDate = date;

            this.stateFilters.add(this.filter);

        }

    }

    validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {

        console.log(currentValue)

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
        console.log('value:', value);
        console.log('property:', property);
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

    formatEuro(quantity) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);

    }

    moduleCost() {

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

    openExcel(){

        let url ='report_route_download_excel?' +
    
        (this.filter.values.dateFrom != '' ? '&dateFrom=' +

            this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +

            this.filter.values.dateTo : '') +

        (this.filter.values.userId != '' ? '&userId=' +

            this.filter.values.userId : '') +

        (this.filter.values.nameRoute != '' ? '&nameRoute=' +

            this.filter.values.nameRoute : '');
        
        return this.backend.getDownloadExcel(url, 'ReportRoute').then((data: string)=>{ })
    
    }

}
