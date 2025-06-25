import { Component, OnInit } from '@angular/core';
import { identity, Subject } from 'rxjs';
import { CategoryInterface } from '../../../../../backend/src/lib/types/category.type';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { environment } from '../../../../../../apps/easyroute/src/environments/environment';
import { take, takeUntil } from 'rxjs/operators';
import { ModalCategoryActivateComponent } from '../../../../../shared/src/lib/components/modal-category-activate/modal-category-activate.component';
import { getDateMomentHours, dateToObject, objectToString } from '../../../../../shared/src/lib/util-functions/date-format';
import { StateCompaniesFacade } from '../../../../../state-companies/src/lib/+state/state-companies.facade';
import { StateCompaniesService } from '../../../../../state-companies/src/lib/state-companies.service';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { ActiveDialogComponent } from './active-dialog/active-dialog.component';
import { ModalFiltersCompaniesComponent } from './modal-filters-companies/modal-filters-companies.component';

declare var $: any;
declare function init_plugins();
@Component({
    selector: 'easyroute-super-admin-companies-list',
    templateUrl: './super-admin-companies-list.component.html',
    styleUrls: ['./super-admin-companies-list.component.scss']
})
export class SuperAdminCompaniesListComponent implements OnInit {
    unsubscribe$ = new Subject<void>();
    table: any;
    filterTable: any;
    me: boolean;
    category: CategoryInterface;
    change: string = 'company';
    profile: Profile;
    timeInterval: any;
    AdminSubscriptionResume: any;
    showCode: boolean = true;
    showSuscription: boolean = false;
    
    filter: any = {
        showActive: '',
        showSubscribeds: '',
        showInDemo: '',
        option: 'showAll',
        companyPartnerId:''
    };
    
    constructor(
        private authLocal: AuthLocalService,
        private _modalService: NgbModal,
        private _toastService: ToastService,
        private stateEasyrouteService: StateEasyrouteService,
        private _translate: TranslateService,
        private _router: Router,
        private loading: LoadingService,
        private companiesFacade: StateCompaniesFacade,
        private companiesService: StateCompaniesService,
        public facadeProfile: ProfileSettingsFacade,) { }

    ngOnInit() {
        this.filter.showActive = undefined;
        this.filter.showSubscribeds = undefined;
        this.filter.showInDemo = undefined;
        this.getResument();
        setTimeout(init_plugins, 1000);
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        this.profile = data;
                    });
            }
        });
        this.cargar();

    }

    cargar() {

        if (this.table) {
            this.table.clear();
        }

        let susbscriptionsCompany = this.susbscriptionsCompany();
        let susbscriptionsCompanyActive = this.susbscriptionsCompanyActive();
        let isSalesman = this.isSalesman() && this.me == false;
        let url = this.me
            ? environment.apiUrl +
            'company_datatables?me=true'

            + (this.filter.showActive === undefined ? '' : '&showActive=' +
                this.filter.showActive)

            + (this.filter.showSubscribeds === undefined ? '' : '&showSubscribeds=' +
                this.filter.showSubscribeds)

            + (this.filter.showInDemo === undefined ? '' : '&showInDemo=' +
                this.filter.showInDemo)

            : environment.apiUrl + 'company_datatables?'

            + (this.filter.showActive === undefined ? '' : '&showActive=' +
                this.filter.showActive) +

            (this.filter.showSubscribeds === undefined ? '' : '&showSubscribeds=' +
                this.filter.showSubscribeds)

            + (this.filter.companyPartnerId === undefined ? '' : '&companyPartnerId=' +
            this.filter.companyPartnerId)

            + 
            (this.filter.showInDemo === undefined ? '' : '&showInDemo=' +
                this.filter.showInDemo);


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#company';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            responsive: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [[ 0, "desc" ]],
            lengthMenu: [10, 100],
            dom: `
            <'row'
                <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-start select-personalize-datatable'l>
                <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                <'col-sm-3 col-md-2 col-xl-1 col-12'
                    <'row p-0 justify-content-sm-end justify-content-center'B>
                >
            >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><'table-responsive't>
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
                    data: 'id',
                    visible: false
                },
                {
                    data: 'name',
                    title: this._translate.instant('GENERAL.COMPANY'),
                    render: (data, type, row) => {
                        let name = data;
                        if (name.length > 30) {
                            name = name.substr(0, 29) + '...';
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
                    data:'name_partner',
                    sortable: false,
                    render: (data, type, row) => {
                        if (data === null) {
                            return '-';
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
                    data: 'nif',
                    title: this._translate.instant('USERS.NATIONALID'),
                    visible: false,
                },
                {
                    data: 'streetAddress',
                    title: this._translate.instant('GENERAL.STREET_ADDRESS'),
                    visible: false,
                },
                { data: 'province', title: this._translate.instant('GENERAL.PROVINCE') },
                {
                    data: 'zipCode',
                    title: this._translate.instant('GENERAL.POSTAL_CODE'),
                    visible: false,
                },
                {
                    data: 'billingEmail',
                    title: this._translate.instant('COMPANIES.BILLING_EMAIL'),
                },
                {
                    data: 'created_at',
                    title: this._translate.instant('COMPANIES.CREATED_AT'),
                    visible: false,
                },
                {
                    data: 'create_by_user',
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('COMPANIES.CREATED_BY'),
                    render: (data, type, row) => {
                        if (data && data != null) {
                            let name = data.name + ' ' + data.surname;
                            if (name.length > 30) {
                                name = name.substr(0, 29) + '...';
                            }
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                data.name +
                                ' ' +
                                data.surname +
                                '">' +
                                name +
                                '</span>'
                            );
                        } else {
                            return '<span></span>';
                        }
                    },
                },
                {
                    data: 'subscriptions_count',
                    title: this._translate.instant('COMPANIES.SUBSCRIBED'),

                    render: (data, type, row) => {

                        if (data > 0) {
                            this.showSuscription = true;
                            return (`
                          <div class="justify-content-center row reset">
                            <div class="success-chip">
                              <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                          </div>
                        `);
                        } else {
                            this.showSuscription = false;
                            return (`
                        <div class="justify-content-center row reset">
                          <div class="times-chip">
                            <i class="fas fa-times mt-2"></i>
                          </div>  
                        </div> 
                      `);
                        }
                    },
                },
                {
                    data: 'company_users_count',
                    title: this._translate.instant('COMPANIES.COMPANY_USERS'),
                },
                {
                    data: 'maxUser',
                    title: this._translate.instant('COMPANIES.COMPANY_AVAIBLE'),
                },
                {
                    data: 'assignedDeliveryPointCount',
                    title: this._translate.instant('COMPANIES.ASSIGNED_DELIVERY_POINT'),
                },
                {
                    data: 'deliveryNoteCount',
                    title: this._translate.instant('COMPANIES.DELIVERY_NOTE_COUNT'),
                },
                {
                    data: 'monthly_fee',
                    title: this._translate.instant('COMPANIES.MONTHLY_FEE'),
                    render: (data, type, row) => {
                        return data + ' €';
                    },
                },
                {
                    data: 'isDemo',
                    title: this._translate.instant('COMPANIES.IS_DEMO'),
                    className: 'text-center',
                    render: (data, type, row) => {
                        /*   let disabled = susbscriptionsCompany ? true : false; */
                        let activeSuscription = susbscriptionsCompanyActive ? true : false;

                        if (this.showSuscription) {
                            if (data) {
                                let option =
                                    +data === 1
                                        ? this._translate.instant('GENERAL.MODIFY')
                                        : this._translate.instant('GENERAL.ACTIVATE');
                                return +data === 1
                                    ? '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm inactive">' +
                                    option +
                                    '</button>'
                                    : '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm active">' +
                                    option +
                                    '</button>';

                            } else {

                                let option =
                                    +data === 1
                                        ? this._translate.instant('GENERAL.MODIFY')
                                        : this._translate.instant('GENERAL.ACTIVATE');
                                return +data === 1
                                    ? '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm inactive">' +
                                    option +
                                    '</button>'
                                    : '<button type="button" style="border-radius: 3px" disabled id="isDemo" class="btn btn-block button-active-user btn-sm active">' +
                                    option +
                                    '</button>';
                            }
                        } else {
                            let status =
                                +data === 1
                                    ? this._translate.instant('GENERAL.IS_ACTIVE')
                                    : this._translate.instant('GENERAL.IS_INACTIVE');
                            let option =
                                +data === 1
                                    ? this._translate.instant('GENERAL.MODIFY')
                                    : this._translate.instant('GENERAL.ACTIVATE');
                            return +data === 1
                                ? '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm inactive">' +
                                option +
                                '</button>'
                                : '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm active">' +
                                option +
                                '</button>';
                        }
                    },
                },
                {
                    data: 'isActive',
                    title: this._translate.instant('COMPANIES.IS_ACTIVE'),
                    render: (data, type, row) => {
                        let disabled = isSalesman ? 'disabled=true' : '';

                        if (disabled) {
                            if (data) {
                                return `<span class="text-center">${this._translate.instant(
                                    'GENERAL.YES',
                                )}</span>`;
                            } else {
                                return `<span class="text-center">${this._translate.instant(
                                    'GENERAL.NO',
                                )}</span>`;
                            }
                        } else {
                            if (data) {
                                return (
                                    '<div class="text-center">' +
                                    '<button class="btn btn-default isActive warning text-center green' +
                                    '" >' +
                                    this._translate.instant('GENERAL.ACTIVATE') +
                                    '</button> ' +
                                    '</div>'
                                );
                            } else {
                                return (
                                    '<div class="text-center">' +
                                    '<button class="btn btn-default isActive warning text-center gray' +
                                    '">' +
                                    this._translate.instant('GENERAL.ACTIVATE') +
                                    '</button> ' +
                                    '</div>'
                                );
                            }
                        }
                    },

                },
                {
                    data: 'last_login_at',
                    title: this._translate.instant('USERS.LAST_CONNECTION'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'N/A';
                        } else {
                            return getDateMomentHours(data);
                        }
                    },
                },
                {
                    data: 'last_login_ip',
                    visible: false,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('USERS.LAST_CONNECTION_IP'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'N/A';
                        } else {
                            return data;
                        }
                    },
                },
                {
                    data: 'company_profile_type',
                    title: this._translate.instant('COMPANIES.PLAN'),
                    render: (data, type, row) => {
                        if (data === null) {
                            return 'No disponible';
                        } else {
                            return data.name;
                        }
                    },
                },
                {
                    data: 'company_partner_count',
                    title: this._translate.instant('COMPANIES.COMPANIES'),

                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '<div class="text-center">';

                        botones += `
                        <span class="editar m-1">
                            <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                        </span>
                    `;

                        botones += '</div>';

                        return botones;

                    },
                },
            ],
        });
        $('.dataTables_filter').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
            <div class="input-group datatables-input-group-width mr-xl-2">
                <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
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

        this.initEvents('#company tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.isActive(tbody, table);
        this.isDemo(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        $(tbody).on('click', 'span.editar', function () {
            let data = table.row($(this).parents('tr')).data();

            that._router.navigate([`/super-admin/company/${data.id}`]);
            /* if (that.me) {
                that._router.navigate([`/users-management/companiesMe/${data.id}/me/true`]);
            } else {
                that._router.navigate([`/users-management/companies/${data.id}`]);
            } */
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function () {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActive(data.id, !data.isActive);
        });
    }

    isDemo(tbody: any, table: any, that = this) {
        $(tbody).on('click', '#isDemo', function () {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckDemo(data.id, data);
        });
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
    }

    OnChangeCheckDemo(companyId: number, data): void {
        const dialogRef = this._modalService.open(DemoDialogComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        dialogRef.componentInstance.data = {
            companyId: companyId,
        };
        dialogRef.componentInstance.startDemoDate = data.startDemoDate
            ? dateToObject(data.startDemoDate)
            : undefined;
        dialogRef.componentInstance.endDemoDate = data.endDemoDate
            ? dateToObject(data.endDemoDate)
            : undefined;
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.editDemoCompany([
                    companyId,
                    {
                        startDemoDate: objectToString(object.startDemoDate),
                        endDemoDate: objectToString(object.endDemoDate),
                    },
                ]);
            }
        });
    }

    OnChangeCheckActive(companyId: number, elemento: any): void {
        const dialogRef = this._modalService.open(ActiveDialogComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        (dialogRef.componentInstance.data = {
            isActive: elemento,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.editActiveCompany([
                        companyId,
                        {
                            isActive: elemento,
                        },
                    ]);
                } else {
                    elemento = !elemento;
                }
            });
    }

    editDemoCompany(obj: [number, any]) {
        this.companiesFacade.updateDemoCompany(obj[0], obj[1]);
        this.companiesFacade.allUsers$.subscribe((data) => {
            if (data) {
                this.table.ajax.reload();
            }
        });
    }

    editActiveCompany(obj: [number, any]) {
        this.companiesService.updateActiveCompany(obj[0], obj[1]).subscribe(
            () => {
                this.cargar();
            },
            (error) => {
                this.cargar();
            },
        );
    }
    changePage(name: string) {

        switch (name) {
            case 'company':
                this.change = name;
                this._router.navigate(['/super-admin/company']);
                break;

            case 'user':
                this.change = name;
                this._router.navigate(['/super-admin/user']);
                break;

            case 'novelty':
                this.change = name;
                this._router.navigate(['/super-admin/novelty']);
                break;

            case 'invoice':
                this.change = name;
                this._router.navigate(['/super-admin/invoice']);
            break;

            case 'start':
                this.change = name;
                this._router.navigate(['/super-admin/start']);
            break;

            default:
                break;
        }
    }


    getResument() {
        this.showCode = false;
        this.stateEasyrouteService.getAdminResumen().subscribe(
            (data: any) => {
                this.AdminSubscriptionResume = data;
                this.showCode = true;
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

    susbscriptionsCompany() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions.length === 0
        ) {

            return true;
        } else {
            return false;
        }
    }
    susbscriptionsCompanyActive() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions.length > 0
        ) {

            return true;
        } else {
            return false;
        }
    }

    filterOpen() {
        const modal = this._modalService.open(ModalFiltersCompaniesComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-left'
        });

        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                console.log(data, 'data');
                if (data) {

                    this.filter.showActive = data.showActive;
                    this.filter.showSubscribeds = data.showSubscribeds;

                    this.cargar();
                }
            },
            (reason) => { },
        );
    }


    isControlPartners() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17) !== undefined
            : false;
    }
}
