import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, FilterState } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { take } from 'rxjs/operators';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { ModalGeneralDownloadComponent, ModalViewPdfGeneralComponent, ToastService } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProviderActiveComponent } from '../../components/provider-list/modal-provider-active/modal-provider-active.component';
import { StateFilterStateFacade } from '@easyroute/filter-state';

declare var $: any;

@Component({
    selector: 'easyroute-provider-list',
    templateUrl: './provider-list.component.html',
    styleUrls: ['./provider-list.component.scss']
})


export class ProviderListComponent implements OnInit {

    table: any;
    refreshTime: number = environment.refresh_datatable_assigned;

    timeInterval: any;

    providerType: any[];
    assigned: any[];

    showInfoDetail: boolean = true;
    totalesInformative: any;



    filter: FilterState = {
        name: 'providers',
        values: {
            providerTypeId: '',
            providerAssigmentTypeId: '',
            isActive: ''
        }
    };

    dataIsActive: any = [
        {
            id: 1,
            name: 'Activados'
        },
        {
            id: 0,
            name: 'Inactivos'
        }
    ]

    loading: string = 'success';

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private backend: BackendService,
        private authLocal: AuthLocalService,
        private toastService: ToastService,
        private translate: TranslateService,
        private detectChange: ChangeDetectorRef,
        private stateEasyrouteService: StateEasyrouteService,
        private stateFilters: StateFilterStateFacade
    ) { }

    ngOnInit() {

        this.loadFilters();

    }

    async loadFilters() {
        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

        this.filter = filters.find(x => x && x.name === 'providers') ? filters.find(x => x.name === 'providers') : this.filter;

        this.getGroupTotalProviders();

        this.getProviderType();

    }

    getGroupTotalProviders() {
        this.showInfoDetail = false;

        this.stateEasyrouteService
            .getGroupTotalProviders()
            .pipe(take(1))
            .subscribe(
                (data: any) => {

                    this.totalesInformative = data.items;

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

    getProviderType() {

        this.loading = 'loading';

        this.stateEasyrouteService.getProviderType().subscribe(
            (data: any) => {

                this.providerType = data.data;
                this.loading = 'success';
                this.getAssigned();

            },
            (error) => {

                this.loading = 'error';

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );

    }

    getAssigned() {

        this.loading = 'loading';

        this.stateEasyrouteService.getAssigned().subscribe(
            (data: any) => {

                this.assigned = data.data;
                this.loading = 'success';
                this.cargar();

            },
            (error) => {

                this.loading = 'error';

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    cargar() {

        let that = this;

        if (this.table) {
            this.table.clear(); // limpia la tabla sin destruirla
        }

        let url =
            environment.apiUrl +
            'providers_datatables?providerTypeId=' +
            this.filter.values.providerTypeId +
            '&providerAssigmentTypeId=' +
            this.filter.values.providerAssigmentTypeId +
            '&isActive=' +
            this.filter.values.isActive;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#providers';
        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            order: [1, 'desc'],
            stateSaveParams: function (settings, data) {
                data.search.search = '';
            },
            /* initComplete: function (settings, data) {
                settings.oClasses.sScrollBody = '';
            }, */
            cache: false,
            lengthMenu: [10, 100],
            dom: `
                <'row'
                    <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                        <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 pr-2 filterProviderDom'>
                    >
                    <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                        <'row'
                            <'col-sm-6 col-md-6 col-xl-9 col-7 p-0 label-search'f>
                            <'col-sm-6 col-md-6 col-xl-3 col-5 pr-2 dt-buttons-table-otro'B>
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
                    this.translate.instant('GENERAL.TABLE'),
                );
            },
            buttons: [
                {
                    extend: 'colvis',
                    text: this.translate.instant('GENERAL.TABLE'),
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
                    render: (data, type, row) => {
                        return '<span class="text-center">' + data + '</span>';
                    },
                },
                {
                    data: 'provider_type.name',
                    title: this.translate.instant('PROVIDERS.TYPE'),
                    render: (data, type, row) => {
                        if (!data) {
                            return '<span class="text center" aria-hidden="true"> ---</span>';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'name',
                    title: this.translate.instant('PROVIDERS.PROVIDER'),
                    render: (data, type, row) => {
                        let name = data;
                        if (name.length > 30) {
                            name = name.substr(0, 29) + '...';
                        }
                        if (!data) {
                            return '<span class="text center" aria-hidden="true">---</span>';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'provider_assigment_type.name',
                    title: this.translate.instant('PROVIDERS.ASSIGNED'),
                    render: (data, type, row) => {

                        if (!data) {
                            return '<span class="text center" aria-hidden="true"> --- </span>';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'contactPerson',
                    title: this.translate.instant('PROVIDERS.CONTACT_PERSON'),
                    visible: true,
                    searchable: false,
                    render: (data, type, row) => {
                        if (!data) {
                            return '<span class="text-center"> --- </span>';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'phoneNumber',
                    title: this.translate.instant('PROVIDERS.PHONE'),
                    visible: true,
                    searchable: false,
                    render: (data, type, row) => {
                        if (!data) {
                            return '<span class="text-center"> --- </span>';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'isActive',
                    title: this.translate.instant('PROVIDERS.STATUS'),
                    render: (data, type, row) => {

                        if (data) {
                            return (
                                '<div class="text-center">' +
                                '<button class="btn btn-default isActive warning text-center button-green' +
                                '" >' +
                                this.translate.instant('GENERAL.ACTIVATE') +
                                '</button> ' +
                                '</div>'
                            );
                        } else {
                            return (
                                '<div class="text-center">' +
                                '<button class="btn btn-default isActive warning text-center button-gray' +
                                '">' +
                                this.translate.instant('GENERAL.INACTIVE') +
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
                    //title: this.translate.instant('PROVIDERS.EDIT'),
                    render: (data, type, row) => {
                        let botones = '';

                        botones += `
                            <div class="text-center editar">
                                <img class="icons-datatable point" src="assets/images/edit.svg">
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
        $('#search').on('keyup', function () {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });
        $('.dataTables_filter').removeAttr('class');

        let filters = this.filter;

        let options_types = '';

        this.providerType.forEach((type) => {

            if (type.id == this.filter.values.providerTypeId) {

                options_types += '<option value="' + type.id + '" selected="true">' + type.name + '</option>'
            } else {

                options_types += '<option value="' + type.id + '">' + type.name + '</option>'
            }
        });

        let options_assigned = '';

        this.assigned.forEach((assign) => {

            if (assign.id == this.filter.values.providerAssigmentTypeId) {

                options_assigned += '<option value="' + assign.id + '" selected="true">' + assign.name + '</option>'
            } else {

                options_assigned += '<option value="' + assign.id + '">' + assign.name + '</option>'
            }
        });

        let opctions_isActive = ''

        this.dataIsActive.forEach((active: any) => {

            if ((this.filter.values.isActive == '0' || this.filter.values.isActive == '1') && active.id == this.filter.values.isActive) {

                opctions_isActive += '<option value="' + active.id + '" selected="true">' + active.name + '</option>'
            } else {

                opctions_isActive += '<option value="' + active.id + '">' + active.name + '</option>'
            }
        });
        $('.filterProviderDom').html(`
            <div class="form-row mb-2 mt-2">
                <div class="col-12 col-xl-4 col-sm-4 mb-1">
                    <select id="providerTypeId"
                        class="form-select form-control form-control-select-datatable providerTypeId point">
                        <option value="">${this.translate.instant('PROVIDERS.TYPE')}</option>
                        `+ options_types + `
                    </select>
                </div>

                <div class="col-12 col-xl-4 col-sm-4 mb-1">
                    <select id="providerAssigmentTypeId"
                        class="form-select form-control form-control-select-datatable providerAssigmentTypeId point">
                        <option value="">${this.translate.instant('PROVIDERS.ASSIGNED_TO')}</option>
                        `+ options_assigned + `
                    </select>
                </div>

                <div class="col-12 col-xl-4 col-sm-4 mb-1">
                    <select id="isActive"
                        class="form-select form-control form-control-select-datatable isActive point"
                    >
                        <option value="">${this.translate.instant('PROVIDERS.STATUS')}</option>
                        `+ opctions_isActive + `
                    </select>
                </div>
            </div>
        `);

        $('.providerTypeId').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        $('.providerAssigmentTypeId').on('change', function (event: any) {

            that.ChangeFilter(event)

        });
        $('.isActive').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);

        this.isActive(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function () {
            console.log('entrando aqui');
            let data = table.row($(this).parents('tr')).data();

            that.router.navigate(['providers/', data.id]);
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function () {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeActive(data.id, !data.isActive, data);
        });
    }

    OnChangeActive(providerId: number, element: any, provider: any) {

        let data = {
            isActive: element,
            name: provider.name,
            providerTypeId: provider.providerTypeId,
            providerAssigmentTypeId: provider.providerAssigmentTypeId
        };

        const modal = this.modalService.open(ModalProviderActiveComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;

        modal.result.then(
            (result) => {
                if (result) {
                    this.editActiveCompany(providerId, data);
                } else {
                    element = !element;
                }
            },
            (reason) => {
                this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
            },
        );

    }

    editActiveCompany(providerId: number, element: any) {
        this.stateEasyrouteService.editProvider(providerId, element).subscribe(
            (data: any) => {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );
                this.table.ajax.reload();
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }


    ChangeFilter(event: any) {

        let value = event.target.value;

        let id = event.target.id;

        this.setFilter(value, id, true);
    }

    setFilter(value: any, property: string, sendData?: boolean) {

        switch (property) {
            case "providerTypeId":

                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        providerTypeId: value
                    }
                }

                this.stateFilters.add(this.filter);

                break;

            case "providerAssigmentTypeId":

                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        providerAssigmentTypeId: value
                    }
                }

                this.stateFilters.add(this.filter);

                break;

            case "isActive":

            this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        isActive: value
                    }
                }

                this.stateFilters.add(this.filter);

                break;

            default:
                this.clearSearch()

                break;
        }

        console.log(this.filter.values.isActive, value, property)

        if (sendData) {
            this.cargar();

            this.detectChange.detectChanges();
        }
    }

    clearSearch() {

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                providerTypeId: '',
                providerAssigmentTypeId: '',
                isActive: ''
            }
        }

        this.stateFilters.add(this.filter);

        console.log('clearSearch', this.filter.values.isActive)

    }

    dowloadProvider(){
        const modal = this.modalService.open(ModalGeneralDownloadComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass:'modal-donwload-User',
            size:'md'
          });

          modal.componentInstance.title = this.translate.instant('PROVIDERS.DOWNLOAD_PROVIDER');
          modal.componentInstance.message = this.translate.instant('PROVIDERS.DOWNLOAD_PROVIDER_MESSAGE');

          modal.result.then(
            (data) => {


              if (data) {
                switch (data) {
                    case 'pdf':

                        this.openPdf();

                        break;

                    case 'excel':

                        this.openCsv();
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

    openPdf() {

        let url =

            'provider/print?providerTypeId=' +
            this.filter.values.providerTypeId +
            '&providerAssigmentTypeId=' +
            this.filter.values.providerAssigmentTypeId +
            '&isActive=' +
            this.filter.values.isActive;

        const modal = this.modalService.open(ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass: 'modal-view-pdf',

            size: 'md'

        });

        modal.componentInstance.title = this.translate.instant('PROVIDERS.NAME');

        modal.componentInstance.url = url;

    }

    openCsv() {

        let url = 'provider/download_excel?isActive=' + this.filter.values.isActive+

        (this.filter.values.providerTypeId != '' ? '&providerTypeId=' +
        this.filter.values.providerTypeId : '') +

        (this.filter.values.providerAssigmentTypeId != '' ? '&providerAssigmentTypeId=' +
        this.filter.values.providerAssigmentTypeId : '');

        return this.backend.getExcel(url).then((data: string)=>{ })

    }

}
