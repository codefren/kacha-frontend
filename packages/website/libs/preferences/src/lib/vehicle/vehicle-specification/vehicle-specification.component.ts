import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { ModalActivateComponent } from 'libs/shared/src/lib/components/modal-activate/modal-activate.component';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

import * as _ from 'lodash';
import { ModalAddServiceComponent } from './modal-add-service/modal-add-service.component';
import { ModalDeleteComponent } from 'libs/shared/src/lib/components/modal-delete/modal-delete.component';

declare var $;


@Component({
  selector: 'easyroute-vehicle-specification',
  templateUrl: './vehicle-specification.component.html',
  styleUrls: ['./vehicle-specification.component.scss']
})
export class VehicleSpecificationComponent implements OnInit {

  tableConcept: any;

  conceptList: any [] =[];

  providersType: any;


  table: any;

  timeInterval: any;
  
  selected: any = [];

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
    this.selected = [];

    let url = environment.apiUrl + 'company_vehicle_service_type_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#vehiclesSettings';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [6],
        order: [[ 1, "asc" ]],
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

    this.initEvents('#vehiclesSettings tbody', this.table);
  }

  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.editar(tbody, table);
    this.trash(tbody, table);
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
  
  trash(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.trash', function() {
  
        let data = table.row($(this).parents('tr')).data();
  
       that.openModalDelete(data.id);
    });
  }
  
  modalAddService(){
  
    if (!this._modalService.hasOpenModals()) {
  
      const modal = this._modalService.open( ModalAddServiceComponent, {
    
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
            else{
  
            }
          
          },
          (reason) => {
            
            
          },
      ); 
    }
  
  }
  
  modalEditService(data: number){
      
      if (!this._modalService.hasOpenModals()) {
    
        const modal = this._modalService.open( ModalAddServiceComponent, {
      
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
              else{
                
              }
            
            },
            (reason) => {
              
              
            },
        ); 
      }
    
    }
  
    openModalActive(id: any, element: any, vehicle: any) {
  
      const clonePoint = _.cloneDeep(vehicle);
  
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
  
              this.editActiveCompany(id, element, vehicle);
  
              } else {

                  $('#isActiveitem-' + id).prop('checked', vehicle.isActive);
                  this.detectChange.detectChanges();
              }
          },
          (reason) => element = !element
      )
    }             

  editActiveCompany(vehicleId: number, element: any , vehicle: any) {
  
      let data ={
          code:vehicle.code,
          isActive:element
      }
      
      this.stateEasyrouteService.UpdateVehiclesServiceType(vehicleId, data).subscribe((data: any) => {
  
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
  
  openModalDelete(id: any) {
  
      let data = {
          message: this._translate.instant('VEHICLES.DELETE_SPACIFICATION')
      };
  
      const modal = this._modalService.open(ModalDeleteComponent, {
          backdrop: 'static',
          backdropClass: 'customBackdrop',
          centered: true,
      });
  
      modal.componentInstance.message = data.message;
  
      modal.result.then(
          (resp: boolean) => {
              if (resp) {
  
                this.deleteSpesification(id);
  
              } 
          },
          (reason) => {}
      )
  } 
  
  deleteSpesification(vehicleId: number,) {
      
      this.stateEasyrouteService.deleteVehiclesServiceType(vehicleId).subscribe((data: any) => {
  
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
