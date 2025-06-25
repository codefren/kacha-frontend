import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment-timezone';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { take } from 'rxjs/operators';
import { environment } from '@optimroute/env/environment';
import { ModalViewPdfGeneralComponent } from '@optimroute/shared';
declare var $: any;
@Component({
  selector: 'easyroute-parcel-list',
  templateUrl: './parcel-list.component.html',
  styleUrls: ['./parcel-list.component.scss']
})
export class ParcelListComponent implements OnInit {

  table: any;

  nextDay: boolean = false;

  today: string;

  refreshTime: number = environment.refresh_datatable_assigned;

  timeInterval: any;

  filter: FilterState = {
      name: 'parcel',
      values: {
          userId: '',
          routeId:'',
          statusRouteId:'',
          dateFrom: this.getToday(),
      }
  };
  state: any[];

  dataIsActive: any = [
    {
        id: 3,
        name: 'Realizado'
    },
    {
        id: 2,
        name: 'Pendiente'
    }
]

  selectAll: boolean = false;

  selected: any = [];

  botones: boolean = false;

  zones: Zone[];

  users: any[] = [];

  totalizedData: any;

  showCode: boolean = true;

  constructor(
    private authLocal: AuthLocalService,
    private _modalService: NgbModal,
    private _translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private _toastService: ToastService,
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

        this.filter = filters.find(x => x && x.name === 'parcel') ? filters.find(x => x.name === 'parcel') : this.filter;

        this.getUsers();
    }

/* para rutas */

getZone(){
    this.zoneFacade.loadAll();
    this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{
        if(loaded){
            this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
                this.zones = data.filter(x => x.isActive === true);
                console.log(this.zones, 'this.zones');

                this.detectChange.detectChanges();

                if (this.zones.length > 0) {
                    this.cargar();

                } else {

                    this.zones = [];
                    this.cargar();
                }

            });
        }
    })
  }

getAssigned() {

    this.stateRoutePlanningService
        .getRoutesAssignedSheet(this.filter.values.dateFrom.substring(0, 10))
        .pipe(take(1))
        .subscribe((data) => {

            this.zones = data.data;

            this.detectChange.detectChanges();

            if (this.zones.length > 0) {
                this.cargar();

            } else {

                this.zones = [];
                this.cargar();
            }

        });
}

/* usuarios */

getUsers() {

    this.loadingService.showLoading();

    this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
        (data: any) => {

            this.users = data.data;

            this.loadTotalizedDate();

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

/* informacion de cuadrso de arriba */

loadTotalizedDate() {


    this.showCode = false;

    this.backendService

        .post('route_planning/route_package_total',  this.filter.values )

        .pipe(

            take(1)).subscribe(

                (resp: any) => {

                    this.totalizedData = null;

                    this.totalizedData = resp.data;

                    this.showCode = true;

                    this.detectChange.detectChanges();

                    this.getAssigned();


                },
                (error) => {
                    this.showCode = true;

                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
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

cargar() {


    if (this.table) {
        this.table.clear(); // limpia la tabla sin destruirla
    }


    let that = this;


    let url = environment.apiUrl + 'route_planning/route_package_datatable?' +

        (this.filter.values.statusRouteId != '' ? '&statusRouteId=' +
            this.filter.values.statusRouteId : '') +

        (this.filter.values.userId != '' ? '&userId=' +
            this.filter.values.userId : '') +


        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.routeId != '' ? '&routeId=' +
            this.filter.values.routeId : '');


    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#parcelList';
    this.table = $(table).DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        stateSave: true,
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
                <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 buttonDom'>
            >
            <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                <'row'
                    <'col-sm-6 col-md-6 col-xl-9 col-7 p-0 label-search'f>
                    <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro'B>
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
                this._translate.instant('GENERAL.TABLE'),
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
                data: 'name_route',
                title: this._translate.instant('PARCEL.ROUTE'),
                render: (data, type, row) => {
                    if (data) {
                        return '<span class="text-center">' + data +  '</span>';
                    } else {
                        return '-----';
                    }

                },
            },
            {
                data: 'driver_name',
                title: this._translate.instant('PARCEL.EMPLOYEE'),
                render: (data, type, row) => {
                    if (data) {
                        return '<span class="text-center">' + data  + '</span>';
                    } else {
                        return '<span class="text-center"> no disponible </span>';
                    }
                },

            },

            {
                data: 'total_package',
                title: this._translate.instant('PARCEL.TOTAL_PACKAGES'),
                render: (data, type, row) => {
                    let varClass = '';

                    if (!data) {
                        return '<span class="text-center">' + '---' + '</span>';
                    } else {
                        if (
                            row.total_verified < data
                         ) {
                             varClass = 'font-roja';
                         }


                        return '<span class="'+varClass +'" class="text-center">' + row.total_verified + '/' + data + '</span>';
                    }


                },
            },
            {
                data: 'statusRouteId',
                title: this._translate.instant('PARCEL.CONDITION'),
                render: (data, type, row) => {

                    if (data == 2 || data == 4) {
                        return '<buttom class="btn btn-primary btn-pendiente btn-status-datatable">'+this._translate.instant('PARCEL.EARRIGN')+'</buttom>';
                    } else if (data == 3) {
                        return '<buttom class="btn btn-primary btn-entregado btn-status-datatable">'+this._translate.instant('PARCEL.DOME')+'</buttom>';
                    }


                },
            },

            {
                data: null,
                sortable: false,
                searchable: false,
                orderable:false,
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
            }
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
    let options = '';



    this.zones.forEach((zone: any) => {



        let userName = zone.name;

        if (userName && userName.length > 20) {

            userName = userName.substr(0, 16) + '...';

        }

        if (Number(that.filter.values.routeId) === zone.id) {

            options += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

        } else {

            options += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

        }


    });

    let users = '';

    this.users.forEach((user) => {

        console.log(user, 'user')

        let routeName = user;

        if (Number(that.filter.values.userId) === user.id) {


            users += '<option title="' + user.name + ' ' + user.surname + '" value="' + that.filter.values.userId + '" selected>' + routeName.name + ' ' + routeName.surname + '</option>'

        } else {


            users += '<option title="' + user.name + ' ' + user.surname + '" value="' + user.id + '">' + routeName.name + ' ' + routeName.surname + '</option>'

        }


    });

    let opctions_isActive = '';

    this.dataIsActive.forEach((active: any) => {


        if ((this.filter.values.statusRouteId == '2' || this.filter.values.statusRouteId == '3') && active.id == Number(this.filter.values.statusRouteId)) {


            opctions_isActive += '<option value="' + active.id + '" selected="true">' + active.name + '</option>'
        } else {


            opctions_isActive += '<option value="' + active.id + '">' + active.name + '</option>'
        }
    });

    $('.buttonDom').html(`
        <div class="form-row mb-1 mt-2 pl-1">


        <div class="col-12 col-xl col-sm-4 mb-1 point">
             <select id="routeId"
               class="form-select form-control routeId form-control-select-datatable point">
                <option value=""> Rutas </option>
                `+ options + `
              </select>
           </div>

            <div class="col-12 col-xl col-sm-4 mb-1 point">
                <select (change)="ChangeFilter($event)"
                    id="userId"
                    class="form-select  userId form-control form-control-select-datatable  point">
                    <option value="">Empleado</option>
                    `+ users + `
                </select>
            </div>

            <div class="col-12 col-xl col-sm-4 mb-1">
            <select id="statusRouteId"
                class="form-select form-control  form-control-select-datatable isActive point">
                <option value="">${this._translate.instant('PROVIDERS.STATUS')}</option>
                `+ opctions_isActive + `
            </select>
        </div>

            <div class="col-12 col-xl col-sm-4 mb-1">

            <div class="input-group point">
                <input type="date" class="form-control input-size date1 point" id="dateFrom" value=${this.filter.values.dateFrom} autocomplete="off" />
            </div>

        </div>


        </div>
    `);

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

        //that.getAssigned();

        that.loadTotalizedDate();

        // that.cargar();


    });


    /* select de ruta */

    $('.routeId').on('change', function () {


        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                routeId: this.value
            }
        }

        that.stateFilters.add(that.filter);

        that.loadTotalizedDate();
    });

    /* user */
    $('.userId').on('change', function () {


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


    $('.isActive').on('change', function () {

        that.filter = {
            ...that.filter,
            values: {
                ...that.filter.values,
                statusRouteId: this.value
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

        that.router.navigate(['parcel/', data.routeId]);

    });
}


openPdf() {

    let url ='route_planning/route_package_pdf?' +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.routeId != '' ? '&routeId=' +
            this.filter.values.routeId : '') +


        (this.filter.values.userId != '' ? '&userId=' +
            this.filter.values.userId : '') +

        (this.filter.values.statusRouteId != '' ? '&statusRouteId=' +
            this.filter.values.statusRouteId : '');

    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass:'modal-view-pdf',

      size:'lg'

    });

    modal.componentInstance.title = this._translate.instant('PARCEL.NAME');

    modal.componentInstance.url = url;

}
openCsv() {

    console.log('descargar openCsv');

    let url ='route_planning/route_package_excel?' +

    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
    this.filter.values.dateFrom : '') +

    (this.filter.values.routeId != '' ? '&routeId=' +
        this.filter.values.routeId : '') +

    (this.filter.values.userId != '' ? '&userId=' +
        this.filter.values.userId : '') +

    (this.filter.values.statusRouteId != '' ? '&statusRouteId=' +
        this.filter.values.statusRouteId : '');


    return this.backendService.getExcelParcel(url).then((data: string)=>{


      })
}
openSetting() {

    /* this.router.navigate(['parcel/settings']); */
    this.router.navigateByUrl('/preferences?option=parcel');
}

}
