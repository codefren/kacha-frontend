import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { MeasureInterface } from '@optimroute/backend';
declare var $: any;

@Component({
  selector: 'easyroute-products-modal-measure',
  templateUrl: './products-modal-measure.component.html',
  styleUrls: ['./products-modal-measure.component.scss']
})
export class ProductsModalMeasureComponent implements OnInit {

  table: any;

  measure: any;

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
  
    let url = environment.apiUrl + 'measure_general_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    this.table = $('#measure').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      scrollY: "30vh",
      stateSaveParams: function (settings, data) {
        data.search.search = "";
       /*  $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll'); */
      },
      initComplete : function (settings, data) {
        settings.oClasses.sScrollBody="";
        /* $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll'); */
      },
      lengthMenu: [ 30, 50, 100],
      dom: `
        <'row'
            <'col-sm-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
            <'col-sm-4 col-12 label-search'fr>
        >
        <'point table-responsive't>
        <'row reset'
          <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
          <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
        >
     `,
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
        { data: 'id', title: 'Id' },
        { 
          data: 'name',
          title: this._translate.instant('GENERAL.NAME') 
        },
        {
          data: 'activateEquivalentAmount',
          render: (data, type, row) =>{
            return data? 'Si' : 'No'
          }
        },
        {
          data: 'equivalentAmount'
        },
        {
            data: null,
            sortable: false,
            searchable: false,
            title: this._translate.instant('GENERAL.SELECT'),
            render: (data, type, row) => {
                let botones = '';
  
                botones +=
                `
                <div class="row justify-content-center backgroundColorRow">
                  <div class="round round-little">
                    <input class="editar" type="radio" name="checkAddMeasure" id="row_format_${ row.id }"/>
                    <label for="row_format_${ row.id }"></label>
                  </div>
                </div>
                `;
                return botones;
                
            },
        },
      ],
      order: [1, "asc"]
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
      $('#measure').DataTable().search( this.value ).draw();
    });
    setTimeout(() => {
        $('#measure').DataTable().columns.adjust().draw();
    }, 1)
  
    $('.dataTables_filter').removeAttr("class");

    this.editar('#measure tbody', this.table);
  }
  
  editar(tbody: any, table: any, that = this) {
  
    $(tbody).on('click', '.editar', function() {
      let data = table.row($(this).parents('tr')).data();
      that.measure = data;
    });
  }

  closeDialog( data?: any ) {
    this.activeModal.close( data );
  }

}

