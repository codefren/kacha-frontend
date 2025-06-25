import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
    Renderer2,
    OnDestroy,
} from '@angular/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import {
    secondsToDayTimeAsString,
    DurationPipe,
    LoadingService,
    ToastService,
    downloadFile,
    dateToDDMMYYY,
    ModalViewPdfGeneralComponent,
    ModalGeneralMergeRecordComponent,
} from '@optimroute/shared';
import { Point, BackendService } from '@optimroute/backend';
import { StatePointService } from '../../../../../state-points/src/lib/state-point.service';

declare var $: any;
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalBadAddressComponent } from './modal-bad-address/modal-bad-address.component';
import { Router } from '@angular/router';
import { ModalActiveClientComponent } from './modal-active-client/modal-active-client.component';
import { StatePointsFacade } from '@easyroute/state-points';
import { take } from 'rxjs/operators';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { AssociatedCompany } from '../../../../../backend/src/lib/types/companies-associated.type';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { ModalGeneralDownloadComponent } from 'libs/shared/src/lib/components/modal-general-download/modal-general-download.component';
declare function init_plugins();
@Component({
    selector: 'easyroute-magement-clients-table',
    templateUrl: './magement-clients-table.component.html',
    styleUrls: ['./magement-clients-table.component.scss'],
})
export class MagementClientsTableComponent implements OnInit {
    table: any;
    timeInterval: any;
    formDataFile: FormGroup;
    refreshTime: number = environment.refresh_datatable_assigned;

    filter: FilterState = {
        name: 'clients',
        values: {
            showAll: false,
            showActive: 'true',
            option: 1,
            vinculations: false,
            companyAssociatedId: '',
            agentUserId: '',
            statusDeliveryPointId: '',
        },
    };
   
    deliveryPoints: any[] = [];
    change: string = 'client';
    showInfoDetail: boolean = true;

    informativeClientSummary: any;

    userAgent: any[];

    statusDeliveryPoint: any[];

    showcompanys: boolean = false;

    associatedCompany: AssociatedCompany[] = [];

    dataIsActive: any = [
        {
            id: 1,
            name: this._translate.instant('GENERAL.ACTIVE_'),
            value: 'true'
        },
        {
            id: 2,
            name: this._translate.instant('GENERAL.INACTIVATED'),
            value: 'false'
        }
    ]

    dataVinculate: any = [
        {
            id: 1,
            name: this._translate.instant('DELIVERY_POINTS.CLIENT_LINKED'),
            value: 'true'
        },
        {
            id: 2,
            name: this._translate.instant('DELIVERY_POINTS.CLIENT_NO_LINKED'),
            value: 'false'
        }
    ]

    selected: any = [];

    selectAll: boolean = false;

    deliveryPointId: any = [];

    allowCompanyPreferenceDuplicate: any = '';

    constructor(
        private dialog: NgbModal,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private backend: BackendService,
        private stateEasyrouteService: StateEasyrouteService,
        private durationPipe: DurationPipe,
        private statePointService: StatePointService,
        private loading: LoadingService,
        private toastService: ToastService,
        private router: Router,
        private _modalService: NgbModal,
        private facade: StatePointsFacade,
        private detectChanges: ChangeDetectorRef,
        private stateFilters: StateFilterStateFacade,
        private facadeProfile: ProfileSettingsFacade,
    ) {}

    ngOnInit() {
        /* setTimeout(()=>{
            init_plugins();
           
            $(document).on('inserted.bs.tooltip', function(e) {
               
                var tooltip = $(e.target).data('bs.tooltip');

                $(tooltip.tip).addClass($(e.target).data('tooltip-custom-classes'));

            });
            
        }, 1000);   */

        this.validations();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data) => {
                    const filters = await this.stateFilters.filters$
                        .pipe(take(1))
                        .toPromise();

                    this.filter = filters.find((x) => x.name === 'clients')
                        ? filters.find((x) => x.name === 'clients')
                        : this.filter;

                    this.detectChanges.detectChanges();

                    this.backend.timeoutToken().subscribe(
                        (data) => {
                            this.getResumentClient();
                            this.setStatusDeliveryPoint();
                            this.getCompanyPreferenceDuplicate();
                            //this.setUserAgent();
                            //this.setCompaniesAsociated();
                            //this.cargar();
                            //this.editar('#clients tbody', this.table);
                        },
                        (error) => {
                            this.backend.Logout();
                        },
                    );
                });
            }
        });
    }

    /* ngOnDestroy(): void {
        this.table.destroy();
    } */

    getCompanyPreferenceDuplicate() {

            this.backend
                .get('company_preference_duplicates')
                .pipe(take(1))
                .subscribe(
                    ({ data }) => {
                        this.allowCompanyPreferenceDuplicate = data;

                        this.detectChanges.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
      }

    validations() {
        this.formDataFile = new FormGroup({
            import_file: new FormControl(''),
        });
    }

    cargar() {

        
        if (this.table) {
            this.table.clear(); // limpia la tabla sin destruirla
        }

        this.selected = [];

        let that = this;

        let url = environment.apiUrl + 'delivery_point_datatables';

        if (!this.filter.values.showAll) {
            url += `?showActive=${this.filter.values.showActive}`;
        }

        if (this.filter.values.vinculations) {
            url += !this.filter.values.showAll
                ? `&vinculations=${this.filter.values.vinculations}`
                : `?vinculations=${this.filter.values.vinculations}`;
        }

        if (this.filter.values.companyAssociatedId !== '') {
            url +=
                !this.filter.values.showAll || this.filter.values.vinculations
                    ? `&companyAssociatedId=${this.filter.values.companyAssociatedId}`
                    : `?companyAssociatedId=${this.filter.values.companyAssociatedId}`;
        }

        if (this.filter.values.agentUserId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&agentUserId=${this.filter.values.agentUserId}`
                    : `?agentUserId=${this.filter.values.agentUserId}`;
        }

        if (this.filter.values.statusDeliveryPointId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`
                    : `?statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`;
        }

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#clients';
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            paging: true,
            stateSaveParams: function(settings, data) {
                data.search.search = '';
            },
            lengthMenu: [50, 100],
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {

                    $('#search').prop('disabled', true);

                    setTimeout(function () {
                        $(".dataTables_processing").hide();
                    }, 10);

                    this.toastService.displayHTTPErrorToast(xhr.responseJSON.code, xhr.responseJSON.error);

                    let html = '<div class="container" style="padding: 10px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un error al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });

                },
            },
            dom:`
                <'row'
                    <'col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                        <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 pr-2 buttonDom'>
                    >
                    <'col-xl-4 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                        <'row'
                            <'col-sm-6 col-md-6 col-xl-9 col-7 label-search'f>
                            <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table'B>
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
                    '<i class="far fa-edit"></i>' +
                        ' ' +
                        this._translate.instant('GENERAL.TABLE'),
                );
            },
            rowCallback: (row, data) => {

                if ($.inArray(data.id, this.selected) !== -1) {

                    $(row).addClass('selected-travel');

                    setTimeout(()=>{

                        $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');

                        $('#ck-' + data.id).prop('checked', true);

                    }, 900);
                    
                }
                $(row).addClass('point');
                
                /* if (data.groupDeliveryPointId != null) {
                    $('#ck-' + data.id).prop('disabled', true);
                } */
            },
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.TABLE'),
                    columnText: function(dt, idx, title) {
                        return title;
                    },
                },
            ],
            language: environment.DataTableEspaniol,
            columns: [
                {
                    data: 'id',
                    sortable: false,
                    searchable: false,
                    orderable: false,
                    className: 'dt-body-center',
                    render: (data, type, row) => {
                        return (`
                            <div class="row justify-content-center backgroundColorRow">
                              <div class="round-style-client round-little-cost text-center">
                                <input type="checkbox" class="isActive" id="ck-${data}"/>
                                <label></label>
                              </div>
                            </div>
                        `);
                    }
                },
                {
                    data: 'isGroup',
                    sortable: false,
                    searchable: false,
                    orderable: false,
                    className: 'dt-body-center',
                    render: (data, type, row) => {
                        if (data) {
                            return `
                            <div class="justify-content-center reset row">
                              <div class="text-center mt-2">
                                  <img class="point" src="assets/icons/group-g.svg">
                              </div>  
                            </div> 
                          `;
                        } else {
                            return `
                            <div class="justify-content-center reset row">
                              <div class="text-center mt-2">
                                  <img class="point" src="assets/icons/group-i.svg">
                              </div>
                            </div>
                          `;
                        }
                    },
                },
                {
                    data: 'id',
                    title: this._translate.instant('DELIVERY_POINTS.CODE'),
                    // orderable: true
                },
                {
                    data: 'statusDeliveryPointId',
                    title: this._translate.instant('DELIVERY_POINTS.TYPE'),
                    render: (data, type, row) => {
                        if (data) {
                            if (data === 1) {
                                return (
                                    '<span data-toggle="tooltip" data-placement="top" title="' +
                                    data +
                                    '">' +
                                    this._translate.instant('DELIVERY_POINTS.FREQUENT') +
                                    '</span>'
                                );
                            } else {
                                return (
                                    '<span data-toggle="tooltip" data-placement="top" title="' +
                                    data +
                                    '">' +
                                    this._translate.instant('DELIVERY_POINTS.LOST') +
                                    '</span>'
                                );
                            }
                        }else{
                            return (
                                '<span data-toggle="tooltip" data-placement="top">' +
                                    this._translate.instant('GENERAL.NOT_AVAILABLE') +
                                '</span>'
                            );
                        }
                    }
                },
                {
                    data: 'name',
                    title: this._translate.instant('DELIVERY_POINTS.NAME_'),
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
                    data: 'postalCode',
                    title: this._translate.instant('DELIVERY_POINTS.POSTAL_CODE'),
                    visible: false,
                },
                {
                    data: 'province',
                    title: this._translate.instant('DELIVERY_POINTS.PROVINCE'),
                    visible: false,
                },
                {
                    data: 'phoneNumber',
                    title: this._translate.instant('DELIVERY_POINTS.PHONE'),
                    visible: false,
                },
                {
                    data: 'email',
                    title: this._translate.instant('DELIVERY_POINTS.EMAIL'),
                    visible: false,
                },
                {
                    data: 'deliveryWindowStart',
                    title: this._translate.instant('DELIVERY_POINTS.START'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span data-toggle="tooltip" data-placement="top" title="' +
                                data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '">' + data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                'Libre' +
                                '">' +
                                'Libre' +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'deliveryWindowEnd',
                    title: this._translate.instant('DELIVERY_POINTS.END'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span data-toggle="tooltip" data-placement="top" title="' +
                                data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '">' + data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                'Libre' +
                                '">' +
                                'Libre' +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'keyOpen',
                    visible: false,
                    title: this._translate.instant('DELIVERY_POINTS.KEY_OPEN'),
                    render: (data, type, row) => {
                        if (data && data == true) {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                this._translate.instant('GENERAL.YES') +
                                '">' +
                                this._translate.instant('GENERAL.YES') +
                                '</span>'
                            );
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                this._translate.instant('GENERAL.NO') +
                                '">' +
                                this._translate.instant('GENERAL.NO') +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'serviceTime',
                    title: this._translate.instant('DELIVERY_POINTS.SERVICE_TIME'),
                    render: (data, type, row) => {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            this.durationPipe.transform(data) +
                            '">' +
                            this.durationPipe.transform(data) +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'delivery_zone.id',
                    title: this._translate.instant('DELIVERY_ZONES.ROUTE_ASSIGNED'),
                    render: (data, type, row) => {
                        let name = 'No disponible';

                        if (row.delivery_zone) {
                            name =
                                row.delivery_zone.name === null
                                    ? row.delivery_zone.id
                                    : row.delivery_zone.name;
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            name +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                /* {
                    data: 'id',
                    className: 'text-left',
                    title: this._translate.instant('DELIVERY_POINTS.FILL_PROFILE'),
                    render: (data, type, row) => {
                        
                        return (`
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped " role="progressbar" style="width: 78%" 
                                    aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                
                                    <span class="pl-2">
                                        78% 
                                    </span>
                
                                </div>
                            </div>
                            
                        `);

                    }
                }, */
                {
                    data: 'agent_user',
                    title: 'Asignado',
                    render: (data, type, row) => {
                        let name = 'No disponible';
                        if (data && data.name && data.surname) {
                            name = data.name + ' ' + data.surname;
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            name +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'coordinatesLatitude',
                    sortable: false,
                    searchable: false,
                    className: 'dt-body-center',
                    title: this._translate.instant('DELIVERY_POINTS.COORDINATES'),
                    render: (data, type, row) => {
                        if (data == '0' && row.coordinatesLongitude == '0') {
                            return `
                            <div class="justify-content-center reset row">
                              <div class="times-chip-new">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `;
                        } else {
                            return `
                            <div class="justify-content-center reset row">
                              <div class="success-chip-new">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                              </div>
                            </div>
                          `;
                        }
                    },
                },
                {
                    data: 'verifiedByDriver',
                    sortable: true,
                    searchable: false,
                    className: 'dt-body-center',
                    title: this._translate.instant('DELIVERY_POINTS.VERIFIED_BY_DRIVER'),
                    render: (data, type, row) => {
                        if (data === '1' || data === true) {
                            return `
                           <div class="justify-content-center reset row">
                             <div class="success-chip-new">
                               <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                             </div>
                           </div>
                         `;
                        } else {
                            return `
                           <div class="justify-content-center reset row">
                             <div class="times-chip-new">
                               <i class="fas fa-times mt-2"></i>
                             </div>  
                           </div> 
                         `;
                        }
                    },
                },
                {
                    data: 'isActive',
                    sortable: true,
                    searchable: false,
                    title: this._translate.instant('DELIVERY_POINTS.ACTIVE'),
                    className: 'dt-body-center',
                    render: (data, type, row) => {
                        if (data) {
                            return (
                                '<div class="d-flex justify-content-center backgroundColorRow">' +
                                '<button class="no-point btn btn-default green-new isActive warning' +
                                '" >' +
                                this._translate.instant('DELIVERY_POINTS.ACTIVE_CLIENT') +
                                '</button> ' +
                                '</div>'
                            );
                        } else {
                            return (
                                '<div class="d-flex justify-content-center backgroundColorRow">' +
                                '<button class="no-point btn btn-default gray-new isActive warning' +
                                '">' +
                                this._translate.instant('DELIVERY_POINTS.INACTIVE_CLIENT') +
                                '</button> ' +
                                '</div>'
                            );
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    className: 'dt-body-center',
                    render: () => {
                        let botones = '';
                        botones += `<div class="text-center editar">
                                <img class="icons-datatable point" src="assets/images/edit.svg">
                            </div>`;
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

        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');

        let option_type = '';

        this.statusDeliveryPoint.forEach((type) => {

            if (type.id == that.filter.values.statusDeliveryPointId) {

                option_type += '<option value="' + type.id + '" selected="true">' + type.name.replace( 'Cliente', 'Frecuente') + '</option>'
            } else {

                option_type += '<option value="' + type.id + '">' + type.name.replace( 'Cliente', 'Frecuente') + '</option>'
            }
        });

        let options_agent_user = '';

        this.userAgent.forEach((userAgent) => {

            if (userAgent.id == that.filter.values.agentUserId) {

                options_agent_user += '<option value="' + userAgent.id + '" selected="true">' + userAgent.name + userAgent.surname + '</option>'
            } else {

                options_agent_user += '<option value="' + userAgent.id + '">' + userAgent.name +' ' + userAgent.surname + '</option>'
            }
        });

        let opctions_companyAssociated = ''

        this.associatedCompany.forEach((associatedCompany: any) => {

            if (associatedCompany.id == that.filter.values.agentUserId) {

                opctions_companyAssociated += '<option value="' + associatedCompany.id + '" selected="true">' + associatedCompany.name + '</option>'
            } else {

                opctions_companyAssociated += '<option value="' + associatedCompany.id + '">' + associatedCompany.name + '</option>'
            }
        });

        let opctions_vinculate = ''

        this.dataVinculate.forEach((vinculate: any) => {

            if ((this.filter.values.vinculations || !this.filter.values.vinculations ) === vinculate.value) {

                opctions_vinculate += '<option value="' + vinculate.value + '" selected="true">' + vinculate.name + '</option>'
            } else {

                opctions_vinculate += '<option value="' + vinculate.value + '">' + vinculate.name + '</option>'
            }
        });

        let opctions_isActive = ''

        this.dataIsActive.forEach((active: any) => {


            if ((this.filter.values.showActive || !this.filter.values.showActive) === active.value) {

                opctions_isActive += '<option value="' + active.value + '" selected="true">' + active.name + '</option>'
    
            } else {

                opctions_isActive += '<option value="' + active.value + '">' + active.name + '</option>'
            }
        });

        $('.buttonDom').html(`
            <div class="form-row mb-2 mt-2">
                <div class="col-12 col-xl col-sm-4 mb-1 point">
                    <select id="statusDeliveryPointId"
                        class="form-select form-control form-control-select-datatable statusDeliveryPointId point">
                        <option value="">${that._translate.instant('DELIVERY_POINTS.TYPE')}</option>
                        `+ option_type + `
                    </select>
                </div>

                <div class="col-12 col-xl col-sm-4 mb-1 point">
                    <select id="agentUserId"
                        class="form-select form-control form-control-select-datatable agentUserId point"
                    >
                        <option value="">${that._translate.instant('DELIVERY_POINTS.COMMERCIAL_AGENT')}</option>
                        `+ options_agent_user + `
                    </select>
                </div>
    
                <div class="col-12 col-xl col-sm-4 mb-1 point">
                    <select id="companyAssociatedId"
                        class="form-select form-control form-control-select-datatable companyAssociatedId point">
                        <option value="">${that._translate.instant('COMPANIES.ASSOCIATED_COMPANY')}</option>
                        `+ opctions_companyAssociated + `
                    </select>
                </div>

                <div class="col-12 col-xl col-sm-4 mb-1 point">
                    <select id="vinculations"
                        class="form-select form-control form-control-select-datatable vinculations point"
                    >
                        <option value="">${that._translate.instant('DELIVERY_POINTS.BINDINGS')}</option>
                        `+ opctions_vinculate + `
                    </select>
                </div>

                <div class="col-12 col-xl col-sm-4 mb-1 point">
                    <select id="statusRouteId"
                        class="form-select form-control form-control-select-datatable showActive point"
                    >
                        <option value="">${that._translate.instant('GENERAL.STATE_ORDER')}</option>
                        `+ opctions_isActive + `
                    </select>
                </div>
            </div>
        `);

        $('.statusDeliveryPointId').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        $('.agentUserId').on('change', function (event: any) {

            that.ChangeFilter(event)

        }); 

        $('.companyAssociatedId').on('change', function (event: any) {

            that.ChangeFilter(event)

        }); 

        $('.vinculations').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        $('.showActive').on('change', function () {

            that.filter = {
                ...that.filter,
                values: {
                    ...that.filter.values,
                    showActive: this.value
                }
            }
         
            that.stateFilters.add(that.filter);

            that.cargar();
            
        });

        this.initEvents(table + ' tbody', this.table);

    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        /* this.timeInterval = window.setInterval(() => {
            this.table.ajax.reload();
        }, this.refreshTime); */
        this.editar(tbody, table);
        this.isActive(tbody, table);
        this.select(tbody, table);
    

    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.router.navigate([`/management/clients/${data.id}`]);
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            that.openModalActive(data.id, !data.isActive, data);
        });
    }

    importDeliveriPointExcel(file: any) {
        console.log(file, 'file')
        let excel: FormData = new FormData();
        excel.append('import_file', file, file.name);

        console.log(excel, 'excel para enviar');

        this.loading.showLoading();

        this.statePointService.addDeliveryPointImportExcel(excel).subscribe(
            (resp: any) => {
                this.loading.hideLoading();
                this.table.ajax.reload();

                if (resp.length !== 0) {
                    const dialogRef = this.dialog.open(ModalBadAddressComponent, {
                        size: 'lg',
                        backdropClass: 'customBackdrop',
                        centered: true,
                        backdrop: 'static',
                    });
                    dialogRef.componentInstance.data = {
                        badAddress: resp,
                    };
                    dialogRef.result.then(([add, object]) => {
                        this.toastService.displayWebsiteRelatedToast(
                            'Archivo procesado satisfactoriamente.',
                            this._translate.instant('GENERAL.ACCEPT'),
                        );
                    });
                } else {
                    this.toastService.displayWebsiteRelatedToast(
                        'Archivo procesado satisfactoriamente.',
                        this._translate.instant('GENERAL.ACCEPT'),
                    );
                }
            },
            (error: any) => {
                this.loading.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );

        this.formDataFile.get('import_file').setValue('');
    }

    isCommercialAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
            : false;
    }

    openModalActive(id: string, element: any, deliveryPoint: any) {
        // se clona el punto para evitar modificar la instancia del this de la tabla
        const clonePoint = _.cloneDeep(deliveryPoint);

        let data = {
            message: clonePoint.isActive
                ? this._translate.instant('DELIVERY_POINTS.DESACTIVATE_CLIENT')
                : this._translate.instant('DELIVERY_POINTS.ACTIVATE_CLIENT'),
        };

        delete clonePoint.company;
        delete clonePoint.delivery_zone;
        delete clonePoint.company_associated;
        delete clonePoint.agent_user;
        delete clonePoint.status_delivery_point;
        delete clonePoint.vinculations;

        const modal = this._modalService.open(ModalActiveClientComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;

        modal.result.then(
            (resp: boolean) => {
                if (resp) {
                    this.loading.showLoading();

                    clonePoint.isActive = !clonePoint.isActive;

                    this.facade.editPoint(id, clonePoint);
                    this.facade.updated$.pipe(take(2)).subscribe(
                        (resp) => {
                            console.log(resp);
                            if (resp) {
                                console.log(resp);
                                if (resp) {
                                    console.log(resp);
                                    this.loading.hideLoading();
                                    this.toastService.displayWebsiteRelatedToast(
                                        this._translate.instant('CLIENTS.UPDATE_CLIENT'),
                                        this._translate.instant('GENERAL.ACCEPT'),
                                    );

                                    this.table.ajax.reload();
                                    this.getResumentClient();
                                    this.detectChanges.detectChanges();
                                }
                            }
                            (error) => {
                                console.log(error);
                                this.loading.hideLoading();
                                this.toastService.displayWebsiteRelatedToast(
                                    this._translate.instant('CLIENTS.UPDATE_CLIENT'),
                                    this._translate.instant('GENERAL.ACCEPT'),
                                );

                                this.table.ajax.reload();
                                this.detectChanges.detectChanges();
                            };
                        },
                        (error) => {
                            console.log(error);
                            this.loading.hideLoading();
                            this.toastService.displayHTTPErrorToast(
                                error,
                                'error al actualizar',
                            );
                        },
                    );
                } else {
                    element = !element;
                }
            },
            (reason) => (element = !element),
        );
    }

    filterOpen() {
        const modal = this.dialog.open(ModalFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-left',
        });

        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                if (data) {
                    console.log(data, 'cierre del modal');
                    this.filter.values.agentUserId = data.agentUserId;
                    this.filter.values.showAll = data.showAll;
                    this.filter.values.showActive = data.showActive;
                    this.filter.values.option = data.option;
                    this.filter.values.vinculations = data.vinculations;
                    this.filter.values.companyAssociatedId = data.companyAssociatedId;

                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    export() {
        let url = 'delivery_point_export_json';

        if (!this.filter.values.showAll) {
            url += `?showActive=${this.filter.values.showActive}`;
        }

        if (this.filter.values.vinculations) {
            url += !this.filter.values.showAll
                ? `&vinculations=${this.filter.values.vinculations}`
                : `?vinculations=${this.filter.values.vinculations}`;
        }

        if (this.filter.values.companyAssociatedId !== '') {
            url +=
                !this.filter.values.showAll || this.filter.values.vinculations
                    ? `&companyAssociatedId=${this.filter.values.companyAssociatedId}`
                    : `?companyAssociatedId=${this.filter.values.companyAssociatedId}`;
        }

        if (this.filter.values.agentUserId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&agentUserId=${this.filter.values.agentUserId}`
                    : `?agentUserId=${this.filter.values.agentUserId}`;
        }

        this.statePointService.getDeliveryPointExportJson(url).subscribe(
            (resp: any) => {
                this.generateJson(resp);
            },
            (error: any) => {
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );
    }

    generateJson(data: any, routeId: any = null) {
        let json = JSON.stringify(data);

        if (routeId == null) {
            downloadFile(json, `polpoo_delivery_Points${dateToDDMMYYY(new Date())}.json`);
        } else {

            downloadFile(
                json,
                `polpoo_routes_${dateToDDMMYYY(new Date())}_${routeId}.json`,
            );
        }
    }

    getResumentClient() {
        this.showInfoDetail = false;

        this.stateEasyrouteService
            .getInformativeClientSummary()
            .pipe(take(1))
            .subscribe(
                (data: any) => {
                    this.informativeClientSummary = data.dataTotalClient;

                    this.showInfoDetail = true;
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

    setStatusDeliveryPoint() {
        this.backend
            .get('status_delivery_point')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.statusDeliveryPoint = data;

                    this.setUserAgent();

                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error,
                        error.error.error,
                    );
                },
            );
    }

    setUserAgent() {
        this.backend
            .get('users_salesman')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.userAgent = data;

                    this.setCompaniesAsociated();

                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error,
                        error.error.error,
                    );
                },
            );
    }

    setCompaniesAsociated() {
        this.backend
            .get('company_associated_list')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.associatedCompany = data;
                    this.showcompanys = true;

                    this.cargar();
                    this.editar('#clients tbody', this.table);

                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }


    ChangeFilter(event) {
        let value = event.target.value;

        let id = event.target.id;

        /* if (id === 'vinculations') {
            value = event.target.checked;
        } */

        console.log(value, id)
        this.setFilter(value, id, true);
    }

    setFilter(value: any, property: string, sendData?: boolean) {
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                [property]: value,
            },
        };

        console.log(this.filter, 'filter');

        this.stateFilters.add(this.filter);

        if (sendData) {
            this.cargar();

            this.detectChanges.detectChanges();
        }
    }

    onChangeShowActive(value: any) {
        console.log(value,'onChangeShowActive');
        switch (value) {
            case '1':
                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        ['option']: value,
                        ['showAll']: false,
                        ['showActive']: true,
                    },
                };
                break;

            case '2':
                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        ['option']: value,
                        ['showAll']: false,
                        ['showActive']: false,
                    },
                };
                break;

            default:
                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        ['option']: value,
                        ['showAll']: '',
                        ['showActive']: '',
                    },
                };
                break;
        }

        this.stateFilters.add(this.filter);
        this.cargar();
        this.detectChanges.detectChanges();
    }

    openSetting() {

        //this.router.navigate(['management/client-settings']);
        this.router.navigateByUrl('/preferences?option=timeSpecification');
    }

    openUpdateData(){
        this.router.navigate(['/management/clients/update']);
    }


    // Descargar cliente
    openModalDonwload(){
        const modal = this.dialog.open(ModalGeneralDownloadComponent, {
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-donwload-User',
            size:'md'
        });

        modal.componentInstance.title = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT');
        modal.componentInstance.message = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT_MESSAGE');
        modal.componentInstance.pdf = false;
        modal.componentInstance.selectDownload = 'excel';
        modal.componentInstance.etiqueta = 'json';

        modal.result.then(
            (data) => {
                    
              if (data) {
                switch (data) {
                    case 'pdf':

                        this.dowloadClientPdf();
                        break;

                    case 'excel':

                        this.dowloadClientExcel();
                        break

                    case 'json':

                        this.export();
                        break
                
                    default:
                        break;
                }

            }      
            },
            (reason) => {
              
            },
        ); 
    }

    dowloadClientPdf() {

        let url = 'delivery_point_download_pdf';

        if (!this.filter.values.showAll) {
            url += `?showActive=${this.filter.values.showActive}`;
        }
        
        if (this.filter.values.vinculations) {
            url += !this.filter.values.showAll
                ? `&vinculations=${this.filter.values.vinculations}`
                : `?vinculations=${this.filter.values.vinculations}`;
        }

        if (this.filter.values.companyAssociatedId !== '') {
            url +=
                !this.filter.values.showAll || this.filter.values.vinculations
                    ? `&companyAssociatedId=${this.filter.values.companyAssociatedId}`
                    : `?companyAssociatedId=${this.filter.values.companyAssociatedId}`;
        }

        if (this.filter.values.agentUserId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&agentUserId=${this.filter.values.agentUserId}`
                    : `?agentUserId=${this.filter.values.agentUserId}`;
        }

        if (this.filter.values.statusDeliveryPointId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`
                    : `?statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`;
        }

        const modal = this.dialog.open( ModalViewPdfGeneralComponent, {
          
            backdropClass: 'modal-backdrop-ticket',
        
            centered: true,
        
            windowClass:'modal-view-pdf',
        
            size:'lg'
        
          });
  
          modal.componentInstance.title = this._translate.instant('PREFERENCES.CLIENTS');
      
          modal.componentInstance.url = url;
    }

    dowloadClientExcel() {
        
        let url = 'delivery_point_download_excel';

        if (!this.filter.values.showAll) {
            url += `?showActive=${this.filter.values.showActive}`;
        }
        
        if (this.filter.values.vinculations) {
            url += !this.filter.values.showAll
                ? `&vinculations=${this.filter.values.vinculations}`
                : `?vinculations=${this.filter.values.vinculations}`;
        }

        if (this.filter.values.companyAssociatedId !== '') {
            url +=
                !this.filter.values.showAll || this.filter.values.vinculations
                    ? `&companyAssociatedId=${this.filter.values.companyAssociatedId}`
                    : `?companyAssociatedId=${this.filter.values.companyAssociatedId}`;
        }

        if (this.filter.values.agentUserId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&agentUserId=${this.filter.values.agentUserId}`
                    : `?agentUserId=${this.filter.values.agentUserId}`;
        }

        if (this.filter.values.statusDeliveryPointId !== '') {
            url +=
                !this.filter.values.showAll ||
                this.filter.values.vinculations ||
                this.filter.values.companyAssociatedId !== ''
                    ? `&statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`
                    : `?statusDeliveryPointId=${this.filter.values.statusDeliveryPointId}`;
        }

        return this.backend.getDownloadExcel(url, 'Client').then((data: string)=>{ })
        
    }


    multivalidation() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 16 || role === 14) !== undefined
            : false;
    }

    select(tbody: any, table: any, that = this) {
        
        $(tbody).on('click', 'tr', function () {

            let data = table.row($(this)).data();

            if(data.isGroup) return

            that.selectAll = true;

            var index = that.selected.findIndex(x => x.id === data.id);

            if (index === -1) {
                
                that.deliveryPointId.push(data.id);

                that.selected.push({
                    id: data.id,
                    name: data.name,
                    address: data.address,
                    zipCode: data.postalCode,
                    population: data.population,
                    phone: data.phoneNumber
                });

                $('#ck-' + data.id).prop('checked', true);

                $('#thead-1').addClass('hidden');

                $('#thead-2').removeClass('hidden');

                $(this).parent().parent().addClass('selected-travel');

                if (that.table.rows()[0].length == that.selected.length) {

                    $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');
                }

            } else {

                that.selectAll = false;
                
                that.deliveryPointId.splice(index, 1);
                that.selected.splice(index, 1);

                $('#ck-' + data.id).prop('checked', false);

                $('#checkboxDriverCost1').prop('checked', that.selectAll).removeAttr('checked');

                that.table.rows()[0].forEach((element) => {

                    if (that.selected.length === 0) {

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

    }

    selectAllFunc() {
  
        this.table.rows()[0].forEach((element) => {
    
            let data = this.table.row(element).data();

            if(data.isGroup) return
    
            var index = this.selected.findIndex(x => x.id === data.id);
    
            if (this.selectAll) {
    
                var x = this.selected.filter(x => x.id == data.id);
    
                if (x.length == 0) {
    
                    this.deliveryPointId.push(data.id);

                    this.selected.push({
                        id: data.id,
                        name: data.name,
                        address: data.address,
                        zipCode: data.postalCode,
                        population: data.population,
                        phone: data.phoneNumber
                    });
    
                    $('#ck-' + data.id).prop('checked', true);
    
                    $('#thead-1').addClass('hidden');
    
                    $('#thead-2').removeClass('hidden');
    
                    $(this.table.row(element).node()).addClass('selected-travel');
                }
    
            } else {
    
                $('#ck-' + data.id).prop('checked', false);
    
                $('#thead-1').removeClass('hidden');
    
                $('#thead-2').addClass('hidden');
    
                $(this.table.row(element).node()).removeClass('selected-travel');
    
                $('#checkboxDriverCost1').prop('checked', false).removeAttr('checked');
    
                this.selected.splice(index, 1);
    
                this.selected = [];
    
                $(this).toggleClass('selected-travel');
            }
    
            this.detectChanges.detectChanges();
        });
        
    }

    registerRecord() {
        const modal = this._modalService.open(ModalGeneralMergeRecordComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            windowClass:'modal-export-routes',
        });
        
        modal.componentInstance.title = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');
    
        modal.componentInstance.Subtitle = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ARE_YOU_SURE_YOU_WANT_TO_DROP_THIS_CUSTOMER');
    
        modal.componentInstance.message = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ONE_YOU_DISCARD_IT_THIS_CLIENT_WILL_GO_TO_THE_LIST_OF_CLIENTS_WITHOUT_GROUPING');
    
        modal.componentInstance.accept =  this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');
        
        modal.componentInstance.cssStyle = 'btn btn-red-general';

        modal.componentInstance.dataClient = this.selected;
        
        modal.componentInstance.deliveryPointId = this.deliveryPointId;
    
        modal.result.then(
            (data) => {
                if (data) {
                    
                    this.selectAll = false;
                    this.selectAllFunc();
                    
                    this.getResumentClient();
                    this.cargar();
                
                }      
            },
            (reason) => {
            
            },
        ); 
    }

}
