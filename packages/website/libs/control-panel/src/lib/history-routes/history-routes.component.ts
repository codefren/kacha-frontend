import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { StateRoutePlanningService } from '../../../../state-route-planning/src/lib/state-route-planning.service';
import { AuthLocalService } from '@optimroute/auth-local';
import { TranslateService } from '@ngx-translate/core';
import {
    ToDayTimePipe,
    DistancePipe,
    ToastService,
    downloadFile,
    objectToString,
    dateToObject,
    dateToDDMMYYY,
    getToday,
    dayTimeAsStringToSeconds,
    DetailComponent,
    ModalWarningComponent,
} from '@optimroute/shared';
import * as moment from 'moment';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '@optimroute/env/environment';
import { secondsToAbsoluteTime } from 'libs/shared/src/lib/util-functions/time-format';
import { DeliveryPoint } from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { ModalRoutesComponent } from '../assigned-routes/modal-routes/modal-routes.component';
// import { DetailComponent } from '../assigned-routes/detail/detail.component';
import { BackendService, FilterState, OptimizationPreferences } from '@optimroute/backend';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { ModalWarningComponent } from './modal-warning/modal-warning.component';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StateFilterStateFacade } from '@easyroute/filter-state';

declare var $: any;

@Component({
    selector: 'easyroute-history-routes',
    templateUrl: './history-routes.component.html',
    styleUrls: ['./history-routes.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HistoryRoutesComponent implements OnInit {

    optimizationPreferences$: Observable<OptimizationPreferences>;

    togglInfor: boolean = true;
    show: boolean = true;

    unsubscribe$ = new Subject<void>();
    routes: any = [];
    table: any;
    selectedRouteId: any;

    routeSeleted: any;

    dateSearch = new FormControl(new Date().toISOString());
    dateRoute: string = moment().format('DD/MM/YYYY');

    timeInterval: any;
    selected: any = [];
    disabled: boolean;
    statusRouteId: number = 3;
    routeStartData: any;

    formDemo: FormGroup;

    dataRoutes: any[] = [];
    filter: FilterState = {
        name: 'history-routes',
        values: {},
    };
    data: any;
    dataDuringDelivery: any;
    constructor(
        private stateRoutePlanningService: StateRoutePlanningService,
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private dialog: NgbModal,
        private dayTime: ToDayTimePipe,
        private distance: DistancePipe,
        private detectChanges: ChangeDetectorRef,
        private backend: BackendService,
        private toast: ToastService,
        private fb: FormBuilder,
        private _router: Router,
        private stateFilters: StateFilterStateFacade,
        private route: ActivatedRoute,
        private preferencesFacade: PreferencesFacade,

    ) {
        this.route.queryParams.subscribe(params => {
            if (this._router.getCurrentNavigation() && this._router.getCurrentNavigation().extras
                && this._router.getCurrentNavigation().extras.state) {
                this.data = this._router.getCurrentNavigation().extras.state;
                this.backend.timeoutToken().subscribe(
                    async (data) => {
                        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

                        this.filter = filters.find(x => x.name === 'history-routes') ? filters.find(x => x.name === 'history-routes') : this.filter;

                        console.log('filtros', this.filter);

                        this.dateRoute = this.filter && this.filter.values && this.filter.values.date ? moment(this.filter.values.date).format('DD/MM/YYYY') :
                            moment(this.dateSearch.value).format('DD/MM/YYYY');


                        this.load(this.filter && this.filter.values && this.filter.values.date ? this.filter.values.date : moment(this.dateSearch.value).format('YYYY-MM-DD'),
                            this.data && this.data.id ? this.data.id : undefined);

                            this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
                    },
                    (error) => {
                        this.backend.Logout();
                    },
                );
            } else {
                this.backend.timeoutToken().subscribe(
                    async (data) => {
                        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

                        this.filter = filters.find(x => x.name === 'history-routes') ? filters.find(x => x.name === 'history-routes') : this.filter;

                        console.log('filtros', this.filter);

                        this.dateRoute = this.filter && this.filter.values && this.filter.values.date ? moment(this.filter.values.date).format('DD/MM/YYYY') :
                            moment(this.dateSearch.value).format('DD/MM/YYYY');


                        this.load(this.filter && this.filter.values && this.filter.values.date ? this.filter.values.date : moment(this.dateSearch.value).format('YYYY-MM-DD'),
                            this.filter && this.filter.values && this.filter.values.routeId ? this.filter.values.routeId : undefined);
                        
                        this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
                    },
                    (error) => {
                        this.backend.Logout();
                    },
                );
            }
        });
    }

    ngOnInit() {

                this.dateRoute =
                    this.filter && this.filter.values && this.filter.values.date
                        ? moment(this.filter.values.date).format('DD/MM/YYYY')
                        : moment(this.dateSearch.value).format('DD/MM/YYYY');

    }

    showCardInfo() {
        this.togglInfor = !this.togglInfor;
    }

    ngOnDestroy() {
        window.clearInterval(this.timeInterval);
    }

    refresh() {
        this.table.ajax.reload();
    }

    load(date: any, routeId?: any) {
        this.stateRoutePlanningService
            .getRoutesAssigned(date.substring(0, 10), this.statusRouteId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.routes = data.data;
                this.detectChanges.detectChanges();
                if (this.routes.length > 0) {
                    this.cargar(routeId ? routeId : data.data[0].id);
                    this.getRouteStartData(routeId ? routeId : data.data[0].id)
                    this.getDataDuringDelivery(routeId ? routeId : data.data[0].id);
                } else {
                    this.selectedRouteId = undefined;
                    this.routeSeleted = undefined;
                }
            });
    }

    changeDate(event: string, dataEvent: any) {
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                date: moment(
                    `${dataEvent.year}-${dataEvent.month
                        .toString()
                        .padStart(2, '0')}-${dataEvent.day.toString().padStart(2, '0')}`,
                ).format('YYYY-MM-DD'),
                routeId: undefined,
            },
        };

        this.stateFilters.add(this.filter);

        this.backend.timeoutToken().subscribe(
            (data) => {
                this.load(
                    moment(
                        `${dataEvent.year}-${dataEvent.month
                            .toString()
                            .padStart(2, '0')}-${dataEvent.day
                                .toString()
                                .padStart(2, '0')}`,
                    ).format('YYYY-MM-DD'),
                );
            },
            (error) => {
                this.backend.Logout();
            },
        );
    }

    changeRoute(routeId) {
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                routeId: routeId
            }
        }
        this.stateFilters.add(this.filter);
        this.cargar(routeId);
    }

    cargar(routeId: number) {
        if (this.disabled) return;
        if (this.table) {
            this.table.clear();
            //this.table.state.clear();
        }
        this.selected = [];
        this.selectedRouteId = routeId;
        this.routeSeleted = this.routes.find((x: any) => x.id == routeId);

        this.getDataDuringDelivery(this.routeSeleted.id);
        this.getRouteStartData(this.routeSeleted.id)

        let url = environment.apiUrl + 'route_planning/route/assigned/' + routeId;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#assigned';
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            order: [0, 'asc'],
            stateSaveParams: function(settings, data) {
                data.search.search = '';
            },
            lengthMenu: [50, 100],
            dom: `
                <'row'
                    <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                    <'col-sm-3 col-md-2 col-xl-1 col-12'
                        <'row p-0 justify-content-sm-start justify-content-center'B>
                    >
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><t>

                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
                >
            `,
            headerCallback: (thead, data, start, end, display) => {
                $('.buttons-collection').html('<i class="far fa-edit"></i>' + ' ' + this._translate.instant('GENERAL.SHOW/HIDE'))
            },
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
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
                beforeSend: () => {
                    this.detectChanges.detectChanges();
                    this.disabled = true;
                },
                complete: () => {
                    this.detectChanges.detectChanges();
                    this.disabled = false;
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 10px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar(routeId);
                    });
                },
            },
            rowCallback: (row, data) => {
                if ($.inArray(data.id, this.selected) !== -1) {
                    $(row).addClass('selected');
                }
                if (data.deliveryType === 'pickup') {
                    $(row).addClass('pickup');
                }
                if(data.deliveryZoneSpecificationCode){
                    $(row).addClass('zoneSpecification')
                }
            },
            columns: [
                {
                    data: 'order',
                    render: function (data, type, row) {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            row.order +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'deliveryPointId',
                    title: this._translate.instant('ID'),
                    render: function (data, type, row) {
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
                    data: 'name',
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
                    data: 'companyPreferenceDelayTimeId',
                    title: 'Tipología',
                    render: (data, type, row) => {
                        let botones = '';

                        if (data && data > 0) {

                            botones += `
                                <div class="text-center">
                                    ${row.company_preference_delay_time_type.name}
                                </div>
                            `;

                        } else {
                            botones += `
                            <div class="text-center">
                            </div>
                            `;
                        }

                        return botones;
                    }
                },
                {
                    data: 'population',
                },
                {
                    data: 'address',
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
                    data: 'deliveryWindowStart',
                    visible: false,
                    render: (data, type, row) => {
                        return data
                            ? '<span>' +
                            this.dayTime.transform(data, false, false) +
                            '</span>'
                            : '<span>Libre</span>';
                    },
                },
                {
                    data: 'deliveryWindowEnd',
                    visible: false,
                    render: (data, type, row) => {
                        return data
                            ? '<span>' +
                            this.dayTime.transform(data, false, false) +
                            '</span>'
                            : '<span>Libre</span>';
                    },
                },
                {
                    data: 'travelTimeToNext',
                    visible: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'arrivalDayTime',
                    render: (data, type, row) => {
                        return (
                            '<span>' +
                            this.dayTime.transform(data, false, false) +
                            '</span>'
                        );
                    },
                },
                {
                    title: 'Retraso',
                    data: 'delayTimeOnDelivery',
                    visible: true,
                    orderable: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    } 
                },
                {
                    title: 'Hora de llegada con retraso',
                    data: 'arrivalDayTimeWithDelay',
                    visible: true,
                    orderable: false,
                    render: (data, type, row) => {
                        return data
                            ? '<span>' +
                            this.dayTime.transform(data, false, false) +
                            '</span>'
                            : '<span>Libre</span>';
                    } 
                },
                {
                    data: 'delayTime',
                    visible: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'vehicleWaitTime',
                    visible: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'serviceTime',
                    visible: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'travelDistanceToNext',
                    visible: false,
                    render: (data, type, row) => {
                        return this.distance.transform(data);
                    },
                },
                {
                    data: 'customerWaitTime',
                    visible: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'driverArrivalTime',
                    render: (data, type, row) => {
                        let arrivalTime = dayTimeAsStringToSeconds(
                            moment(data).format('HH:mm'),
                        );

                        if (arrivalTime < 0)
                            return data ? moment(data).format('HH:mm') : '';

                        let varClass = '';

                        if (arrivalTime < row.deliveryWindowStart) {
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
                                '<span class="' +
                                varClass +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        } else {
                            return data ? moment(data).format('HH:mm') : '';
                        }
                    },
                },
                {
                    data: 'signatureTime',
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
                                '<span class="' +
                                varClass +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        } else {
                            return data ? moment(data).format('HH:mm') : '';
                        }
                    },
                },
                {
                    data: 'serviceTimeClient',
                    orderable: false,
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'status_route_delivery_point.name',
                    render: (data, type, row) => {
                        let varClass = '';

                        if (data === 'Finalizado' && row.howOftenReturned === 0) {
                            varClass = 'green';
                        }
                        if (data == 'En proceso') {
                            varClass = 'blue';
                        }

                        if (data == 'No entregado') {
                            varClass = 'yellow';
                        }

                        if (data == 'Pospuesto') {
                            varClass = 'orange';
                        }

                        if (data === 'Finalizado' && +row.howOftenReturned > 0) {
                            data = 'Finalizado (segunda vuelta)';
                            varClass = 'green';
                        }
                        if (data === 'Asignado') {
                            varClass = '';
                        }

                        return (
                            '<div class="text-center">' +
                            '<button class="btn btn-default warning ' +
                            varClass +
                            '"><i class="fas fa-history"></i> ' +
                            data +
                            ' </button> ' +
                            '</div>'
                        );
                    },
                },
                {
                    title: 'Devoluciones',
                    data: 'route_planning_route_delivery_point_devolution_count',
                    render: (data, type, row) => {
                        let botones = '';

                        if (data > 0) {

                            botones += `
                                <div class="text-center editar col">
                                    <img class="icons-datatable point" src="assets/icons/devolution.svg">
                                </div>
                            `;
                        } else {
                            botones += `
                                <div class="text-center editar col">
                                    <img class="icons-datatable point" src="assets/icons/no-devolution.svg">
                                </div>
                            `;
                        }
                        return botones;
                    },
                },
                {
                    data: 'statusRouteDeliveryPointId',
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    className: 'dt-body-center',
                    render: (data, type, row) => {
                        let botones = '';

                        botones += `<div class="d-flex justify-content-center backgroundColorRow">`;

                        botones += `
                            <div class="text-center editar col-12">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/eye-outline.svg">
                            </div>
                        `;

                        /* if (data == 3) {
                            botones += `
                                <div class="text-center export col-4">
                                    <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg">
                                </div>
                            `;
                        } */

                        /* if (row.signatureTime) {
                            botones += `
                                <div class="text-center print col-4">
                                    <img class="icons-datatable point" src="assets/icons/optimmanage/print-outline.svg">
                                </div>
                            `;
                        } */

                        botones += `</div>`;
                        return botones;
                    },
                },
            ],
        });
        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-md-end justify-content-center mr-xl-2">
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

        $('#search').on('keyup', function () {
            $(table).DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr("class");

        this.initEvents('#assigned tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.receipt(tbody, table);
        this.export(tbody, table);
        this.select(tbody, table);
        this.waning(tbody, table);
        this.print(tbody, table);
        this.onChangeOrderValue(tbody, table);
    }

    routeChance() {
        const dialogRef = this.dialog.open(ModalRoutesComponent, {
            size: 'lg',
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });
        (dialogRef.componentInstance.data = {
            routeId: this.routeSeleted,
            routes: this.routes,
            deliveryPoints: this.selected,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.table.ajax.reload();
                    this.selected = [];
                }
            });
    }

    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function () {
            let data = table.row($(this)).data();
            var index = $.inArray(+data.id, that.selected);
            if (index === -1) {
                that.selected.push(+data.id);
            } else {
                that.selected.splice(index, 1);
            }
            $(this).toggleClass('selected');
            that.detectChanges.detectChanges();
        });
    }

    onChangeOrderValue(tbody: any, table: any, that = this) {
        $(tbody).on('focusout', 'input.order_input', function () {
            let data = table.row($(this).parents('tr')).data();
            let zone = {
                order: +$(this).val(),
            };
            if (data.order == +$(this).val()) {
                return;
            }
            that.updateZone([data.id, zone]);
        });
    }

    updateZone(obj: [string, Partial<DeliveryPoint>]) {
        this.stateRoutePlanningService
            .updateDeliveryZone(this.routeSeleted.id, obj[0], obj[1])
            .subscribe(
                (data) => {
                    this.table.ajax.reload();
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function () {
            let data = table.row($(this).parents('tr')).data();

            // that.editElement(data);
            that._router.navigate([`/control-panel/history/${data.id}`]);
        });
    }

    waning(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.warning', function () {
            let data = table.row($(this).parents('tr')).data();
            that.showWarning(data);
        });
    }

    showWarning(data: any): void {
        const modal = this.dialog.open(ModalWarningComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        console.log(data);
        modal.componentInstance.data = data;
    }

    receipt(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.receipt', function () {
            let data = table.row($(this).parents('tr')).data();
            that.receiptElement(data);
        });
    }

    export(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.export', function () {
            let data = table.row($(this).parents('tr')).data();

            let deliveredBoxesTotal = data.deliveredBoxes == null ? 0 : data.deliveredBoxes;
            deliveredBoxesTotal = parseInt(deliveredBoxesTotal) + parseInt(data.extraBoxes);

            let json = {
                id: data.deliveryPointId,
                signature: data.signature,
                deliveredBoxes: deliveredBoxesTotal,
                devolutionDeliveryNote: data.devolutionDeliveryNote,
                observation: data.observation,
                dniDeliveryNote: data.dniDeliveryNote,
                nameDeliveryNote: data.nameDeliveryNote,
            };

            that.generateExpotJson(json);
        });
    }

    exportJsonRoute(that = this) {
        this.stateRoutePlanningService
            .jsonRouteDeliveryPoint(this.selectedRouteId)
            .subscribe(
                (data) => {
                    that.generateJson(data, this.selectedRouteId);
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    generateExpotJson(data: any, routeId: any = null) {
        let json = JSON.stringify(data);

        const modal = this.dialog.open(ModalConfirmComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.result.then(
            (result) => {
                if (result) {
                    if (routeId == null) {
                        downloadFile(
                            json,
                            `polpoo_${dateToDDMMYYY(new Date())}_${data.id}.json`,
                        );
                    } else {
                        downloadFile(
                            json,
                            `polpoo_routes_${dateToDDMMYYY(new Date())}_${routeId}.json`,
                        );
                    }
                }
            },
            (reason) => {

            }
        );
    }

    generateJson(data: any, routeId: any = null) {
        let json = JSON.stringify(data);

        if (routeId == null) {
            downloadFile(json, `polpoo_${dateToDDMMYYY(new Date())}_${data.id}.json`);
        } else {
            downloadFile(
                json,
                `polpoo_routes_${dateToDDMMYYY(new Date())}_${routeId}.json`,
            );
        }
    }

    async receiptElement(data: any) {
        await this.stateRoutePlanningService.getPdfDeliveryPoint(data.routeId, data.id);
    }

    editElement(data: any): void {
        const dialogRef = this.dialog.open(DetailComponent, {
            size: 'lg',
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        dialogRef.componentInstance.data = data;
    }

    sendProducts(deliveryPointWithProducts: any) {
        deliveryPointWithProducts.routeId = this.selectedRouteId;
        this.stateRoutePlanningService
            .uploadProductosRoute(deliveryPointWithProducts)
            .subscribe(
                (data) => {
                    this.table.ajax.reload();
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    getDataDuringDelivery(routerId: number) {

        this.show = false;

        this.stateRoutePlanningService

            .getDataDuringDelivery(routerId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {

                this.dataDuringDelivery = data.dataDuringDelivery;

                this.show = true;

                this.detectChanges.detectChanges();


            });
    }
    getRouteStartData(routerId: number) {

        this.show = false;

        this.stateRoutePlanningService

            .getRouteStartData(routerId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {

                this.routeStartData = data;

                this.show = true;


                this.detectChanges.detectChanges();


            });
    }

    ftpJsonRoute() {
        // let name = this.routes.find((x: any) => x.id === this.selectedRouteId).name;
        let name = this.routeSeleted.name;
        this.stateRoutePlanningService
            .ftpRouteDeliveryPoint(this.selectedRouteId, name)
            .subscribe(
                (resp) => {
                    this.toast.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.FILE_SENT_SUCCESSFULLY'),
                    );
                },
                (error: any) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error.error);
                },
            );
    }

    exportJsonRouteGeneral(that = this) {
        this.dataRoutes = [];

        for (let i = 0; i < this.routes.length; i++) {
            this.dataRoutes.push(this.routes[i].id);
        }

        this.stateRoutePlanningService
            .jsonRouteDeliveryPointGeneral(this.dataRoutes)
            .subscribe(
                (data) => {
                    let dataJson = [];
                    for (let i = 0; i < data.length; i++) {
                        dataJson.push({
                            routeId: data[i].routeId,
                            createdDate: data[i].createdDate,
                            deliveryPoints: data[i].deliveryPoints,
                        });
                    }
                    that.generateJsonGeneral(dataJson);
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    validateSAC() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 14) !== undefined
            : false;
    }

    isControlPanel() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 7) !== undefined
            : false;
    }

    isAdminCompany() {

        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 2) !== undefined
            : false;
    }

    isCommercialAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
            : false;
    }

    isCommercialDirector() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 9) !== undefined
            : false;
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }

    isAdminGlobal() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }

    ftpJsonRouteGeneral() {
        this.dataRoutes = [];

        for (let i = 0; i < this.routes.length; i++) {
            this.dataRoutes.push(this.routes[i].id);
        }

        this.stateRoutePlanningService
            .ftpRouteDeliveryPointGeneral(this.dataRoutes)
            .subscribe(
                (resp) => {
                    this.toast.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.FILE_SENT_SUCCESSFULLY'),
                    );
                },
                (error: any) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error.error);
                },
            );
    }

    formatEuro(quantity) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);

    }

    decimal(numb) {

        /* con esta funcion muestra el valor con formato de espaa */
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

        /* let nf = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
         return nf.format(numb);  */
    }

    generateJsonGeneral(data: any) {
        let json = JSON.stringify(data);
        downloadFile(json, `routes_${dateToDDMMYYY(new Date())}.json`);
    }

    print(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.print', function () {
            let data = table.row($(this).parents('tr')).data();
            that.downloadPdf(data.routeId, data.id);
        });
    }

    async downloadPdf(routeId: number, id: number) {
        this.stateRoutePlanningService.getPdfDeliveryPoint(routeId, id);
    }
    convertTime(date: string) {
        let converted = '';

        if (date != null) {
            converted = moment(date).format('DD/MM/YYYY HH:mm:ss');
        }
        return converted;
    }
}
