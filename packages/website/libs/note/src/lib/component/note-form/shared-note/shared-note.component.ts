import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/index';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '@optimroute/shared';
// import { MyNoteService } from 'libs/my-note/src/public-api';
import { NoteService } from '../../../note.service';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'lib-shared-note',
  templateUrl: './shared-note.component.html',
  styleUrls: ['./shared-note.component.scss']
})
export class SharedNoteComponent implements OnInit {

    itemsSelected: any = [];
    table: any;
    @Input() selected: any = [];
    @Input() idNote: number = 0;

    constructor(
        public activeModal: NgbActiveModal,
        private authLocal: AuthLocalService,
        private _loading: LoadingService,
        private noteService: NoteService,
        private _translate: TranslateService
    ) { }

    ngOnInit() {
        this.itemsSelected = this.selected;
        
        this.cargar();
    }

    ngOnDestroy() {
        this.table.destroy();
    }

    cargar() {
        let url = environment.apiUrl + 'users_salesman_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#salesman';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            lengthMenu: [10, 50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom: `
                <'row'
                    <'col-sm-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start'l>
                    <'col-sm-4 col-12 label-search'f>
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
                <"top-button-hide"><'table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `, 
            /*dom: `
                <'row p-2'<' col-sm-6 col-12 d-flex flex-column justify-content-center'l>
                    <'col-md-5 col-12 label-search'fr>
                >
                <'table-responsive't>
                <'row p-2 mt-2'<'col-sm-3 col-12 d-flex text-left'i><'col-sm-6 col-12 m-2 text-right'p>>
            `,*/

            language: environment.DataTableEspaniol,
            select: {
                style:  'multi'
            },
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 30px;">';
                    html += '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html += '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            columns: [
                { data: 'id', title: 'Id' },
                { 
                    data: 'name',
                    title: this._translate.instant('GENERAL.NAME'),
                    render: (data, type, row)=>{
                        return '<label>' + row.name + ' ' + row.surname + '</label>';
                    }
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.SELECT'),
                    render: (data, type, row) => {
                        if (this.itemsSelected.find(x => x.id == row.id)) {
                            return (`
                                <div class="row reset justify-content-center pr-3">
                                    <div class="round text-center editar">
                                        <input type="checkbox" class="isActive" id="${ row.id }" checked="true" disabled="true"/>
                                        <label for="${ row.id }"></label>
                                    </div>
                                </div>
                            `);
                        } else {
                            return (`
                                <div class="row reset justify-content-center pr-3">
                                    <div class="round text-center editar">
                                        <input type="checkbox" class="isActive" id="${ row.id }" disabled="true"/>
                                        <label for="${ row.id }"></label>
                                    </div>
                                </div>
                            `);
                        }                        
                    },
                },
            ],
            order: [1, "asc"]
        });

        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search" type="text" class="form-control pull-right" placeholder="Buscar">
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
        
        this.editar('#salesman tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', async function() { 
            let data = table.row($(this).parents('tr')).data();

            if (that.itemsSelected.find(x => x.id == data.id)) {
                // let companyNoteShare = that.itemsSelected.filter(x => x.id == data.id).map(y => { 
                //     return {
                //         userId: y.id
                //     }
                // });

                that.itemsSelected = that.itemsSelected.filter(x => x.id != data.id);

                // if (that.idNote > 0) {
                //     that.deleteFromNote(companyNoteShare, that.idNote);
                // }
            } else {
                // if (that.idNote > 0) {
                //     that.addUserShareNote([{ userId: data.id }], that.idNote);
                // }

                that.itemsSelected.push(data);  
            }

            that.table.ajax.reload();
        });
    }
  
    closemodal() {
        this.activeModal.close(this.selected);
    }

    acceptModal() {
        this.activeModal.close(this.itemsSelected);
    }

    deleteFromNote(companyNoteShare: any, id: number) {
        this._loading.showLoading();

        this.noteService.deleteUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
            this._loading.hideLoading();
        });
    }

    addUserShareNote(companyNoteShare: any, id: number) {
        this._loading.showLoading();

        this.noteService.addUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
            this._loading.hideLoading();
        });
    }
}
