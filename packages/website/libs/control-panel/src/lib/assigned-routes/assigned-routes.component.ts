import {
    Component,
    OnInit,
    ChangeDetectorRef,
    OnDestroy,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AuthLocalService } from '@optimroute/auth-local';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { DetailComponent } from './detail/detail.component';
import {
    ToDayTimePipe,
    DistancePipe,
    ErrorDialogComponent,
    removeNulls,
    ImportedProductsDeliveryPointDto,
    ToastService,
    objectToString,
    dayTimeAsStringToSeconds,
    ModalWarningComponent,
    LoadingService
} from '@optimroute/shared';
import { secondsToAbsoluteTime } from 'libs/shared/src/lib/util-functions/time-format';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ModalRoutesComponent } from './modal-routes/modal-routes.component';
import { DeliveryPoint } from '@optimroute/state-route-planning';
import { ChangeVehiclesDialogComponent } from './change-vehicles-dialog/change-vehicles-dialog.component';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmEndRouteComponent } from './modal-confirm-end-route/modal-confirm-end-route.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../state-easyroute/src/lib/state-easyroute.service';
import { ChangeDriverDialogComponent } from './change-driver-dialog/change-driver-dialog.component';
import { OptimizationPreferences } from '../../../../backend/src/lib/types/preferences.type';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { BackendService, FilterState } from '@optimroute/backend'
import { ModalCreateRetainerRouteComponent } from './modal-create-retainer-route/modal-create-retainer-route.component';
declare var $: any;

@Component({
    selector: 'easyroute-assigned-routes',
    templateUrl: './assigned-routes.component.html',
    styleUrls: ['./assigned-routes.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AssignedRoutesComponent implements OnInit, OnDestroy {

    optimizationPreferences$: Observable<OptimizationPreferences>;
    unsubscribe$ = new Subject<void>();

    dateSearch = new FormControl(new Date().toISOString());

    dateRoute: string = moment().format('DD/MM/YYYY');
    disabled: boolean;
    productGlobalImport: boolean;
    refreshTime: number = environment.refresh_datatable_assigned;
    routes: any = [];
    routeSeleted: any;
    selected: any = [];
    selectedRouteId: any;
    showButton: boolean = true;
    statusRouteId: number = 2;
    table: any;
    timeInterval: any;
    dataRoutes: any[] = [];
    togglInfor: boolean = true;
    dataDuringDelivery: any;
    routeStartData: any;
    show: boolean = true;
    date: any;
    filter: FilterState = {
        name: 'assigned',
        values: {}
    };
    data: any;
    
    constructor(
        private stateRoutePlanningService: StateRoutePlanningService,
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private dayTime: ToDayTimePipe,
        private distance: DistancePipe,
        private detectChanges: ChangeDetectorRef,
        private toast: ToastService,
        private preferencesFacade: PreferencesFacade,
        private loading: LoadingService,
        private modalService: NgbModal,
        private _router: Router,
        private stateEasyrouteService: StateEasyrouteService,
        private stateFilters: StateFilterStateFacade,
        private route: ActivatedRoute,
        private backend: BackendService
    ) {
        this.route.queryParams.subscribe(params => {
            if (this._router.getCurrentNavigation() && this._router.getCurrentNavigation().extras
                && this._router.getCurrentNavigation().extras.state) {
                this.data = this._router.getCurrentNavigation().extras.state;
                this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe(async (data) => {

                    console.log(data ,'preferencesFacade')

                    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();


                    this.filter = filters.find(x => x.name === 'assigned') ? filters.find(x => x.name === 'assigned') : this.filter;

                    this.dateRoute = this.filter && this.filter.values && this.filter.values.date ? moment(this.filter.values.date).format('DD/MM/YYYY') :
                        moment(this.dateSearch.value).format('DD/MM/YYYY');

                    this.refreshTime =
                        data.refreshTime !== null && data.refreshTime > 0
                            ? data.refreshTime * 1000
                            : this.refreshTime;
                    this.load(this.filter && this.filter.values && this.filter.values.date ? this.filter.values.date :
                        moment(this.dateSearch.value).format('YYYY-MM-DD'), this.data && this.data.id ? this.data.id : undefined);


                });
                this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
            } else {
                this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe(async (data) => {

                    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();


                    this.filter = filters.find(x => x.name === 'assigned') ? filters.find(x => x.name === 'assigned') : this.filter;

                    this.dateRoute = this.filter && this.filter.values && this.filter.values.date ? moment(this.filter.values.date).format('DD/MM/YYYY') :
                        moment(this.dateSearch.value).format('DD/MM/YYYY');

                    this.refreshTime =
                        data.refreshTime !== null && data.refreshTime > 0
                            ? data.refreshTime * 1000
                            : this.refreshTime;
                    this.load(this.filter && this.filter.values && this.filter.values.date ? this.filter.values.date :
                        moment(this.dateSearch.value).format('YYYY-MM-DD'), this.filter && this.filter.values && this.filter.values.routeId ? this.filter.values.routeId : undefined);


                });
                this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
            }
        });
    }

    ngOnInit() { }

    ngOnDestroy() {
        window.clearInterval(this.timeInterval);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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

                console.log( this.routes, 'servicio de rutas');

                this.detectChanges.detectChanges();

                if (this.routes.length > 0) {
                    this.cargar(routeId ? routeId : data.data[0].id);
                    this.getRouteStartData(routeId ? routeId : data.data[0].id)
                    this.getDataDuringDelivery(routeId ? routeId : data.data[0].id);
                    this.selectedRouteId = routeId ? routeId : data.data[0].id;
                } else {
                    this.selectedRouteId = undefined;
                    this.routeSeleted = undefined;
                }
            });
    }

    changeDate(data: any, dataEvent: any) {


        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                date: moment(
                    `${dataEvent.year}-${dataEvent.month
                        .toString()
                        .padStart(2, '0')}-${dataEvent.day.toString().padStart(2, '0')}`,
                ).format('YYYY-MM-DD'),
                routeId: undefined
            }
        }

        this.stateFilters.add(this.filter);

        this.load(
            moment(
                `${dataEvent.year}-${dataEvent.month
                    .toString()
                    .padStart(2, '0')}-${dataEvent.day.toString().padStart(2, '0')}`,
            ).format('YYYY-MM-DD'),
        );
    }

    addChangeVehicles() {
        const modal = this.modalService.open(ChangeVehiclesDialogComponent, {
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.data = {
            RouteId: this.routeSeleted.id,
        };

        modal.result.then((data: any) => {

            console.log(data);

            if (data === undefined) {
            } else {
                let dateDeliveryStart;
                if (
                    this.dateSearch.value.year &&
                    this.dateSearch.value.month &&
                    this.dateSearch.value.day
                ) {
                    dateDeliveryStart = objectToString(this.dateSearch.value);
                } else {
                    dateDeliveryStart = moment(this.dateSearch.value).format('YYYY-MM-DD');
                }
                this.load(dateDeliveryStart);
            }
        });
    }

    changeDriver() {
        console.log('aqui changeDriver')
        const modal = this.modalService.open(ChangeDriverDialogComponent, {
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.data = {
            RouteId: this.routeSeleted.id,
        };
        modal.result.then((data: any) => {

            console.log(data);

            if (data === undefined) {
            } else {
                let dateDeliveryStart;
                if (
                    this.dateSearch.value.year &&
                    this.dateSearch.value.month &&
                    this.dateSearch.value.day
                ) {
                    dateDeliveryStart = objectToString(this.dateSearch.value);
                } else {
                    dateDeliveryStart = moment(this.dateSearch.value).format('YYYY-MM-DD');
                }
                this.load(dateDeliveryStart);
            }
        });
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
        }

        this.selected = [];
        this.selectedRouteId = routeId;



        this.routeSeleted = this.routes.find((x: any) => x.id == routeId);

        console.log(this.routeSeleted, 'routeSeleted');

        this.getDataDuringDelivery(this.routeSeleted.id);

        this.getRouteStartData(this.routeSeleted.id)

        let url = environment.apiUrl + 'route_planning/route/assigned/' + routeId;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#assigned';
        this.table = $('#assigned').DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [0, 'asc'],
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
                <"top-button-hide"><'table-responsive-md't>
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
                    title: this._translate.instant('DELIVERY_POINTS.ORDER'),
                    render: function (data, type, row) {
                        return (
                            '<input class="form-control aling-input-table p-0 pl-1 pr-1 text-center  order_input" type="number" style="width:50px"  min="1" name="' +
                            row.id +
                            '" value="' +
                            data +
                            '">'
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
                    title: this._translate.instant('DELIVERY_POINTS.POINT'),
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
                    title: this._translate.instant('DELIVERY_POINTS.POPULATION'),
                },
                {
                    data: 'address',
                    title: this._translate.instant('DELIVERY_POINTS.ADDRESS'),
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
                    title: this._translate.instant('ROUTE_PLANNING.ZONE.DELIVERY_POINTS_TABLE.OPENING_TIME'),
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
                    title: this._translate.instant('DELIVERY_POINTS.TRAVEL_TIME'),
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'arrivalDayTime',
                    title: 'Hora de llegada programada',
                    render: (data, type, row) => {
                        return (
                            '<span>' +
                            this.dayTime.transform(data, false, false) +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'delayTime',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.CLIENT_DELAY'),
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
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
                    data: 'vehicleWaitTime',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.VEHICLE_WAIT_TIME'),
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'serviceTime',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.DELIVERY_TIME'),
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data, true);
                    },
                },
                {
                    data: 'travelDistanceToNext',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.TOTAL_KM'),
                    render: (data, type, row) => {
                        return this.distance.transform(data);
                    },
                },
                {
                    data: 'customerWaitTime',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.WAIT_TIME'),
                    render: (data, type, row) => {
                        return secondsToAbsoluteTime(data);
                    },
                },
                {
                    data: 'driverArrivalTime',
                    render: (data, type, row) => {
                            

                        let arrivalTime = dayTimeAsStringToSeconds(
                            moment(data).format('HH:mm'),
                        );
                        console.log(arrivalTime, 'arrivalTime');

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
                    title: 'Valoración',
                    data: 'valorationTotal',
                    render: (data, type, row) => {
                        const valoration = data.split('/');
                        const varClass = valoration[0] !== valoration[1] ? 'red' : '';
                        return '<span class="' +
                            varClass + '">' + data +
                            '</span>'
                    }
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
                        /* 
                        if (data !== 'Finalizado') {
                            varClass = 'yellow';
                        } */

                        if (data === 'Finalizado' && +row.howOftenReturned > 0) {
                            data = 'Finalizado (segunda vuelta)';
                            varClass = 'green';
                        }

                        if (data === 'Asignado') {
                            varClass = '';
                        }
                        return (
                            '<div class="text-center">' +
                            '<button class="btn btn-default warning text-center ' +
                            varClass +
                            '"><i class="fas fa-history pr-1"></i> ' +
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
                    }
                },
                {
                    title: this._translate.instant('ASSIGNED_ROUTES.ALBARAN_DETAIL'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones += `
                            <div class="text-center editar col">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/eye-outline.svg">
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

        $('#search').on('keyup', function () {
            $(table).DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr("class");

        this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.timeInterval = window.setInterval(() => {
            this.table.ajax.reload();
        }, this.refreshTime);
        this.editar(tbody, table);
        this.receipt(tbody, table);
        this.select(tbody, table);
        this.waning(tbody, table);
        this.onChangeOrderValue(tbody, table);
    }

    endRoute() {
        const modal = this.modalService.open(ModalConfirmEndRouteComponent, {
            centered: true,
            backdrop: 'static',
        });
        modal.result.then((data: any) => {
            if (data) {
                this.stateRoutePlanningService
                    .finishRoute(this.routeSeleted.id)
                    .pipe(take(2))
                    .subscribe(
                        (data) => {
                            if (data) {
                                if (this.dateSearch.value && this.dateSearch.value.year) {
                                    this.load(objectToString(this.dateSearch.value));
                                } else {
                                    this.load(this.dateSearch.value);
                                }
                            }
                        },
                        (error) => {
                            this.toast.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }

    routeChange() {
        let data = {
            routeId: this.routeSeleted,
            routes: this.routes,
            deliveryPoints: this.selected,
        };

        const modal = this.modalService.open(ModalRoutesComponent, {
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.data = data;

        modal.result.then((data: any) => {
            if (data) {
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
            //that.editElement(data)
            that._router.navigate([`/control-panel/assigned/${data.id}`]);
        });
    }

    waning(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.warning', function () {
            let data = table.row($(this).parents('tr')).data();
            that.showWarning(data);
        });
    }

    receipt(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.receipt', function () {
            let data = table.row($(this).parents('tr')).data();
            that.receiptElement(data);
        });
    }

    async receiptElement(data: any) {
        await this.stateRoutePlanningService.getPdfDeliveryPoint(data.routeId, data.id);
    }

    showWarning(data: any): void {
        const modal = this.modalService.open(ModalWarningComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.data = data;
    }

    editElement(data: any): void {
        const modal = this.modalService.open(DetailComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.data = data;
    }

    importPlanSession(file: File) {
        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (e) => {
            if (file.type === 'application/json') {
                this.validateJSON(fileReader.result.toString(), false);
            } else {
                // this.validateCSV(fileReader.result.toString());
            }
        };
    }

    private validateJSON(fileContent: string, productGlobalImport: boolean): void {
        let validator = new Validator();
        if (validator.isJSON(fileContent)) {
            let parsedJSON = JSON.parse(fileContent);
            this.JSONValidation(parsedJSON, productGlobalImport);
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <h3>El JSON importado tiene un mal formato</h3>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        }
    }

    private openImportedFileErrorDialog(html: string) {
        const dialogRef = this.modalService.open(ErrorDialogComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });
        dialogRef.componentInstance.data = {
            errorDescription: html,
            errorTitle: 'Fallo en la importación del fichero',
        };
    }

    private async JSONValidation(parsedJSON: any, productGlobalImport: boolean) {

        const deliveryPointsMap: { [key: string]: any } = {};

        if (parsedJSON.deliveryPoints) {

            if (parsedJSON.deliveryPoints.length === 0) {
                
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo debe contener al menos un punto de entrega.</h3>                                            
                                        </div>
                                </div>`;

                this.openImportedFileErrorDialog(dialogHTML);
                return;
            }
            for (let i = 0; i < parsedJSON.deliveryPoints.length; ++i) {
                if (!this.checkUniqueId(parsedJSON.deliveryPoints[i], deliveryPointsMap, i))
                    return;
            }

            let deliveryPoints = removeNulls(
                plainToClass(ImportedProductsDeliveryPointDto, parsedJSON),
            ) as ImportedProductsDeliveryPointDto;

            this.sendProducts(deliveryPoints, productGlobalImport);
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El JSON debe contener el campo "deliveryPoints" el cual contiene todos los puntos de entrega</h3>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        }
    }

    private checkUniqueId(
        deliveryPoint: any,
        deliveryPointsIds: { [key: string]: {} },
        index: number,
    ) {
        if (deliveryPoint.id && typeof deliveryPoint.id === 'string') {

            deliveryPointsIds[deliveryPoint.id] = deliveryPoint;
            return true;

        } else if (typeof deliveryPoint.id !== 'string') {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene un punto de entrega con un formato incorrecto en el ID</h3>                                                                      
                                            <h4>Error en el punto de entrega n. ${index +
                1}</h4>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene un punto de entrega sin el campo ID</h3>                                                                      
                                            <h4>Error en el punto de entrega n. ${index +
                1}</h4>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
            return false;
        }
    }

    sendProducts(deliveryPointWithProducts: any, productGlobalImport: boolean) {
        console.log('aqui')
        if (!productGlobalImport) {
            console.log('en el if sendProducts');
            deliveryPointWithProducts.routeId = this.selectedRouteId;
            this.stateRoutePlanningService
                .uploadProductosRoute(deliveryPointWithProducts)
                .subscribe(
                    (data) => {
                        this.getRouteStartData(this.selectedRouteId)
                        this.getDataDuringDelivery(this.selectedRouteId);
                        this.table.ajax.reload();
                        this.toast.displayWebsiteRelatedToast(
                            'Archivo cargado satisfactoriamente',
                        );
                    },
                    (error) => {
                        this.toast.displayHTTPErrorToast(error.status, error.error);
                    },
                );
        } else {
            console.log('en el else sendProducts');
            if (
                this.dateSearch.value.year &&
                this.dateSearch.value.month &&
                this.dateSearch.value.day
            ) {
                deliveryPointWithProducts.dateDeliveryStart = moment(
                    `${this.dateSearch.value.year
                    }-${this.dateSearch.value.month
                        .toString()
                        .padStart(2, '0')}-${this.dateSearch.value.day
                            .toString()
                            .padStart(2, '0')}`,
                ).format('YYYY-MM-DD');
            } else {
                deliveryPointWithProducts.dateDeliveryStart = moment(
                    this.dateSearch.value,
                ).format('YYYY-MM-DD');
            }
            this.stateRoutePlanningService
                .uploadProductosRouteGlobal(deliveryPointWithProducts)
                .subscribe(
                    (data) => {
                        this.getRouteStartData(this.selectedRouteId)
                        this.getDataDuringDelivery(this.selectedRouteId);
                        this.table.ajax.reload();
                        this.toast.displayWebsiteRelatedToast(
                            'Archivo cargado satisfactoriamente',
                        );
                    },
                    (error) => {
                        this.toast.displayHTTPErrorToast(error.status, error.error);
                    },
                );
        }
    }

    importProductGlobal(file: File) {
        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (e) => {
            if (file.type === 'application/json') {
                this.validateJSON(fileReader.result.toString(), true);
            } else {
                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('CONTROL_PANEL.NOT_JSON'),
                );
            }
        };
    }

    ImportProductFromCloudGlobal() {
        let dateDeliveryStart: any;
        if (
            this.dateSearch.value.year &&
            this.dateSearch.value.month &&
            this.dateSearch.value.day
        ) {
            dateDeliveryStart = objectToString(this.dateSearch.value);
        } else {
            dateDeliveryStart = moment(this.dateSearch.value).format('YYYY-MM-DD');
        }
        this.stateRoutePlanningService
            .ftpUploadProductosRouteGlobal(dateDeliveryStart)
            .subscribe(
                (data) => {
                    this.table.ajax.reload();
                    this.toast.displayWebsiteRelatedToast(
                        'Archivo cargado satisfactoriamente',
                    );
                },
                (error) => {
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    convertTime(date: string) {
        let converted = '';

        if (date != null) {
            converted = moment(date).format('DD/MM/YYYY HH:mm:ss');
        }
        return converted;
    }

    downloadRouteSelected() {

        this.dataRoutes = [];

        this.dataRoutes.push(this.selectedRouteId);

        this.stateEasyrouteService.getPdfRouteAssigneProduct(this.dataRoutes);

    }

    donwnloadAllRoute() {

        console.log(this.routes, 'en la funcion descargar todos inicio');

        this.dataRoutes = [];


        /* Si es multiple se puede usar esa funcion */

        for (let i = 0; i < this.routes.length; i++) {
            this.dataRoutes.push(this.routes[i].id);
        }

        this.stateEasyrouteService.getPdfRouteAssigneProduct(this.dataRoutes);
    }


    showCardInfo() {
        this.togglInfor = !this.togglInfor;
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

                console.log( this.routeStartData, ' this.routeStartData');

                this.show = true;


                this.detectChanges.detectChanges();


            });
    }

    /* decimal(number: any){
       console.log(this.separatorQuantity(number), 'funcion de prueba')
        return number.toFixed(2).split('.');
      } */

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
    formatEuro(quantity) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);

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

    decimalKm(number){
        return number.toFixed(2).split('.')
    }

    createRetainerRoute(){
        const modal = this.modalService.open(ModalCreateRetainerRouteComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static',
        });


        modal.result.then(async (data)=> {
            if(data){
                let structure = data[1];
                if (
                    this.dateSearch.value.year &&
                    this.dateSearch.value.month &&
                    this.dateSearch.value.day
                ) {
                    structure.date = objectToString(this.dateSearch.value);
                } else {
                    structure.date = moment(this.dateSearch.value).format('YYYY-MM-DD');
                }
                const preferences = await this.optimizationPreferences$.pipe(take(1)).toPromise();
                structure.warehouse = preferences.warehouse;

                this.loading.showLoading();

                this.backend.post('route_planning/route_retainer', structure).pipe(take(1)).subscribe(()=>{
                    this.loading.hideLoading();
                    this.load(structure.date)
                }, error => {
                    this.loading.hideLoading();
                    this.toast.displayHTTPErrorToast(error.status, error.error.error);
                })
            }
        });
    }
}
