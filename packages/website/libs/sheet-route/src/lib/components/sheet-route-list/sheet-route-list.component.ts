import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { Filter } from '../../../../../backend/src/lib/types/filter.type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCheckRoutesComponent } from './modal-check-routes/modal-check-routes.component';
import { Router } from '@angular/router';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { take, takeUntil } from 'rxjs/operators';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { FilterState, Profile } from '@optimroute/backend';
import { ModalViewPdfGeneralComponent } from '@optimroute/shared';
import { Subject } from 'rxjs';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';

declare var $: any;
@Component({
    selector: 'easyroute-sheet-route-list',
    templateUrl: './sheet-route-list.component.html',
    styleUrls: ['./sheet-route-list.component.scss']
})
export class SheetRouteListComponent implements OnInit {

    table: any;

    nextDay: boolean = false;

    today: string;

    refreshTime: number = environment.refresh_datatable_assigned;

    timeInterval: any;

    filter: FilterState = {
        name: 'sheet_route',
        values: {
            userId: '',
            routePlanningRouteId: '',
            dateFrom: this.getToday(),
            dateTo: ''
        }
    };

    selectAll: boolean = false;

    selected: any = [];

    botones: boolean = false;

    zones: Zone[];

    users: any[] = [];

    totalizedDate: any;

    showCode: boolean = true;

    profile: Profile;
    unsubscribe$ = new Subject<void>();

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
        private stateFilters: StateFilterStateFacade,
        public facadeProfile: ProfileSettingsFacade,
    ) { }

    ngOnInit() {

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

    async loadFilters() {
        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

        this.filter = filters.find(x => x && x.name === 'sheet_route') ? filters.find(x => x.name === 'sheet_route') : this.filter;

        this.getUsers();
    }

    /* para rutas */

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

            .post('route_sheet_route_totalized_date', { date: this.filter.values.dateFrom })

            .pipe(

                take(1)).subscribe(

                    (resp: any) => {

                        this.totalizedDate = null;

                        this.totalizedDate = resp;

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


        let url = environment.apiUrl + 'route_sheet_route_datatables?' +

            (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
                this.filter.values.routePlanningRouteId : '') +

            (this.filter.values.userId != '' ? '&userId=' +
                this.filter.values.userId : '') +


            (this.filter.values.dateFrom != '' ? '&dateFrom=' +
                this.filter.values.dateFrom : '') +

            (this.filter.values.dateTo != '' ? '&dateTo=' +
                this.filter.values.dateTo : '');


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#sheetRoute';
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
                    data: 'created_at',
                    title: this._translate.instant('SHEET_ROUTE.DATE'),

                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'name',
                    title: this._translate.instant('SHEET_ROUTE.ROUTE'),
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
                    title: this._translate.instant('SHEET_ROUTE.ASSIGNED_DRIVER'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span class="text-center">' + data + '</span>';
                        } else {
                            return '<span class="text-center"> No disponible </span>';
                        }
                    },
                },
                {
                    data: 'userCharger',
                    title: this._translate.instant('SHEET_ROUTE.CHARGER'),
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
                    title: this._translate.instant('SHEET_ROUTE.HOME_ROUTE'),
                    render: (data, type, row) => {
                        if (data) {
                            return moment(data).format('HH:mm');
                        } else {
                            return '-----';
                        }
                    },
                },
                {
                    data: 'driverEndTime',
                    title: this._translate.instant('SHEET_ROUTE.END_ROUTE'),
                    render: (data, type, row) => {
                        if (data) {
                            return moment(data).format('HH:mm');
                        } else {
                            return '-----';
                        }

                    },
                },
                {
                    data: 'total_invoice',
                    title: this._translate.instant('SHEET_ROUTE.INCOICED'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + this.formatEuro(data)  + '</span>';
                        } else {
                            return '<span class="text-center"> no disponible </span>';
                        }
                    },

                },
                {
                    data: 'total_cost',
                    visible: this.moduleCost(),
                    title: this._translate.instant('SHEET_ROUTE.COST'),
                    render: (data, type, row) => {
                        if (data) {
                            return '<span class="text-center">' + this.formatEuro(data) + '</span>';
                        } else {
                            return '<span class="text-center"> no disponible </span>';
                        }
                    },
                },
                {
                    data: 'attached',

                    title: this._translate.instant('SHEET_ROUTE.ATTACH'),
                    render: (data, type, row) => {

                        if (!data) {
                            return '<img class="point" src="assets/icons/attachedFalse.svg">';
                        } else {
                            return '<img class="point" src="assets/icons/attachedTrue.svg">';
                        }


                    },
                },
                {
                    data: 'statusRouteId',
                    //sortable: false,
                    //  searchable: false,
                    title: this._translate.instant('SHEET_ROUTE.CONDITION'),
                    render: (data, type, row) => {

                        if (data == 2) {
                            return '<buttom class="btn btn-primary btn-pendiente btn-status-datatable">Pendiente</buttom>';
                        } else if (data == 3) {
                            return '<buttom class="btn btn-primary btn-entregado btn-status-datatable">Finalizado</buttom>';
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
        let options = '';



        this.zones.forEach((zone: any) => {



            let userName = zone.name;

            if (userName && userName.length > 20) {

                userName = userName.substr(0, 16) + '...';

            }

            if (Number(that.filter.values.routePlanningRouteId) === zone.id) {

                options += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

            } else {

                options += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

            }


        });

        let routeLi = '';

        this.users.forEach((user) => {

            let routeName = user;

            if (Number(that.filter.values.userId) === user.id) {


                routeLi += '<option title="' + user.name + ' ' + user.surname + '" value="' + that.filter.values.userId + '" selected>' + routeName.name + ' ' + routeName.surname + '</option>'

            } else {


                routeLi += '<option title="' + user.name + ' ' + user.surname + '" value="' + user.id + '">' + routeName.name + ' ' + routeName.surname + '</option>'

            }


        });

        $('.buttonDom').html(`
            <div class="form-row mb-1 mt-2 pl-1">

            <div class="col-12 col-xl-4 col-sm-4 mb-1">
            
            <div class="input-group">
                <input type="date" class="form-control input-size date1 point" id="dateFrom" value=${this.filter.values.dateFrom} autocomplete="off" />
            </div>
        
        </div>

       

            <div class="col-12 col-xl-4 col-sm-4 mb-1 point">
                 <select
                 
                  id="routeId"
                   class="form-select size-select form-control form-control-select select-search-route form-control-select-datatable point">
                    <option value=""> Todas las rutas </option>
                    `+ options + `
                  </select>
               </div>
                <div class="col-12 col-xl-4 col-sm-4 mb-1 point">
                    <select (change)="ChangeFilter($event)" 
                        [value]="filter.values.typeDeliveryPointId" 
                        id="typeDeliveryPointId"
                        class="form-select size-select form-control form-control-select  select-search-user form-control-select-datatable point">
                        <option value="">Usuarios</option>
                        `+ routeLi + `
                    </select>
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

        $('.date2').on('change', function () {

            that.filter = {
                ...that.filter,
                values: {
                    ...that.filter.values,
                    dateTo: this.value
                }
            }

            that.stateFilters.add(that.filter);

            that.cargar();
        });
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

            that.cargar();
        });


        $('.select-search-user').on('change', function () {

            that.filter = {
                ...that.filter,
                values: {
                    ...that.filter.values,
                    userId: this.value
                }
            }

            that.stateFilters.add(that.filter);
            that.cargar();
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
        this.select(tbody, table);
        this.detail(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function () {
            let data = table.row($(this).parents('tr')).data();

            that.router.navigate(['sheet-route/', data.id]);
        });
    }

    detail(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.detail', function () {
            let data = table.row($(this).parents('tr')).data();

            // that.Router.navigate([`/orders/detail-order/${data.id}`]);
        });
    }

    openPdf() {

        let url ='route_sheet_route_download_pdf?' +

            (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
                this.filter.values.routePlanningRouteId : '') +

            (this.filter.values.userId != '' ? '&userId=' +
                this.filter.values.userId : '') +


            (this.filter.values.dateFrom != '' ? '&dateFrom=' +
                this.filter.values.dateFrom : '') +

            (this.filter.values.dateTo != '' ? '&dateTo=' +
                this.filter.values.dateTo : '');
        
        const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
          
          backdropClass: 'modal-backdrop-ticket',
      
          centered: true,
      
          windowClass:'modal-view-pdf',
      
          size:'lg'
      
        });

        modal.componentInstance.title = this._translate.instant('SHEET_ROUTE.NAME');
    
        modal.componentInstance.url = url;
    
    }
    
    openCsv() {

        console.log('descargar openCsv');

        let url ='route_sheet_route_download_excel?' +

        (this.filter.values.routePlanningRouteId != '' ? '&routePlanningRouteId=' +
            this.filter.values.routePlanningRouteId : '') +

        (this.filter.values.userId != '' ? '&userId=' +
            this.filter.values.userId : '') +


        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
            this.filter.values.dateTo : '');

        
        return this.backendService.getExcelSheet(url).then((data: string)=>{
      
           
          })
    }
    openSetting() {
        
        this.router.navigateByUrl('/preferences?option=sheetRouteFirst');
    }

    openModalVerifed() {

        const modal = this._modalService.open(ModalCheckRoutesComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            size: 'sm',
            windowClass: 'modal-infor'
        });

        modal.result.then((result) => {

            console.log(result)

            if (result) {

            }
        }, (reason) => {
            // this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
        });
    }

    selectAllGen(event: any) {
        this.selectAll = event.target.checked;
        this.selectAllFunc();
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

                    $(this.table.row(element).node()).addClass('selected');
                }

            } else {

                $('#ck-' + data.id).prop('checked', false);

                $(this.table.row(element).node()).removeClass('selected');

                this.selected.splice(index, 1);

                this.selected = [];

            }

            this.detectChange.detectChanges();
        });
    }
    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.backgroundColorRow', function () {
            that.selectAll = true;
            let data = table.row($(this).parents('tr')).data();
            that.selectAll = true;
            var index = that.selected.findIndex(x => x === data.id);

            if (index === -1) {




                that.selected.push(data.id);

                $('#ck-' + data.id).prop('checked', true);


                $(this).parent().parent().addClass('selected');


            } else {

                that.selectAll = false;

                that.selected.splice(index, 1);

                $('#ck-' + data.id).prop('checked', false);

                $(this).parent().parent().removeClass('selected');

                $('.checkboxExample1').prop('checked', that.selectAll).removeAttr('checked');

            }

            that.table.rows()[0].forEach((element) => {



                if (that.selected.find(x => +x.id === +  that.table.row(element).data().id) === undefined) {

                    that.selectAll = false;

                }
            });


            that.detectChange.detectChanges();
        });
    }

    prueba() {
        console.log('aqui')
    }

    moduleCost(){
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

    formatEuro(quantity) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);
    
    }

}
