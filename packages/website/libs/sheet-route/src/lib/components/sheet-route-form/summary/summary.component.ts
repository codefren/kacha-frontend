import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalViewReturnsComponent } from './modal-view-returns/modal-view-returns.component';
import { ModalViewObservationsComponent } from './modal-view-observations/modal-view-observations.component';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { ModalExtraBoxesComponent } from './modal-extra-boxes/modal-extra-boxes.component';
import { ModalIncidenciasComponent } from './modal-incidencias/modal-incidencias.component';
declare var $: any;

@Component({
  selector: 'easyroute-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {

  tableSummary: any;

  invoice: any;

  @Input() routePlanningRouteId: any;

  @Input() routeId: any;



  duringDelivery: any;

  showSummary: boolean = true;

  constructor(
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private backendService: BackendService,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef,
  ) { }

  ngOnInit() {
   // this.cargar();
  }

  ngOnChanges() {
   this.load();
  }
  async load(){

    this.loadingService.showLoading();

    await this.backendService

    .get('company_bill_list/route/' + this.routePlanningRouteId)

    .pipe(take(1),)
    .subscribe(
        (resp: any) => {

            

            this.invoice = resp;
          
            this.loadingService.hideLoading();

            this.getCount();
    
        },
        (error) => {

            this.loadingService.hideLoading();

            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }

  getCount(){

    this.showSummary = false;

    this.backendService
    .post('route_planning/route/data_during_delivery',{routeId: this.routePlanningRouteId})
    .pipe(
        take(1),
       
    )
    .subscribe(
        (resp: any) => {

          this.duringDelivery = resp.dataDuringDelivery;

          this.showSummary = true;

          this.cargar();

          this.detectChanges.detectChanges()
    
        },
        (error) => {

            this.showSummary = true;
            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }
  cargar() {
   
    let table = '#tableSummary';

    this.tableSummary = $(table).DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        data:this.invoice,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
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
       
        columns: [
            { data: 'code', title: this._translate.instant('SHEET_ROUTE.CODE') },
            {
                data: 'paymentDate',
                title: this._translate.instant('SHEET_ROUTE.DATE'),
                render: (data, type, row) => {
                    if (data) {
                        return moment(data).format('DD/MM/YYYY');
                    } else{
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    }
                    
                },
            },
            {
                data: 'total',
                title: this._translate.instant('SHEET_ROUTE.AMOUNT'),
                render: (data, type, row) => {
                  
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        this.formatEuro(data) +
                        '">' +
                        this.formatEuro(data) +
                        '</span>'
                    );
                },
            },
            {
                data: 'bill_payment_type.name',
                title: this._translate.instant('SHEET_ROUTE.PAYMENT_METHOD'),
                render: (data, type, row) => {
                  if (!data ) {
                      return '<p class="text center" aria-hidden="true"> No disponible</p>';
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
                data: 'user_charged_by',
                title: this._translate.instant('SHEET_ROUTE.AUTHORIZED_BY'),
                render: (data, type, row) => {

                    console.log(data, 'user_charged_by')

                    if (!data) {
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            data.name + ' ' + data.surname+
                            '</span>'
                        );
                    }
                  
                  
                },
            },
            {
              data: 'bill_payment_status',
              title: this._translate.instant('SHEET_ROUTE.CONDITION'),
               render: (data, type, row) => {
                    if (data.id == 2) {
                      
                       return '<buttom class="btn btn-primary btn-entregado">Cobrada</buttom>';

                    } else {
                        return (
                            '<buttom class="btn btn-primary btn-pendiente view">Entregado</buttom>'
                        );
                    }
                },
            },
           
            {
              data: null,
              sortable: false,
              searchable: false,
              render: (data, type, row) => {
                  return `<span class="view point"> <img class="icons-datatable point" src="assets/icons/cloudDonwnload.svg"></span>`;
              },
            },
            
           
        ],
        order: [1, 'asc'],
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
    
    this.view('#tableSummary tbody', this.tableSummary);
    
}

view(tbody: any, table: any, that = this) {   

  $(tbody).unbind();

  $(tbody).on('click', '.view', function() {
      let data = table.row($(this).parents('tr')).data();
      console.log(data.archiveUrl, 'descargar factura');
      //that.openModalVerifed();
      that.donloadPdf(data.archiveUrl);
    
  });
}

openModalReturns(){
  
  const modal = this._modalService.open( ModalViewReturnsComponent, {
    
    backdropClass: 'modal-backdrop-ticket',

    centered: false,

    windowClass:'modal-content-temp',

    size:'lg'

  });

  modal.componentInstance.routePlanningRouteId = this.routePlanningRouteId;

  modal.componentInstance.numberLength = this.duringDelivery.TotalDevolutions;
}

openObservations(){
  console.log('abrir modal de devoluciones');
  const modal = this._modalService.open( ModalViewObservationsComponent, {
    
    backdropClass: 'modal-backdrop-ticket',

    centered: false,

    windowClass:'modal-content-temp',

    size:'lg'

  });
}

openModalIncident(){
    const modal = this._modalService.open( ModalIncidenciasComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
    
        centered: false,
    
        windowClass:'modal-content-temp',
    
        size:'lg'
    
      });
    
      modal.componentInstance.routePlanningRouteId = this.routePlanningRouteId;
    
      modal.componentInstance.numberLength = this.duringDelivery.TotalIncidents;
}

openModalExtraBoxes(){
    const modal = this._modalService.open( ModalExtraBoxesComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
    
        centered: false,
    
        windowClass:'modal-content-temp',
    
        size:'lg'
    
      });
    
      modal.componentInstance.routePlanningRouteId = this.routePlanningRouteId;
    
      modal.componentInstance.numberLength = this.duringDelivery.TotalExtraBoxes;
}

donloadPdf(url:any){
    window.open(url, "_blank");
    //this.backendService.getPDF(url);
}
formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

}
}
