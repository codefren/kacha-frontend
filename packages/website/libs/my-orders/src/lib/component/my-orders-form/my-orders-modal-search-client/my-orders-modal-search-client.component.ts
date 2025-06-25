import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ClientInterface } from '../../../../../../backend/src/lib/types/clients.type';
import { environment } from '@optimroute/env/environment';
declare var $: any;

@Component({
  selector: 'easyroute-my-orders-modal-search-client',
  templateUrl: './my-orders-modal-search-client.component.html',
  styleUrls: ['./my-orders-modal-search-client.component.scss']
})
export class MyOrdersModalSearchClientComponent implements OnInit {

  table: any;

  constructor(
    public activeModal: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService
  ) { }

  ngOnInit() {
    this.cargar();
  }

  ngOnDestroy() {
    this.table.destroy();
  }

  cargar() {
    let url = environment.apiUrl + 'delivery_point_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    this.table = $('#clients').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      order: [0, 'asc'],
      scrollY: "50vh",
      stateSaveParams: function (settings, data) {
        data.search.search = "";
    },
     // scrollCollapse: true,
      lengthMenu: [50, 100],
      dom: `
    <'row'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
        <'col-sm-6 col-12 label-search'fr>
    >
    <"top-button-hide"B><t><ip>
  `,
    buttons: [
          {
              extend: 'colvis',
              text: 'Mostrar/ocultar',
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
          { data: 'id', title: this._translate.instant('CLIENTS.CODE_CLIENTS') },
          { data: 'name', title: this._translate.instant('CLIENTS.CLIENTS_LIST.NAME') },
          /* { data: 'nif', title: this._translate.instant('CLIENTS.CLIENTS_LIST.NIF') },
          { data: 'province', title: this._translate.instant('CLIENTS.CLIENTS_LIST.PROVINCE') }, */
          { data: 'email', title: this._translate.instant('CLIENTS.CLIENTS_LIST.EMAIL'),
          render:(data, type, row) =>{
            if (data == null || data ==0) {

              return '<span class="text center" aria-hidden="true"> No disponible</span>';

            } else {

              return '<span data-toggle="tooltip" data-placement="top" title="' + '">' + data +'</span>';
            }
          }
         },
          {
              data: null,
              sortable: false,
              searchable: false,
              title: this._translate.instant('GENERAL.SELECT'),
              render: (data, type, row) => {
                  let botones = '';
  
                  botones +=
                  '<button class="btn editar"><i class="fas fa-check"></i></button>';
                  return botones;
                  
              },
          },
      ],
    });
    this.editar('#clients tbody', this.table);
  }

  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'button.editar', function() {
         
        let data = table.row($(this).parents('tr')).data();
    
        let client: ClientInterface =  data;
   
        that.closemodal(client);
   
    });
  }

  closemodal(data? : any){
    this.activeModal.close(data);
  }

}
