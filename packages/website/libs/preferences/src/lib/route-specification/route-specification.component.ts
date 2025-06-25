import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { ModalRouteSpecificationComponent } from './modal-route-specification/modal-route-specification.component';
import { ModalActivateComponent } from 'libs/shared/src/lib/components/modal-activate/modal-activate.component';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'easyroute-route-specification',
  templateUrl: './route-specification.component.html',
  styleUrls: ['./route-specification.component.scss']
})
export class RouteSpecificationComponent implements OnInit {

  table: any;

  timeInterval: any;
  
  constructor(
    private router: Router,
    private stateEasyrouteService: StateEasyrouteService,
    private _modalService: NgbModal,
    private detectChange: ChangeDetectorRef,
    private toastService: ToastService,
    public authLocal: AuthLocalService,
    private _translate: TranslateService,
    private loading: LoadingService,
  ) { }

  ngOnInit() {

    this.cargar();
   
  }
 
  cargar() {

    let url = environment.apiUrl + 'delivery_zone_specification_type_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#route-specification';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [6],
        order: [[ 1, "desc" ]],
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
              <'col-sm-12 col-lg-12 col-12 p-3 d-flex flex-column justify-content-center'f>
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
        columns: [
            {
                data: 'isActive',
                title: this._translate.instant('SHEET_ROUTE.CONDITION'),
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
                className: 'text-aling-table',
                title: this._translate.instant('VEHICLES.SERVICE_TYPE.SPECIFICATION'),
                render: (data, type, row) => {
                    let name = data;
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
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
                    }
                },
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
        ],
    });
    $('.dataTables_filter').html(`
        <div class="d-flex justify-content-md-end justify-content-center">
            <div class="input-group">
                <input 
                    id="search" 
                    type="text" 
                    class="form-control search-general
                    pull-right input-personalize-datatable" 
                    placeholder="Buscar"
                    style="max-width: initial;"
                >
                <span class="input-group-append">
                    <span class="input-group-text input-group-text-general table-append">
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

    this.initEvents('#route-specification tbody', this.table);
  }
  
  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.editar(tbody, table);
    this.active(tbody, table);
  }
  
  active(tbody: any, table: any, that = this){
    $(tbody).on('click', '.active', function() {
      let data = table.row($(this).parents('tr')).data();
     
     that.openModalActive(data.id, !data.isActive, data);
    });
  }
  
  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.editar', function() {
        let data = table.row($(this).parents('tr')).data();
       
        that.modalEditService(data)
    });
  }
  
  modalAddService(){
      
    if (!this._modalService.hasOpenModals()) {
  
      const modal = this._modalService.open( ModalRouteSpecificationComponent, {
    
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
  
  }

  modalEditService(data: number){
    
    if (!this._modalService.hasOpenModals()) {
  
      const modal = this._modalService.open( ModalRouteSpecificationComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
  
        windowClass:'modal-view-Roadmap',
    
        size:'md',
  
        backdrop: 'static'
    
      });
      
     modal.componentInstance.data = data;
  
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
  
  }

  openModalActive(id: any, element: any, serviceRoute: any) {
  
    const clonePoint = _.cloneDeep(serviceRoute);

    let data = {
        message: clonePoint.isActive ? this._translate.instant('VEHICLES.DIABLES_SPACIFICATION')
            : this._translate.instant('VEHICLES.ACTIVATE_SPACIFICATION')
    };

    const modal = this._modalService.open(ModalActivateComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
    });

    modal.componentInstance.data = data;

    modal.result.then(
        (resp: boolean) => {
            if (resp) {

            this.editActive(id, element, serviceRoute);

            } else {
               
                $('#isActiveitem-' + id).prop('checked', serviceRoute.isActive);
                this.detectChange.detectChanges();
            }
        },
        (reason) => element = !element
    )
  }   

  editActive(serviceRouteId: number, element: any , serviceRoute: any) {
     
      let data ={
          code:serviceRoute.code,
          isActive:element
      }

      this.stateEasyrouteService.UpdateDeliveryZoneSpecificationType(serviceRouteId, data).subscribe((data: any) => {
  
          this.loading.hideLoading();
  
          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
          );
         
          this.table.ajax.reload();
          
        }, (error) => {
  
          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;
  
        });
  } 
  
}
