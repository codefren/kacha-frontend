import { Component, OnInit } from '@angular/core';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { ToastService } from '@optimroute/shared';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'easyroute-modal-integration',
    templateUrl: './modal-integration.component.html',
    styleUrls: ['./modal-integration.component.scss'],
})
export class ModalIntegrationComponent implements OnInit {
    jsongenerator: any = [];

    table: any;
    planningOrder: number = 0
    dateFilter: string | any = '';

    constructor(
        public activeModal: NgbActiveModal,
        private stateRoutePlanningService: StateRoutePlanningService,
        private toast: ToastService,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
    ) {}

    changeDate($event: any){
        this.loadSessionList();
    }
    ngOnInit() {
        this.loadSessionList();
    }

    clearDate(){
        this.dateFilter = '';
        this.loadSessionList();
    }

    loadSessionList() {
        let url = environment.apiUrl + 'integration/session' + '?date=' + this.dateFilter ;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = "#details";

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            lengthMenu: [10, 50, 100],
            dom: `
                <'row'
                    <'col-sm-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-6 col-12 label-search'fr>
                >
                <"top-button-hide"><'point table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function (dt, idx, title) {
                        return idx + 1 + ': ' + title;
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
                },
            },
            order: [0, 'desc'],
            columns: [
                { data: '_id', visible: false },
                {
                    data: 'name',
                    title: this._translate.instant('ROUTE_PLANNING.MODAL_INTEGRATION.NAME'),
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
                    data: 'dateSession',
                    searchable: true,
                    title: this._translate.instant('ROUTE_PLANNING.MODAL_INTEGRATION.DATE'),
                    render: (data, type, row) => {
                        return data
                            ? '<span>' + moment(data).format('DD/MM/YYYY') + '</span>'
                            : '<span>Libre</span>';
                    },
                },
                {
                    data: 'integration_session_type.name',
                },
                {
                    data: 'created_at',
                    searchable: true,
                    title: this._translate.instant('GENERAL.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY HH:mm:ss');
                    },
                },
                {
                    data: '_id',
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('ROUTE_PLANNING.MODAL_INTEGRATION.SELECTION'),
                    render: (data, type, row) => {
                        return (`
                            <div class="row justify-content-center" style="background-color: transparent;">
                                <div class="round">
                                    <input type="radio" class="isActive" id="row_${ row._id }" [value]="${ this.planningOrder }" name="planningOrder"/>
                                    <label for="row_${ row._id }"></label>
                                </div>
                            </div>
                        `);
                    },
                },
            ],
        });

        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group input-search" style="width: initial !important;">
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
        } );

        $('.dataTables_filter').removeAttr("class");

        this.editar('#details tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.round', function() {
            let data = table.row($(this).parents('tr')).data();
            that.planningOrder = data._id;
        });
    }

    generatorJson() {
        this.stateRoutePlanningService.postIntegrationGeneratorjson(this.planningOrder).subscribe(
            (data) => {
                this.jsongenerator = data;
                this.closeDialog([true, this.jsongenerator]);
            },
            (error) => {
                this.toast.displayHTTPErrorToast(error.status, error.error);
            },
        );
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }
}
