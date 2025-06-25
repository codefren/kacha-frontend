import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Company } from '@optimroute/backend';
import { Observable, Subject } from 'rxjs';
import { MatCheckbox } from '@angular/material';
import * as _ from 'lodash';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { ActiveDialogComponent } from './active-dialog/active-dialog.component';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateCompaniesFacade, StateCompaniesService } from '@optimroute/state-companies';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    objectToString,
    getDateMomentHours,
    dateToObject,
    ToastService,
} from '@optimroute/shared';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    selector: 'optimroute-companies-table',
    templateUrl: './companies-table.component.html',
    styleUrls: ['./companies-table.component.scss'],
})
export class CompaniesTableComponent implements OnInit {
    @Input() companies: Company[];
    @Input() me: boolean;

    table: any;
    filteredCountries: Observable<string[]>;
    unsubscribe$ = new Subject<void>();
    adding: boolean;
    totalUsuariosSuscritos: number = 0;
    totalCuotaMensual: number = 0;
    showActive: boolean = true;
    showSubscribeds: boolean = true;
    timeInterval: any;
    showSuscription : boolean = false;

    @ViewChild('checkIsDemo', { read: true, static: false }) checkIsDemo: MatCheckbox;

    @ViewChild('checkIsActive', { read: true, static: false }) checkIsActive: MatCheckbox;

    constructor(
        private dialog: NgbModal,
        public authLocal: AuthLocalService,
        private companiesFacade: StateCompaniesFacade,
        private _translate: TranslateService,
        private router: Router,
        private translate: TranslateService,
        private companiesService: StateCompaniesService,
        private toastService: ToastService,
    ) {}

    ngOnInit() {
        this.companiesFacade.loaded$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.cargar();
                    this.editar('#company tbody', this.table);
                    this.isActive('#company tbody', this.table);
                    this.isDemo('#company tbody', this.table);
                }
            });

        this.companiesService.getCompanySubscriptionTotalized().subscribe(
            (resp: any) => {
                this.totalUsuariosSuscritos = resp.data.totalCompanyUsers;
                this.totalCuotaMensual = resp.data.totalMonthlyFee;
            },
            (error: any) => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    OnChangeCheckDemo(companyId: number, data): void {
        const dialogRef = this.dialog.open(DemoDialogComponent, {
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
        const dialogRef = this.dialog.open(ActiveDialogComponent, {
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

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 3 || role === 8) !==
                  undefined
            : false;
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

    cargar() {

        if ( this.table ) {
            this.table.clear();
        }

        let isSalesman = this.isSalesman() && this.me == false;
        let url = this.me
            ? environment.apiUrl +
              'company_datatables?me=true&showActive=' +
              this.showActive +'&showSubscribeds=' +this.showSubscribeds
            : environment.apiUrl + 'company_datatables?showActive=' + this.showActive +'&showSubscribeds=' +this.showSubscribeds;
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
            lengthMenu: [50, 100],
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
            headerCallback: ( thead, data, start, end, display ) => {               
                $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
            },
          
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
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
                   /*  render: (data, type, row) => {
                        if (data > 0 ) {
                            return '<i class="fas fa-check text-success" title="Activo" aria-hidden="true"></i>';
                        } else {
                            return '<i class="fas fa-times text-danger" aria-hidden="true"></i>';
                        }
                    }, */

                    render: (data, type, row) => {
                        this.showSuscription = true;
                        if (data > 0) {
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
                        let disabled = isSalesman ? 'disabled=true' : '';
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
                       /*  if (disabled) {
                            if (data) {
                                return (
                                    '<span>' +
                                    this._translate.instant('GENERAL.YES') +
                                    '</span>'
                                );
                            } else {
                                return (
                                    '<span>' +
                                    this._translate.instant('GENERAL.NO') +
                                    '</span>'
                                );
                            }
                        } else {
                            let status =
                                +data === 1
                                    ? this.translate.instant('GENERAL.IS_ACTIVE')
                                    : this.translate.instant('GENERAL.IS_INACTIVE');
                            let option =
                                +data === 1
                                    ? this.translate.instant('GENERAL.MODIFY')
                                    : this.translate.instant('GENERAL.ACTIVATE');
                            return +data === 1
                                ? '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm inactive">' +
                                      option +
                                      '</button>'
                                : '<button type="button" style="border-radius: 3px" id="isDemo" class="btn btn-block button-active-user btn-sm active">' +
                                      option +
                                      '</button>';
                        } */
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
                                /* return (`
                                  <div class="row reset justify-content-center pr-3">
                                    <div class="round-new text-center">
                                      <input type="checkbox" class="isActive" id="row_${ row.id }" checked="true" ${disabled} />
                                      <label for="row_${ row.id }"></label>
                                    </div>
                                  </div>
                                `); */
                                return (
                                    '<div class="text-center">' +
                                        '<button class="btn btn-default isActive warning text-center green' +
                                            '" >' +
                                            this._translate.instant('GENERAL.DEACTIVATE') +
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
                               /*  return (`
                                  <div class="row reset justify-content-center pr-3">
                                    <div class="round-new text-center">
                                      <input type="checkbox" class="isActive" id="row_${ row.id }" ${disabled} />
                                      <label for="row_${ row.id }"></label>
                                    </div>
                                  </div>
                              `); */
                            }
                        }
                    },
                    
                },
                /* {
                    data: 'autonomous',
                    title: this._translate.instant('COMPANIES.AUTONOMOUS'),
                    render: (data, type, row) => {
                        if (data == 1 || data == true) {
                            return (`
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `);
                        } else {
                            return (`
                            <div class="justify-content-center row reset">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `);
                        }
                    },
                }, */
                /* {
                    data: 'promotionCovid',
                    title: this._translate.instant('GENERAL.PROMOTION_COVID'),
                    render: (data, type, row) => {
                        if (data == 1 || data == true) {
                            return (`
                              <div class="justify-content-center row reset">
                                <div class="success-chip">
                                  <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                              </div>
                            `);
                        } else {
                            return (`
                            <div class="justify-content-center row reset">
                              <div class="times-chip">
                                <i class="fas fa-times mt-2"></i>
                              </div>  
                            </div> 
                          `);
                        }
                    },
                }, */
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

        $('#search').on( 'keyup', function () {
            $(table).DataTable().search( this.value ).draw();
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
        $(tbody).on('click', 'span.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            console.log(that.me);

            if (that.me) {
                that.router.navigate([`/users-management/companiesMe/${data.id}/me/true`]);
            } else {
                that.router.navigate([`/users-management/companies/${data.id}`]);
            }
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActive(data.id, !data.isActive);
        });
    }

    isDemo(tbody: any, table: any, that = this) {
        $(tbody).on('click', '#isDemo', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckDemo(data.id, data);
        });
    }

    onChangeShowActive() {
        this.showActive = !this.showActive;
        this.cargar();
    }
    onChangeShowSubscribeds(){
        this.showSubscribeds= !this.showSubscribeds;
        this.cargar();
    }
}
