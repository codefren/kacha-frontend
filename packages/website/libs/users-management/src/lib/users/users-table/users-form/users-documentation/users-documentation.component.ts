import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';
import { UsersService } from '../../../users.service';
import { UserModalConfirmDocumentComponent } from '../../user-modal-confirm-document/user-modal-confirm-document.component';
import { UserModalDocumentComponent } from '../../user-modal-document/user-modal-document.component';
declare var $: any;


@Component({
  selector: 'easyroute-users-documentation',
  templateUrl: './users-documentation.component.html',
  styleUrls: ['./users-documentation.component.scss']
})
export class UsersDocumentationComponent implements OnInit, OnChanges {

  @Input() idParam: any;

  table: any;

  constructor(
    private toastService: ToastService,
    public authLocal: AuthLocalService,
    private translate: TranslateService,
    private dialog: NgbModal,
    private userService: UsersService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    this.cargarDocument();

  }

  cargarDocument() {
        
    let url = environment.apiUrl + 'user_doc_datatables?userId=' + this.idParam;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#userManamentDocument';
    
    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [[ 0, "desc" ]],
        lengthMenu: [5],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
            <"top-button-hide"><'point table-responsive-md't>
            <'row reset'
              <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        buttons: [
            {
                extend: 'colvis',
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
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

                $('#companies_processing').html(html);
            },
        },
        columns: [
            {
                data: 'id',
                render: (data, type, row) => {
                  let botones = '';
                  
                  botones += `<div class="row backgroundColorRow pr-4 pl-4">`;
                  
                  botones += `
                    <div class="text-center col p-0 pt-1  ">
                      <img src="assets/images/pdf.svg">
                    </div>
                  `;

                  botones += `</div>`;
                  return botones;
              },
            },
            {
                data: 'name',
                title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_OF_NAME'),
                className: 'text-justify',
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 65) {
                        name = name.substr(0, 67) + '...';
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
                data: 'date',
                title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPLOAD_DATE'),
                className: 'text-justify',
                render: (data, type, row) => {
                    return moment(data).format('DD/MM/YYYY');
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                className: 'dt-body-center',
                render: (data, type, row) => {
                    let botones = '';
                    
                    botones += `<div class="row backgroundColorRow pr-4 pl-4">`;
                    
                    botones += `
                        <div class="text-center download col p-0 pt-1  ">
                            <img class="point" src="assets/images/pdf1.svg">
                        </div>
                    `;

                    botones += `</div>`;
                    return botones;
                },
            },
            {
              data: null,
              sortable: false,
              searchable: false,
              className: 'dt-body-center',
              render: (data, type, row) => {
                  let botones = '';
                  
                  botones += `<div class="row backgroundColorRow pr-4 pl-4">`;
                  
                  botones += `
                      <div class="text-center delete col p-0 pt-1">
                          <img class="icons-datatable point" src="assets/images/delete.svg">
                      </div>
                  `;

                  botones += `</div>`;
                  return botones;
              },
          },
        ],
    });

    this.initEvents('#userManamentDocument tbody', this.table);

  }

  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.edit(tbody, table);
    this.download(tbody, table);
    this.delete(tbody, table);
  }

  edit(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.edit', function() {
          let data = table.row($(this).parents('tr')).data();
          data = {
              ...data,
              date: moment(data.date)
          }
          that.editElement(data);
      });
  }

  editElement(document: any): void {
      const dialogRef = this.dialog.open(UserModalDocumentComponent, {
          backdropClass: 'customBackdrop',
          centered: true,
          size: 'md',
          backdrop: 'static',
          windowClass:'modal-document',
      });
  
      dialogRef.componentInstance.document = document;
      dialogRef.componentInstance.showBtn = true;
  
      dialogRef.componentInstance.title = this.translate.instant(
          'RATES_AND_MODULES.DOCUMENT.EDIT_DOCUMENT',
      );
      
     dialogRef.result.then((data) => {
         
          if (data) {
              this.userService
              .editCompanyDoc(data, document.id)
              .subscribe(
                  (data: any) => {
                      
                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPDATE_SUCCESSFUL'),
                      );
                      this.table.ajax.reload();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.status,
                          error.error.error,
                      );
                  },
              );
  
          }
      },
          (error) => {
              if(error.status){
                  this.toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              }
              
          },
      );
  }

  download(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.download', function() {
          let data = table.row($(this).parents('tr')).data();
          that.downloadElement(data);
      });
  }

  downloadElement(archivo: any): void {
  
      let link= document.createElement('a');
      document.body.appendChild(link);
      link.target = '_blank';
      let fileName = 'img';
      link.download = fileName;
      link.href = archivo.urlDocument;
      link.click();
  }

  delete(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.delete', function() {
          let data = table.row($(this).parents('tr')).data();
          that.deleteElement(data.id);
      });
  }

  deleteElement(documentId: any): void {
      const dialogRef = this.dialog.open(UserModalConfirmDocumentComponent, {
          backdrop: 'static',
          backdropClass: 'customBackdrop',
          centered: true,
      });
      
      dialogRef.componentInstance.message = this.translate.instant(
          'RATES_AND_MODULES.DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT',
      );
  
      dialogRef.result.then(
          (data) => {
              if (data) {
                  this.userService
                      .destroyCompanyDoc(documentId)
                      .subscribe(
                          (data: any) => {
                              
                              this.toastService.displayWebsiteRelatedToast(
                                  this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_DELETED_SUCCESSFULLY'),
                              );
                              this.table.ajax.reload();
                          },
                          (error) => {
                              this.toastService.displayHTTPErrorToast(
                                  error.status,
                                  error.error.error,
                              );
                          },
                      );
              }
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
  }

  addDocument() {
      let document = {
          id: '',
          userId: this.idParam,
          name: '',
          date: '',
          document: ''
      };
      const dialogRef = this.dialog.open(UserModalDocumentComponent, {
          backdropClass: 'customBackdrop',
          centered: true,
          size: 'md',
          backdrop: 'static',
          windowClass:'modal-document',
      });
      dialogRef.componentInstance.document = document;
      dialogRef.componentInstance.showBtn = true;
  
      dialogRef.componentInstance.title = this.translate.instant(
          'RATES_AND_MODULES.DOCUMENT.ADD_DOCUMENT',
      );
      
      dialogRef.result.then((data) => {
  
          if (data) {
              this.userService
              .addCompanyDoc(data)
              .subscribe(
                  (data: any) => {
                      
                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant('RATES_AND_MODULES.DOCUMENT.SUCCESSFUL_REGISTRATION'),
                      );
                      this.table.ajax.reload();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.status,
                          error.error.error,
                      );
                  },
              );
  
          }
      },
          (error) => {
              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
      
  }

}
