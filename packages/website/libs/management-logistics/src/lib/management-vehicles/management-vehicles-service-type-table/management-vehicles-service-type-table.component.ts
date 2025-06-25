import { secondsToDayTimeAsString } from '@optimroute/shared';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
declare var $;
import * as _ from 'lodash';
import * as moment from 'moment';
declare function init_plugins();

@Component({
  selector: 'easyroute-management-vehicles-service-type-table',
  templateUrl: './management-vehicles-service-type-table.component.html',
  styleUrls: ['./management-vehicles-service-type-table.component.scss']
})
export class ManagementVehiclesServiceTypeTableComponent implements OnInit {

  change: string = 'servies-type';

  table: any;

  timeInterval: any;
  
  selected: any = [];

  constructor(
    private router: Router,
    public authLocal: AuthLocalService,
    private _translate: TranslateService,
    ) { }

  ngOnInit() {
    setTimeout(()=>{
        init_plugins();
    }, 1000)
    this.cargar();
  }

  cargar() {
    this.selected = [];

    let url = environment.apiUrl + 'company_vehicle_service_type_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#vehiclesService';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [[ 0, "desc" ]],
        scrollCollapse: true,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-lg-2 col-12 label-search'f>
            >
            <'row p-0 reset'
              <'offset-sm-6 offset-lg-6 offset-5'>
              <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
            >
            <"top-button-hide"><'table-responsive-lg't>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
       /*  headerCallback: ( thead, data, start, end, display ) => {               
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
        rowCallback: (row, data) => {
            if ($.inArray(data.id, this.selected) !== -1) {
                $(row).addClass('selected');
            }
        },
        columns: [
            {
                data: 'id',
                title: this._translate.instant('ID'),
            },
            {
                data: 'code',
                title: this._translate.instant('VEHICLES.SERVICE_TYPE.CODE'),
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
                data: 'name',
                title: this._translate.instant('VEHICLES.SERVICE_TYPE.SERVICE_NAME'),
                /* render: (data, type, row) => {
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
                }, */
                render: (data, type, row) => {
                    let name = data;
                    if (name !=null && name.length > 50) {
                        name = name.substr(0, 49) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        name +
                        '</span>'
                    );
                },
            },
            /* {
                data: 'isActive',
                title: this._translate.instant('VEHICLES.SERVICE_TYPE.ACTIVE'),
            }, */
            {
                data: 'isActive',
                title: this._translate.instant('VEHICLES.SERVICE_TYPE.ACTIVE'),
                render: ( data, type, row ) => {
                    if ( data ) {
                        return (`
                            <div class="row reset justify-content-center">
                                <div class="success-chip-new">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                            </div>
                        `);
                    }

                    return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip-new">
                                <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                  `);
                }
            },
            

            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                render: (data, type, row) => {
                    let botones = '<div class="text-center">';

                    botones += `
                        <span class="editar m-1">
                            <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                        </span>
                    `;

                    botones += '</div>';

                    return botones;
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

    this.initEvents('#vehiclesService tbody', this.table);
}
initEvents(tbody: any, table: any, that = this) {
  $(tbody).unbind();
  window.clearInterval(this.timeInterval);
  this.editar(tbody, table);
  this.trash(tbody, table);
}

editar(tbody: any, table: any, that = this) {
  $(tbody).on('click', 'span.editar', function() {
      let data = table.row($(this).parents('tr')).data();
      that.router.navigate([`/management-logistics/vehicles/servies-type/${data.id}`]);
      //that.editVehicles(data);
  });
}

trash(tbody: any, table: any, that = this) {
  $(tbody).on('click', 'span.trash', function() {
      let data = table.row($(this).parents('tr')).data();

     // that.deleteElement(data.id, data.name);
  });
}


  changePage(name: string){
       
    switch (name) {
        case 'vehicles':
            this.change = name;
            this.router.navigate(['/management-logistics/vehicles']);
            break;

            case 'servies-type':
                this.change = name;
                this.router.navigate(['/management-logistics/vehicles/servies-type']);
            break;
    
        default:
            break;
    }
}

}
