import { dateToDDMMYYY, ModalViewPdfGeneralComponent } from '@optimroute/shared';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { downloadFile } from '../../../../../../shared/src/lib/util-functions/download-file';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'easyroute-delivery-notes',
  templateUrl: './delivery-notes.component.html',
  styleUrls: ['./delivery-notes.component.scss']
})

export class DeliveryNotesComponent implements OnInit ,OnChanges {

  tableDeliveryNotes: any;

  @Input() routeId: any;

  @Input() routePlanningRouteId: any;

  deliveryNote: any;

  cont: any;

  constructor(
    private backendService: BackendService,
    private _toastService: ToastService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private loadingService: LoadingService,
    private _modalService: NgbModal
  ) { }

  ngOnInit() {
 
  }

  ngOnChanges() {
    
    this.load();
  }

 async load(){

    this.loadingService.showLoading();

    await this.backendService
    .get('route_planning/delivery_note/route/' + this.routePlanningRouteId)
    .pipe(
        take(1),)
    .subscribe(
        (resp: any) => {

          
            this.cont = resp.data.length;

            this.deliveryNote = resp.data;
                
                this.cargar(resp.data);

                this.loadingService.hideLoading();

                this.detectChanges.detectChanges();
          
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

  cargar(data:any) {
   
   
    let tables = '#tableDeliveryNotes';
   
    this.tableDeliveryNotes = $(tables).DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        data:data,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
        dom: `
            <'row mt-5'
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
       /*  ajax: {
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
        }, */
        columns: [
            { data: 'deliveryPointId', title: this._translate.instant('SHEET_ROUTE.DELIVERY_NOTE') },
            {
                data: 'deliveryNoteCode',
                title: this._translate.instant('SHEET_ROUTE.ORDER_NUMBER'),
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
                data: 'dniDeliveryNote',
                title: this._translate.instant('SHEET_ROUTE.DNI_NIE'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
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
                data: 'nameDeliveryNote',
                title: this._translate.instant('SHEET_ROUTE.CLIENT'),
                render: (data, type, row) => {
                  if (data == null || data == 0) {
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
                data: 'totalPrice',
                title: this._translate.instant('SHEET_ROUTE.AMOUNT'),
                render: (data, type, row) => {

                    if (data == null ) {
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            this.decimal(data) +
                            '</span>'
                        );
                    }
                  
                    
                },
            },
            {
              data: 'routePlanningRouteDeliveryPoint.statusRouteDeliveryPointId',
              title: this._translate.instant('SHEET_ROUTE.CONDITION'),
               render: (data, type, row) => {
                    if (data === 3) {
                      
                        return (
                            '<buttom class="btn btn-primary btn-entregado">Entregado</buttom>'
                        );

                    } else {
                        return '<buttom class="btn btn-primary btn-pendiente">Pendiente</buttom>';
                       
                    }
                },
            },
           
            {
              data: null,
              sortable: false,
              searchable: false,
             // title: this._translate.instant('GENERAL.ACTIONS'),
              render: (data, type, row) => {
                  return `<span class="view point"> <img class="icons-datatable point" src="assets/icons/External_Link.svg"></span>`;
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
        $(tables)
            .DataTable()
            .search(this.value)
            .draw();
    });

    $('.dataTables_filter').removeAttr('class');
    
    this.view('#tableDeliveryNotes tbody', this.tableDeliveryNotes);
    
}

view(tbody: any, table: any, that = this) {   

  $(tbody).unbind();

  $(tbody).on('click', '.view', function() {
      let data = table.row($(this).parents('tr')).data();
      console.log(data, 'Abrir link externos');
      that.downloadPdf(data.id);
  });
}

downloadPdf(id:number) {
   /*  return this.backendService.getPDF(
        'route_planning/delivery_note/' + id,
    ); */

    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    modal.componentInstance.title = this._translate.instant('SHEET_ROUTE.DOWNLOAD_PDF_DELIVERY_NOTES');

    modal.componentInstance.url ='route_planning/delivery_note/' + id;

    //modal.componentInstance.routeId = this.routeId;
}

decimal(numb) {

    /* con esta funcion muestra el valor con formato de espaa */
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

    /* let nf = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
     return nf.format(numb);  */
}
}
