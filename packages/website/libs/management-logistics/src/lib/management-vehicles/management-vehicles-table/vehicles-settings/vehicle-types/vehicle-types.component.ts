import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
declare var $;
import * as _ from 'lodash';
import { environment } from '@optimroute/env/environment';
import { ModalActivateComponent } from '../../modal-activate/modal-activate.component';
import { ModalDeleteServiceComponent } from '../service-specification/modal-delete-service/modal-delete-service.component';
import { ModalAddVehicleTypeComponent } from './modal-add-vehicle-type/modal-add-vehicle-type.component';
@Component({
  selector: 'easyroute-vehicle-types',
  templateUrl: './vehicle-types.component.html',
  styleUrls: ['./vehicle-types.component.scss']
})
export class VehicleTypesComponent implements OnInit {

  //tableConcept: any;

  conceptList: any [] =[];

  providersType: any;

  tableTypeVehicle: any;

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

    let url = environment.apiUrl + 'company_vehicle_type_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#vehiclesType';

    this.tableTypeVehicle = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [6],
        order: [[ 0, "asc" ]],
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
              data: 'id',
              visible: false,
            },
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
                data: 'name',
                className: 'text-aling-table',
                title: this._translate.instant('VEHICLES.LICENSE'),
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
              data: 'licenses',
              className: 'text-aling-table',
              title: this._translate.instant('VEHICLES.GUY'),
              render: (data, type, row) => {
                  if (data == null || data == 0) {
                      return '<span class="text left" aria-hidden="true"> No disponible</span>';
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
                //title: this._translate.instant('VEHICLES.SERVICE_TYPE.ACTIVE'),
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
              //  title: this._translate.instant('GENERAL.ACTIONS'),
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

    this.initEvents('#vehiclesType tbody', this.tableTypeVehicle);
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

    const modal = this._modalService.open( ModalAddVehicleTypeComponent, {
  
      backdropClass: 'modal-backdrop-ticket',

     // windowClass:'modal-view-Roadmap',
  
      size:'lg',

      centered: true,

      windowClass:'modal-size-vehicles',

      backdrop: 'static'
  
    });
    


   modal.componentInstance.actions ='new';

     modal.result.then(
        (data) => {
          if (data) {
            this.tableTypeVehicle.ajax.reload();
          }
          else{

          }
        
        },
        (reason) => {
          
          
        },
    ); 
  }
  

}

  modalEditService(data: any){
  
      
      if (!this._modalService.hasOpenModals()) {
    
        const modal = this._modalService.open( ModalAddVehicleTypeComponent, {
      
          backdropClass: 'modal-backdrop-ticket',
    
          windowClass:'modal-size-vehicles',
  
          centered: true,
      
          size:'lg',
  
          //windowClass: 'modal',
    
          backdrop: 'static'
      
        });
        
       modal.componentInstance.data = data;
    
       modal.componentInstance.actions ='new';
    
         modal.result.then(
            (data) => {
              if (data) {
                this.tableTypeVehicle.ajax.reload();
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

  
    // se clona el punto para evitar modificar la instancia del this de la tabla

    const clonePoint = _.cloneDeep(vehicle);

    let data = {
        message: clonePoint.isActive ? this._translate.instant('VEHICLES.DIABLES_TYPE')
            : this._translate.instant('VEHICLES.ACTIVATE_TYPE')
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

            this.editActiveVehicleType(id, element, vehicle);

            } else {
      
      
                $('#isActiveitem-' + id).prop('checked', vehicle.isActive);

                this.detectChange.detectChanges();
            }
        },
        (reason) => element = !element
    )
  }             
  editActiveVehicleType(vehicleId: number, element: any , vehicle: any) {
  
      let data ={
          isActive:element
      }
  
  
      this.stateEasyrouteService.UpdateVehiclesType(vehicleId, data).subscribe((data: any) => {
  
          this.loading.hideLoading();
  
          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
          );
         
          this.tableTypeVehicle.ajax.reload();
          
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
          message: this._translate.instant('VEHICLES.DELETE_TYPE')
              
      };
  
      const modal = this._modalService.open(ModalDeleteServiceComponent, {

          backdrop: 'static',

          backdropClass: 'customBackdrop',

          centered: true,

      });
  
      modal.componentInstance.message = data.message;

  
      modal.result.then(
          (resp: boolean) => {
              if (resp) {
  
              this.deleteSpesification(id);
  
              } else {
                 // element = !element;
                
              }
          },
          (reason) => {}
      )
  } 

  deleteSpesification(vehicleId: number,) {
     
  
      this.stateEasyrouteService.deleteVehiclesType(vehicleId).subscribe((data: any) => {
  
          this.loading.hideLoading();
  
          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
          );
         
          this.tableTypeVehicle.ajax.reload();
          
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
