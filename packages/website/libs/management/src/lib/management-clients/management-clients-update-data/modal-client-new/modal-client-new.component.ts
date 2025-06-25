import { Component, OnInit } from '@angular/core';
import { ClientInterface } from '../../../../../../backend/src/lib/types/clients.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
declare var $: any;
@Component({
  selector: 'easyroute-modal-client-new',
  templateUrl: './modal-client-new.component.html',
  styleUrls: ['./modal-client-new.component.scss']
})
export class ModalClientNewComponent implements OnInit {

  table: any;

  client: ClientInterface;

  cssStyle: string = 'btn btn-primary mr-2'

  constructor(
    public activeModal: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private router: Router
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
    let table = '#clients';
    this.table = $(table).DataTable({
      destroy: true,
      language: environment.DataTableEspaniol,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      order: [0, 'asc'],
      scrollY: "50vh",
      scrollX: true,
      stateSaveParams: function (settings, data) {
        data.search.search = "";
        $('.dataTables_scrollBody table thead tr').addClass('color-hidden-scroll');
      },
      initComplete : function (settings, data) {
          settings.oClasses.sScrollBody="";
          $('#clients .dataTables_empty').html('No hay datos disponibles en esta tabla, '+
          '<a id="newClient" style="color: #0088cc; cursor:pointer; text-decoration: underline;">Crear cliente</a>');
        $('.dataTables_scrollBody table thead tr').addClass('color-hidden-scroll');
       
      },
      drawCallback: (settings, json) =>{
        setTimeout(() => {
            $('#clients').DataTable().columns.adjust();
        }, 1);
      },
      lengthMenu: [50, 100],
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
            `<div class="row reset justify-content-center editar">
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
    $('.dataTables_filter').html(`
          <div class="row p-0 justify-content-sm-end justify-content-center">
              <div class="input-group input-search" style="width: initial !important;">
                  <input id="search" type="text" class="search-client form-control pull-right input-personalize-datatable" placeholder="Buscar">
                  <span class="input-group-append">
                      <span class="input-group-text table-append">
                          <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                      </span>
                  </span>
              </div>
          </div>
      `);

      $('.search-client').on( 'keyup', function () {
          console.log(this.value);
          $(table).DataTable().search( this.value ).draw();
      } );
      
      $('.dataTables_filter').removeAttr("class");
      $('.dataTables_scrollBody thead tr').addClass('hidden');
      /* $('.dataTables_scrollBody thead tr').addClass('hidden'); */

    this.editar('#clients tbody', this.table);
    this.newClient('#clients tbody', this.table);
  }

  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.editar', function() {
         
      let data = table.row($(this).parents('tr')).data();

      that.closemodal(data);
   
    });
  }

  newClient(tbody: any, table: any, that = this) {
    $(tbody).on('click', '#newClient', function(){
      that.router.navigateByUrl('management/clients/new');
      that.activeModal.close();
    });
  }

  closemodal(data? : any){
    this.client =  data;
  }

  closeDialog() {
    this.activeModal.close();
  }

}
