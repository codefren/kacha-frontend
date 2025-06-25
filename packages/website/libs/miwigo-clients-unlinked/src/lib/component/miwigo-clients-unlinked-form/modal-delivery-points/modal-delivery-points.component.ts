import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { ClientInterface } from '../../../../../../backend/src/lib/types/clients.type';
declare var $: any;

@Component({
    selector: 'easyroute-modal-delivery-points',
    templateUrl: './modal-delivery-points.component.html',
    styleUrls: ['./modal-delivery-points.component.scss'],
})
export class ModalDeliveryPointsComponent implements OnInit {
    table: any;
    client: ClientInterface;
    constructor(
        public activeModal: NgbActiveModal,
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
    ) {}

    ngOnInit() {
        this.cargar();
    }

    ngOnDestroy() {
        this.table.destroy();
    }

    cargar() {
        let url = environment.apiUrl + 'delivery_point_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#clientsModal';
        this.table = $(table).DataTable({
            scrollY: '20vw',
            scrollX: true,
            scrollCollapse: false,
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            paging: true,
            lengthMenu: [30, 50, 100],
            order: [0, 'asc'],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            initComplete : function (settings, data) {
                settings.oClasses.sScrollBody="";
            $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            
            },
            dom: `
                <'row'
                    <'col-sm-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
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

                    $('#clientsModal').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            columns: [
                { data: 'id', title: 'ID' },
                {
                    data: 'name',
                    title: this._translate.instant('CLIENTS.CLIENTS_LIST.NAME'),
                },
                {
                    data: 'agent_user',
                    title: this._translate.instant('DELIVERY_POINTS.COMMERCIAL_AGENT'),
                    render: (data, type, row) => {

                        let name = 'No disponible'
                        if(data && data.name && data.surname){
                            name = data.name + ' ' + data.surname;
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            name +
                            '">' +
                            name +
                            '</span>'
                        ); 
                    }
                },
                {
                    data: 'email',
                    title: this._translate.instant('CLIENTS.CLIENTS_LIST.EMAIL'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
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
                    title: this._translate.instant('GENERAL.SELECT'),
                    render: (data, type, row) => {
                        let botones = '';

                        botones +=
                        `
                        <div class="row reset justify-content-center">
                          <div class="round">
                            <input class="editar" type="radio" name="checkAddMeasure" id="${ row.id }"/>
                            <label for="${ row.id }"></label>
                          </div>
                        </div>
                        `;
                        return botones;
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
        $('.dataTables_scrollBody thead tr').addClass('hidden');

        setTimeout(() => {
            $('#clientsModal').DataTable().columns.adjust().draw();
        }, 1)

        
        this.editar('#clientsModal tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.client = data;
    
        });
    }

    closemodal(data?: any) {
        this.activeModal.close(data);
    }


}
