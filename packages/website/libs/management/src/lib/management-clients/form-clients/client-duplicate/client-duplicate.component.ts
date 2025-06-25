import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { CustomDatepickerI18n, Language, MomentDateFormatter, dateToObject, getEndOf, getStartOf, objectToString } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { ModalMoveClientComponent } from './modal-move-client/modal-move-client.component';

declare var $: any;


@Component({
  selector: 'easyroute-client-duplicate',
  templateUrl: './client-duplicate.component.html',
  styleUrls: ['./client-duplicate.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ClientDuplicateComponent implements OnInit {

  @Input() idParam: any;

  tableclientDuplicate: any;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private dialog: NgbModal,
  ) { }

  ngOnInit() {

    this.cargar();
    
  }

  cargar() {

    if (this.tableclientDuplicate) {
        this.tableclientDuplicate.clear();
        this.tableclientDuplicate.state.clear();
    }

    let table = '#clientDuplicateTable';

    let url = environment.apiUrl + 'delivery_point_datatables?showActive=true' +

        (this.idParam != '' ? '&groupId=' + this.idParam : '');

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    
    this.tableclientDuplicate = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: false,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [15, 100],
        order: [0, 'asc'],
        dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'>
                <'col-sm-4 col-lg-2 col-12 label-search'>
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
                title: this._translate.instant('CLIENTS.CLIENTS_DUPLICATE.NAME'),
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
                data: 'phoneNumber',
                title: this._translate.instant('CLIENTS.CLIENTS_DUPLICATE.PHONE'),
                render: (data, type, row) => {
                  let name = data;
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
                data: 'address',
                title: this._translate.instant('CLIENTS.CLIENTS_DUPLICATE.ADDRESS'),
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
              data: 'population',
              title: this._translate.instant('CLIENTS.CLIENTS_DUPLICATE.POPULATION'),
              render: (data, type, row) => {
                  let name = data ? data : 'No disponible';
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
              data: 'postalCode',
              title: this._translate.instant('CLIENTS.CLIENTS_DUPLICATE.POSTAL_CODE'),
              render: (data, type, row) => {
                  let name = data ? data : 'No disponible';
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
                data: null,
                sortable: false,
                searchable: false,
                orderable:false,
                title: '',
                render: (data, type, row) => {
                    let botones = '';
                    botones += `
                            <div class="text-center editar">
                                <img class="point" src="assets/icons/duplicate-client.svg">
                            </div>
                        `;

                    return botones;
                },
            }
        ],
    
    });
    
    $('#search').on('keyup', function() {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });
    
    $('.dataTables_filter').removeAttr('class');
    this.editar('#clientDuplicateTable tbody', this.tableclientDuplicate);
    
  }

  editar(tbody: any, table: any, that = this) {
    
    $(tbody).unbind();
  
    $(tbody).on('click', '.editar', function() {
  
      let data = table.row($(this).parents('tr')).data();

      that.modalMoveClient(data.id);
  
    });
  }

  modalMoveClient(id: number) {
    const dialogRef = this.dialog.open(ModalMoveClientComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      windowClass:'modal-client-duplicate',
      backdropClass: 'modal-client-duplicate'
    });

    dialogRef.componentInstance.deliveryPointId = [id];
    dialogRef.componentInstance.fatherGroupId = this.idParam;

    dialogRef.result.then(
        (data) => {
            if (data) {
                
                this.cargar();
            
            }      
        },
        (reason) => {
        
        },
    ); 

  }

}
