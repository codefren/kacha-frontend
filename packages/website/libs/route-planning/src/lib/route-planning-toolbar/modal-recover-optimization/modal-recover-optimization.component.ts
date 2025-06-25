import { Component, OnInit } from '@angular/core';
import { ToastService } from '@optimroute/shared';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { environment } from '@optimroute/env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'easyroute-modal-recover-optimization',
    templateUrl: './modal-recover-optimization.component.html',
    styleUrls: ['./modal-recover-optimization.component.scss'],
})
export class ModalRecoverOptimizationComponent implements OnInit {
    table: any;
    Secion: any;

    constructor(
        private toast: ToastService,
        public activeModal: NgbActiveModal,
        private _translate: TranslateService,
        public authLocal: AuthLocalService,
        private stateRoutePlanningService: StateRoutePlanningService,
    ) {}

    ngOnInit() {
        this.loadSessionList();
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }

    loadSessionList() {
        let url = environment.apiUrl + 'route-planning/session/saved';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#details';

        this.table = $('#details').DataTable({
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            order: [0, 'desc'],
            lengthMenu: [10, 50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
              },

            dom: `
                <'row'<'col-sm-6 col-12 d-flex flex-column align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-6 col-12 label-search'fr>
                    >
                <"top-button-hide"><'point no-scroll-x table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function(dt, idx, title) {
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
            columns: [
                { data: 'id' },
                {
                    data: 'name',
                    title: this._translate.instant('RECOVER_SESSION.NAME'),
                    render: (data, type, row) => {
                        let name = data;
                        if (name && name != null && name.length > 30) {
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
                    title: this._translate.instant('RECOVER_SESSION.DESCRIPTION'),
                },
                {
                    data: 'savedDate',
                    title: this._translate.instant('RECOVER_SESSION.DATE'),
                    render: (data, type, row) => {
                        return data
                            ? '<span>' + moment(data).format('DD/MM/YYYY') + '</span>'
                            : '<span> </span>';
                    },
                },
                {
                    data: 'created_at',
                    title: this._translate.instant('RECOVER_SESSION.HOUR'),
                    render: (data, type, row) => {
                        return data
                            ? '<span>' + moment(data).format('HH:mm') + '</span>'
                            : '<span> </span>';
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones +=
                        `<div class="row justify-content-center editar backgroundColorRow">
                          <div class="round">
                            <input type="radio" id="`+row.id+`" name="checkAddClient"/>
                            <label for="`+row.id+`"></label>
                          </div>
                        </div>`;
                        return botones;   
                    },
                },
            ],
        });
        $('easyroute-modal-recover-optimization').find('.label-search').html(`
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
        $(tbody).unbind();
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.closemodal(data);
     
        });
    }

    closemodal(data? : any){
        this.Secion =  data;
        console.log(this.Secion, 'seccion');
      }
}
