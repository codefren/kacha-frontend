import { ToastService } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from 'libs/auth-local/src/index';
import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ModalConfirmDocumentComponent } from 'libs/shared/src/lib/components/modal-confirm-document/modal-confirm-document.component';
import { ModalDocumentComponent } from 'libs/shared/src/lib/components/modal-document/modal-document.component';
declare var $: any;
@Component({
  selector: 'easyroute-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit, OnChanges {

  table: any;

  @Input() idParan: any;

  constructor(
    private dialog: NgbModal,
    private toastService: ToastService,
    private service: StateUsersService,
    private translate: TranslateService,
    private detectChange: ChangeDetectorRef,
        public authLocal: AuthLocalService,
  ) { }

  ngOnInit() { }
  ngOnChanges() {
    try {
      this.detectChange.detectChanges();

     this.cargarDocument();
  } catch (e) {}

  }
    // Document
    cargarDocument() {
      let url =
          environment.apiUrl + 'vehicle_doc_datatables?vehicleId=' + this.idParan;

      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#vehicleDocument';

      this.table = $(table).DataTable({
          destroy: true,
          serverSide: true,
          processing: true,
          stateSave: true,
          cache: false,
         // order: [[0, 'desc']],
          lengthMenu: [5],
          stateSaveParams: function(settings, data) {
              data.search.search = '';
          },
          dom: `
              <"top-button-hide"><'vehicles table-responsive-md't>
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
                data: 'name',
                sortable: false,
                searchable: false,

                render: (data, type, row) => {


                    let forma = this.get_url_extension(row.urlDocument)


                  let botones1 = '';

                  botones1 += `<div class="row backgroundColorRow pr-4 pl-4">`;


                  botones1 += `
                    <div class="text-center col p-0 pt-1  ">
                      <img src="assets/images/pdf.svg">
                    </div>
                  `;


                  botones1 += `</div>`;
                  return botones1;
              },
            },
            {
                data: 'name',
                className: 'text-aling-table',
                title: this.translate.instant(
                    'RATES_AND_MODULES.DOCUMENT.DOCUMENT_OF_NAME',
                ),
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
                        <div class="text-center download col p-0 pt-1 mr-1 ml-1">
                            <img class="vehicles point" title="Descargar" src="assets/icons/descargar.svg">
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
                          <img class="vehicles point" title="Eliminar" src="assets/icons/delete.svg">
                      </div>
                  `;

                  botones += `</div>`;
                  return botones;
              },
          },
        ],
      });

      this.initEvents('#vehicleDocument tbody', this.table);
  }

  addDocument() {
      let document = {
          id: '',
          vehicleId: this.idParan,
          name: '',
          date: '',
          document: '',
      };
      const dialogRef = this.dialog.open(ModalDocumentComponent, {
          backdropClass: 'customBackdrop',
          centered: true,
          size: 'md',
          backdrop: 'static',
          windowClass: 'modal-document',
      });
      dialogRef.componentInstance.document = document;
      dialogRef.componentInstance.showBtn = true;

      dialogRef.componentInstance.title = this.translate.instant(
          'RATES_AND_MODULES.DOCUMENT.ADD_DOCUMENT',
      );

      dialogRef.result.then(
          (data) => {
              if (data) {
                  this.service.addVehiclesDoc(data).subscribe(
                      (data: any) => {
                          this.toastService.displayWebsiteRelatedToast(
                              this.translate.instant(
                                  'RATES_AND_MODULES.DOCUMENT.SUCCESSFUL_REGISTRATION',
                              ),
                          );
                          //this.cargarDocument();
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
              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
      );
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
              date: moment(data.date),
          };
          that.editElement(data);
      });
  }

  editElement(document: any): void {
      const dialogRef = this.dialog.open(ModalDocumentComponent, {
          backdropClass: 'customBackdrop',
          centered: true,
          size: 'md',
          backdrop: 'static',
          windowClass: 'modal-document',
      });

      dialogRef.componentInstance.document = document;
      dialogRef.componentInstance.showBtn = true;

      dialogRef.componentInstance.title = this.translate.instant(
          'RATES_AND_MODULES.DOCUMENT.EDIT_DOCUMENT',
      );

      dialogRef.result.then(
          (data) => {
              if (data) {
                  this.service.editVehiclesDoc(data, document.id).subscribe(
                      (data: any) => {
                          this.toastService.displayWebsiteRelatedToast(
                              this.translate.instant(
                                  'RATES_AND_MODULES.DOCUMENT.UPDATE_SUCCESSFUL',
                              ),
                          );
                          // this.cargarDocument();
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
              if (error.status) {
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
      let link = document.createElement('a');
      document.body.appendChild(link); //required in FF, optional for Chrome
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
      const dialogRef = this.dialog.open(ModalConfirmDocumentComponent, {
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
                  this.service.destroyVehiclesDoc(documentId).subscribe(
                      (data: any) => {
                          this.toastService.displayWebsiteRelatedToast(
                              this.translate.instant(
                                  'RATES_AND_MODULES.DOCUMENT.DOCUMENT_DELETED_SUCCESSFULLY',
                              ),
                          );
                          //this.cargarDocument();
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
              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
      );
  }

   get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

}
