import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment-timezone';
import { take, takeUntil } from 'rxjs/operators';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router, Event, NavigationExtras } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { secondsToAbsoluteTime } from '../../../../../shared/src/lib/util-functions/time-format';
import { secondsToDayTimeAsString } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { environment } from '@optimroute/env/environment';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getYearToToday, objectToString, getToday } from '../../../../../shared/src/lib/util-functions/date-format';
import { FormControl } from '@angular/forms';
import { ErrorDialogComponent } from 'libs/shared/src/lib/components/error-dialog/error-dialog.component';
import { Validator } from 'class-validator';
import { ImportedProductsDeliveryPointDto, removeNulls } from '@optimroute/shared';
import { plainToClass } from 'class-transformer';
import { Observable, Subject } from 'rxjs';
import { OptimizationPreferences } from '../../../../../backend/src/lib/types/preferences.type';
import { ModalCreateRetainerRouteComponent } from './modal-create-retainer-route/modal-create-retainer-route.component';
import { PreferencesFacade } from '../../../../../state-preferences/src/lib/+state/preferences.facade';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { ModalCreateClientsComponent } from './modal-create-clients/modal-create-clients.component';
import { contrastColor } from '../../../../../shared/src/lib/util-functions/color-functions';
import { ModalRepostajeTravelComponent } from './modal-repostaje-travel/modal-repostaje-travel.component';
import { DeliveryPoint, RoutePlanningFacade } from '@optimroute/state-route-planning';
import { ModalAddTemplateComponent } from './modal-add-template/modal-add-template.component';
declare var $: any;

@Component({
    selector: 'easyroute-travel-tracking-list',
    templateUrl: './travel-tracking-list.component.html',
    styleUrls: ['./travel-tracking-list.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
    ]
})
export class TravelTrackingListComponent implements OnInit, OnDestroy {

    table: any;

    profile: Profile;

    min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

    dateSearchFrom: FormControl = new FormControl(dateToObject(getToday()));

    nextDay: boolean = false;

    today: string;

    timeInterval: any;

    filter: FilterState = {
        name: 'travel_tracking',
        values: {
            routePlanningRouteId: '',
            userId: '',
            dateDeliveryStart: this.getToday(),
        }
    };

    zones: Zone[];

    users: any[] = [];

    totalizedDate: any;

    showCode: boolean = false;

    showDrop: boolean = false;

    showUser: boolean = true;

    showZones: boolean = true;

    selectedRouteId: any;

    optimizationPreferences$: Observable<OptimizationPreferences>;
    unsubscribe$ = new Subject<void>();

    dataRoutes: any[] = [];

    selectAll: boolean = false;

    selected = [];

    selectSlope = [];

    totalRefueling: any;

    deliveryPoints: DeliveryPoint[];
    deliveryPointFilter: DeliveryPoint[];
    inputFilter: any;


    constructor(
        private authLocal: AuthLocalService,
        private _modalService: NgbModal,
        private _translate: TranslateService,
        private router: Router,
        private toastService: ToastService,
        private backendService: BackendService,
        private preferencesFacade: PreferencesFacade,
        private loadingService: LoadingService,
        private detectChange: ChangeDetectorRef,
        public zoneFacade: StateDeliveryZonesFacade,
        private stateEasyrouteService: StateEasyrouteService,
        private stateRoutePlanningService: StateRoutePlanningService,
        private stateFilters: StateFilterStateFacade,
        public facadeProfile: ProfileSettingsFacade,
        private facade: RoutePlanningFacade,
    ) { }

    ngOnInit() {

        this.loadFilters();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {

                        this.profile = data;
                    });
            }
        });

        this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;

    }

    async loadFilters() {
        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

        this.filter = filters.find(x => x && x.name === 'travel_tracking') ? filters.find(x => x.name === 'travel_tracking') : this.filter;


        if (this.filter.values.dateDeliveryStart) {
            this.dateSearchFrom = new FormControl(dateToObject(this.filter.values.dateDeliveryStart));
        }

        this.getUsers();
    }

    /* clientes */
    getDeliveryPoint() {
        
        this.deliveryPoints = [];
        this.deliveryPointFilter = [];
        this.inputFilter = '';

        this.stateRoutePlanningService
        .postDeliveryPoint(this.filter.values)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {

            this.deliveryPoints = data.data;

            this.detectChange.detectChanges();

        },
        (error) => {

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },);

    }

    /* usuarios */
    getUsers() {

        this.loadingService.showLoading();

        this.showUser = false;

        this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
            (data: any) => {

                this.users = data.data;

                this.showUser = true;

                this.getAssigned();

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

    getTotalRefueling() {

        this.showZones = false;

        this.stateRoutePlanningService
        .getRefuelingTotalTravel(this.filter.values)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {

            this.totalRefueling = data;

            this.showZones = true;

            this.detectChange.detectChanges();

        });

    }

    /* informacion de cuadros */
    loadTotalizedDate() {

        this.showCode = false;

        this.backendService

            .post('route_planning/route/travel_tracking_totalized', this.filter.values)
            .pipe(
                take(1)).subscribe(

                    (resp: any) => {

                        this.totalizedDate = null;

                        this.totalizedDate = resp;

                        this.showCode = true;

                        this.detectChange.detectChanges();

                        if (this.zones.length > 0) {
                            this.cargar();

                        } else {

                            this.zones = [];
                            this.cargar();
                        }

                        this.getDeliveryPoint();

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

    /* para rutas */
    getAssigned() {

        this.showZones = false;

        this.stateRoutePlanningService
            .getRoutesAssignedSheet(this.filter.values.dateDeliveryStart.substring(0, 10))
            .pipe(take(1))
            .subscribe((data) => {

                this.zones = data.data;

                this.showZones = true;

                this.detectChange.detectChanges();

                this.loadTotalizedDate();

                this.getTotalRefueling();

            });
    }


    cargar() {

        if (this.table) {
            this.table.clear();
            //this.table.state.clear();
        }

        let that = this;

        let url = environment.apiUrl + 'route_planning/route/travel_tracking?' +

            (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
                this.filter.values.routePlanningRouteId : '') +

            (this.filter.values.userId != '' ? '&userId=' +
                this.filter.values.userId : '') +


            (this.filter.values.dateDeliveryStart != '' ? '&dateDeliveryStart=' +
                this.filter.values.dateDeliveryStart : '');


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        let table = '#travelTracking';

        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            /* order: [4, 'desc'], */
          // order: [[0, 'desc']],
            order:[],
            colReorder: true,
            stateSave: true,
            //columnDefs: [{ targets: 5, type: 'date' }],
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
                            <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'B>
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
            buttons: [
                {
                    extend: 'colvis',
                    text: '',
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
            rowCallback: (row, data) => {

                console.log('hay cambios en la tabla ?');


                if ($.inArray(data.id, this.selected) !== -1) {

                    $(row).addClass('selected');
                    $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');
                    setTimeout(() => {
                        $('#ck-' + data.id.replace(' ', '-')).prop('checked', true);
                    }, 900);

                }
                $(row).addClass('point');
            },

            columns: [
                {
                    data: 'id',
                    sortable: false,
                    searchable: false,
                    ordering: false,
                    buttons: false,
                    render: (data, type, row) => {
                        return (`
                            <div class="row justify-content-center backgroundColorRow">
                              <div class="round-style-cost round-little-cost text-center">
                                <input type="checkbox" class="isActive" id="ck-${data}"  />
                                <label></label>
                              </div>
                            </div>
                        `);
                    }
                },
                {
                    data: 'name',
                    className: 'text-left padding-travel',
                    title: this._translate.instant('TRAVEL_TRACKING.ROUTE'),
                    render: (data, type, row) => {
                        let id = data;
                        if (id.length > 35) {
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
                    data: 'id',
                    className: 'text-center',
                    title: this._translate.instant('TRAVEL_TRACKING.CONDITION'),
                    render: (data, type, row) => {

                        let parcent = row.percentComplete;

                        let status = row.statusRouteId == 3 ? 'state-end' : row.statusRouteId == 2 && row.percentComplete > 0 ? 'state-process' : 'state-assigned';

                        let statusText = row.statusRouteId == 3 ? 'Finalizado' : row.statusRouteId == 2 && row.percentComplete > 0 ? 'En activo' : 'Por iniciar';



                        return (`
                            <div class="condition-state ${status}">
                               ${statusText}
                            </div>
                        `);


                    }
                },
                {
                    data: 'id',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.PROCESS'),
                    render: (data, type, row) => {

                        let parcent = row.percentComplete;

                        let classSpan = that.getContrastColor(row.color);

                        if (!row.percentComplete && !row.totalDelivered) {
                            return (`
                                <div class="progress light  progres-travel">
                                    <div class="progress-bar value-bar-travel" style="background-color:${row.color}; color:${parcent < 40 ? '#000' : '#FFF'}; width:${parcent}% !important;">
                                        <span class="pl-2">${row.totalDelivered}/${row.totalClient}</span>
                                    </div>

                                </div>
                    `);
                        } else {
                            return (`
                                <div class="progress light  progres-travel">
                                    <div class="progress-bar complete border-travel" style="background-color:${row.color}!important; width:${row.percentComplete}% !important" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"">

                                        <span class="pl-2" style="color:${classSpan}">${row.totalDelivered}/${row.totalClient}</span>

                                    </div>
                                </div>
                            `);
                        }

                    }
                },
                {
                    data: 'driverName',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.ASSIGNED_DRIVER'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                {
                    data: 'registration',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.VEHICLE_REGISTRATION'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                {
                    data: 'startTime',
                    sortable: false,
                    searchable: false,
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.INIT'),
                    render: (data, type, row) => {
                        return '<span class="text-center">' + data + '</span>';
                    }
                },
                {
                    data: 'endTime',
                    sortable: false,
                    searchable: false,
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.END'),
                    render: (data, type, row) => {
                        return '<span class="text-center">' + data + '</span>';
                    }
                },
                {
                    data: 'totalClient',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.CLIENT')
                },
                {
                    data: 'totalAlbarans',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.ALBARANS'),
                },
                {
                    data: 'totalInvoice',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.BILLING'),
                    render: (data, type, row) => {

                        if (data) {

                            return '<span class="text-center">' + this.decimal(data) + '</span>';

                        } else {

                            return '<span class="text-center">' + this.decimal(data) ? data : '' + '</span>';

                        }
                    },
                },
                {
                    data: 'totalDelayTime',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.DELAY_TIME'),
                    render: (data, type, row) => {

                        return '<span class="text-center">' + data + '</span>';
                    },
                },
                {
                    data: 'totalOutRange',
                    title: 'Fuera radio',
                    visible: false,
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
                    data: 'totalIncident',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.INCIDENTS'),
                },
                {
                    data: 'totalDevolution',
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.RETURNS'),
                },

                {
                    data: 'totalCost',
                    className: 'text-left',
                    visible: this.validateCost(),
                    title: this._translate.instant('TRAVEL_TRACKING.COST'),
                    render: (data, type, row) => {

                        if (data) {

                            return '<span class="text-center">' + this.decimal(data) + '</span>';

                        } else {

                            return '<span class="text-center">' + this.decimal(data) ? data : '' + '</span>';

                        }
                    },
                }
            ],
        });



        $('.dataTables_filter').html(`
        <div class="input-group datatables-input-group-width">
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
    `);



        $('.dt-button').css("border", "0px");

        $('.dt-button').css("height", "0px");

        const $elem = $('.dt-button');


        $elem[0].style.setProperty('padding', '0px', 'important');

        $('.dt-buttons').css("height", "0px");

        $('#dt-buttons-table').off('click');

        $('#dt-buttons-table').on('click', function (event: any) {

            $('.dt-button').click();

        });

        $('#search').on('keyup', function () {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');


        /* evento del reorder */


        this.initEvents(table + ' tbody', this.table);
    }


    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.select(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.text-left', function () {
            let data = table.row($(this).parents('tr')).data();

            that.operRouter(data);


        });
    }

    select(tbody: any, table: any, that = this) {


        $(tbody).on('click', 'tr', function () {

            console.log('entra aqui');
            that.selectAll = true;

            let data = table.row($(this)).data();
            //let data = table.row($(this).parents('tr')).data();

            that.selectAll = true;

            //var index = $.inArray(+data.id, that.selected);
            var index = that.selected.findIndex(x => x === data.id);

            if (index === -1) {

                that.selected.push(+data.id);

                $('#ck-' + data.id).prop('checked', true);

                $('#btn-' + data.id).prop('disabled', true);

                $('#btn1-' + data.id).prop('disabled', true);

                $('#thead-1').addClass('hidden');

                $('#thead-2').removeClass('hidden');

                $(this).parent().parent().addClass('selected-travel');

                if (that.table.rows()[0].length == that.selected.length) {

                    $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');

                    $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');
                }

                that.table.rows()[0].forEach((element) => {

                    let disabled = that.table.row(element).data();

                    $('#btnTicket-' + disabled.id).prop('disabled', true);

                    $('#btn-' + disabled.id).prop('disabled', true);

                    $('#btn1-' + disabled.id).prop('disabled', true);


                });

            } else {

                that.selectAll = false;

                that.selected.splice(index, 1);

                $('#ck-' + data.id).prop('checked', false);

                $('#btn-' + data.id).prop('disabled', false);

                $('#btn1-' + data.id).prop('disabled', false);

                $('#checkboxDriverCost').prop('checked', that.selectAll).removeAttr('checked');

                $('#checkboxDriverCost1').prop('checked', that.selectAll).removeAttr('checked');

                that.table.rows()[0].forEach((element) => {

                    let disabled = that.table.row(element).data();

                    if (that.selected.length === 0) {

                        $('#btnTicket-' + disabled.id).prop('disabled', false);

                        $('#btn-' + disabled.id).prop('disabled', false);

                        $('#btn1-' + disabled.id).prop('disabled', false);

                        $('#thead-1').removeClass('hidden');

                        $('#thead-2').addClass('hidden');
                    }

                });

                $(this).parent().parent().removeClass('selected-travel');

            }



            that.table.rows()[0].forEach((element) => {

                if (that.selected.find(x => +x.id === +  that.table.row(element).data().id) === undefined) {

                    that.selectAll = false;

                }
            });

            $(this).toggleClass('selected-travel');

            that.detectChange.detectChanges();

        });




    }


    selectAllFunc() {

        this.table.rows()[0].forEach((element) => {


            let data = this.table.row(element).data();

            var index = this.selected.findIndex(x => x === data.id);

            if (this.selectAll) {

                var x = this.selected.filter(x => x == data.id);

                if (x.length == 0) {

                    this.selected.push(data.id);

                    $('#ck-' + data.id).prop('checked', true);


                    $(this.table.row(element).node()).addClass('selected-travel');
                }

            } else {


                $('#ck-' + data.id).prop('checked', false);


                $(this.table.row(element).node()).removeClass('selected-travel');

                $('#checkboxDriverCost').prop('checked', false).removeAttr('checked');

                this.selected.splice(index, 1);

                this.selected = [];

                $(this).toggleClass('selected-travel');
            }



            this.detectChange.detectChanges();
        });

    }
    ftpJsonRoute() {

        if (this.selected.length > 0) {

            this.stateRoutePlanningService
                .ftpRouteDeliveryPointGeneral(this.selected)
                .subscribe(
                    (resp) => {
                        this.toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.FILE_SENT_SUCCESSFULLY'),
                        );
                    },
                    (error: any) => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        }

    }

    ftpJsonRouteGeneral() {

        if (this.zones.length > 0) {
            this.dataRoutes = [];

            for (let i = 0; i < this.zones.length; i++) {
                this.dataRoutes.push(this.zones[i].id);
            }

            this.stateRoutePlanningService
                .ftpRouteDeliveryPointGeneral(this.dataRoutes)
                .subscribe(
                    (resp) => {
                        this.toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.FILE_SENT_SUCCESSFULLY'),
                        );
                    },
                    (error: any) => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        }

    }

    openSetting() {

        this.router.navigateByUrl('/preferences?option=summaryBoxes');
    }

    forceFinished() {
        /*  const modal = this._modalService.open(ModalForceFinishedComponent, {
           backdrop: 'static',
           backdropClass: 'modal-backdrop-ticket',
           centered: true,
           size: 'sm',
           windowClass: 'modal-infor'
         });

         modal.componentInstance.title = this._translate.instant('LOADING_DOCK.FORCE_FINISHED');
         modal.componentInstance.subTitle = this._translate.instant('LOADING_DOCK.SUB_TITLE_FORCE_FINISHED');
         modal.componentInstance.message = this._translate.instant('LOADING_DOCK.MESSAGE_FORCE_FINISHED');
         modal.componentInstance.titleBotton = this._translate.instant('LOADING_DOCK.FINISH_ALL');


         modal.result.then((result) => {
           if (result) {
             this.loadingService.showLoading();
             this.backendService.post('dock_route_force_finished_all?dateFrom=' + this.filter.values.dateFrom)
                 .pipe(take(1)).subscribe((data)=>{
                     this.loadingService.hideLoading();
                     this.ngOnInit();
                 }, error =>{
                     this.loadingService.hideLoading();
                     this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                 })
           }
         }, (reason) => {

           this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
         }); */
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

    openDash() {
        this.router.navigate(['dashboard'])
    }

    test(Event: any) {
        console.log(Event, 'Event');

    }

    changeDate(name: string, dataEvent: NgbDate) {

        if (name == 'from') {

            this.filter = {

                ...this.filter,

                values: {

                    ...this.filter.values,

                    dateDeliveryStart: objectToString(dataEvent)
                }
            }

            this.stateFilters.add(this.filter);

        }


        this.getAssigned();



    }

    changeUserId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }

    changeroutePlanningRouteId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }

    setFilter(value: any, property: string, sendData?: boolean) {

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                [property]: value
            }
        }


        this.stateFilters.add(this.filter);

        this.loadTotalizedDate();

        this.getTotalRefueling();
    }

    /* CARGAR ALBARAN */

    importProductGlobal(file: File) {
        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (e) => {
            if (file.type === 'application/json') {
                this.validateJSON(fileReader.result.toString(), true);
            } else {
                this.toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONTROL_PANEL.NOT_JSON'),
                );
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
        const dialogRef = this._modalService.open(ErrorDialogComponent, {
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

        deliveryPointWithProducts.routeIds = this.selected;

        if (!productGlobalImport) {

            deliveryPointWithProducts.routeId = this.filter.values.routePlanningRouteId;
            this.stateRoutePlanningService
                .uploadProductosRoute(deliveryPointWithProducts)
                .subscribe(
                    (data) => {

                        this.table.ajax.reload();
                        this.toastService.displayWebsiteRelatedToast(
                            'Archivo cargado satisfactoriamente',
                        );
                        this.selected = [];
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error);
                    },
                );
        } else {

            if (this.filter.values.dateDeliveryStart) {

                deliveryPointWithProducts.dateDeliveryStart = this.filter.values.dateDeliveryStart;

            } else {

                deliveryPointWithProducts.dateDeliveryStart = this.filter.values.dateDeliveryStart;

            }


            this.stateRoutePlanningService
                .uploadProductosRouteGlobaTravel(deliveryPointWithProducts)
                .subscribe(
                    (data) => {

                        this.table.ajax.reload();
                        this.toastService.displayWebsiteRelatedToast(
                            'Archivo cargado satisfactoriamente',
                        );
                        this.selected = [];
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error);
                    },
                );
        }
    }

    ImportProductFromCloudGlobal() {

        let data = {
            dateDeliveryStart: this.filter.values.dateDeliveryStart,
            routeIds: this.selected
        }

        this.stateRoutePlanningService
            .ftpUploadProductosRouteGlobalTravel(data)
            .subscribe(
                (data) => {
                    this.table.ajax.reload();
                    this.toastService.displayWebsiteRelatedToast(
                        'Archivo cargado satisfactoriamente',
                    );
                    this.selected = [];
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    /* crear reten */

    createRetainerRoute() {
        const modal = this._modalService.open(ModalCreateRetainerRouteComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            windowClass: 'modal-travel-retainer',
        });


        modal.result.then(async (data) => {
            if (data) {
                let structure = data[1];
                if (this.filter.values.dateDeliveryStart) {

                    structure.date = this.filter.values.dateDeliveryStart;

                } else {

                    structure.date = this.filter.values.dateDeliveryStart;

                }

                const preferences = await this.optimizationPreferences$.pipe(take(1)).toPromise();

                structure.warehouse = preferences.warehouse;


                this.loadingService.showLoading();

                this.backendService.post('route_planning/route_retainer', structure).pipe(take(1)).subscribe(() => {

                    this.loadingService.hideLoading();

                    // this.load(structure.date)


                    this.getAssigned();

                    // this.table.ajax.reload();

                    this.toastService.displayWebsiteRelatedToast(
                        'Ruta creada satifactoriamente',
                    );

                }, error => {

                    this.loadingService.hideLoading();

                    this.toastService.displayHTTPErrorToast(error.status, error.error.error);

                })
            }
        });
    }

    decimal(numb) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
    }

    validateCost() {
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


    createClient() {
        const modal = this._modalService.open(ModalCreateClientsComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            windowClass: 'modal-travel-retainer-client',
        });

        console.log(this.zones);
        modal.componentInstance.zones = this.zones.filter((x: any) => x.status_route.id !== 3);

        modal.result.then(async (data) => {
            if(data){
                this.loadingService.showLoading();
                let points = data.points.map((ele:any)=> ele.id);
                this.backendService.post('route_planning/route/' + data.route + '/add_points', {points}).pipe(take(1)).subscribe(()=>{
                    this.loadingService.hideLoading();
                    this.loadTotalizedDate();
                }, error =>{
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                })
            }

        });
    }

    operRouter(data: any) {

        console.log(data.statusRouteId, 'statusRouteId')

        const navigationExtras: NavigationExtras = {
            state: {
                id: data.id,
                name: data.name,
                statusRouteId: data.statusRouteId,
                date: this.filter.values.dateDeliveryStart
            }
        };

        this.router.navigate(['travel-tracking/', data.id], navigationExtras);

    }

    editTable() {
        console.log('editar table');
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getContrastColor(originalColor: string) {
        return contrastColor(originalColor === '#000' ? '#000000' : originalColor);
    }

    openModalRepostaje(){

        const modal = this._modalService.open(ModalRepostajeTravelComponent, {

            backdrop: 'static',

            size:'md',

            centered: true,

            backdropClass: 'modal-backdrop-ticket',

            windowClass:'modal-repostaje',

        });

        modal.componentInstance.dateDeliveryStart = this.filter.values.dateDeliveryStart;

        modal.result.then((data: any) => {
            if (data) { }
        });


    }

    searchValue(text: string) {

        if (text && text.length >= 1) {
           
            this.deliveryPointFilter = this.deliveryPoints.filter(x => x.name.toLocaleUpperCase().includes(text.toLocaleUpperCase()))
            
        } else {
            this.deliveryPointFilter = [];
        }

    }

    selectDeliveryPoint(point: DeliveryPoint) {
        this.deliveryPointFilter = [];

        if (point && point.name) {
            this.inputFilter = point.name;
            let table = '#travelTracking';
            
            $(table)
                .DataTable()
                .search(point.name)
                .draw();
        }

    }

    loadTemplateDeliveryPoint(){

        const dialogRef = this._modalService.open(ModalAddTemplateComponent, {

            centered: true,

            backdrop: 'static',

            backdropClass: 'modal-backdrop-ticket',

            windowClass: 'modal-load-template-route',

            size:'lg'

        });

        dialogRef.componentInstance.dateDeliveryStart = this.filter.values.dateDeliveryStart;

        dialogRef.result.then((add) => {

            if (add) {

                console.log('ir a proceso para crear los puntos deliveryPOINT');

                this.loadTotalizedDate();

            }

        });

    }

}
