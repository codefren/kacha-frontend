import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { orderPhoneNumber } from '@optimroute/shared'
declare var $;

@Component({
  selector: 'easyroute-miwigo-clients-unlinked-list',
  templateUrl: './miwigo-clients-unlinked-list.component.html',
  styleUrls: ['./miwigo-clients-unlinked-list.component.scss']
})
export class MiwigoClientsUnlinkedListComponent implements OnInit {

  table: any;

  me: boolean;

  modalOptions:NgbModalOptions;

  constructor(
              private authLocal: AuthLocalService,
              private _toastService: ToastService,
              private _translate: TranslateService,
              private _modalService: NgbModal,
             // private _clientsUnlinkedService: ClientsUnlinkedService,
              private Router: Router
  ) { }

  ngOnInit() {
    this.cargar();
  }

  ngOnDestroy() {
    this.table.destroy();
  }
  
  returnProfileString(profiles: any): string {
    let profile = [];
    profiles.forEach((element) => {
        profile.push(element.name);
    });
    return profile
        .map((element) => {
            return element;
        })
        .join(', ');
  }

  cargar() {
      let url = environment.apiUrl + 'datatables_unlinked';
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      this.table = $('#clients_vinculate').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [ 30, 50, 100],
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      },
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
      /* coemntar para que aparesca botones */
      /* headerCallback: ( thead, data, start, end, display ) => {
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
        { data: 'user.email', title: this._translate.instant('USERS.EMAIL') },
        { data: 'user.name', title: this._translate.instant('USERS.NAME_USER') },
        { data: 'user.surname', title: this._translate.instant('USERS.SURNAME_USER') },
        { 
          data: 'user.phone', 
          title: this._translate.instant('GENERAL.PHONE_NUMBER'),
          render: ( data, type, row ) => {
      
            if ( data ) {
              return orderPhoneNumber( data );
            }

            return 'No disponible'
          } 
        },
        {
            data: null,
            sortable: false,
            searchable: false,
            title: this._translate.instant('GENERAL.EDIT_PENDING_BINDINGS'),
            render: (data, type, row) => {
              let title=this._translate.instant('GENERAL.ACCEPT_LINKS');
              return (`
                <div class="text-center editar">
                  <button type="button" style="border-radius: 3px" title=" ${title}" class="btn btn-link button-active-user btn-sm editar">
                   ${title} 
                  </button>
                </div>
              `);
            },
        },
    ],
  });

  /* $('.dataTables_filter').html(`
    <div class="row p-0 justify-content-sm-end justify-content-center">
      <div class="input-group">
          <input 
            id="search"  
            type="text" 
            class="form-control pull-right input-personalize-datatable" 
            placeholder="Buscar"
           >
          <span class="input-group-append">
              <span class="input-group-text table-append">
                  <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
              </span>
          </span>
      </div>
    </div>
  `); */
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

  $('#search').on( 'keyup', function () {
    $('#clients_vinculate').DataTable().search( this.value ).draw();
  });

  $('.dataTables_filter').removeAttr("class");

  this.editar('#clients_vinculate tbody', this.table);
  this.isActive('#clients_vinculate tbody', this.table);
  }

  isSalesman() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
        : false;
  }
  
  isActive(tbody: any, table: any, that = this) {
    $(tbody).on('click', '#isActive', function() {
        let data = table.row($(this).parents('tr')).data();
        console.log(data ,'editar');
       // that.OnChangeCheckActive(data.id, this);
    });
  }
  

  editar(tbody: any, table: any, that = this) {
  
    $(tbody).unbind();
  
    $(tbody).on('click', '.editar', function() {
         
        let data = table.row($(this).parents('tr')).data();
        
        that.Router.navigate(['miwigo-unlinked', data.userId]);
       
    });
  }

}
