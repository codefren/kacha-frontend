import {
    Component,
    OnInit
} from '@angular/core';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '../../../../auth-local/src/lib/auth-local.service';
import { environment } from '@optimroute/env/environment';
import { Router } from '@angular/router';
import { ModalGeneratorRouteComponent } from './modal-generator-route/modal-generator-route.component';
import * as moment from 'moment';
import { ToastService, dateNbToDDMMYYY, LoadingService } from '@optimroute/shared';
import { StateEasyrouteService } from '../../../../state-easyroute/src/lib/state-easyroute.service';
import { ModalIntegrationFavoritesComponent } from './modal-integration-favorites/modal-integration-favorites.component';
import { take } from 'rxjs/operators';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
declare var $: any;

@Component({
    selector: 'easyroute-integration',
    templateUrl: './integration.component.html',
    styleUrls: ['./integration.component.scss'],
})
export class IntegrationComponent implements OnInit {
    table: any;
    me: boolean;
    filterType: number = 0;
    companyClient: any = [];

    clientName: any;

    agentUser: any = [];

    filter: {
        integrationSessionTypeId: string;
        dateFrom: string;
        dateTo: string;
        date: string;
        favorites: 'true' | 'false' | '';
    } = {
            integrationSessionTypeId: '',
            dateFrom: '',
            dateTo: '',
            date: '',
            favorites: '',
        };

    constructor(
        private dialog: NgbModal,
        private translate: TranslateService,
        private authLocal: AuthLocalService,
        private stateEasyrouteService: StateEasyrouteService,
        private toastService: ToastService,
        private Router: Router,
        private _loading: LoadingService,
    ) { }

    ngOnInit() {
        this.cargar();
        this.editar('#integration tbody', this.table);
        this.changeFavorite('#integration tbody', this.table);
    }

    add() {
        const dialogRef = this.dialog.open(ModalGeneratorRouteComponent, {
            size: 'lg',
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });
        /* dialogRef.result.then((option) => {
        if (option && option === 1) {
          this.Router.navigateByUrl('integration/new');
        } else if(option && option === 2) {
          this.table.ajax.reload();
        }
    }); */
    }

    openModalFavorite(favorite: boolean, id: number) {


        console.log(favorite, id);

        const dialogRef = this.dialog.open(ModalIntegrationFavoritesComponent, {
            // size: 'lg',
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        if(!favorite){
            dialogRef.componentInstance.message = this.translate.instant('INTEGRATION.MESSAGE_1');
        } else {
            dialogRef.componentInstance.message = this.translate.instant('INTEGRATION.MESSAGE_2');
        }


        dialogRef.result.then(
            (resp: boolean) => {

                if (resp) {

                    this._loading.showLoading();

                    this.stateEasyrouteService.changeFavorite(id, { favorite: !favorite }).pipe(take(1))
                        .subscribe(
                            (resp) => {
                                console.log(resp);
                                this._loading.hideLoading();
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant('GENERAL.ACTION_SUCCESSFULLY'),
                                    this.translate.instant('GENERAL.ACCEPT')
                                );
                                this.cargar();
                                // this.changeDetect.detectChanges();
                            },
                            (error) => {
                                console.log(resp);
                                this._loading.hideLoading();
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            }
                        );
                }
            },
            (reason) => { }
        );



    }

    ngOnDestroy() {
            this.table.destroy();
        }

    cargar() {
            let url =
            environment.apiUrl +
            'integration_datatables?date=' +
            this.filter.date +
            '&dateFrom=' +
            this.filter.dateFrom +
            '&dateTo=' +
            this.filter.dateTo +
            '&integrationSessionTypeId=' +
            this.filter.integrationSessionTypeId;

            if(this.filter.favorites.length > 0 ) {
            url += '&favorite=' + this.filter.favorites;
        }

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        this.table = $('#integration').DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            stateSaveParams: function (settings, data) {
                data.search.search = '';
            },
            lengthMenu: [10, 50, 100],
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><'table-responsive't>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
                >
            `,
            /* headerCallback: ( thead, data, start, end, display ) => {
                $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this.translate.instant('GENERAL.SHOW/HIDE'))
            }, */
            buttons: [
                {
                    extend: 'colvis',
                    text: this.translate.instant('GENERAL.SHOW/HIDE'),
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
            order: [0, 'desc'],
            columns: [
                {
                    data: 'favorite',
                    searchable: false,
                    title: this.translate.instant('INTEGRATION.FAVORITE'),
                    orderable: false,
                    render: (data, type, row) => {

                        if (data) {
                            return (`<i class="eye-icon fas fa-star favorite point"></i>`)
                        }

                        return (`<i class="eye-icon far fa-star favorite point"></i>`);
                    }
                },
                {
                    data: '_id',
                    title: 'ID',
                },
                {
                    data: 'name',
                    title: this.translate.instant('INTEGRATION.NAME'),
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
                    data: 'description',
                    title: this.translate.instant('INTEGRATION.DESCRIPTION'),
                    render: (data, type, row) => {
                        let description = data;

                        if (description === null || !description || description === '') {
                            description = 'No disponible';
                        } else {
                            if (description.length > 50) {
                                description = description.substr(0, 49) + '...';
                            }
                        }

                        return `
                  <span
                    data-toggle="tooltip"
                    data-placement="top"
                    title="${data === null || !data || data === '' ? description : data}">
                    ${description}
                  </span>
                `;
                    },
                },
                {
                    data: 'dateSession',
                    title: this.translate.instant('INTEGRATION.DATE_SESSION'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },

                {
                    data: 'created_by',
                    title: this.translate.instant('INTEGRATION.CREATED_BY'),
                    render: (data, type, row) => {
                        console.log(data);
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
                    data: 'integration_session_type.name',
                    title: this.translate.instant('INTEGRATION.PLANNING_TYPE'),
                },
                {
                    data: 'created_at',
                    title: this.translate.instant('GENERAL.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY HH:mm:ss');
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this.translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => `
                      <div class="editar">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                      </div>
                    `,
                },
            ],
        });
        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group">
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
            $('#integration')
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');

        /*  $('.dataTables_filter').html(`
            <div class="d-flex justify-content-md-end justify-content-center mr-xl-2">
                <div class="input-group datatables-input-group-width">
                    <input
                        id="search"
                        type="text"
                        class="form-control
                        pull-right input-personalize-datatable"
                        placeholder="Buscar"
                        style="max-width: initial;"
                    >
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
        `);

        $('#search').on('keyup', function() {
            $('#integration').DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr('class'); */

        this.editar('#integration tbody', this.table);
        this.changeFavorite('#integration tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        $(tbody).on('click', '.editar', function () {
            let data = table.row($(this).parents('tr')).data();
            console.log(data);
            that.Router.navigate(['integration', data._id]);
        });
    }

    changeFavorite(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.favorite', function () {
            let data = table.row($(this).parents('tr')).data();
            that.openModalFavorite(data.favorite, data._id);
        });
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
                    this.filter = data;

                    this.cargar();
                }
            },
            (reason) => { },
        );
    }
}
