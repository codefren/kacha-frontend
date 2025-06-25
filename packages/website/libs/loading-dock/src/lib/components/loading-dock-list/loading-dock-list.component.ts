import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService, FilterState, Zone } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '@optimroute/auth-local';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoadingService, secondsToAbsoluteTime, secondsToDayTimeAsString, ToastService, ModalViewPdfGeneralComponent } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { ModalForceFinishedComponent } from '../loading-dock-modal/modal-force-finished/modal-force-finished.component';

declare var $: any;


@Component({
  selector: 'easyroute-loading-dock-list',
  templateUrl: './loading-dock-list.component.html',
  styleUrls: ['./loading-dock-list.component.scss']
})

export class LoadingDockListComponent implements OnInit {

  table: any;

  nextDay: boolean = false;

  today: string;

  timeInterval: any;

  filter: FilterState = {
      name: 'loading_dock',
      values: {
        routePlanningRouteId: '',
        userId: '',
        vehicleId: '',
        vehicleStatusId: '',
        dateFrom: this.getToday(),
      }
  };

  zones: Zone[];

  users: any[] = [];

  vehicles: any[] = [];

  vehicleStatuses: any[] = [];

  totalizedDate: any;

  showCode: boolean = false;

  constructor(
      private authLocal: AuthLocalService,
      private _modalService: NgbModal,
      private _translate: TranslateService,
      private router: Router,
      private toastService: ToastService,
      private backendService: BackendService,
      private loadingService: LoadingService,
      private detectChange: ChangeDetectorRef,
      public zoneFacade: StateDeliveryZonesFacade,
      private stateEasyrouteService: StateEasyrouteService,
      private stateRoutePlanningService: StateRoutePlanningService,
      private stateFilters: StateFilterStateFacade
  ) { }

  ngOnInit() {
    this.loadFilters();
  }

  async loadFilters() {
    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'loading_dock') ? filters.find(x => x.name === 'loading_dock') : this.filter;

    this.getUsers();
  }

  /* usuarios */
  getUsers() {

    this.loadingService.showLoading();

    this.stateEasyrouteService.getUserDock().pipe(take(1)).subscribe(
        (data: any) => {

            this.users = data.data;

            this.getVehicle();

            this.loadingService.hideLoading();

        },
        (error) => {

            this.loadingService.hideLoading();

            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

  }

  /* vehículo */
  getVehicle() {

    this.loadingService.showLoading();

    this.stateEasyrouteService.getVehicle().pipe(take(1)).subscribe(
        (data: any) => {

            this.vehicles = data.data;

            this.getVehicleStatus();

            this.loadingService.hideLoading();

        },
        (error) => {

            this.loadingService.hideLoading();

            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

  }

  /* vehículo */
  getVehicleStatus() {

    this.loadingService.showLoading();

    this.stateEasyrouteService.getStatusDriver().pipe(take(1)).subscribe(
        (data: any) => {

            this.vehicleStatuses = data.data;

            this.getAssigned();

            this.loadingService.hideLoading();

        },
        (error) => {

            this.loadingService.hideLoading();

            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

  }

  /* informacion de cuadros */
  loadTotalizedDate() {

    this.showCode = false;

    this.backendService

        .post('dock_route_totalized',  this.filter.values )
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

    this.stateRoutePlanningService
        .getRoutesAssignedDock(this.filter.values.dateFrom.substring(0, 10))
        .pipe(take(1))
        .subscribe((data) => {

            this.zones = data.data;

            this.detectChange.detectChanges();

            this.loadTotalizedDate();

            

        });
  }

  cargar() {

    if (this.table) {
        this.table.clear();
    }

    let that = this;

    let url = environment.apiUrl + 'dock_route_datatables?' +

        (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
            this.filter.values.routePlanningRouteId : '') +

        (this.filter.values.userId != '' ? '&userId=' +
            this.filter.values.userId : '') +

        (this.filter.values.vehicleId != '' ? '&vehicleId=' +
        this.filter.values.vehicleId : '') +

        (this.filter.values.vehicleStatusId != '' ? '&vehicleStatusId=' +
        this.filter.values.vehicleStatusId : '') +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '');


    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#loadingDock';
    this.table = $(table).DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        order: [4, 'desc'],
        columnDefs: [{ targets: 5, type: 'date' }],
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
                <'col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                    <'col-xl-12 col-md-12 col-12 col-sm-12 pl-3 pr-2 buttonDom'>
                >
                <'col-xl-4 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                    <'row'
                        <'col-sm-6 col-md-6 col-xl-8 col-7 p-0 label-search'f>
                        <'col-sm-6 col-md-6 col-xl-4 col-5 pr-2 dt-buttons-table-otro'B>
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
              '<img class="icons-datatable point" src="assets/images/edit_datatable.svg">' +
              ' ' +
              this._translate.instant('GENERAL.TABLE'),
          );
        },
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.TABLE'),
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
              data: 'id',
              title: this._translate.instant('LOADING_DOCK.CODE'),
            },
            {
              data: 'nameRoute',
              title: this._translate.instant('LOADING_DOCK.ROUTE'),
              render: (data, type, row) => {
                  if (data != null) {
                      return '<span class="text-center">' + data + '</span>';
                  } else {
                      return '<span class="text-center"> No disponible </span>';
                  }
              },
            },
            {
              data: 'user_name',
              title: this._translate.instant('LOADING_DOCK.ASSIGNED_TO'),
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
              title: this._translate.instant('LOADING_DOCK.VEHICLE')
            },
            {
              data: 'downloadPackage',
              title: this._translate.instant('LOADING_DOCK.UNLOADED_PACKAGES'),
            },
            {
              data: 'loadPackage',
              title: this._translate.instant('LOADING_DOCK.LOADED_PACKAGES'),
            },

            {
              data: 'vehicleStatusName',

              title: this._translate.instant('LOADING_DOCK.VEHICLE_STATUS'),
              render: (data, type, row) => {
                
                if (row['vehicleStatusId'] == 2) {
                    return '<span class="text-center color-red">' + data + '</span>';
                } else {
                    return '<span class="text-center">' + data ?  data :'' + '</span>';;
                }
            },
            },
            {
                data: 'temperaruteBox',
                title: this._translate.instant('LOADING_DOCK.TEMPERATURE')
            },
            {
              data: 'startTime',
              title: this._translate.instant('LOADING_DOCK.START_ROUTE'),
              visible: false,
              render: (data, type, row) => {
                  if (data) {
                      return secondsToDayTimeAsString(data);
                  } else {
                      return '-----';
                  }
              },
            },
            {
              data: 'endTime',
              title: this._translate.instant('LOADING_DOCK.END_ROUTE'),
              visible: false,
              render: (data, type, row) => {
                  if (data) {
                      return secondsToDayTimeAsString(data);
                  } else {
                      return '-----';
                  }
              },
            },
            {
              data: 'timeSpent',
              title: this._translate.instant('LOADING_DOCK.TIME_SPENT'),
              render: (data, type, row) => {
                if (data) {
                    return secondsToAbsoluteTime(data);
                } else {
                    return '-----';
                }
              },
            },
            {
                data: 'dockStatusName',
                title: this._translate.instant('LOADING_DOCK.CONDITION'),
                render: (data, type, row) => {
                   
                   
                    if (row['dockStatusId'] == 2) {
                        return '<buttom class="btn btn-primary btn-entregado btn-status-datatable">' + data + '</buttom>';
                    } else {
                        return '<buttom class="btn btn-primary btn-pendiente btn-status-datatable">' + data + '</buttom>';
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

    let userList = '';

    this.users.forEach((user) => {

        let routeName = user;

        if (Number(that.filter.values.userId) === user.id) {

          userList += '<option title="' + user.name + ' ' + user.surname + '" value="' + that.filter.values.userId + '" selected>' + routeName.name + ' ' + routeName.surname + '</option>'

        } else {

          userList += '<option title="' + user.name + ' ' + user.surname + '" value="' + user.id + '">' + routeName.name + ' ' + routeName.surname + '</option>'

        }

    });

    let routeList = '';

    this.zones.forEach((zone: any) => {

        let userName = zone.name;

        if (userName && userName.length > 20) {

            userName = userName.substr(0, 16) + '...';

        }

        if (Number(that.filter.values.routePlanningRouteId) === zone.id) {

          routeList += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

        } else {

          routeList += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

        }

    });

    let vehicleList = '';

    this.vehicles.forEach((vehicle) => {

        let vehicleName = vehicle;

        if (Number(that.filter.values.vehicleId) === vehicle.id) {

          vehicleList += '<option title="' + vehicle.name+ '" value="' + that.filter.values.vehicleId + '" selected>'  + vehicleName.name + " " + '('+ vehicleName.user.name + ' ' + vehicleName.user.surname +')'+ '</option>'

        } else {

          vehicleList += '<option title="' + vehicle.name + '" value="' + vehicle.id + '">' + vehicleName.name + " " + '('+ vehicleName.user.name + ' ' + vehicleName.user.surname +')'+'</option>'

        }

    });

    let vehicleStateList = '';

    this.vehicleStatuses.forEach((vehicleStatus) => {

        let vehicleStatuName = vehicleStatus;

        if (Number(that.filter.values.vehicleStatusId) === vehicleStatus.id) {

          vehicleStateList += '<option title="' + vehicleStatus.name+ '" value="' + that.filter.values.vehicleStatusId + '" selected>' + vehicleStatuName.name + '</option>'

        } else {

          vehicleStateList += '<option title="' + vehicleStatus.name + '" value="' + vehicleStatus.id + '">' + vehicleStatuName.name + '</option>'

        }

    });

    $('.buttonDom').html(`
          <div class="form-row mb-2 mt-2">

            <div class="col-12 col-xl-3 col-sm-3 mb-1 point">
                <select
                  id="routeId"
                   class="form-select size-select form-control form-control-select-datatable select-search-route point">
                    <option value=""> Todas las rutas </option>
                    `+ routeList + `
                </select>
            </div>

            <div class="col-12 col-xl col-sm-4 mb-1 point">
                <select (change)="ChangeFilter($event)"
                    [value]="filter.values.userId"
                    id="userId"
                    class="form-select size-select form-control form-control-select-datatable  select-search-user point">
                    <option value="">Usuario</option>
                    `+ userList + `
                </select>
            </div>

            <div class="col-12 col-xl col-sm-4 mb-1 point">
                <select (change)="ChangeFilter($event)"
                    [value]="filter.values.vehicleId"
                    id="vehicleId"
                    class="form-select size-select form-control form-control-select-datatable  select-search-vehicle point">
                    <option value="">Vehículo</option>
                    `+ vehicleList + `
                </select>
            </div>

            <div class="col-12 col-xl col-sm-4 mb-1 point">
                <select (change)="ChangeFilter($event)"
                    [value]="filter.values.vehicleStateId"
                    id="vehicleStateId"
                    class="form-select size-select form-control form-control-select-datatable  select-search-vehicle-state point">
                    <option value="">Estado vehículo</option>
                    `+ vehicleStateList + `
                </select>
            </div>

            <div class="col-12 col-xl col-sm-4 mb-1">
                <div class="input-group">
                    <input type="date" class="form-control input-size date1 point" id="dateFrom" value=${this.filter.values.dateFrom} autocomplete="off" />
                </div>
            </div>

        </div>
    `);

    /* select de ruta */
    $('.select-search-route').on('change', function () {
      that.filter = {
          ...that.filter,
          values: {
              ...that.filter.values,
              routePlanningRouteId: this.value
          }
      }

      that.stateFilters.add(that.filter);

      that.loadTotalizedDate();
    });

    /* Select de usuario */
    $('.select-search-user').on('change', function () {
      that.filter = {
          ...that.filter,
          values: {
              ...that.filter.values,
              userId: this.value
          }
      }

      that.stateFilters.add(that.filter);
      that.loadTotalizedDate();
    });

    /* select de vehiculo */
    $('.select-search-vehicle').on('change', function () {
      that.filter = {
          ...that.filter,
          values: {
              ...that.filter.values,
              vehicleId: this.value
          }
      }

      that.stateFilters.add(that.filter);

      that.loadTotalizedDate();
    });

    /* select de estatus de vehiculo */
    $('.select-search-vehicle-state').on('change', function () {
      that.filter = {
          ...that.filter,
          values: {
              ...that.filter.values,
              vehicleStatusId: this.value
          }
      }

      that.stateFilters.add(that.filter);

      that.loadTotalizedDate();
    });

    /* Fecha */
    $('.date1').on('change', function () {

        that.zones = [];

        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                dateFrom: this.value
            }
        }

        that.stateFilters.add(that.filter);

        that.loadTotalizedDate();

    });

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
  }

  editar(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.editar', function () {
          let data = table.row($(this).parents('tr')).data();

          that.router.navigate(['loading-dock/', data.id]);
      });
  }

  openPdf() {

      let url ='dock_route_download_pdf?' +

      (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +

      this.filter.values.routePlanningRouteId : '') +

      (this.filter.values.userId != '' ? '&userId=' +

      this.filter.values.userId : '') +
    
      (this.filter.values.vehicleId != '' ? '&vehicleId=' +

      this.filter.values.vehicleId : '') +

      (this.filter.values.vehicleStatusId != '' ? '&vehicleStatusId=' +

      this.filter.values.vehicleStatusId : '') +

      (this.filter.values.dateFrom != '' ? '&dateFrom=' +

      this.filter.values.dateFrom : '');


      const modal = this._modalService.open( ModalViewPdfGeneralComponent, {

        backdropClass: 'modal-backdrop-ticket',

        centered: true,

        windowClass:'modal-view-pdf',

        size:'lg'

      });

      modal.componentInstance.title = this._translate.instant('LOADING_DOCK.NAME');

      modal.componentInstance.url = url;

  }

  openCsv() {

      console.log('descargar openCsv');

      let url ='dock_route_download_excel?' +

      (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
      this.filter.values.routePlanningRouteId : '') +

      (this.filter.values.userId != '' ? '&userId=' +
          this.filter.values.userId : '') +
    
      (this.filter.values.vehicleId != '' ? '&vehicleId=' +
      this.filter.values.vehicleId : '') +

      (this.filter.values.vehicleStatusId != '' ? '&vehicleStatusId=' +
      this.filter.values.vehicleStatusId : '') +

      (this.filter.values.dateFrom != '' ? '&dateFrom=' +
          this.filter.values.dateFrom : '');


      return this.backendService.getDockList(url).then((data: string)=>{


        })
  }

  openSetting() {

      //this.router.navigate(['loading-dock/settings']);
      this.router.navigateByUrl('/preferences?option=dockTypePackage');
  }

  forceFinished () {
    const modal = this._modalService.open(ModalForceFinishedComponent, {
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
    });
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



}
