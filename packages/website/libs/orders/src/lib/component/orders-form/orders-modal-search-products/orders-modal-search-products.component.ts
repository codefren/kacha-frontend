import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
declare var $;

@Component({
  selector: 'easyroute-orders-modal-search-products',
  templateUrl: './orders-modal-search-products.component.html',
  styleUrls: ['./orders-modal-search-products.component.scss']
})
export class OrdersModalSearchProductsComponent implements OnInit {

  table: any;
  selectedProduct: any[] = [];

  constructor( 
    public activeModal: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _toastService: ToastService,
    private detectChanges: ChangeDetectorRef,
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
      let table = '#productsPrice';
      this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        searching: true,
        scrollY: "50vh",
        scrollX: true,
        cache: false,
        stateSaveParams: function (settings, data) {
          data.search.search = "";
          $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
        },
        initComplete : function (settings, data) {
            settings.oClasses.sScrollBody="";
          $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
         
        },
        drawCallback: (settings, json) =>{
          setTimeout(() => {
              $('#productsPrice').DataTable().columns.adjust();
          }, 1);
        },
        lengthMenu: [50, 100],
        dom: `
            <'row'
                <'col-sm-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-12 label-search'f>
                >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><'table-responsive't>
            <'row reset'
              <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
              <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
            >
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
          { data: 'lotCode', title: this._translate.instant('PRODUCTS_GENERAL.PRODUCT_FORM.LOTE') },
          { data: 'quantity', title: this._translate.instant('PRODUCTS_GENERAL.PRODUCT_FORM.QUANTITY') },
          { data: 'measure.name', title: this._translate.instant('GENERAL.FORMATS') },
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
          { data: 'taxPercent', title:this._translate.instant('PRODUCTS_GENERAL.PRODUCT_FORM.TAX'),
            render:(data, type, row) =>{
                      
              if (data == null || data ==0) {
      
                return '<p class="text center" aria-hidden="true"> No disponible</p>';
      
              } else {
      
                let euro = data;
      
                return euro + " " + '<i class="fas fa-percent"></i>'
              }
            }
          },
          { data: 'equivalencePercent', title: this._translate.instant('PRODUCTS.EQUIVALENCE'),
            render: ( data, type, row ) => {
              
              if ( data === null || data === 0 ) {
                return (`<p class="text-center" aria-hidden="true">No disponible</p>`);
              }

              return (`${ data }<i class="fas fa-percent"></i>`);
            }
          },
          {
            data: null,
            sortable: false,
            searchable: false,
            selected: true,
            title: this._translate.instant('GENERAL.SELECT'),
            render: (data, type, row) => {
              let botones = '';
              botones +=
              `<div class="row reset justify-content-center editar">
                <div class="round">
                  <input type="checkbox" id="`+row.id+`"/>
                  <label for="`+row.id+`"></label>
                </div>
              </div>`;

              return botones;
            },
          },
        ],
      });
      
      $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
        `);

      $('#search').on( 'keyup', function () {
          $(table).DataTable().search( this.value ).draw();
      } );
      
      $('.dataTables_filter').removeAttr("class");


      this.editar('#productsPrice tbody', this.table);
    }
  
    editar(tbody: any, table: any, that = this) {

      $(tbody).on('click', 'div.editar', function() {

        let data = table.row($(this).parents('tr')).data();
        let n: string = '#' +  data.id
        
        $(tbody).on('click', n, function() {
          
            let index = that.selectedProduct.findIndex((x: any) => x.id === data.id);
            
            if ( this.checked && index === -1) {
              that.selectedProduct.push( data );

            } else if( !this.checked && index > -1 ){
              that.selectedProduct.splice( index, 1 );
            
            }

            // console.log( that.selectedProduct );
            
        });

      });
    }

    closeDialog() {
      this.activeModal.close();
    }

}
