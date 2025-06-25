import { Component, OnInit } from '@angular/core';
import { ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { Router } from '@angular/router';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'lib-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
    table: any;

    me: boolean;

    constructor(
        private authLocal: AuthLocalService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private Router: Router,
    ) {}

    ngOnInit() {
        this.cargar();
    }
    ngOnDestroy() {
        this.table.destroy();
    }
    cargar() {
        let isSalesman = this.isSalesman() && this.me == false;
        let url = this.me
            ? environment.apiUrl + 'company_note_datatables?me=true'
            : environment.apiUrl + 'company_note_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#notes'

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            paging: true,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            lengthMenu: [50, 100],
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
            // <'row p-0 justify-content-sm-start justify-content-center'B>
           /*  headerCallback: ( thead, data, start, end, display ) => {
                $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE'))
            }, */
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
                    title: this._translate.instant('NOTES.NOTES_FORM.TITLE'),
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
                    title: this._translate.instant('NOTES.NOTES_LIST.MESSAGE'),
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
                    title: this._translate.instant('NOTES.NOTES_LIST.USER_TO_DESTINATION'),
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
                    title: this._translate.instant('NOTES.NOTES_LIST.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'created_by_user',
                    title: this._translate.instant('NOTES.NOTES_LIST.CREATED_BY'),
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
                    data: 'isActive',
                    title: this._translate.instant('NOTES.NOTES_LIST.ACTIVE'),
                    render: ( data, type, row ) => {
                        
                        if ( data ) {
                            return (`
                            <div class="row reset justify-content-center">
                              <div class="success-chip-new">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                              </div>
                            </div>
                            `);
                        }
    
                        return (`
                          <div class="row reset justify-content-center">
                            <div class="times-chip-new">
                              <i class="fas fa-times mt-2"></i>
                            </div>  
                          </div>
                        `);
                    } 
                },
                {
                    data: 'isDeleted',
                    title: this._translate.instant('NOTES.NOTES_LIST.ELIMINATED'),
                    render: (data, type, row) => {
                        
                        if ( data ) {
                            return (`
                            <div class="row reset justify-content-center">
                              <div class="success-chip-new">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                              </div>
                            </div>
                            `);
                        }
    
                        return (`
                          <div class="row reset justify-content-center">
                            <div class="times-chip-new">
                              <i class="fas fa-times mt-2"></i>
                            </div>  
                          </div>
                        `);



                        /* let subscribe =
                            +data === 1
                                ? this._translate.get('NOTES.NOTES_LIST.ELIMINATED')
                                : this._translate.get('NOTES.NOTES_LIST.ACTIVE');    
                        
                        let active;
                        
                        subscribe.subscribe((data) => {
                            active = data;
                        });
                        return (`
                            <span class="${ +data === 1 ? 'text-danger' : 'text-success' }">
                                ${active}
                            </span>`
                        ); */
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
                            `<div class="text-center editar">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                            </div>`;
                        return botones;
                    },
                },
            ],
            order: [3, 'desc'],
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
        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });
        $('.dataTables_filter').removeAttr('class'); 
    
        this.editar('#notes tbody', this.table);
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that.Router.navigate(['note', data.id]);
        });
    }
}
