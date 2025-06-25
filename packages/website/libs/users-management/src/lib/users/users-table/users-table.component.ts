import { ModalViewPdfGeneralComponent } from './../../../../../shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { Component, OnInit, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Profile, BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { UserCreationDialogComponent } from './user-creation-dialog/user-creation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getDateMomentHours, ToastService, LoadingService } from '@optimroute/shared';
import { Router } from '@angular/router';
import { UsersConfirmDialogComponent } from './users-confirm-dialog/users-confirm-dialog.component';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { take, takeUntil } from 'rxjs/operators';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateCompaniesService } from '@optimroute/state-companies';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { ModalMaxUsersComponent } from './modal-max-users/modal-max-users.component';
import { UsersService } from '../users.service';
import { ContentObserver } from '@angular/cdk/observers';
import { ModalBadImportComponent } from './modal-bad-import/modal-bad-import.component';
import { ModalDownloadUsersComponent } from './modal-download-users/modal-download-users.component';
import { ModalApplySalaryCostComponent } from 'libs/shared/src/lib/components/modal-apply-salary-cost/modal-apply-salary-cost.component';

declare var $: any;

@Component({
    selector: 'optimroute-users-table',
    templateUrl: './users-table.component.html',
    styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {

    @Input() me: boolean;

    countries: string[] = [];
    filteredCountries: Observable<string[]>;
    @Output() addUser = new EventEmitter<User>();

    @Output() editUser = new EventEmitter<[number, Partial<User>]>();

    @Output() deleteUser = new EventEmitter<string>();

    table: any;
    profile: Profile;
    unsubscribe$ = new Subject<void>();

    loadingFilter: string = 'success';
    profiles: any;

    filter: any = {
        me: false,
        showActive: 'true',
        profileId: '',
        userTypeId: ''
    };

    dataIsActive: any = [
        {
            id: 1,
            name: this._translate.instant('GENERAL.IS_ACTIVE'),
            value: 'true'
        },
        {
            id: 2,
            name: this._translate.instant('GENERAL.IS_INACTIVE'),
            value: 'false'
        }
    ]

    rolType: any[];
    userType: any[];

    timeInterval: any;

    totalized: any;

    showCode: boolean = true;

    isPartnerType: boolean = false;

    constructor(
        private dialog: NgbModal,
        private translate: TranslateService,
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private router: Router,
        private userService: StateUsersService,
        private toast: ToastService,
        private loading: LoadingService,
        private profileSettingFacade: ProfileSettingsFacade,
        private companyService: StateCompaniesService,
        private changeDetectorRef: ChangeDetectorRef,
        private backend: BackendService,
        private userService2: UsersService
    ) { }

    ngOnInit() {
        this.profileSettingFacade.profile$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((profile) => {
                this.profile = profile;
            });

        this. getUserProfile();

        this.isPartnersCompany();

    }

    addUserLink(me: boolean) {
        if (me) {
            this.backend.get('can_add_users_subscription').pipe(take(1)).subscribe(data => {
                if (data && data.canAddUser) {
                    this.router.navigate(['management/users/new/me/true']);
                } else {
                    const modal = this.dialog.open(ModalMaxUsersComponent, {
                        size: 'xs',
                        backdrop: true,
                        windowClass: 'modal-users-max'
                    });
                    modal.result.then(data => {
                        if (data) {
                            this.router.navigate(['profile/invoicing'])
                        }
                    })
                }
            })

        } else {
            this.router.navigate(['users-management/users/new']);

        }
    }

    getUserProfile() {
        this.loadingFilter = 'loading';

        this.userService2.loadProfiles().subscribe(
        ( resp ) => {
            this.loadingFilter = 'success';
            this.rolType = resp.data;

            this.getUserType();
        },
        (error) => {
            this.loadingFilter = 'error';

            this.toast.displayHTTPErrorToast(
            error.status,
            error.error.error,
            );
        },
        );

    }

    getUserType() {
        this.loadingFilter = 'loading';

        this.userService2.getUser().subscribe(
            ( resp ) => {
                this.loadingFilter = 'success';
                this.userType = resp.data;

                this.cargar();
                this.editar('#users tbody', this.table);
                this.inactive('#users tbody', this.table);
                this.active('#users tbody', this.table);
                this.details('#users tbody', this.table);

                this.loadTotalized();

            },
            (error) => {
                this.loadingFilter = 'error';

                this.toast.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );

    }

    loadTotalized() {
        this.showCode = false;

        if (this.me) {
            this.filter.me = true;
        }

        this.backend
            .post('user_totalized', this.filter)
            .pipe(
                take(1)).subscribe(
                    (resp: any) => {
                        this.totalized = null;
                        this.totalized = resp;
                        this.showCode = true;
                        this.changeDetectorRef.detectChanges();
                    },
                    (error) => {
                        this.showCode = true;

                        this.toast.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
    }

    dowloadClient() {

       let url = this.me

        ?  'download_user_template_in_excel?me=true&showActive=' +

        this.filter.showActive +

        '&profileId=' +

        this.filter.profileId +

        '&userTypeId=' +

        this.filter.userTypeId

        : 'download_user_template_in_excel?showActive=' +

        this.filter.showActive +

        '&profileId=' +

        this.filter.profileId +

        '&userTypeId=' +

        this.filter.userTypeId;


        return this.backend.getExcelUser(url).then((data: string)=>{


          })
    }

    importClient(file: any) {

        let mee : any = this.me;
        let excel: FormData = new FormData();

        excel.append('import_file', file, file.name);

        excel.append('me', mee);

        this.loading.showLoading();

        this.userService.addLoadUserTemplateInExcel(excel).subscribe(
            (resp: any) => {

                this.loading.hideLoading();

                this.table.ajax.reload();

                this.toast.displayWebsiteRelatedToast(
                    'Archivo procesado satisfactoriamente.',
                    this._translate.instant('GENERAL.ACCEPT'),
                );

                $("input[type='file']").val('');


            },
            (error: any) => {
                $("input[type='file']").val('');
                this.loading.hideLoading();
                this.toast.displayHTTPErrorToast(error.error.code, error.error);
            },
        );

    }

    openSetting() {

        //this.router.navigate(['management/users-settings']);
        this.router.navigateByUrl('/preferences?option=drivingLicenses');
    }

    ngOnDestroy() {
        this.table.destroy();
        window.clearInterval(this.timeInterval);
    }

    newAddition(): void {
        this.router.navigate(['/users-management/users/new']);
    }

    inactiveUser(user: User, i?: number, profiles: any = []) {
        let profileAccept =
            profiles &&
                profiles.length > 1 &&
                profiles.find((x) => +x.profileId === 6) === undefined
                ? true
                : profiles.length > 1 && profiles.find((x) => +x.profileId === 6)
                    ? true
                    : profiles.length === 1 && profiles.find((x) => +x.profileId !== 6)
                        ? true
                        : false;

        let title = 'USERS.DEACTIVATE_USER_QUESTION';
        let info = 'USERS.DEACTIVATE_USER_INFO';
        let buttonAccept = 'GENERAL.DEACTIVATE';

        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0 &&
            profileAccept
        ) {
            this.loading.showLoading();
            this.companyService
                .costPlan()
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        this.loading.hideLoading();
                        const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static',
                        });
                        dialogRef.componentInstance.title = title;
                        dialogRef.componentInstance.user = user;
                        dialogRef.componentInstance.info = info;
                        dialogRef.componentInstance.buttonAccept = buttonAccept;
                        dialogRef.result
                            .then((resp) => {
                                if (resp) {
                                    this.loading.showLoading();
                                    this.userService
                                        .deactivate(user.id)
                                        .pipe(take(1))
                                        .subscribe(
                                            () => {
                                                this.loading.hideLoading();
                                                this.table.ajax.reload();
                                                this.loadTotalized();
                                            },
                                            (error) => {
                                                this.loading.hideLoading();
                                                this.toast.displayHTTPErrorToast(
                                                    error.status,
                                                    error.error.error,
                                                );
                                            },
                                        );
                                }
                            })
                            .catch((error) => console.log(error));
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        } else {
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loading.showLoading();
                        this.userService
                            .deactivate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loading.hideLoading();
                                    this.table.ajax.reload();
                                    this.loadTotalized();
                                },
                                (error) => {
                                    this.loading.hideLoading();
                                    this.toast.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    activeUser(user: User, i?: number, profiles: any = []) {
        let profileAccept =
            profiles &&
                profiles.length > 1 &&
                profiles.find((x) => +x.profileId === 6) === undefined
                ? true
                : profiles.length > 1 && profiles.find((x) => +x.profileId === 6)
                    ? true
                    : profiles.length === 1 && profiles.find((x) => +x.profileId !== 6)
                        ? true
                        : false;

        let title = 'USERS.ACTIVATE_USER_QUESTION';
        let info = 'USERS.ACTIVATE_USER_INFO';
        let buttonAccept = 'GENERAL.ACTIVATE';

        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0 &&
            profileAccept
        ) {
            this.loading.showLoading();
            this.companyService
                .costPlan()
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        this.loading.hideLoading();
                        const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static',
                        });
                        dialogRef.componentInstance.title = title;
                        dialogRef.componentInstance.user = user;
                        dialogRef.componentInstance.info = info;
                        dialogRef.componentInstance.buttonAccept = buttonAccept;
                        dialogRef.result
                            .then((resp) => {
                                if (resp) {
                                    this.loading.showLoading();
                                    this.userService
                                        .activate(user.id)
                                        .pipe(take(1))
                                        .subscribe(
                                            () => {
                                                this.loading.hideLoading();
                                                this.table.ajax.reload();
                                                this.loadTotalized();
                                            },
                                            (error) => {
                                                this.loading.hideLoading();
                                                this.toast.displayHTTPErrorToast(
                                                    error.status,
                                                    error.error.error,
                                                );
                                            },
                                        );
                                }
                            })
                            .catch((error) => console.log(error));
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        } else {
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loading.showLoading();
                        this.userService
                            .activate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loading.hideLoading();
                                    this.table.ajax.reload();
                                    this.loadTotalized();
                                },
                                (error) => {
                                    this.loading.hideLoading();
                                    this.toast.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    returnProfileString(profiles: any): string {
        let profile = [];
        profiles.forEach((element) => {
            profile.push(element.name);
        });
        return profile
            .map((element) => {
                return element;
            })
            .join(', ');
    }

    cargar() {

        let url: any = '';

        if (this.table) {
            this.table.clear();
        }

        let that = this;

        url = this.me
            ? environment.apiUrl + 'users_datatables?me=true&showActive=' +
            this.filter.showActive +
            '&profileId=' +
            this.filter.profileId +
            '&userTypeId=' +
            this.filter.userTypeId
            : environment.apiUrl + 'users_datatables?showActive=' +
            this.filter.showActive +
            '&profileId=' +
            this.filter.profileId +
            '&userTypeId=' +
            this.filter.userTypeId;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        let table = '#users';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order:[],
            lengthMenu: [50, 100],
            dom:`
                <'row'
                    <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                        <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 pr-2 buttonDom'>
                    >
                    <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                        <'row'
                            <'col-sm-6 col-md-6 col-xl-9 col-7 label-search'f>
                            <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table'B>
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

                    $('#search').prop('disabled', true);

                    setTimeout(function () {
                        $(".dataTables_processing").hide();
                    }, 10);

                    this.toast.displayHTTPErrorToast(xhr.responseJSON.code, xhr.responseJSON.error);

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
            columns: [
                {
                    data: 'idERP',
                    visible: false,
                    sortable: false,
                    searchable: false,
                    title: 'IdERP',
                    render: (data, type, row) => {

                        if (data) {
                            return (
                                '<span data-toggle="tooltip" data-placement="top"">' +
                                data +
                                '</span>'
                            );
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top"">' +
                                'No disponible' +
                                '</span>'
                            );
                        }

                    },
                },
                {
                    data: 'company.name',
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
                { data: 'nationalId', title: this._translate.instant('USERS.NATIONALID') },
                { data: 'email', title: this._translate.instant('USERS.EMAIL') },
                { data: 'name', title: this._translate.instant('USERS.NAME_USER') },
                { data: 'surname', title: this._translate.instant('USERS.SURNAME_USER') },
                { data: 'phone', title: this._translate.instant('USERS.PHONE') },
                {
                    data: 'profile',
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('USERS.ROLE'),
                    render: (data, type, row) => {
                        let datos = this.returnProfileString(data);
                        let name = datos;
                        if (name.length > 30) {
                            name = name.substr(0, 29) + '...';
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            datos +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'user_type.name',
                    title: this._translate.instant('USERS.USER_TYPE'),
                    render: (data, type, row) => {

                        if (data && data != null) {

                            let name = data;
                            if (name.length > 30) {
                                name = name.substr(0, 29) + '...';
                            }
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="'+ data +'">' +
                                name.replace( 'Empleado', 'Empresa') +
                                '</span>'
                            );
                        } else {
                            return '<span>No disponible</span>';
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
                            return moment(data)
                                .locale('es')
                                .fromNow();
                        }
                    },
                },
                {
                    data: 'isActive',
                    title: this._translate.instant('GENERAL.SUBSCRIPTION'),
                    render: (data, type, row) => {
                        let status =
                            +data === 1
                                ? '<span class="text-success">' +
                                this.translate.instant('GENERAL.IS_ACTIVE') +
                                '</span>'
                                : '<span>' +
                                this.translate.instant('GENERAL.IS_INACTIVE') +
                                '</span>';
                        if (this.me) {
                            let option =
                                +data === 1
                                    ? this.translate.instant('GENERAL.IS_ACTIVE')
                                    : this.translate.instant('GENERAL.IS_INACTIVE');
                            return +data === 1
                                ? '<button type="button" style="border-radius: 3px" class="btn btn-block green-new btn-sm inactive">' +
                                option +
                                '</button>'
                                : '<button type="button" style="border-radius: 3px"  class="btn btn-block gray-new btn-sm pl-4 pr-4 active">' +
                                option +
                                '</button>';
                        } else {
                            return '<span>' + status + '</span>';
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

        $('#search').on('keyup', function () {
            $(table).DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr("class");

        let options_rol = '';

            this.rolType.forEach((type) => {
                if (type.id == that.filter.profileId) {

                    options_rol += '<option value="' + type.id + '" selected="true">' + type.name + '</option>'
                } else {

                    options_rol += '<option value="' + type.id + '">' + type.name + '</option>'
                }
            });

            let options_user_type = '';

            this.userType.forEach((userType) => {

                if (userType.id == that.filter.userTypeId) {

                    options_user_type += '<option value="' + userType.id + '" selected="true">' + userType.name.replace( 'Empleado', 'Empresa') + '</option>'
                } else {

                    options_user_type += '<option value="' + userType.id + '">' + userType.name.replace( 'Empleado', 'Empresa') + '</option>'
                }
            });

            let opctions_isActive = ''

            this.dataIsActive.forEach((active: any) => {

                if ((this.filter.showActive || !this.filter.showActive ) === active.value) {

                    opctions_isActive += '<option value="' + active.value + '" selected="true">' + active.name + '</option>'
                } else {

                    opctions_isActive += '<option value="' + active.value + '">' + active.name + '</option>'
                }
            });

  /*           let opctions_isActive = ''

    this.dataIsActive.forEach((active: any) => {


        if ((this.filterTable.values.isActive || !this.filterTable.values.isActive) === active.value) {


            opctions_isActive += '<option value="' + active.value + '" selected="true">' + active.name + '</option>'

        } else {

            opctions_isActive += '<option value="' + active.value + '">' + active.name + '</option>'
        }
    }); */



        $('.buttonDom').html(`
            <div class="form-row mb-2 mt-2">
                <div class="col-12 col-xl-4 col-sm-4 mb-1" id="div-1">
                    <select id="profileId"
                        class="form-select form-control form-control-select-datatable profileId point">
                        <option value="">${that.translate.instant('USERS.ROLL')}</option>
                        `+ options_rol + `
                    </select>
                </div>

                <div class="col-12 col-xl-4 col-sm-4 mb-1">
                    <select id="showActive"
                        class="form-select form-control form-control-select-datatable showActive point"
                    >
                        <option value="">${this.translate.instant('USERS.SUBSCRIPTION')}</option>
                        `+ opctions_isActive + `
                    </select>
                </div>

                <div class="col-12 col-xl-4 col-sm-4 mb-1" id="div-2">
                    <select id="userTypeId"
                        class="form-select form-control form-control-select-datatable userTypeId point">
                        <option value="">${that.translate.instant('USERS.TYPES_USERS')}</option>
                        `+ options_user_type + `
                    </select>
                </div>
            </div>
        `);

        if (this.isPartnerType && this.Partners() ) {

            $('#div-1').remove();
            $('#div-2').remove();

        }

        $('.profileId').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        $('.showActive').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        $('.userTypeId').on('change', function (event: any) {

            that.ChangeFilter(event)

        });

        this.initEvents('#users tbody', this.table);

    }

    ChangeFilter(event: any) {

        let value = event.target.value; // el valor
        let id = event.target.id; // nombre de la etiqueta

        switch ( id ) {
          case "showActive":
            this.filter.showActive = value;
            this.cargar();
            this.loadTotalized();
            this.changeDetectorRef.detectChanges();

            break;

          case "profileId":
            this.filter.profileId = value;
            this.cargar();
            this.loadTotalized();
            this.changeDetectorRef.detectChanges();

            break;

        case "userTypeId":
            this.filter.userTypeId = value;
            this.cargar();
            this.loadTotalized();
            this.changeDetectorRef.detectChanges();

            break;

          default:
            break;
        }

    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.details(tbody, table);
        this.inactive(tbody, table);
        this.active(tbody, table);

    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        $(tbody).on('click', 'div.editar', function () {
            let data = table.row($(this).parents('tr')).data();
            that.editElement(data.id, data.id, data);
        });
    }

    editElement(id: number, i: number, editUser: any): void {
        if (this.me) {
            this.router.navigate([`/management/users/${id}/me/true`]);
        } else {
            this.router.navigate([`/users-management/users/${id}`]);
        }
    }

    details(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.details', function () {
            let data = table.row($(this).parents('tr')).data();
            that.detailElement(data.id, data.id, data);
        });
    }

    inactive(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.inactive', function () {
            let data = table.row($(this).parents('tr')).data();

            that.inactiveUser(data, null, data.profile);
        });
    }

    active(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'button.active', function () {
            let data = table.row($(this).parents('tr')).data();

            that.activeUser(data, 0, data.profile);
        });
    }

    detailElement(id: number, i: number, editUser: any): void {
        if (this.me) {
            this.router.navigate([`/management/users/detail/${id}/me/true`]);
        } else {
            this.router.navigate([`/users-management/users/detail/${id}`]);
        }
    }

    isValidateRol() {

        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 2 || role === 10  || role === 9 || role === 7 || role === 1 || role === 16 || role === 17) !== undefined
            : false;
    }

    validateSAC() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 14) !== undefined
            : false;
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

    openModalApplySalaryCost() {

        const modal = this.dialog.open(ModalApplySalaryCostComponent, {
          backdropClass: 'modal-backdrop-ticket',
          centered: true,
          windowClass:'modal-salary-cost',
          size:'md'
        });

        modal.result.then(
          (data) => {
            if (data) {

            }
          },
          (reason) => {

          },
        );
      }

    importSalary(file: any) {

        let mee : any = this.me;
        let excel: FormData = new FormData();

        excel.append('import_file', file, file.name);

        excel.append('me', mee);

        this.loading.showLoading();

        this.userService.loadSalaryByExcel(excel).subscribe(
            (resp: any) => {

                this.loading.hideLoading();

                this.table.ajax.reload();

                this.toast.displayWebsiteRelatedToast(
                    'Archivo procesado satisfactoriamente.',
                    this._translate.instant('GENERAL.ACCEPT'),
                );

                $("input[type='file']").val('');

            },
            (error: any) => {
                $("input[type='file']").val('');
                this.loading.hideLoading();
                this.toast.displayHTTPErrorToast(error.error.code, error.error);
            },
        );

    }

    openModalDonwloadUser(){
        const modal = this.dialog.open(ModalDownloadUsersComponent, {
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-donwload-User',
            size:'md'
          });

          modal.result.then(
            (data) => {

              if (data) {
                switch (data) {
                    case 'pdf':

                        this.print();

                        break;

                    case 'excel':

                        this.dowloadClient();
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

    print() {

        let url = this.me

        ?  'download_user_template_in_pdf?me=true&showActive=' +

        this.filter.showActive +

        '&profileId=' +

        this.filter.profileId +

        '&userTypeId=' +

        this.filter.userTypeId

        : 'download_user_template_in_pdf?showActive=' +

        this.filter.showActive +

        '&profileId=' +

        this.filter.profileId +

        '&userTypeId=' +

        this.filter.userTypeId;

        const modal = this.dialog.open( ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass:'modal-view-pdf',

            size:'lg'

          });

          modal.componentInstance.title = this._translate.instant('USERS.NAME');

          modal.componentInstance.url = url;
    }

    Partners() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17) !== undefined
            : false;
    }

    isPartnersCompany(){
        const prefereces = JSON.parse(localStorage.getItem('company'));

        this.isPartnerType = prefereces.isPartnerType;

    }

}
