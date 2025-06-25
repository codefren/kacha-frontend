import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { environment } from '@optimroute/env/environment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeasureGeneralFormComponent } from '../measure-general-form/measure-general-form.component';
import { MeasureInterface } from '@optimroute/backend';

declare var $: any;

@Component({
    selector: 'lib-measure-general-list',
    templateUrl: './measure-general-list.component.html',
    styleUrls: ['./measure-general-list.component.scss'],
})
export class MeasureGeneralListComponent implements OnInit {
    table: any;

    constructor(
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private dialog: NgbModal,
    ) {}

    ngOnInit() {
        this.cargar();
    }

    cargar() {
        let url = environment.apiUrl + 'measure_without_company_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#measure';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            lengthMenu: [50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            language: environment.DataTableEspaniol,
            dom: `
              <'row p-2'<' col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
                  <'col-md-5 col-12 label-search'fr>
              >
              <t>
              <'row p-2 mt-2'<'col-sm-3 col-3 d-flex ion-text-left'i><'col-sm-6 col-6 m-2 ion-text-right'p>>
            `,
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
                { data: 'id', title: this._translate.instant('CONFIGURATIONS.MEASURE.ID') },
                {
                    data: 'code',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.CODE'),
                },
                {
                    data: 'name',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.NAME'),
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
                    data: 'isActive',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.ACTIVE'),
                    render: (data, type, row) => {
                        if (data === '1' || data === 1 || data === true) {
                            return `
                                <div class="row justify-content-center">
                                    <div class="round">
                                        <input type="checkbox" id="isActive" checked="true" disabled=true />
                                        <label for="isActive" style="cursor: default;"></label>
                                    </div>
                                </div>
                            `;
                        }

                        return `
                            <div class="row justify-content-center">
                                <div class="round">
                                    <input type="checkbox" id="isActive" disabled=true />
                                    <label for="isActive" style="cursor: default;"></label>
                                </div>
                            </div>
                        `;
                    },
                },
                {
                    data: 'createdAt',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'created_by_user',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.CREATED_BY'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<p class="text center" aria-hidden="true"> No disponible</p>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '';

                        botones += `
                            <div class="text-center editar">
                                <i class="fas fa-edit eye-icon mt-2 point"></i>
                            </div>
                        `;

                        return botones;
                    },
                },
            ],
            order: [1, 'asc'],
        });
        $('.dataTables_filter').html(`
            <div class="form-group row">
                <div class="offset-md-4 col-md-8 pb-2 col-12">
                    <div class="input-group">
                        <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                        <span class="input-group-append">
                            <span class="input-group-text table-append">
                                <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                            </span>
                        </span>
                    </div>
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
        this.editar('#measure tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that.editElement(data);
        });
    }

    newAddition() {
        let measure: any = {
            measure: {
                id: null,
                name: '',
                code: '',
                isActive: true,
            },
        };
        const dialogRef = this.dialog.open(MeasureGeneralFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = measure;
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.MEASURE.ADD_MEASURE';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
            }
        });
    }

    editElement(measure: any) {
        let editingCopy: MeasureInterface = _.cloneDeep(measure);
        const dialogRef = this.dialog.open(MeasureGeneralFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = {
            measure: editingCopy,
        };
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.MEASURE.EDIT_MEASURE';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
            }
        });
    }
}
