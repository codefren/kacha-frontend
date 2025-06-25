import { Component, OnInit } from '@angular/core';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'easyroute-modal-view-returns',
  templateUrl: './modal-view-returns.component.html',
  styleUrls: ['./modal-view-returns.component.scss']
})
export class ModalViewReturnsComponent implements OnInit {

  tableReturns: any;

  routePlanningRouteId: any;

  numberLength: any;
  constructor(
    private authLocal: AuthLocalService,
    private Router: Router,
    private _translate: TranslateService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
   
    let url = environment.apiUrl + 'route_sheet_route_devolution/route/'+ this.routePlanningRouteId;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#returns';

    this.tableReturns = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
        dom: `
            <'row mt-1'
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
                data: 'client', 
                
                title: this._translate.instant('SHEET_ROUTE.CLIENT'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        name +
                        '</span>'
                    );
                },
             }
                ,
            {
                data: 'nameProduct',
                title: this._translate.instant('SHEET_ROUTE.PRODUCT'),
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
                data: 'quantityProduct',
                title: this._translate.instant('SHEET_ROUTE.QUANTITY'),
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
                data: null,
                sortable: false,
                searchable: false,
               // title: this._translate.instant('GENERAL.ACTIONS'),
                render: (data, type, row) => {
                    return `<span class="view point"> <img class="icons-datatable point" src="assets/icons/External_Link.svg"></span>`;
                },
              }
           
            
           
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
    this.view('#returns tbody', this.tableReturns);
    
  }

  view(tbody: any, table: any, that = this) {   

    $(tbody).unbind();

    $(tbody).on('click', '.view', function() {
        
        let data = table.row($(this).parents('tr')).data();
    
        that.Router.navigate([`/control-panel/assigned//${data.routePlanningRouteDeliveryPointId}`]);

        that.activeModal.close(true);
    
    });
  }


  donwload(){
      console.log('abrir descargar ticket');
  }
  
  downloadPdf(){
      console.log('descargar como pdf');
  }

}
