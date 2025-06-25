import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
declare var $;
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { dayTimeAsStringToSeconds, ToastService } from '@optimroute/shared';
import { secondsToAbsoluteTime, secondsToDayTimeAsString } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagementFormClientServiceTypeComponent } from './management-form-client-service-type/management-form-client-service-type.component';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { take } from 'rxjs/operators';
import { BackendService } from '@optimroute/backend';
import { ModalDeleteServiceTypeComponent } from '../management-clients-settings/modal-delete-service-type/modal-delete-service-type.component';
declare function init_plugins();

@Component({
  selector: 'easyroute-managenent-clients-service-type-table',
  templateUrl: './managenent-clients-service-type-table.component.html',
  styleUrls: ['./managenent-clients-service-type-table.component.scss']
})
export class ManagenentClientsServiceTypeTableComponent implements OnInit {

    change: string = 'servies-type';

    table: any;

    timeInterval: any;

    selected: any = [];

    constructor(
        private router: Router,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private _modalService: NgbModal,
        private _detectChanges: ChangeDetectorRef,
        private toastService: ToastService,
        private backendService: BackendService,
    ) { }

    ngOnInit() {
      setTimeout(()=>{
          init_plugins();
      }, 1000)
      this.cargar();
    }

    cargar() {
      this.selected = [];

      let url = environment.apiUrl + 'company_time_zone_datatables';
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#clientServiceType';

      this.table = $(table).DataTable({
          destroy: true,
          serverSide: true,
          processing: true,
          stateSave: true,
          cache: false,
          order: [[ 0, "desc" ]],
          scrollCollapse: true,
          stateSaveParams: function (settings, data) {
              data.search.search = "";
          },
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
                  let html = '<div class="container" style="padding: 10px;">';
                  html +=
                      '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                  html +=
                      '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                  html += '</div>';

                  $('#vehicles_processing').html(html);

                  $('#refrescar').click(() => {
                      this.cargar();
                  });
              },
          },
          rowCallback: (row, data) => {
              if ($.inArray(data.id, this.selected) !== -1) {
                  $(row).addClass('selected');
              }
          },
          columns: [
            {
                data: 'isActive',
                className:'text-xl-left',
                title: this._translate.instant('DELIVERY_POINTS.STATE'),
                render:(data, type, row) => {
                    if (data) {
                        return (`
                            <div class="switch w-100">
                              <label class="switch-width mb-0">
                                <input type="checkbox" class="active" checked  id="isActiveitem-${row.id}"/>
                                <span class="lever lever-general switch-col-primary m-2"></span>
                              </label>
                            </div>
                        `);
                    }

                    return (`
                        <div class="switch w-100">
                        <label class="switch-width mb-0">
                            <input type="checkbox" class="active" id="isActiveitem-${row.id}"/>
                            <span class="lever lever-general switch-col-primary m-2"></span>
                        </label>
                        </div>
                    `);
                }
            },
            {
                  data: 'code',
                  className:'text-xl-left',
                  title: this._translate.instant('VEHICLES.SERVICE_TYPE.CODE'),
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
                  data: 'name',
                  className:'text-xl-left',
                  title: this._translate.instant('DELIVERY_POINTS.SPECIFICATION'),

                  render: (data, type, row) => {
                      let name = data;
                      if (name.length > 50) {
                          name = name.substr(0, 49) + '...';
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
                data: 'timeStart',
                className:'text-xl-left',
                title: this._translate.instant('DELIVERY_POINTS.START'),
                render: ( data, type, row ) => {

                    let timeStart = secondsToDayTimeAsString(data);

                    console.log(timeStart, 'timeStart')


                    if ( data && timeStart ) {
                        return timeStart;
                    } else {
                        return timeStart;
                    }

                    return '<span class="text center" aria-hidden="true"> No disponible</span>';
                }
            },
            {
                data: 'timeEnd',
                className:'text-xl-left',
                title: this._translate.instant('DELIVERY_POINTS.END'),
                render: ( data, type, row ) => {
                    let timeEnd = secondsToDayTimeAsString(data);

                    if ( data && timeEnd ) {
                        return timeEnd;
                    }

                    return '<span class="text center" aria-hidden="true"> No disponible</span>';
                }
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                render: ( data, type, row ) => {
                    let botones = '<div class="text-center">';

                    botones += `
                        <span class="editar m-1">
                            <img class="icons-datatable point" title="Editar" src="assets/icons/editSettings.svg">
                        </span>
                    `;

                    botones += '</div>';

                    return botones;
                }
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                render: (data, type, row) => {
                    let botones1 = '<div class="text-center">';

                    botones1 += `
                        <span class="trash m-1">
                            <img class="icons-datatable point" title="Eliminar" src="assets/icons/trashSetting.svg">
                        </span>
                    `;

                    botones1 += '</div>';

                    return botones1;
                },
            },
          ],
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

      this.initEvents('#clientServiceType tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.trash(tbody, table);
        this.active(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.modalEditServiceType(data);
        });
    }

    trash(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.trash', function() {
            let data = table.row($(this).parents('tr')).data();

            that.deleteElement(data.id);
        });
    }

    deleteElement(id:any){

        let data = {
            message: this._translate.instant('DELIVERY_POINTS.SETTINGS.DELETE_SPACIFICATION')
        };

        const modal = this._modalService.open(ModalDeleteServiceTypeComponent, {
          centered: true,
          backdrop: 'static'
        });

        modal.componentInstance.message = data.message;

        modal.result.then((result) => {

          if (result) {
            this.deleteService(id);
          }
        });

      }

      deleteService(id:any){
        this.backendService.delete('company_time_zone/'+ id).pipe(take(1)).subscribe((data)=>{

          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
          );

          this.table.ajax.reload();
          this._detectChanges.detectChanges();

          }, error => {

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      }


    active(tbody: any, table: any, that = this){
        $(tbody).on('click', '.active', function() {
            let data = table.row($(this).parents('tr')).data();

            that.openModalActive(data.id, !data.isActive, data);

        });
    }

    openModalActive(id: any, element: any, serviceType: any) {

        const clonePoint = _.cloneDeep(serviceType);

        let data = {
            message: clonePoint.isActive ? this._translate.instant('GENERAL.INACTIVE?')
                : this._translate.instant('GENERAL.ACTIVE?')
        };

        const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;
        modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = data.message;

        modal.result.then(
            (resp: boolean) => {
                if (resp) {

                    this.updateIsActive(id, element, serviceType);

                } else {

                    $('#isActiveitem-' + id).prop('checked', serviceType.isActive);

                    this._detectChanges.detectChanges();
                }
            },
            (reason) => element = !element
        )
    }

    updateIsActive(Id: number, element: any , serviceType: any) {

        this.backendService.put('company_time_zone/'+Id,{isActive:element}).pipe(take(1)).subscribe((data)=>{

          this.table.ajax.reload();

          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
          );

          this._detectChanges.detectChanges();

        }, error => {

          this.toastService.displayHTTPErrorToast(error.status, error.error.error);

        });

    }

    modalAddServiceType(){

        const modal = this._modalService.open(ManagementFormClientServiceTypeComponent, {
          backdropClass: 'modal-backdrop-ticket',
          windowClass:'modal-view-Roadmap',
          size:'md',
          backdrop: 'static'
        });

        modal.componentInstance.actions ='new';

        modal.result.then(
          (data) => {
            if (data) {
              this.table.ajax.reload();
            }
          },
          (reason) => {
          },
        );

    }

    modalEditServiceType(data: any){

        const modal = this._modalService.open(ManagementFormClientServiceTypeComponent, {
          backdropClass: 'modal-backdrop-ticket',
          windowClass:'modal-view-Roadmap',
          size:'md',
          backdrop: 'static'
        });

        modal.componentInstance.data = data;
        modal.componentInstance.actions ='edit';

        modal.result.then(
          (data) => {
            if (data) {
                this.table.ajax.reload();
            }
          },
          (reason) => {
          },
        );

    }

  /* redirectTo(){
    this.router.navigate(['management/clients']);
  } */

}
