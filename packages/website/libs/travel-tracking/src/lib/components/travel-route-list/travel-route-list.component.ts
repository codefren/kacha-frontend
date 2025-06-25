import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { ToDayTimePipe } from '../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { DistancePipe } from '../../../../../shared/src/lib/pipes/distance.pipe';
import { secondsToAbsoluteTime, dayTimeAsStringToSeconds } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import * as moment from 'moment';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { NgbModal, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangeDriverComponent } from './modal-change-driver/modal-change-driver.component';
import { ModalChangeVehicleComponent } from './modal-change-vehicle/modal-change-vehicle.component';
import { ModalConfirmEndrouteComponent } from './modal-confirm-endroute/modal-confirm-endroute.component';
import { ModalRoutesComponent } from './modal-routes/modal-routes.component';
import { DeliveryPoint } from '@optimroute/state-route-planning';
import { ModalShowLoadsComponent } from './modal-show-loads/modal-show-loads.component';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { OptimizationPreferences } from '../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../state-preferences/src/lib/+state/preferences.facade';
import { FormControl } from '@angular/forms';
import { dateToObject, getToday, Language, MomentDateFormatter, CustomDatepickerI18n, objectToString } from '../../../../../shared/src/lib/util-functions/date-format';
import { ModalEndRoutesComponent } from './modal-end-routes/modal-end-routes.component';
import { ErrorDialogComponent } from 'libs/shared/src/lib/components/error-dialog/error-dialog.component';
import { Validator } from 'class-validator';
import { removeNulls, dateToDDMMYYY, downloadFile, ImportedProductsDeliveryPointDto, ModalGeneralWarningComponent } from '@optimroute/shared';
import { plainToClass } from 'class-transformer';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { ModalCreateClientsComponent } from '../travel-tracking-list/modal-create-clients/modal-create-clients.component';
import { ModalRepostajeComponent } from './modal-repostaje/modal-repostaje.component';
import { ModalCreateRetainerRouteInsideComponent } from './modal-create-retainer-route-inside/modal-create-retainer-route-inside.component';
import { ModalEditCostActualComponent } from './modal-edit-cost-actual/modal-edit-cost-actual.component';
declare var $: any;


@Component({
  selector: 'easyroute-travel-route-list',
  templateUrl: './travel-route-list.component.html',
  styleUrls: ['./travel-route-list.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]

})
export class TravelRouteListComponent implements OnInit, OnDestroy {
  optimizationPreferences$: Observable<OptimizationPreferences>;

  unsubscribe$ = new Subject<void>();

  data: any;

  table: any;

  timeInterval: any;

  refreshTime: number = environment.refresh_datatable_assigned;

  selected: any = [];

  disabled: boolean;

  routeSeleted: any;

  routes: any [] = [];

  selectedRouteId: any;

  dataDuringDelivery: any;

  totalRefueling: any;

  routeStartData: any;

  show: boolean = true;

  dataSelect: any;

  filter: FilterState = {
    name: 'route_details',
    values: {
        routeId:'',
        dateDeliveryStart:''
    }
};

selectAll: boolean = false;

scroll: number = 0;

idRoute: number;

showZones: boolean = true;

zones: Zone[];

dateSearchFrom: FormControl = new FormControl(dateToObject(getToday()));

min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

dataRoutes: any[] = [];

preferenceTravelCash: any = {
    summaryLoads: false,
    deliveryStatus: false,
    summaryCosts: false

  };

  profile$: Observable<Profile>;
  profileSnapShot: {
      profile: Profile['profile'];
      address: Profile['address'];
      company: Profile['company'];
  };

  profile: any;

  daraRedirectDas: any;

  constructor(
    private _router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private dayTime: ToDayTimePipe,
    private distance: DistancePipe,
    private toast: ToastService,
    private backendService: BackendService,
    private preferencesFacade: PreferencesFacade,
    private loadingService: LoadingService,
    private stateFilters: StateFilterStateFacade,
    private stateEasyrouteService: StateEasyrouteService,
    private stateRoutePlanningService: StateRoutePlanningService,
    private facade: ProfileSettingsFacade
  ) {
    this.route.queryParams.pipe(
        take(1)).subscribe(params => {

        if (this._router.getCurrentNavigation() && this._router.getCurrentNavigation().extras

            && this._router.getCurrentNavigation().extras.state) {

                console.log('if');

            this.daraRedirectDas = this._router.getCurrentNavigation().extras.state;



        }
    });
  }

  ngOnInit() {

    this.profile$ = this.facade.profile$;
    this.profile$.pipe(
        take(1),
    ).subscribe((profile) => {
        if (profile) {

            this.profileSnapShot = {
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            };

            this.profile =  this.profileSnapShot;

            this.detectChanges.detectChanges();
        }
    });


    this.getActiveRoute();

    this.refreshTime = 120 * 1000;

    /* this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe(async (data) => {

        this.refreshTime =
            data.refreshTime !== null && data.refreshTime > 0
                ? data.refreshTime * 1000
                : this.refreshTime;


    }); */

    this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;

    this.loadPreferences();


  }

  getActiveRoute(){

    this.route.params.subscribe((params) => {

        this.idRoute = params['id'];

        if (params['id'] !== 'noRoutes') {

            this.loadingService.showLoading();

            this.backendService.get('route_planning/route_data/' + params['id']).pipe(take(1)).subscribe(({data})=>{

                this.dataSelect = data;

                this.loadFilters();

                this.detectChanges.detectChanges();

                this.loadingService.hideLoading();


            }, error => {

                this.loadingService.hideLoading();

                this.toast.displayHTTPErrorToast(error.status, error.error.error);

            })
        } else {

            this.loadFilterNoRoute();
        }
    });
  }

  async loadFilterNoRoute(){

    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'route_details') ? filters.find(x => x.name === 'route_details') : this.filter;

    console.log(this.filter.values, 'loadFilterNoRoute');

    this.dateSearchFrom = new FormControl(dateToObject(this.filter.values.dateDeliveryStart ? this.filter.values.dateDeliveryStart :moment().format('YYYY-MM-DD')));
  }

  async loadFilters() {

    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'route_details') ? filters.find(x => x.name === 'route_details') : this.filter;



    if (this.filter.values.dateDeliveryStart) {

        this.filter = {

            ...this.filter,

            values: {

                ...this.filter.values,

                routeId: Number(this.idRoute),

                dateDeliveryStart: this.dataSelect.dateDeliveryStart
            }
        }

        this.stateFilters.add(this.filter);

        //this.filter.values.dateDeliveryStart = this.dataSelect.dateDeliveryStart;

    } else {

        this.filter = {

            ...this.filter,

            values: {

                ...this.filter.values,

                routeId:this.dataSelect.id,

                dateDeliveryStart: this.dataSelect.dateDeliveryStart
            }
        }
        this.stateFilters.add(this.filter);
        //this.filter.values.routeId = this.dataSelect.id;

        //this.filter.values.dateDeliveryStart = this.dataSelect.dateDeliveryStart;

    }

    this.getAssigned();
  }


    /* para rutas */
    getAssigned() {

        this.showZones = false;

        this.stateRoutePlanningService
            .getRoutesAssignedSheet(this.filter.values.dateDeliveryStart)
            .pipe(take(1))
            .subscribe((data) => {

                this.zones = data.data;

                this.showZones = true;

                this.load(this.dataSelect.dateDeliveryStart, this.dataSelect.id);

                this.detectChanges.detectChanges();


            });
      }


  load(date: any, routeId?: any) {

    this.stateRoutePlanningService

        .getRoutesAssigned(date, this.dataSelect.statusRouteId )

        .pipe(takeUntil(this.unsubscribe$))

        .subscribe((data) => {

            this.routes = data.data;

            this.detectChanges.detectChanges();

            if (this.routes.length > 0) {

                if (this.dataSelect.statusRouteId != 3) {

                    this.cargar(routeId ? routeId : data.data[0].id);

                } else {

                    this.History(routeId ? routeId : data.data[0].id);

                }

                this.selectedRouteId = routeId ? routeId : data.data[0].id;

            } else {

                this.selectedRouteId = undefined;

                this.routeSeleted = undefined;
            }

        });
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

  getTotalRefueling(vehicleId: number, dateDeliveryStart: string) {

    this.show = false;

    this.stateRoutePlanningService

        .getRefuelingTotalRoute(vehicleId, dateDeliveryStart)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {

            this.totalRefueling = data;

            this.show = true;

            this.detectChanges.detectChanges();
        });
  }

  loadPreferences() {

    this.loadingService.showLoading();

    this.backendService.get('company_preference_box_route').pipe(take(1)).subscribe(({ data }) => {

      this.loadingService.hideLoading();

      this.preferenceTravelCash = data;

      this.detectChanges.detectChanges();

    }, (error) => {



      this.loadingService.hideLoading();

      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );

    });

  }




  cargar(routeId: number) {

    let that = this;

    if (this.disabled) return;

    if (this.table) {
        this.table.clear();
    }

    this.selected = [];

    this.selectedRouteId = routeId;

    this.routeSeleted = this.routes.find((x: any) => x.id == routeId);

    console.log(this.routeSeleted)
    this.getDataDuringDelivery(this.routeSeleted.id);

    this.getRouteStartData(this.routeSeleted.id);

    this.getTotalRefueling(this.routeSeleted.vrp_vehicle.vehicleId, this.routeSeleted.dateDeliveryStart);



    this.moveALL();

    let url = environment.apiUrl + 'route_planning/route/assigned/' + routeId;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#assigned';
    this.table = $('#assigned').DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: true,
        scrollX: true,
        autoWidth: false,
        colReorder: true,

        stateSaveParams: function (settings, data) {
            data.search.search = "";
            $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
          },
          initComplete: function (settings, data) {
            settings.oClasses.sScrollBody = "";
            $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
          },
          drawCallback: (settings, json) => {
            setTimeout(() => {
              $('#assigned').DataTable().columns.adjust();
            }, 100);
          },

        lengthMenu: [50, 100],
        dom: `
            <'row'
                <'col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                    <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 buttonDom'>
                >
                <'col-xl-4 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                    <'row'
                        <'col-sm-6 col-md-6 col-xl-9 col-7 p-0 label-search'f>
                        <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro'B>
                    >
                >
            >
            <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
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
                this._translate.instant('GENERAL.TABLE'),
            );
        },
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.TABLE'),

                //enabled: $( that.table.column().header()).hasClass('noVis') ? false : true,
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

                $(row).addClass('selected-travel');

                setTimeout(()=>{

                    $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');

                    $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');

                    $('#ck-' + data.id).prop('checked', true);

                  }, 900);
            }

            if(data.afterSession){
                $(row).addClass('afterSession');
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
                data:'id',
                sortable: false,
                searchable: false,

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
                data: 'order',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ORDER'),
                render: function (data, type, row) {

                    if (that.dataSelect && that.dataSelect.statusRouteId != 3) {
                        return (
                            '<input class="form-control aling-input-table p-0 pl-1 pr-1 text-center  order_input" type="number" style="width:50px"  min="1" name="' +
                            row.id +
                            '" value="' +
                            data +
                            '">'
                        );
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            data +
                            '</span>'
                        );
                    }

                },
            },
            {
                data: 'orderInitial',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ORDER_POLPO'),
            },
            {
                data:'deliveryPointId',
            },
           /*  {
                data: 'deliveryPointId',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.REAL'),
                render: function (data, type, row) {
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        data +
                        '</span>'
                    );
                },
            }, */
            {
                data: 'name',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.DELIVERY_COLLECTION_POINT'),
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
                visible: false,
                title: 'Tipología',
                className:'text-left',
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.POPULATION'),
            },
            {
                data: 'address',
                className:'text-left',
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
                className:'text-left',
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
                className:'text-left',
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.TRAVEL_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'arrivalDayTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.SCHEDULED_TIME'),
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.CLIENT_DELAY'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                title: 'Retraso',
                className:'text-left',
                data: 'delayTimeOnDelivery',
                visible: true,
                orderable: false,
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                }
            },
            {
                data: 'vehicleWaitTime',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.VEHICLE_WAIT_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'serviceTime',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.DELIVERY_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'travelDistanceToNext',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.TOTAL_KM'),
                render: (data, type, row) => {
                    return this.distance.transform(data);
                },
            },
            {
                data: 'customerWaitTime',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.WAIT_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data);
                },
            },
            {
                data: 'driverArrivalTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ARRIVAL'),
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
                data: 'signatureTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.EXIT'),
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
                className:'text-left',
                orderable: false,
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.DOWNLOAD'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'status_route_delivery_point.name',
                className:'aligt-travel',
                title: this._translate.instant('DELIVERY_POINTS.STATE'),
                render: (data, type, row) => {
                    let varClass = '';

                    if (data === 'Finalizado' && row.howOftenReturned === 0) {
                        varClass = 'green-travel';
                    }

                    if (data == 'En proceso') {
                        varClass = 'blue-travel';
                    }

                    if (data == 'No entregado') {
                        varClass = 'yellow-travel';
                    }

                    if (data == 'Pospuesto') {
                        varClass = 'orange-travel';
                    }

                    if (data === 'Finalizado' && +row.howOftenReturned > 0) {
                        data = 'Fin. (2a vuelta)';
                        varClass = 'green-travel';
                    }

                    if (data === 'Asignado') {
                        varClass = '';
                    }
                    return (
                        '<div class="text-center" style="width:125px !important;">' +
                        '<button style="width: 132px !important;" class="btn btn-primary btn-travel warning text-center ' + varClass + '">' + data +' </button> ' +
                        '</div>'
                    );

                },
            },
            {
                title: 'Albaranes',
                className:'text-left',
                data: 'id',
                sortable: false,
                render: (data, type, row) => {
                    let botones = '';

                    if (row.route_planning_route_delivery_note_count > 0 || row.countDetail) {

                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                title: 'Devoluciones',
                className:'text-left',
                data: 'route_planning_route_delivery_point_devolution_count',
                render: (data, type, row) => {
                    let botones = '';

                    if (data > 0) {

                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                title: 'Cobro',
                className:'text-left',
                data: 'paymentInvoice',
                render: (data, type, row) => {
                    let botones = '';

                    if (data > 0) {

                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                data: 'outRange',
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
                //className:'text-left',
                title: this._translate.instant('GENERAL.ACTIONS'),
                sortable: false,
                render: (data, type, row) => {
                    let botones = '';
                    botones += `
                        <div class="text-center editar col">
                            <img class="point" src="assets/icons/External_Link.svg">
                        </div>
                    `;
                    return botones;
                },
            },
        ],
    });

    this.table.on( 'column-reorder', function ( e, settings, details ) {
        setTimeout(() => {
            $('#assigned').DataTable().columns.adjust();
          }, 1000);
    } );


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

     /* rutas */

     let options = '';

        this.zones.forEach((zone: any) => {

            let userName = zone.name;

            if (userName && userName.length > 20) {

                userName = userName.substr(0, 16) + '...';

            }

            if (that.filter.values.routeId === zone.id) {

                options += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

            } else {

                options += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

            }


        });

    /* chofer assignado */

    let User : any;

    User = that.routeSeleted.user;

    /* nombre completo */

    let fullName= '';

    fullName = User.name +' ' +User.surname;


    /* vehicle */

    let vehicle: any;

    vehicle = that.routeSeleted.vrp_vehicle;


    $('.buttonDom').html(`

        <div class="form-row mb-1 mt-2 pl-1">

        <div class="col-12 col-xl-3 col-sm-4 mb-1">

            <div class="input-group">
                <input type="date" class="form-control input-size date1 point" id="dateFrom" value=${that.filter.values.dateDeliveryStart}  autocomplete="off" />
            </div>

        </div>

        <div class="col-12 col-xl-3 col-sm-4 mb-1">
            <select id="routePlanningRouteId"  class="form-control-select-datatable size-select form-control form-control-select select-search-route point">

            `+ options + `
            </select>
        </div>


        <div class="col-12 col-xl-3 col-sm-4 mb-1 point">

            <div class="input-group">

              <input type="text" readonly  class="form-control input-size input-travel-site point input-color-travel" value="${fullName}" autocomplete="off" style="font-size: 16px !important;"/>

              <span class="input-group-append userId">

                <span title="Cambiar chofer"  class="input-group-text border-btn-travel point">

                  <img src="assets/icons/pencil.svg" alt="">

                 </span>

               </span>

            </div>


         </div>

        <div class="col-12 col-xl-3 col-sm-4 mb-1 point">

        <div class="input-group">

            <input name="text" readonly  class="form-control input-size input-travel-site point input-color-travel"  value="${vehicle.name}" autocomplete="off" style="font-size: 16px !important;"/>

            <span class="input-group-append vehicleId" >

                <span title="Cambiar vehiculo"  class="input-group-text border-btn-travel point">

                    <img src="assets/icons/pencil.svg" alt="">

                </span>
            </span>

        </div>

        </div>

        </div>
    `);

    /* fecha */

    $('.date1').on('change', function () {

        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                dateDeliveryStart: this.value
            }
        }

        that.stateFilters.add(that.filter);

        that.getAssignedChange();

    });

    /* cambiar vehiculo */

    $('.userId').on('click', function () {

        if (that.dataSelect.statusRouteId != 3) {
            that.changeDriver();
        } else {
            return
        }


    });

    /* cambiar vehiculo */

    $('.vehicleId').on('click', function () {

        if (that.dataSelect.statusRouteId != 3) {
            that.addChangeVehicles();
        } else {
            return
        }


    });

    /* cambiar rutas */
    $('.select-search-route').on('change', function () {


        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                routeId: Number(this.value)
            }
        }

        that.stateFilters.add(that.filter);

        that.changeRouteRedirect(this.value);



        //that.cargar();
    });

     /* Buscar datatbles */

    $('#search').on('keyup', function () {

        $('#checkboxDriverCost').prop('checked', false).addClass('checked');

        $('#checkboxDriverCost1').prop('checked', false).addClass('checked');

        $(table).DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");

    this.initEvents(table + ' tbody', this.table);
}

History(routeId: number) {

    let that = this;

    if (this.disabled) return;

    if (this.table) {
        this.table.clear();
    }

    this.selected = [];

    this.selectedRouteId = routeId;

    this.routeSeleted = this.routes.find((x: any) => x.id == routeId);

    this.getDataDuringDelivery(this.routeSeleted.id);

    this.getRouteStartData(this.routeSeleted.id);

    this.getTotalRefueling(this.routeSeleted.vrp_vehicle.vehicleId, this.routeSeleted.dateDeliveryStart);

    this.moveALL();

    let url = environment.apiUrl + 'route_planning/route/assigned/' + routeId;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#history';
    this.table = $('#history').DataTable({
        destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            colReorder: true,

        stateSaveParams: function (settings, data) {
            data.search.search = "";
           // $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
          },
          initComplete: function (settings, data) {

            settings.oClasses.sScrollBody = '';
        },
        lengthMenu: [50, 100],
        dom: `
            <'row'
                <'col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                    <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 buttonDom'>
                >
                <'col-xl-4 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                    <'row'
                        <'col-sm-6 col-md-6 col-xl-9 col-7 p-0 label-search'f>
                        <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro'B>
                    >
                >
            >
            <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
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
                this._translate.instant('GENERAL.TABLE'),
            );
        },
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.TABLE'),

                //enabled: $( that.table.column().header()).hasClass('noVis') ? false : true,
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

                $(row).addClass('selected-travel');

                setTimeout(()=>{

                    $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');

                    $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');

                    $('#ck-' + data.id).prop('checked', true);

                  }, 900);
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
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ORDER'),
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
                data: 'orderInitial',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ORDER_POLPO'),
            },
            {
                data: 'realOrder',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.REAL'),
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
                data: 'deliveryPointId',
            },
            {
                data: 'name',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.DELIVERY_COLLECTION_POINT'),
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
                visible: false,
                title: 'Tipología',
                className:'text-left',
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.POPULATION'),
            },
            {
                data: 'address',
                className:'text-left',
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
                className:'text-left',
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
                className:'text-left',
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.TRAVEL_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'arrivalDayTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.SCHEDULED_TIME'),
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
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.CLIENT_DELAY'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                title: 'Retraso',
                className:'text-left',
                data: 'delayTimeOnDelivery',
                visible: true,
                orderable: false,
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                }
            },
            {
                data: 'vehicleWaitTime',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.VEHICLE_WAIT_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'serviceTime',
                className:'text-left',
                visible: false,
                title: this._translate.instant('DELIVERY_POINTS.DELIVERY_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'travelDistanceToNext',
                visible: false,
                className:'text-left',
                title: this._translate.instant('DELIVERY_POINTS.TOTAL_KM'),
                render: (data, type, row) => {
                    return this.distance.transform(data);
                },
            },
            {
                data: 'customerWaitTime',
                visible: false,
                className:'text-left',
                title: this._translate.instant('DELIVERY_POINTS.WAIT_TIME'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data);
                },
            },
            {
                data: 'driverArrivalTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.ARRIVAL'),
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
                data: 'signatureTime',
                className:'text-left',
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.EXIT'),
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
                className:'text-left',
                orderable: false,
                title: this._translate.instant('TRAVEL_TRACKING.DELIVERY_POINTS.DOWNLOAD'),
                render: (data, type, row) => {
                    return secondsToAbsoluteTime(data, true);
                },
            },
            {
                data: 'status_route_delivery_point.name',
                title:this._translate.instant('DELIVERY_POINTS.STATE'),
                className:'aligt-travel',
                render: (data, type, row) => {
                    let varClass = '';

                    if (data === 'Finalizado' && row.howOftenReturned === 0) {
                        varClass = 'green-travel';
                    }

                    if (data == 'En proceso') {
                        varClass = 'blue-travel';
                    }

                    if (data == 'No entregado') {
                        varClass = 'yellow-travel';
                    }

                    if (data == 'Pospuesto') {
                        varClass = 'orange-travel';
                    }

                    if (data === 'Finalizado' && +row.howOftenReturned > 0) {
                        data = 'Fin. (2a vuelta)';
                        varClass = 'green-travel';
                    }

                    if (data === 'Asignado') {
                        varClass = '';
                    }
                    return (
                        '<div class="text-center" style="width:125px !important;">' +
                        '<button style="width: 132px !important;" class="btn btn-primary btn-travel warning text-center ' + varClass + '">' + data +' </button> ' +
                        '</div>'
                    );
                },
            },
            {
                title: 'Albaranes',
                className:'text-left',
                data: 'route_planning_route_delivery_note_count',
                render: (data, type, row) => {
                    let botones = '';

                    if (data > 0) {

                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                title: 'Devoluciones',
                className:'text-left',
                data: 'route_planning_route_delivery_point_devolution_count',
                render: (data, type, row) => {
                    let botones = '';

                    if (data > 0) {

                        botones += `
                            <div class="text-center editar col">
                                 <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                data: 'outRange',
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
                title: 'Cobro',
                className:'text-left',
                data: 'paymentInvoice',
                render: (data, type, row) => {
                    let botones = '';

                    if (data > 0) {

                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedTrue.svg">
                            </div>
                        `;

                    } else {
                        botones += `
                            <div class="text-center editar col">
                                <img class="point" src="assets/icons/attachedFalse.svg">
                            </div>
                        `;
                    }

                    return botones;
                }
            },
            {
                title: this._translate.instant('GENERAL.ACTIONS'),
                sortable: false,
                render: (data, type, row) => {
                    let botones = '';
                    botones += `
                        <div class="text-center editar col">
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

     /* rutas */

     let options = '';

        this.zones.forEach((zone: any) => {

            let userName = zone.name;

            if (userName && userName.length > 20) {

                userName = userName.substr(0, 16) + '...';

            }

            if (that.filter.values.routeId === zone.id) {

                options += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

            } else {

                options += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

            }


        });

           /* nombre completo */

    let User : any;

    User = that.routeSeleted.user;

    let fullName= '';

    fullName = User.name +' ' +User.surname;


    /* vehicle */

    let vehicle: any;

    vehicle = that.routeSeleted.vrp_vehicle;


    $('.buttonDom').html(`

        <div class="form-row mb-1 mt-2 pl-1">

        <div class="col-12 col-xl-3 col-sm-4 mb-1">

            <div class="input-group">
                <input type="date" class="form-control input-size date1 point" id="dateFrom" value=${that.filter.values.dateDeliveryStart}  autocomplete="off" />
            </div>

        </div>

        <div class="col-12 col-xl-3 col-sm-4 mb-1">
            <select id="routePlanningRouteId"  class="form-control-select-datatable size-select form-control form-control-select select-search-route point">

            `+ options + `
            </select>
        </div>

        <div class="col-12 col-xl-3 col-sm-4 mb-1 point">

            <div class="input-group">

              <input type="text" readonly  class="form-control input-size input-travel-site point input-color-travel" value="${fullName}" autocomplete="off" style="font-size: 16px !important;"/>

              <span class="input-group-append userId">

                <span title="Cambiar chofer"  class="input-group-text border-btn-travel point">

                  <img src="assets/icons/pencil.svg" alt="">

                 </span>

               </span>

            </div>


         </div>

          <div class="col-12 col-xl-3 col-sm-4 mb-1 point">

        <div class="input-group">

            <input name="text" readonly  class="form-control input-size input-travel-site point input-color-travel"  value="${vehicle.name}" autocomplete="off" style="font-size: 16px !important;"/>

            <span class="input-group-append vehicleId" >

                <span title="Cambiar vehiculo"  class="input-group-text border-btn-travel point">

                    <img src="assets/icons/pencil.svg" alt="">

                </span>
            </span>

        </div>

        </div>


        </div>
    `);

    /* fecha */

    $('.date1').on('change', function () {

        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                dateDeliveryStart: this.value
            }
        }

        that.stateFilters.add(that.filter);

        that.getAssignedChange();

    });

    /* cambiar vehiculo */

 /*    $('.userId').on('click', function () {

        if (that.validateSAC()) {
            that.changeDriver();
        } else {
            return
        }


    }); */

    /* cambiar vehiculo */

   /*  $('.vehicleId').on('click', function () {

        if ( !that.validateSAC() || that.isControlPanel() ||
        that.isAdmin() || that.isAdminCompany() ||
        that.isCommercialDirector() || that.isCommercialAgent()) {
            that.addChangeVehicles();
        } else {
            return
        }


    }); */

    /* cambiar rutas */
    $('.select-search-route').on('change', function () {


        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                routeId: Number(this.value)
            }
        }

        that.stateFilters.add(that.filter);

        that.changeRouteRedirect(this.value);



        //that.cargar();
    });

     /* Buscar datatbles */

    $('#search').on('keyup', function () {

        $('#checkboxDriverCost').prop('checked', false).addClass('checked');

        $('#checkboxDriverCost1').prop('checked', false).addClass('checked');

        $(table).DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");

    this.initEvents(table + ' tbody', this.table);
}

initEvents(tbody: any, table: any, that = this) {

    $(tbody).unbind();

    console.log(this.refreshTime)
    window.clearInterval(this.timeInterval);

    this.timeInterval = window.setInterval(() => {

        this.table.ajax.reload();

    }, this.refreshTime);

    this.editar(tbody, table);

    this.receipt(tbody, table);

    this.select(tbody, table);

    this.rowClick(tbody, table);

    this.waning(tbody, table);

    this.onChangeOrderValue(tbody, table);
}

editar(tbody: any, table: any, that = this) {


  $(tbody).on('click', 'div.editar', function () {

      let data = table.row($(this).parents('tr')).data();

      //that.editElement(data)

      that._router.navigate([`/travel-tracking/${that.idRoute}/details/${data.id}`]);

  });


}

rowClick(tbody, table: any, that = this) {
    $(tbody).on('click', '.text-left', function () {

        var data = table.row($(this).parents('tr')).data();

        that._router.navigate([`/travel-tracking/${that.idRoute}/details/${data.id}`]);

    });
}

waning(tbody: any, table: any, that = this) {

  $(tbody).on('click', 'button.warning', function () {

      let data = table.row($(this).parents('tr')).data();

      that.showWarning(data);
  });

}

showWarning(data: any): void {
    const modal = this.modalService.open(ModalGeneralWarningComponent, {
        size: 'lg',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
    });

    modal.componentInstance.data = data;
}


receipt(tbody: any, table: any, that = this) {

  $(tbody).on('click', 'button.receipt', function () {

      let data = table.row($(this).parents('tr')).data();

      //that.receiptElement(data);
  });

}

select(tbody: any, table: any, that = this) {

    if (that.dataSelect.statusRouteId != 3) {

        $(tbody).on('click', 'tr', function () {

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

                  if(that.table.rows()[0].length == that.selected.length) {

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

              that.detectChanges.detectChanges();

          });

    } else {

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

                $('#btn-' + data.id).prop('disabled', true);

                $('#btn1-' + data.id).prop('disabled', true);

                $('#thead-1').addClass('hidden');

                $('#thead-2').removeClass('hidden');

                $(this.table.row(element).node()).addClass('selected-travel');
            }

        } else {


            $('#ck-' + data.id).prop('checked', false);

            $('#btn-' + data.id).prop('disabled', false);

            $('#btn1-' + data.id).prop('disabled', false);

            $('#thead-1').removeClass('hidden');

            $('#thead-2').addClass('hidden');

            $(this.table.row(element).node()).removeClass('selected-travel');

            $('#checkboxDriverCost').prop('checked', false).removeAttr('checked');

            this.selected.splice(index, 1);

            this.selected = [];

            $(this).toggleClass('selected-travel');
        }



        this.detectChanges.detectChanges();
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

createClient() {
    const modal = this.modalService.open(ModalCreateClientsComponent, {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        backdropClass: 'modal-backdrop-ticket',
        windowClass: 'modal-travel-retainer-client',
    });

    modal.componentInstance.zones = this.zones;
    modal.componentInstance.showRoutes = false;

    modal.componentInstance.zoneSelected = this.idRoute;


    modal.result.then(async (data) => {
        if(data){
            this.loadingService.showLoading();
            let points = data.points.map((ele:any)=> ele.id);
            this.backendService.post('route_planning/route/' + data.route + '/add_points', {points}).pipe(take(1)).subscribe(()=>{
                this.loadingService.hideLoading();
                this.load(this.dataSelect.dateDeliveryStart, this.dataSelect.id);
            }, error =>{
                this.loadingService.hideLoading();
                this.toast.displayHTTPErrorToast(error.status, error.error.error);
            })
        }

    });
}

updateZone(obj: [string, Partial<DeliveryPoint>]) {

    console.log(obj);
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

  refreshTable(){
    console.log('refrescar')
  }

  returnsList(){

    if (this.daraRedirectDas && this.daraRedirectDas.redirectDas) {

        this._router.navigate(['dashboard']);

    } else {

        this._router.navigate(['travel-tracking/']);

    }

  }

  /* cambiar vehicle */

  addChangeVehicles() {

    const modal = this.modalService.open(ModalChangeVehicleComponent, {

        centered: true,

        size: 'md',

        backdrop: 'static',

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-travel-retainer',

    });


    modal.componentInstance.data = {

        RouteId: this.routeSeleted.id,

    };

    modal.result.then((data: any) => {

        if (data === undefined || !data) {
        } else {

            this.load(this.dataSelect.dateDeliveryStart, this.idRoute);
        }
    });
}

changeDriver() {

    const modal = this.modalService.open(ModalChangeDriverComponent, {

        centered: true,

        size: 'md',

        backdrop: 'static',

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-travel-retainer',

    });

    modal.componentInstance.data = {

        RouteId: this.routeSeleted.id,

    };

    modal.result.then((data: any) => {

        if (data === undefined || !data) {
        } else {
            this.load(this.dataSelect.dateDeliveryStart, this.idRoute);
        }
    });
}

endRoute() {
    const modal = this.modalService.open(ModalEndRoutesComponent, {

        backdropClass: 'modal-backdrop-ticket',

        centered: true,

        windowClass:'modal-cost',

        size:'md'

    });

    modal.componentInstance.routeName = this.routeSeleted;

    modal.result.then((data: any) => {

        if (data) {

            this.stateRoutePlanningService
                .finishRoute(this.routeSeleted.id)
                .pipe(take(2))
                .subscribe(
                    (data) => {
                        if (data) {

                            this.ngOnInit();

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

        size: 'md',

        centered: true,

        backdrop: 'static',

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-travel-change-route',

    });

    modal.componentInstance.data = data;

    modal.result.then((data: any) => {
        if (data) {

            this.selectAll = false;

            this.selectAllFunc();

            this.getRouteStartData(this.selectedRouteId);

            this.getDataDuringDelivery(this.selectedRouteId);

            this.table.ajax.reload();

        }
    });
}

refresh() {
    this.table.ajax.reload();
    this.getDataDuringDelivery(this.selectedRouteId);
    this.getTotalRefueling(this.routeSeleted.vrp_vehicle.vehicleId, this.routeSeleted.dateDeliveryStart);
}

convertTime(date: string) {
    let converted = '';

    if (date != null) {
        converted = moment(date).format('HH:mm');
    } else {
        converted = '--:--';
    }
    return converted;
}

decimal(numb) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);


}
formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

}

openModalTotalLoad(data: any ,totalLoad:any){

const modal = this.modalService.open(ModalShowLoadsComponent, {

    backdrop: 'static',

    //size:'sm',

    backdropClass: 'modal-backdrop-ticket',

    windowClass:'modal-travel-load',

});

modal.componentInstance.data = data;

modal.componentInstance.totalLoad = totalLoad;

modal.result.then((data: any) => {
    if (data) { }
});
}

/* infinete scroll */

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

  getAssignedChange() {

    this.showZones = false;

    this.stateRoutePlanningService
        .getRoutesAssignedSheet(this.filter.values.dateDeliveryStart)
        .pipe(take(1))
        .subscribe((data) => {

            this.zones = data.data;

            if (this.zones.length > 0) {
                this.changeRouteRedirect(this.zones[0].id);

            } else {
                this.redirectTo('travel-tracking/noRoutes');
                //this._router.navigate(['travel-tracking/' + 'noRoutes']);

            }



            this.showZones = true;

           //

            this.detectChanges.detectChanges();


        });
  }

  redirectTo(uri:string){
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this._router.navigate([uri]));
 }
  loadSecond(date: any, routeId?: any) {

    this.stateRoutePlanningService

        .getRoutesAssigned(date, this.dataSelect.statusRouteId )

        .pipe(takeUntil(this.unsubscribe$))

        .subscribe((data) => {

            this.routes = data.data;

            return

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

  changeRouteRedirect(routeId:any){
    this._router.navigate(['travel-tracking/' + routeId]);
  }


  /* validate rol */
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
    isCommercialAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
            : false;
    }



/* end infinete scroll */

/* buscar fecha cuando no hay nada */

changeDate( name: string, dataEvent: NgbDate ) {

    if (name == 'from') {

      this.filter = {

        ...this.filter,

        values: {

            ...this.filter.values,

            dateDeliveryStart: objectToString( dataEvent )
        }
    }

    this.stateFilters.add(this.filter);

    }


  this.getAssignedChange();



  }

  /* CARGAR ALBARAN */
      /* CARGAR ALBARAN */

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
            if (!productGlobalImport) {

                deliveryPointWithProducts.routeId = this.filter.values.routePlanningRouteId;
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

                if ( this.filter.values.dateDeliveryStart ) {

                    deliveryPointWithProducts.dateDeliveryStart = this.filter.values.dateDeliveryStart;

                } else {

                    deliveryPointWithProducts.dateDeliveryStart = this.filter.values.dateDeliveryStart;

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

        /* IMPORAT DESDE LA NUBE */

        ImportProductFromCloudGlobal() {
            let dateDeliveryStart: any;

            dateDeliveryStart = this.filter.values.dateDeliveryStart;

            this.stateRoutePlanningService
                .ftpUploadProductosRouteGlobal(dateDeliveryStart)
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
  /* END CARGAR ALBARAN */

  /* imprimir ruta seleccionada */

      downloadRouteSelected() {

        this.dataRoutes = [];

        this.dataRoutes.push(this.selectedRouteId);

        this.stateEasyrouteService.getPdfRouteAssigneProduct(this.dataRoutes);

    }


    donwnloadAllRoute() {

        this.dataRoutes = [];

        /* Si es multiple se puede usar esa funcion */

        for (let i = 0; i < this.routes.length; i++) {
            this.dataRoutes.push(this.routes[i].id);
        }

        this.stateEasyrouteService.getPdfRouteAssigneProduct(this.dataRoutes);
    }

  /* end imprimir ruta seleccionada */

  /* descargar todos historico*/

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

  generateJsonGeneral(data: any) {
    let json = JSON.stringify(data);
    downloadFile(json, `routes_${dateToDDMMYYY(new Date())}.json`);
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


  /* end descargar todos en historico */

  /* descargar albaran */
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

  /* end descargar albaran */



  ngOnDestroy() {

    window.clearInterval(this.timeInterval);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ModuleCost(){
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



  openModalRepostaje(){

    const modal = this.modalService.open(ModalRepostajeComponent, {

        backdrop: 'static',

        size:'md',

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-repostaje',

    });

    modal.componentInstance.vehicleId =  this.routeSeleted.vrp_vehicle.vehicle.id;

    modal.componentInstance.dateDeliveryStart = this.filter.values.dateDeliveryStart;

    modal.result.then((data: any) => {
        if (data) { }
    });


  }

  createRetainerRoute() {

    const modal = this.modalService.open(ModalCreateRetainerRouteInsideComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        backdropClass: 'modal-backdrop-ticket',
        windowClass: 'modal-travel-retainer',
    });

    modal.componentInstance.idRoute = Number(this.idRoute);

    modal.componentInstance.selectedVehicle =  this.routeSeleted.vrp_vehicle.vehicle.id;


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

            console.log(structure, 'structure');

            this.loadingService.showLoading();

            this.backendService.post('route_planning/route_retainer', structure).pipe(take(1)).subscribe(() => {

                this.loadingService.hideLoading();

                // this.load(structure.date)


                this.getAssigned();

                // this.table.ajax.reload();

                this.toast.displayWebsiteRelatedToast(
                    'Ruta creada satifactoriamente',
                );

            }, error => {

                this.loadingService.hideLoading();

                this.toast.displayHTTPErrorToast(error.status, error.error.error);

            })
        }
    });
}


openModalEditCostActual(totalCost?:any){

    const modal = this.modalService.open(ModalEditCostActualComponent, {

        backdrop: 'static',

        //size:'sm',

        centered:true,

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-travel-load',

    });

    modal.componentInstance.idRoute = this.idRoute,

    modal.componentInstance.totalCostAutonomous = totalCost,

    modal.result.then((data: any) => {
        if (data) {
            this.getDataDuringDelivery(this.selectedRouteId)
         }
    });
    }
}
