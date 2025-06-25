import { ModalViewPdfGeneralComponent, secondsToDayTimeAsString } from '@optimroute/shared';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbCalendar, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { FilterState, Franchise } from '@optimroute/backend';
declare var $: any;
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { Language, MomentDateFormatter, CustomDatepickerI18n, objectToString, dateToObject, getYearToToday, getYesterdaySubtract } from '../../../../../shared/src/lib/util-functions/date-format';

@Component({
    selector: 'easyroute-vehicle-maintenance-list',
    templateUrl: './vehicle-maintenance-list.component.html',
    styleUrls: ['./vehicle-maintenance-list.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
    ]
})
export class VehicleMaintenanceListComponent implements OnInit {
    me: boolean;

    table: any;

    disabled: boolean;

    selected: any = [];

    timeInterval: any;

    refreshTime: number = environment.refresh_datatable_assigned;

    load: 'loading' | 'success' | 'error' = 'loading';

    loadVehicles: 'loading' | 'success' | 'error' = 'loading';

    driverList: any[] = [];

    VehicleList: any[] = [];

    maintenanceVehicleStateTypeList: any[] = [];

    maintenanceStatusList: any[] = [];

    MaintenanceInformative: any;

    filterMaintenance: FilterState = {
        name: 'vehicle_mantenace',
        values: {
            idUser: '',
            vehicleId: '',
            maintenanceStatusId:'',
            maintenanceVehicleStateTypeId:'',
            dateFrom:getYesterdaySubtract(),
            dateTo:this.getToday()
        }
       
    };
   
    change: string = 'vehicle-maintenance';

    showInfoDetail: boolean = false;

    informativeData: any;

    showmaintenanceVehicleState: boolean = false;

    showMaintenanceVehicleStateTypeId : boolean = false;

    fromDate: NgbDateStruct | null;

	toDate: NgbDateStruct | null;

    hoveredDate: NgbDate | null = null;

    subtraYearDate: any = dateToObject(getYesterdaySubtract());

    constructor(
        private Router: Router,
        private authLocal: AuthLocalService,
        private modalService: NgbModal,
        private loading: LoadingService,
        private detectChanges: ChangeDetectorRef,
        private toastService: ToastService,
        private stateEasyrouteService: StateEasyrouteService,
        private _translate: TranslateService,
        private router: Router,
        private stateFilters: StateFilterStateFacade,
        private backendService: BackendService,
        private calendar: NgbCalendar, 
        public formatter: NgbDateParserFormatter
    ) {}

    redirectConfig(){
        this.router.navigateByUrl('preferences?option=Vehicle');
    }

    ngOnInit() {

        this.fromDate = this.subtraYearDate;
  
    	this.toDate = this.calendar.getToday();
       
        this.loadFilters();
        
    }

    async loadFilters() {

        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

        this.filterMaintenance = filters.find(x => x && x.name === 'vehicle_mantenace') ? filters.find(x => x.name === 'vehicle_mantenace') : this.filterMaintenance;

         /* si tienes las fechas */
  
      if (this.filterMaintenance.values.dateFrom && this.filterMaintenance.values.dateTo) {
  
        this.fromDate = dateToObject(this.filterMaintenance.values.dateFrom);
  
      	this.toDate = dateToObject(this.filterMaintenance.values.dateTo);
        
      } 

        this.getAllDriver();
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

        let that = this;

        this.selected = [];

        let isSalesman = this.isSalesman() && this.me == false;
        
            let url = environment.apiUrl + 'maintenance_datatable?' +

            (this.filterMaintenance.values.idUser != '' ? '&idUser=' +
             this.filterMaintenance.values.idUser : '') +

            (this.filterMaintenance.values.vehicleId != '' ? '&vehicleId=' +
             this.filterMaintenance.values.vehicleId : '') +

            (this.filterMaintenance.values.maintenanceStatusId != '' ? '&maintenanceStatusId=' +
             this.filterMaintenance.values.maintenanceStatusId : '') +

            (this.filterMaintenance.values.maintenanceVehicleStateTypeId != '' ? '&maintenanceVehicleStateTypeId=' +
             this.filterMaintenance.values.maintenanceVehicleStateTypeId : '')+

             (this.filterMaintenance.values.dateFrom != '' ? '&dateFrom=' +
             this.filterMaintenance.values.dateFrom : '')+

             (this.filterMaintenance.values.dateTo != '' ? '&dateTo=' +
             this.filterMaintenance.values.dateTo : '');


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#manteanace';
        this.table = $(table).DataTable({
            destroy: true,
            //serverSide: true,
            processing: true,
            stateSave: true,
            responsive: true,
            cache: false,
            columnDefs: [{ orderData: 1, targets: [0] }],
            lengthMenu: [10, 100],
            stateSaveParams: function(settings, data) {
                data.search.search = '';
            },
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
                <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
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
                    let html = '<div class="container" style="padding: 10px;">';
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
                    data: 'user',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.USERS'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data.name +
                                ' ' +
                                data.surname +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'vehicle.name',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.VEHICLE'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'No disponible';
                        } else {
                            return data;
                        }
                    },
                },
                {
                    data: 'vehicle.name',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.TUITION'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'No disponible';
                        } else {
                            return data;
                        }
                    },
                },
                {
                    data: 'date',
                    type: 'date',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.MAINTENANCE_DATE'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'No disponible';
                        } else {
                            return moment(data).format('DD/MM/YYYY');
                        }
                    },
                },
                {
                    data: 'maintenance_vehicle_state_type',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.VEHICLE_STATUS'),

                    render: (data, type, row) => {
                        if (data) {
                            let varClass = '';
                            //let maintenanceName = data.name ? data.name : null;
                            if (data === 'Bien') {
                                varClass = 'green-vehicle';
                            }
                            if (data == 'Mal') {
                                varClass = 'red-vehicle';
                            }
                            if (data == 'Regular') {
                                varClass = 'orange-vehicle';
                            }

                            return (
                                '<div class="d-flex justify-content-center backgroundColorRow">' +
                                ' <div class="text-center no-point  col-12 p-0 m-0">' +
                                '<button style="font-size: 14px;" class="no-point btn btn-default warning ' +
                                varClass +
                                '">' +
                                data +
                                ' </button> ' +
                                '</div>' +
                                '</div>'
                            );
                        } else {
                            return `<span style="font-weight: bold; color: #837474;"> - - - </span>`;
                        }
                    },
                },
                {
                    data: 'maintenance_image_count',

                    title: this._translate.instant('VEHICLE_MAINTENANCE.PHOTO'),

                    render: (data, type, row) => {

                        let varClass = '';

                        let totalImage = data;

                        let maintenanceVehicle = row.total_preference_review;

                        if (totalImage === 3) {

                            varClass = 'total-vehicle-finish';

                        }

                        if (data >=0) {

                            return (

                                '<span class="' + varClass + '"> ' + totalImage +'/' + 3 +' </span>'
                                
                            );
                        }

                        return `<span style="font-weight: bold; color: #837474;"> - - - </span>`;
                      
                    },
                },

                {
                    data: 'maintenance_vehicle_review_count',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.REVISION'),
                    render: (data, type, row) => {
                        let varClass = '';

                        let totalPreference = data;

                        let maintenanceVehicle = row.total_preference_review;

                        if (maintenanceVehicle == totalPreference) {
                            varClass = 'total-vehicle-finish';
                        }

                        if (data > 0) {
                            return (
                                '<span class="' +
                                varClass +
                                '"> ' +
                                totalPreference +
                                '/' +
                                maintenanceVehicle +
                                ' </span>'
                            );
                        }

                        return `<span style="font-weight: bold; color: #837474;"> - - - </span>`;
                    },
                },

                {
                    data: 'maintenance_status',
                    title: this._translate.instant('VEHICLE_MAINTENANCE.STATE'),
                    render: (data, type, row) => {
                        let varClass = '';

                        if (data) {
                            if (data == 'Sin asignar') {
                                varClass = 'no-asigned';
                            }
                            if (data == 'En preparación' || data == 'En camino') {
                                varClass = 'blue-vehicle';
                            }
                            if (data === 'Finalizado') {
                                varClass = 'green-vehicle';
                            }
                            if (data == 'No entregado') {
                                varClass = 'red-vehicle ';
                            }
                            if (data == 'Pospuesto') {
                                varClass = 'orange-vehicle';
                            }
                            if (data == 'Cancelada') {
                                varClass = 'yellow-vehicle';
                            }
                            if (data === 'No realizado') {
                                varClass = '';
                            }

                            return (
                                '<div class="d-flex justify-content-center backgroundColorRow">' +
                                ' <div class="text-center  col-12 p-0 m-0">' +
                                '<button style="font-size: 14px;" class="no-point btn btn-default warning ' +
                                varClass +
                                '">' +
                                data +
                                ' </button> ' +
                                '</div>' +
                                '</div>'
                            );
                        } else {
                            return `<span style="font-weight: bold;"> no disponible </span>`;
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
                    <div class="text-center editar point">
                        <img class="" src="assets/icons/External_Link.svg">
                    </div>
                `;
                        return botones;
                    },
                },
            ],
        });
        $('.dataTables_filter').html(`
            <div class="d-flex justify-content-md-end justify-content-center">
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
            </div>
        `);

        $('.dt-button').css("border", "0px");
        $('.dt-button').css("height", "0px");
        const $elem = $('.dt-button');
        $elem[0].style.setProperty('padding', '0px', 'important');
        $('.dt-buttons').css("height", "0px");

        $('#dt-buttons-table').off('click');
        $('#dt-buttons-table').on('click', function () {


            $('.dt-button').click();
        });


        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');

        /* this.initEvents(table + ' tbody', this.table); */
        this.initEvents('#manteanace tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        window.clearInterval(this.timeInterval);

        this.timeInterval = window.setInterval(() => {
            this.table.ajax.reload();
        }, this.refreshTime);

        this.editar(tbody, table);

        this.isActive(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.Router.navigate(['vehicle-maintenance', data.id]);
        });
    }

    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function() {
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

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            // that.OnChangeCheckActive(data.id, !data.activeInApp, data);
        });
    }

    editActiveCompany(franchiseId: number, element: any) {
        this.loading.showLoading();

        this.stateEasyrouteService.updateFranchise(franchiseId, element).subscribe(
            (data: any) => {
                this.toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
                this.table.ajax.reload();
                this.loading.hideLoading();
            },
            (error) => {
                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
    }

    /* get chofer */

    getAllDriver() {
        this.load = 'loading';

            this.stateEasyrouteService.getAllDriver().pipe(take(1)).subscribe(
                (data: any) => {
                    this.driverList = data.data;

                    this.load = 'success';

                   // this.detectChanges.detectChanges();

                    this.getVehicle();

                    this.loading.hideLoading();
                },
                (error) => {
                    this.load = 'error';

                    this.loading.hideLoading();

                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        
    }


    /* get vehicle */
    getVehicle() {
        this.loadVehicles = 'loading';
        
            this.stateEasyrouteService.getVehicle().pipe(take(1)).subscribe(
                (data: any) => {
                    this.VehicleList = data.data;

                    this.loadVehicles = 'success';

                    //this.detectChanges.detectChanges();

                    this.getMaintenanceStatus();

                    this.loading.hideLoading();
                },
                (error) => {
                    this.loadVehicles = 'error';

                    this.loading.hideLoading();

                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        
    }

    /* status mantenimiento */
    getMaintenanceStatus(){

        this.showMaintenanceVehicleStateTypeId = false;

        this.stateEasyrouteService.getMaintenanceStatus().pipe(take(1)).subscribe(
            (data: any) => {

                this.maintenanceStatusList = data.data;

                this.showMaintenanceVehicleStateTypeId = true;

                //this.detectChanges.detectChanges();

                this.getMaintenanceVehicleStateType();

                this.loading.hideLoading();
            },
            (error) => {
                this.showMaintenanceVehicleStateTypeId = true

                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );

    }


    getMaintenanceVehicleStateType() {

        this.showmaintenanceVehicleState= false;

            this.stateEasyrouteService.getMaintenanceVehicleStateType().pipe(take(1)).subscribe(
                (data: any) => {

                    this.maintenanceVehicleStateTypeList = data.data;

                    this.showmaintenanceVehicleState= true;

                    ///this.detectChanges.detectChanges();

                    this.getMaintenanceInformative();

                    this.loading.hideLoading();
                },
                (error) => {
                    this.showmaintenanceVehicleState= true;

                    this.loading.hideLoading();

                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        
    }

    /* cuadros informaticos */

    getMaintenanceInformative() {

        this.showInfoDetail = false;

        this.stateEasyrouteService.getMaintenanceInformatice(this.filterMaintenance.values).pipe(take(1)).subscribe(
            (data: any) => {

                this.MaintenanceInformative = data.data;

                this.showInfoDetail = true;

                this.detectChanges.detectChanges();

                this.cargar();

               
            },
            (error) => {

                this.showInfoDetail = true;

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    
}

   
    changeDriver(driverId: string) {
        this.filterMaintenance.values.userId = driverId;

        this.cargar();
    }

    changeVehicle(vehicleId: string) {
        this.filterMaintenance.values.vehicleId = vehicleId;

        this.cargar();
    }

    changePage(name: string){
       
        switch (name) {
            case 'vehicle-maintenance':
                this.change = name;
                this.router.navigate(['/vehicle-maintenance']);
                break;
    
                case 'historial':
                    this.change = name;
                    this.router.navigate(['/vehicle-maintenance/history']);
                break;
        
            default:
                break;
        }
    }

    openCsv() {

        let url ='maintenance_download_excel?' +

        (this.filterMaintenance.values.idUser != '' ? '&idUser=' +
            this.filterMaintenance.values.idUser : '') +

        (this.filterMaintenance.values.vehicleId != '' ? '&vehicleId=' +
            this.filterMaintenance.values.vehicleId : '') +


        (this.filterMaintenance.values.maintenanceVehicleStateTypeId != '' ? '&maintenanceVehicleStateTypeId=' +
            this.filterMaintenance.values.maintenanceVehicleStateTypeId : '') +

            (this.filterMaintenance.values.maintenanceStatusId != '' ? '&maintenanceStatusId=' +
            this.filterMaintenance.values.maintenanceStatusId : '') +

        (this.filterMaintenance.values.date != '' ? '&date=' +
            this.filterMaintenance.values.date : '');

        
        return this.backendService.getvehicleMaintenance(url).then((data: string)=>{
      
           
          })
    }
    
       openPdf() {

        let url ='maintenance_download_pdf?' +

        (this.filterMaintenance.values.idUser != '' ? '&idUser=' +
        this.filterMaintenance.values.idUser : '') +

        (this.filterMaintenance.values.vehicleId != '' ? '&vehicleId=' +
            this.filterMaintenance.values.vehicleId : '') +


        (this.filterMaintenance.values.maintenanceVehicleStateTypeId != '' ? '&maintenanceVehicleStateTypeId=' +
            this.filterMaintenance.values.maintenanceVehicleStateTypeId : '') +

        (this.filterMaintenance.values.maintenanceStatusId != '' ? '&maintenanceStatusId=' +
        this.filterMaintenance.values.maintenanceStatusId : '') +

        (this.filterMaintenance.values.date != '' ? '&date=' +
            this.filterMaintenance.values.date : '');
        
        const modal = this.modalService.open( ModalViewPdfGeneralComponent, {
          
          backdropClass: 'modal-backdrop-ticket',
      
          centered: true,
      
          windowClass:'modal-view-pdf',
      
          size:'lg'
      
        });

        modal.componentInstance.title = this._translate.instant('VEHICLE_MAINTENANCE.VEHICLE_MAINTENANCE');
    
        modal.componentInstance.url = url;
    
    }
    
    openSetting(){
        console.log('abrir la configuración')
        //this.router.navigate(['vehicle-maintenance/settings']);
        this.router.navigateByUrl('/preferences?option=vehicleStatus');
    }

    returnsVehicle(){
        this.Router.navigate(['/management-logistics/vehicles']);
    }

    //new 
    changeroutePlanningRouteId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }
    changeVehicleId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }

    changeMaitenanceId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }

    maintenanceVehicleStateTypeId(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);

    }

    
    setFilter(value: any, property: string, sendData?: boolean) {


        this.filterMaintenance = {
            ...this.filterMaintenance,
            values: {
                ...this.filterMaintenance.values,
                [property]: value
            }
        }


        this.stateFilters.add(this.filterMaintenance);

        this.getMaintenanceInformative();
    }

    /* date */
    onDateSelection(date: NgbDate) {
  
        if (!this.fromDate && !this.toDate) {
      
          this.fromDate = date;
      
          this.filterMaintenance = {
      
            ...this.filterMaintenance,
      
            values: {
      
                ...this.filterMaintenance.values,
      
                dateFrom: objectToString(date),
                
            }
        }
      
        this.getMaintenanceInformative();
        
        this.stateFilters.add(this.filterMaintenance);
      
      
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      
          
      
          this.toDate = date;
      
          this.filterMaintenance = {
      
            ...this.filterMaintenance,
      
            values: {
      
                ...this.filterMaintenance.values,
      
                dateTo: objectToString(date),
                
            }
            
        }
      
        this.getMaintenanceInformative();
      
        this.stateFilters.add(this.filterMaintenance);
      
        } else {
      
          
      
          this.filterMaintenance = {
      
            ...this.filterMaintenance,
      
            values: {
      
                ...this.filterMaintenance.values,
      
                dateFrom: objectToString(date),
      
                dateTo:objectToString(null)
      
            }
        }
      
        //this.getMaintenanceInformative();
      
        this.toDate = null;
      
        this.fromDate = date;
      
        this.stateFilters.add(this.filterMaintenance);
      
        }
    
    
        
      }
    
      isHovered(date: NgbDate) {
      
        return (
      
          this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
      
        );
      
      }
    
      isInside(date: NgbDate) {
      
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
      
      }
    
    
      isRange(date: NgbDate) {
      
        return (
      
          date.equals(this.fromDate) ||
      
          (this.toDate && date.equals(this.toDate)) ||
      
          this.isInside(date) ||
      
          this.isHovered(date)
      
        );
      }
      validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {
  
        const parsed = this.formatter.parse(input);
      
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
      
      }
}
