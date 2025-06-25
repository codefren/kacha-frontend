import { Component, OnInit } from '@angular/core';
import { ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { environment } from '@optimroute/env/environment';
import { Router } from '@angular/router';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'lib-my-note-list',
    templateUrl: './my-note-list.component.html',
    styleUrls: ['./my-note-list.component.scss'],
})
export class MyNoteListComponent implements OnInit {
    table: any;

    constructor(
        private authLocal: AuthLocalService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private _router: Router,
    ) {}

    ngOnInit() {
        this.cargar();
    }

    cargar() {
        let url = environment.apiUrl + 'company_note_datatables_by_user';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        this.table = $('#myNotes').DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            lengthMenu: [50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom: `
                <'row'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
                  <'col-sm-6 col-12 label-search'fr>
                >
                <"top-button-hide"B><t><ip>
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
                    data: 'name',
                    title: this._translate.instant('MYNOTES.MYNOTES_FORM.TITLE'),
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
                    title: this._translate.instant('MYNOTES.MYNOTES_LIST.MESSAGE'),
                    render: (data, type, row) => {
                        let description = data;
                        if (description.length > 50) {
                            description = description.substr(0, 49) + '...';
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            description +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'user',
                    title: this._translate.instant(
                        'MYNOTES.MYNOTES_LIST.USER_TO_DESTINATION',
                    ),
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
                    data: 'createdAt',
                    title: this._translate.instant('MYNOTES.MYNOTES_LIST.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'created_by_user',
                    title: this._translate.instant('MYNOTES.MYNOTES_LIST.CREATED_BY'),
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
                    data: 'isDeleted',
                    title: this._translate.instant('MYNOTES.MYNOTES_LIST.ISDELETED'),
                    render: (data, type, row) => {
                        let subscribe =
                            +data === 1
                                ? this._translate.get('GENERAL.YES')
                                : this._translate.get('GENERAL.NO');
                        let active;
                        subscribe.subscribe((data) => {
                            active = data;
                        });
                        return '<span>' + active + '</span>';
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        return `
                <button class="editar btn btn-default btn-datatable rounded-button">
                  <i class="fas fa-pencil-alt"></i>
                </button>
              `;
                    },
                },
            ],
            order: [3, 'desc'],
        });
        this.editar('#myNotes tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'button.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that._router.navigate(['my-note', data.id]);
        });
    }
}
