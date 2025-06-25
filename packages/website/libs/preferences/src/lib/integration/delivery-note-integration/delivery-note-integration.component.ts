import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { OPA, OptimizationPreferences } from 'libs/backend/src/lib/types/preferences.type';
import { ModalDeleteComponent } from 'libs/shared/src/lib/components/modal-delete/modal-delete.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { PreferencesFacade } from 'libs/state-preferences/src/lib/+state/preferences.facade';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '@optimroute/env/environment';
declare var $: any;
@Component({
  selector: 'easyroute-delivery-note-integration',
  templateUrl: './delivery-note-integration.component.html',
  styleUrls: ['./delivery-note-integration.component.scss']
})
export class DeliveryNoteIntegrationComponent implements OnInit {

  optimizationPreferences$: Observable<OptimizationPreferences>;

  deliveryNoteIntegrationTable: any;

  showData: string ='list';

  showDatas: string ='list';

  integrationId: any;

  unsubscribe$ = new Subject<void>();

  toggleIntegration: boolean = false;

  constructor(
    private _modalService: NgbModal,
    private facade: PreferencesFacade,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChange: ChangeDetectorRef,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.optimizationPreferences$ = this.facade.optimizationPreferences$;

    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {

        console.log(op.activateDeliveryNoteIntegration, 'respuesta del servicios');
  
        if (op.activateDeliveryNoteIntegration) {

            this.toggleIntegration =  op.activateDeliveryNoteIntegration
            
                try {
                    this.detectChange.detectChanges();
                    this.cargar();
                   
                } catch (error) {
                    
                }
            
        }

  
      });

  }


  cargar() {

    if (this.deliveryNoteIntegrationTable) {
        this.deliveryNoteIntegrationTable.clear();
        this.deliveryNoteIntegrationTable.state.clear();
    }

    
    let url = environment.apiUrl + 'company_preference_integration_delivery_note_datatables';

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#routeIntegrationDeliveryNote';
    
    this.deliveryNoteIntegrationTable = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: false,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [50, 100],
        order: [0, 'asc'],
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
      
        {
            data: 'templateName',
            className: 'text-left',
            title: 'Plantilla',
            render: (data, type, row) => {
                let name = data;
                if (name.length > 30) {
                    name = name.substr(0, 29) + '...';
                }
                return (
                    '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
                    data +
                    '">' +
                    name +
                    '</span>'
                );
            },
        },
       
        {
          data: null,
          sortable: false,
          searchable: false,
          title: '',
          render: (data, type, row) => {
              return `<span class="editar point"> <img class="icons-datatable point" src="assets/icons/editSettings.svg"></span>`;
          },
      },
       
       
        {
            data: null,
            sortable: false,
            searchable: false,
            title: '',
            render: (data, type, row) => {
                return `<span class="trash point"> <img class="icons-datatable point" src="assets/icons/delete.svg"></span>`;
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
    this.editar('#routeIntegrationDeliveryNote tbody', this.deliveryNoteIntegrationTable);
    this.trash('#routeIntegrationDeliveryNote tbody', this.deliveryNoteIntegrationTable);
   
    
}

trash(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.trash', function() {
  
        let data = table.row($(this).parents('tr')).data();
  
       that.openModalDelete(data.id);
    });
  }

editar(tbody: any, table: any, that = this) {
    $(tbody).unbind();

    $(tbody).on('click', 'span.editar', function() {
        let data = table.row($(this).parents('tr')).data();

        that.showData ='details';

        that.integrationId = data.id;

        that.detectChange.detectChanges();

    });
}

addTemplate(){

  this.showData ='details';

  this.integrationId = 'new';

  this.detectChange.detectChanges();
}

getData(data: any){

    console.log(data, 'data');

    this.showData = data.showData;

    this.ngOnInit();

}

toggleOptimizationAction(
    key: OPA,
    value: OptimizationPreferences[OPA],
  ) {

    console.log(value, 'value');
   
    this.facade.toggleOptimization(key, value);

    //this.toggleIntegration = !this.toggleIntegration;

    
  }

  showToggleCategory( key: OPA,
    value: OptimizationPreferences[OPA],){
     
    this.toggleIntegration = !this.toggleIntegration;

    this.facade.toggleOptimization(key, value);
    
}

openModalDelete(id: any) {
  
    let data = {
        message: this._translate.instant('GENERAL.ARE_YOU_SURE_TO_DELETE_THE_SELECTED_INTEGRATION')
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

deleteSpesification(vehicleId: number) {

    this.backendService.delete('company_preference_integration_delivery_note/' + vehicleId).pipe(take(1)).subscribe( (data: any) => {

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
          );
         
          this.deliveryNoteIntegrationTable.ajax.reload();
       
    
      }, ( error ) => {
        
        this.loadingService.hideLoading();
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
        return;
      });
    
   
}


}
