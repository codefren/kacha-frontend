import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
declare var $;

@Component({
  selector: 'easyroute-my-orders-modal-search-products',
  templateUrl: './my-orders-modal-search-products.component.html',
  styleUrls: ['./my-orders-modal-search-products.component.scss']
})
export class MyOrdersModalSearchProductsComponent implements OnInit {
  table: any;

  constructor(
    public activeModal: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _toastService: ToastService,
    private _translate: TranslateService) { }

    ngOnInit() {
      this.cargar();
    }
    ngOnDestroy() {
      this.table.destroy();
  }
    cargar() {
    
      let url = environment.apiUrl + 'company_product_price_datatables';
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      this.table = $('#productsPrice').DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        stateSave: false,
        searching: true,
        scrollY: "50vh",
        cache: false,
        lengthMenu: [50, 100],
        stateSaveParams: function (settings, data) {
          data.search.search = "";
      },
        dom: `
        <'row'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
            <'col-sm-6 col-12 label-search'fr>
        >
        <"top-button-hide"B><t><ip>
      `,
        buttons: [
              {
                  extend: 'colvis',
                  text: 'Mostrar/ocultar',
                  columnText: function(dt, idx, title) {
                      return idx + 1 + ': ' + title;
                  },
              },
          ],
          language: environment.DataTableEspaniol,
          ajax: {
              method: 'GET',
              url: url,
              data: function ( d ) {
                d.myKey = "myValue";
            },
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
  
              $('#products').html(html);
  
              $('#refrescar').click(() => {
                  this.cargar();
              });
            },
          },
          columns: [
            { data: 'id', title: this._translate.instant('PRODUCTS_GENERAL.CODE_PRODUCTS')},
            { data: 'company_product.name', title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.NAME') },
            { data: 'measure.name', title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.MEASURE') },
            { data: 'price', title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.PRICE'),
              render:(data, type, row) =>{
                if (data == null || data ==0) {
        
                  return '<p class="text center" aria-hidden="true"> No disponible</p>';
        
                } else {
        
                  let euro = data;
        
                  return euro + " " + '<i class="fas fa-euro-sign"></i>'
                }
              }  
            },
            { data: 'taxPercent', title:this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.TAX'),
              render:(data, type, row) =>{
                        
                if (data == null || data ==0) {
        
                  return '<p class="text center" aria-hidden="true"> No disponible</p>';
        
                } else {
        
                  let euro = data;
        
                  return euro + " " + '<p class="fas fa-percent"></i>'
                }
              }
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.SELECT'),
                render: (data, type, row) => {
                    let botones = '';
    
                    botones +=
                    '<button class="btn primary-btn editar"><i class="fas fa-check"></i></button>';
                    return botones;
                },
            },
        ],
      });
      this.editar('#productsPrice tbody', this.table);
    }
  
    editar(tbody: any, table: any, that = this) {
  
  
      $(tbody).on('click', 'button.editar', function() {
           
          let data = table.row($(this).parents('tr')).data();
            
            that.closemodal(data);
  
      });
    }
    
    closemodal(data? :any){
      this.activeModal.close(data);
    }

}
