import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateCompaniesService } from 'libs/state-companies/src/lib/state-companies.service';
import { ProfileSettingsFacade } from 'libs/state-profile-settings/src/lib/+state/profile-settings.facade';
import { StateUsersFacade } from 'libs/state-users/src/lib/+state/state-users.facade';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ModalFiltersStartComponent } from './modal-filters-start/modal-filters-start.component';
declare var $: any;
@Component({
  selector: 'easyroute-start-list',
  templateUrl: './start-list.component.html',
  styleUrls: ['./start-list.component.scss']
})
export class StartListComponent implements OnInit {

    change: string = 'start';

    filter: any = {
      showActive: true
    };

    @Input() me: boolean;

    timeInterval: any;
    table: any;
    profile: Profile;
    unsubscribe$ = new Subject<void>();
    showResumen: boolean = true;
    dataResumen: any;

  constructor(
    private _router: Router,
    private _modalService: NgbModal,
    private translate: TranslateService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private router: Router,
    private toast: ToastService,
    private loading: LoadingService,
    private profileSettingFacade: ProfileSettingsFacade,
    private companyService: StateCompaniesService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

    ngOnInit() {

        this.getResument();
        this.cargar();

    }

    getResument() {

        this.showResumen = false;

        this.companyService.getResumen(this.filter).pipe(take(1)).subscribe(

            (data: any) => {

                this.dataResumen = data;

                this.showResumen = true;

                this.changeDetectorRef.detectChanges();

            },
            (error) => {

                this.showResumen = false;

                this.toast.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }

    cargar() {

        let url: any = '';

        url = environment.apiUrl + 'company_start_datatables?showActive=' + this.filter.showActive;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        let table = '#start';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            lengthMenu: [50, 100],
            order: [[ 0, "desc" ]],
            dom: `

                <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
                <"top-button-hide"><t>
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

                    $('#search').prop( 'disabled', true );

                    setTimeout(function() {
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
            rowCallback: (row, data) => {

                if(data.isPartnerType){

                    $(row).addClass('startCompanyAzul')

                } else {

                    if (data.lastRouteAssigned) {

                        let lastRouteAssignedDays = moment().diff(moment(data.lastRouteAssigned), 'days') + 1;
        
                        if (lastRouteAssignedDays <= 2) {

                            $(row).addClass('startCompanyVerde');

                        } else if(lastRouteAssignedDays <= 7) {

                            $(row).addClass('startCompanyYellow');

                        }else {

                            $(row).addClass('startCompanyRojo');

                        }

                    }

                }
            },
            columns: [
               {
                    data: 'id',
                    visible: false
                },
                {
                    data: 'name',
                    title: this._translate.instant('START.COMPANY'),
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
                { data: 'province', title: this._translate.instant('START.PROVINCE') },
                { data: 'billingEmail', title: this._translate.instant('START.BILLING_MAIL') },
                { data: 'totalAlbaran', title: this._translate.instant('START.TOTAL_DELIVERY_NOTES') },
                { data: 'totalRoute', title: this._translate.instant('START.TOTAL_ROUTES') },
                { data: 'lastRouteAssigned', title: this._translate.instant('START.LAST_ROUTE_ASSIGNED'),
                render: (data, type, row) => {
                  if (data === null) {
                      return '----';
                  } else {
                      return moment(data).locale('es').format('DD/MM/YYYY');
                  }
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

    }

    changePage(name: string){

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

    filterOpen() {
        const modal = this._modalService.open(ModalFiltersStartComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-left'
        });

        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {

                if (data) {

                    this.filter.showActive = data.showActive;

                    this.getResument();
                    this.cargar();

                }
            },
            (reason) => { },
        );
    }

}
