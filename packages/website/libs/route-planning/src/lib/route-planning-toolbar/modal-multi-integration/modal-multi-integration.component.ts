import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
declare var $;
import * as moment from 'moment';

@Component({
    selector: 'easyroute-modal-multi-integration',
    templateUrl: './modal-multi-integration.component.html',
    styleUrls: ['./modal-multi-integration.component.scss']
})
export class ModalMultiIntegrationComponent implements OnInit {

    jsongenerator: any = [];

    table: any;
    planningOrder: number = 0
    selectAll: boolean = false;
    selected: any = [];

    constructor(
        public activeModal: NgbActiveModal,
        private stateRoutePlanningService: StateRoutePlanningService,
        private toast: ToastService,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadSessionList();
    }

    loadSessionList() {
        let url = environment.apiUrl + 'integration/session';
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
                { data: '_id' },
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
                    title: this._translate.instant('GENERAL.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY HH:mm:ss');
                    },
                },
                {
                    data: '_id',
                    sortable: false,
                    searchable: false,
                    render: (data, type, row) => {
                        return (`
                            <div class="row justify-content-center backgroundColorRow">
                            <div class="round round-little text-center">
                                <input type="checkbox" class="isActive" id="ck-${data}"  />
                                <label></label>
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

        $('#search').on('keyup', function () {
            $(table).DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr("class");

        this.editar('#details tbody', this.table);

        this.select('#details tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.round', function () {
            let data = table.row($(this).parents('tr')).data();
            that.planningOrder = data.id;
        });
    }

    generatorJson() {
        this.stateRoutePlanningService.postMultiIntegration(this.selected.map(x => x.id)).subscribe(
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


    selectAllFunc() {
        this.table.rows()[0].forEach((element) => {
            let data = this.table.row(element).data();
            var index = this.selected.findIndex(x => x.id === data._id);

            if (this.selectAll) {
                this.selected.push({
                    id: data._id,
                    name: data.name
                });

                $('#ck-' + data._id).prop('checked', true);

                $(this.table.row(element).node()).addClass('selected');
            } else {
                $('#ck-' + data._id).prop('checked', false);

                $(this.table.row(element).node()).removeClass('selected');

                this.selected.splice(index, 1);
            }

            this.changeDetector.detectChanges();
        });
    }

    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function () {

            that.selectAll = true;
            let data = table.row($(this)).data();
            that.selectAll = true;
            var index = that.selected.findIndex(x => x.id === data._id);

            console.log('aqui llego', index);
            if (index === -1) {
                that.selected.push({
                    id: data._id,
                    name: data.name
                });


                $('#ck-' + data._id).prop('checked', true);

                $(this).addClass('selected');
            } else {
                that.selectAll = false;

                that.selected.splice(index, 1);

                $('#ck-' + data._id).prop('checked', false);

                $(this).removeClass('selected');
            }

            that.table.rows()[0].forEach((element) => {
                if (that.selected.find(x => x.id === that.table.row(element).data()._id) === undefined) {
                    that.selectAll = false;
                }
            });


            console.log(that.selected);

            that.changeDetector.detectChanges();


        });
    }


}
