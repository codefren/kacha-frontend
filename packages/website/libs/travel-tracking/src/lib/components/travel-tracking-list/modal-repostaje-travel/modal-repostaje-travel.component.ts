import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
declare var $;

@Component({
  selector: 'easyroute-modal-repostaje-travel',
  templateUrl: './modal-repostaje-travel.component.html',
  styleUrls: ['./modal-repostaje-travel.component.scss']
})
export class ModalRepostajeTravelComponent implements OnInit {

  dateDeliveryStart:any;

  tableRepostaje: any;

  timeInterval: any;

  constructor(
    private router: Router,
    public dialogRef: NgbActiveModal,
    public authLocal: AuthLocalService,
    private _translate: TranslateService,
  ) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {

    let url = environment.apiUrl + 'refueling_list_travel?dateDeliveryStart='+this.dateDeliveryStart;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#repostajeTravel';

    this.tableRepostaje = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [6],
        order: [[ 1, "asc" ]],
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
        columns: [
            {
                data: 'vehicle.registration',
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
              data: 'driver',
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
              data: 'import',
              render: (data, type, row) => {
                  
                  return (
                      '<span data-toggle="tooltip" data-placement="top" title="' +
                      data +
                      '"> ' + this.formatEuro(data) + ' </span>'
                  );
              },
            },           
            {
              data: 'liter',
              render: (data, type, row) => {
                  
                  return (
                      '<span data-toggle="tooltip" data-placement="top" title="' +
                      data +
                      '"> ' + this.formatEuroLtr(data) + ' </span>'
                  );
              },
            },
            {
              data: 'urlImage',
              render: (data, type, row) => {

                if (data) {
                    return '<img class="point img-refueling" src="assets/icons/attachedTrue.svg">';
                } else {
                    return '<img class="point img-refueling" src="assets/icons/attachedFalse.svg">';
                }

            },
            },        
            {
                data: null,
                sortable: false,
                searchable: false,
                render: (data, type, row) => {
                    let botones1 = '<div class="text-center">';

                    botones1 += `
                        <span class="trash m-1 editar">
                            <img class="icons-datatable point img-refueling-details" title="Eliminar" src="assets/icons/External_Link.svg">
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

    this.initEvents('#repostajeTravel tbody', this.tableRepostaje);
  }
  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.editar(tbody, table);
  }
  
  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.editar', function() {
        
        let data = table.row($(this).parents('tr')).data();

        that.router.navigate(['management-logistics/vehicles/analysis/' + data.vehicleId]);

        that.dialogRef.close(false);

    });
  }
  
  close(value: any) {
    this.dialogRef.close(value);
  }

  formatEuroLtr(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity) ;
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
