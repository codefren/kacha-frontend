import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment-timezone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalViewPdfBillsGeneralComponent } from 'libs/shared/src/lib/components/modal-view-pdf-bills-general/modal-view-pdf-bills-general.component';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';

declare var $: any;

@Component({
  selector: 'easyroute-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  @Input() dataDetail: any;

  billList: any []=[];

  dataShowList: any;

  detailBills: FormGroup;

  table: any;

  tableBill: any;
  products: any = [];
  deliveryNoteSelected: any;
  bill: any;
    deliveryNote: any;
  constructor(
    private fb: FormBuilder,
    private _modalService: NgbModal,
    private backend: BackendService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private loadingService: LoadingService,
    private detectChange: ChangeDetectorRef,
    public authLocal: AuthLocalService,
    private stateRoutePlanningService: StateRoutePlanningService
  ) { }

  ngOnInit() {
    this.getBillList();
  }

  getBillList(){
    this.loadingService.showLoading();

    this.backend.get(`company_bill_list/routeDeliveryPoint/${this.dataDetail.id}`).pipe( take(1) ).subscribe( (data: any) => {

  
      this.billList = data;

      if (this.billList. length > 0) {

        this.dataShowList =data[0];
        if(data[0] && data[0].routePlanningRouteDeliveryNoteId && this.dataShowList.routePlanningRouteDeliveryNoteId){
            this.cargar(data[0].routePlanningRouteDeliveryNoteId)
        }
        

      } else {

        this.dataShowList =null;
      }


      this.validaciones(this.dataShowList);

      this.detectChange.detectChanges();

      this.loadingService.hideLoading();

     

    }, (error)=>{
        this.loadingService.hideLoading();
        this._toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  validaciones(data: any) {

        let totals : any;

        if (data && data.total) {

          totals = data.total + '€';

        } else{

          totals: '';
        }


        this.detailBills = this.fb.group({
            countBills:[this.billList.length ? this.billList.length:''],
            invoice: [data && data.code ? data.code: ''],
            amount: [totals],
            PaymentMethod: [data && data.billPaymentTypeName ? data && data.billPaymentTypeName:''],
           
        });
    

    try {
      this.detectChange.detectChanges();
      
      this.cargarBillnoPayment();


    } catch (e) {

      this._toastService.displayHTTPErrorToast(1000, e.message);
      
    }

  }

  cargar(deliveryNoteId: number) {

    const url =  'route_planning/delivery_note_detail/' + deliveryNoteId;

    this.backend
        .get(url)
        .pipe(take(1))
        .subscribe((data) => {
            if (this.table) {
                this.table.clear();
            }

            this.products =  data.data.products
            console.log('aqui ve', data.data.bill);
            this.bill = data.data.bill;
            this.deliveryNote = data.data;
            this.detectChange.detectChanges();    

            let table = '#details_assigned';
            this.table = $(table).DataTable({
                destroy: true,
                stateSave: false,
                language: environment.DataTableEspaniol,
                data: this.products,
                ordering: false,
                lengthMenu: [20],
                dom: `
                    <"top-button-hide"><'point no-scroll-x table-responsive't>
                    <'row reset'
                    <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
                    >
                `,
                columns: [
                    {
                        data: 'codeProduct',
                    },
                    {
                        data: 'name',
                    },
                    {
                        data: 'quantity',
                    },
                    {
                        data: 'measure',
                        title: this._translate.instant('PRODUCTS.U_MEASURE'),
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
                        data: 'measureQuantity',
                        title: this._translate.instant('PRODUCTS.UD'),
                        render: (data, type, row) => {
                            if (data == null) {
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
                        data: 'price',
                        title: this._translate.instant('PRODUCTS.PRICE'),
                        render: (data, type, row) => {
                            return '<span>' + data + '€</span>';
                        },
                    },
                    {
                        data: 'delivered',
                        visible: true,
                        title: this._translate.instant('DELIVERY_POINTS.STATE'),
                        render: (data, type, row) => {
                            if (data) {
                                return (
                                    '<span>' +
                                    this._translate.instant(
                                        'DELIVERY_POINTS.DELIVERED',
                                    ) +
                                    '</span>'
                                );
                            } else {
                                return (
                                    '<span>' +
                                    this._translate.instant(
                                        'DELIVERY_POINTS.UNDELIVERED',
                                    ) +
                                    '</span>'
                                );
                            }
                        },
                    },
                ],
                buttons: [
                    {
                        extend: 'colvis',
                        text: this._translate.instant('GENERAL.SHOW/HIDE'),
                        columnText: function(dt, idx, title) {
                            return idx + 1 + ': ' + title;
                        },
                    },
                ],
            });
            $('easyroute-delivery-details').find('#details_filter').html(`
                <div class="row p-0 justify-content-sm-end justify-content-center">
                    <div class="input-group input-search" style="width: initial !important;">
                        <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                        <span class="input-group-append">
                            <span class="input-group-text table-append">
                                <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                            </span>
                        </span>
                    </div>
                </div>
            `);

            $('#search-modal').on('keyup', function() {
                $(table)
                    .DataTable()
                    .search(this.value)
                    .draw();
            });

            $('.dataTables_filter').removeAttr('class');
        });
  }

 
  saveNotMultiple(value: string){
    console.log('saveNotMultiple', this.deliveryNote);
    this.loadingService.showLoading();

    this.backend.put('route_planning/delivery_note_detail/'+this.deliveryNote.id, 
        {
            deliveryNoteOrderCode: value
        }).pipe( take(1) ).subscribe( (data: any) => {

      this.loadingService.hideLoading();

      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this._translate.instant('GENERAL.ACCEPT'),
      );

    }, (error)=>{
        this.loadingService.hideLoading();
        this._toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeDeliveryNoteBills(event: any){
    

    let changeBill =  this.billList.find (x => x.code == event);

    this.dataShowList = changeBill;

    this.cargar(changeBill.routePlanningRouteDeliveryNoteId);

    this.validaciones(changeBill);

  }

  cargarBillnoPayment() {

    let url = environment.apiUrl +
        'company_bill_authorization_dont_charge_datatables?routePlanningRouteDeliveryPointId=' +
        this.dataDetail.id;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let tableBill = '#listBill';

    this.tableBill = $(tableBill).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: false,
        cache: false,
        order: [0, 'desc'],
        lengthMenu: [10],

        stateSaveParams: function(settings, data) {
            data.search.search = '';
        },
        dom: `
            <"top-button-hide"><'vehicles table-responsive't>
            <'row reset'
                <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.SHOW/HIDE'),
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
                data: 'company_bill.code',
                title: this._translate.instant('PRODUCTS.CODE'),
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
              data: 'company_bill.billPaymentStatusId',
              visible: false,
              title: this._translate.instant('SHEET_ROUTE.CONDITION'),
               render: (data, type, row) => {
                    if (data == 2) {

                      return '<span class="text center" aria-hidden="true"> Cobrada </span>';

                    } else {

                      return '<span class="text center" aria-hidden="true"> No cobrada </span>';

                    }
                },
            },
            {
                data: 'user_driver',
                title: this._translate.instant('BILLS.DRIVER'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data.name +
                            '  ' +
                            data.surname +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'authorizingName',
                title: this._translate.instant('BILLS.AUTORIZED_BY'),
                render: (data, type, row) => {
                    let name = data;

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
                data: 'authorizingDate',
                title: this._translate.instant('BILLS.DATE'),
                render: (data, type, row) => {
                    return moment(data).format('DD/MM/YYYY');
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                render: (data, type, row) => {
                    return `<span class="downloadBill point"> <img class="icons-datatable point" src="assets/icons/External_Link.svg"></span>`;
                },
            },
        ],
    });
    this.downloadBill('#listBill tbody', this.tableBill);
  }

  downloadBill(tbody: any, table: any, that = this) {
      $(tbody).unbind();
  
      $(tbody).on('click', 'span.downloadBill', function() {
          let data = table.row($(this).parents('tr')).data();
          that.downloadElement(data);
      });
  }
  
  downloadElement(archivo: any): void {
      let link = document.createElement('a');
      document.body.appendChild(link); //required in FF, optional for Chrome
      link.target = '_blank';
      let fileName = 'pdf';
      link.download = fileName;
      link.href = archivo.company_bill.archiveUrl;
      link.click();
  }

  openPrint() {


    if(this.dataShowList.routePlanningRouteDeliveryNoteId && this.dataShowList.routePlanningRouteDeliveryNoteId > 0){

        return this.backend.getPDF(
            'route_planning/delivery_note/' +
              this.dataShowList.routePlanningRouteDeliveryNoteId,
          );

    } else {
        let url = this.dataShowList.archiveUrl;
    
        const modal = this._modalService.open( ModalViewPdfBillsGeneralComponent, {
          
          backdropClass: 'modal-backdrop-ticket',
      
          centered: true,
      
          windowClass:'modal-view-pdf',
      
          size:'lg'
      
        });
    
        modal.componentInstance.title = this._translate.instant('TRAVEL_TRACKING.DETAILS_BILLS.INVOICE_DETAILS');
    
        modal.componentInstance.url = url;
    }
    

}

downloadBills(archivo: any): void {
  
  let link = document.createElement('a');
  document.body.appendChild(link); //required in FF, optional for Chrome
  link.target = '_blank';
  let fileName = 'pdf';
  link.download = fileName;
  link.href = archivo;
  link.click();
  




  /* posible alternativa pero donde este el servidor tienes que tener la opcion de descargar activo */
  /* fetch(archivo, {
    method: 'GET'
}).then(resp => resp.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = "name"; // the filename you want
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }) */
    
 
}



}
