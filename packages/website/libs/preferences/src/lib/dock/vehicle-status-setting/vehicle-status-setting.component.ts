import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { take } from 'rxjs/operators';
import { ModalAddVehicleStatusComponent } from './modal-add-vehicle-status/modal-add-vehicle-status.component';
import { environment } from '@optimroute/env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService, ToastService } from '@optimroute/shared';
import { BackendService } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'easyroute-vehicle-status-setting',
  templateUrl: './vehicle-status-setting.component.html',
  styleUrls: ['./vehicle-status-setting.component.scss']
})
export class VehicleStatusSettingComponent implements OnInit {

  vehicleStatusList: any [] =[];

  tablaVehicleStatus: any;

  timeInterval: any;

  companyPreferencesLoadingDock: any = {
    activateAnswerAppForBadStatus: false,
    minTemperature: '-17',
    maxTemperature: '-14'
  };

  changedUpdate = false;

  constructor(
    private _modalService: NgbModal,
    private toastService: ToastService,
    private backendService: BackendService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private loading: LoadingService,
    public authLocal: AuthLocalService,
  ) { }

  ngOnInit() { 
    this.getCompanyPreferences();
  }

  getCompanyPreferences(){

    this.loading.showLoading();

    this.backendService.get('dock_company_preference').pipe(take(1)).subscribe((data)=>{

  
     this.companyPreferencesLoadingDock = data.data;

     if (this.companyPreferencesLoadingDock.activateAnswerAppForBadStatus) {
      try {
      
        this.detectChanges.detectChanges();
        this.cargar();
  
       } catch (error) {
        
       }
     }


      this.loading.hideLoading();

      this.detectChanges.detectChanges();
      

    }, error => {
      

      this.loading.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeGeneral(Event: any, id: any){
  
    this.loading.showLoading();
 
     let data ={
        [id]: Event
     };

     this.companyPreferencesLoadingDock.activateAnswerAppForBadStatus = Event;

  

     this.loading.hideLoading();

     this.backendService.post('dock_company_preference_manage', data).pipe(take(1)).subscribe((data)=>{
 
       this.companyPreferencesLoadingDock = data.data;

       this.loading.hideLoading();
 
       this.toastService.displayWebsiteRelatedToast(
         this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
       );

       try {
      
        this.detectChanges.detectChanges();
        this.cargar();
  
       } catch (error) {
        
       }
 
       this.detectChanges.detectChanges();

     }, error => {
       
       this.loading.hideLoading();
 
       this.toastService.displayHTTPErrorToast(error.status, error.error.error);
     });
   }

   createConcept(){


    if (this.changedUpdate) {

      this.changedUpdate = false;
   
      this.backendService.post( 'dock_company_preference_manage', this.companyPreferencesLoadingDock).pipe(take(1))

      .subscribe((data)=>{

        this.companyPreferencesLoadingDock = data.data;   
  
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        );

        this.detectChanges.detectChanges();
  
      //  this.load();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
    }

  }

  cargar() {
    
    let url = environment.apiUrl + 'dock_company_predefined_answer_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#vehicleStatus';

    this.tablaVehicleStatus = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [6],
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
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
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
              data: 'id',
              visible: false,
            },
            {
              data: 'isActive',
              title: this.translate.instant('LOADING_DOCK.SETTING.STATUS'),
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
              data: 'id',
              className: 'text-aling-table',
              title: this.translate.instant('LOADING_DOCK.SETTING.ORDER_APP'),
              render: (data, type, row) => {
                  if (data == null || data == 0) {
                      return '<span class="text center" aria-hidden="true"> No disponible</span>';
                  } else {
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          '"> #' +
                          data +
                          '</span>'
                      );
                  }
              },
            },
            {
              data: 'name',
              className: 'text-aling-table',
              title: this.translate.instant('LOADING_DOCK.SETTING.PREDEFINED_ANSWER'),
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

    this.initEvents('#vehicleStatus tbody', this.tablaVehicleStatus);
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
      
        that.modalEditVehicleStatus(data);
    });
  }

  trash(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.trash', function() {
  
        let data = table.row($(this).parents('tr')).data();
  
       that.deleteVehicleStatus(data);
    });
  }

  openModalActive(id: any, element: any, status: any) {

    const clonePoint = _.cloneDeep(status);

    let data = {
        message: clonePoint.isActive ? this.translate.instant('GENERAL.INACTIVE?')
            : this.translate.instant('GENERAL.ACTIVE?')
    };

   
    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
    });

    modal.componentInstance.data = data;

    modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');

    modal.componentInstance.message = data.message;

    modal.result.then(
        (resp: boolean) => {
            if (resp) {

            this.updateIsActive(id, element, status);

            } else {
              
                $('#isActiveitem-' + id).prop('checked', status.isActive);

                this.detectChanges.detectChanges();
            }
        },
        (reason) => element = !element
    ) 
  }  

  updateIsActive(Id: number, element: any , vehicleStatus: any) {
   
    this.backendService.put('dock_company_predefined_answer/'+Id,{isActive:element}).pipe(take(1)).subscribe((data)=>{
  
      this.tablaVehicleStatus.ajax.reload();
  
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );
  
      this.detectChanges.detectChanges();
  
    }, error => {
      
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
    });
  
  } 

  modalAddVehicleStatus(){
  
    const modal = this._modalService.open(ModalAddVehicleStatusComponent, {

      backdropClass: 'modal-backdrop-ticket',

      windowClass:'modal-view-Roadmap',

      size:'md',

      backdrop: 'static'

    });
    
    modal.componentInstance.actions ='new';

    modal.result.then(

      (data) => {
        
        if (data) {

          this.tablaVehicleStatus.ajax.reload();
        }
      },

      (reason) => {

      },
    ); 

  }

  modalEditVehicleStatus(data: any){
    
    const modal = this._modalService.open(ModalAddVehicleStatusComponent, {

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
            this.tablaVehicleStatus.ajax.reload();
        }
      },
      (reason) => {
      },
    );

  }

  deleteVehicleStatus(data:any){

    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {

      centered: true,

      backdrop: 'static'
    });


    modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
  
    modal.componentInstance.message = this.translate.instant('LOADING_DOCK.SETTING.MESSAGE_DELETE_VEHICLE_STATUS');

    modal.result.then((result) => {
  
      if (result) {
        this.deleteService(data);
      } 
    });
    
  }

  deleteService(send:any){

    this.backendService.delete('dock_company_predefined_answer/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

      );

      this.tablaVehicleStatus.ajax.reload();

      this.detectChanges.detectChanges();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

}
