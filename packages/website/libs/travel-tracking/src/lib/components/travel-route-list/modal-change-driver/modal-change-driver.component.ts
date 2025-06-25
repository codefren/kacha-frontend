import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { StateRoutePlanningService } from '../../../../../../state-route-planning/src/lib/state-route-planning.service';
declare var $: any;
@Component({
  selector: 'easyroute-modal-change-driver',
  templateUrl: './modal-change-driver.component.html',
  styleUrls: ['./modal-change-driver.component.scss']
})
export class ModalChangeDriverComponent implements OnInit {

  table: any;

  selectedVehicle = [];

  zoneSelected: any;

  data: any;

  idUserSelected:number;



  constructor(
    public dialogRef: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private routingPlanning: StateRoutePlanningService,
  ) { }

  ngOnInit() {
    this.initStep2();
  }
  initStep2(){
    if (this.table) {
     
      this.table.state.clear();
  }

    let that = this;
    let url = environment.apiUrl + 'drivers_datatables?';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.table = $('#vehicle').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [5, 100],
      stateSaveParams: function (settings, data) {
        data.search.search = "";
       
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#vehicle').DataTable().columns.adjust();
        }, 1);
      },
   
      dom: `
        <'row p-0'
          <'col-lg-12 col-12 label-search pr-xl-2 pl-xl-2'fr>
        >
        <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
        >
        <"top-button-hide"><'point table-responsive't>
        <'row reset'
          <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
        >
      `,      
      buttons: [
        {
          extend: 'colvis',
          text: 'Mostrar/ocultar',
          columnText: function (dt, idx, title) {
            return idx + 1 + ': ' + title;
          },
        },
      ],
      language: DataTableEspa,
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

          $('#clients_processing').html(html);

          $('#refrescar').click(() => {
            this.initStep2();
          });
        },
      },
      rowCallback: (row, data) => {

        if ($.inArray(data.id, this.selectedVehicle) !== -1) {

          $(row).addClass('selected');

          setTimeout(()=>{

            $('#vh-' + data.id).prop('checked', true);

          }, 900);

        }

        $(row).addClass('point');

      },

      columns: [
        {
          data: 'id',
          sortable: false,
          searchable: false,
          buttons: false,
          render: (data, type, row) => {
            
            return (`
                <div class="row justify-content-center backgroundColorRow">
                  <div class="round round-little text-center">
                    <input type="checkbox"  id="vh-${data}"/>
                    <label></label>
                  </div>
                </div>
            `);
        }
        },
        {
          data: 'id',
          sortable: false,
          buttons: false,
          title: this._translate.instant('DELIVERY_ZONES.ID'),
          render: (data, type, row) => {
            let id = data;
            if (id.length > 30) {
              id = id.substr(0, 29) + '...';
            }
            return (
              '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + '#'+ id +'</span>'
            );
          },
          className: 'text-left',
        },
        {
          data: 'name',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('GENERAL.NAME'),
          render: (data, type, row) => {
            
            return (
              '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + data + ' ' + row.surname +'</span>'
            );
          },
        },
        
        {
          data: 'nationalId',
          sortable: false,
          className: 'text-left',
        },
      ]
    })
    $('.optimroute-integration-table').find('.label-search').html(`
      
        <div class="input-group  mr-xl-3 mr-3 mt-2 mb-2">
    
            <input id="search-modal" type="text" class="form-control search-general
                    pull-right input-personalize-datatable-travel input-travel-search" placeholder="Buscar" style="max-width: 100%; font-size: 15px !important;">
            <span class="input-group-append input-group-appenda">
                <span class="input-group-text input-group-text-general-travel table-append">
                    <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                </span>
            </span>
        </div>
    `);

    $('.select-search-datatables').on('change', function () {
      that.zoneSelected = this.value;
      that.selectedVehicle = [];
    });
    $('#search-modal').on('keyup', function () {
      $('#vehicle').DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");


    this.initEventsVehicle('#vehicle tbody', this.table);
  }

  initEventsVehicle(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectVehicle(tbody, table);
  }

  selectVehicle(tbody: any, table: any, that = this){

    $(tbody).on('click', 'tr', function () {

      let data = table.row($(this)).data();

      var index = $.inArray(data.id, that.selectedVehicle);

      if (index === -1) {

        if (that.selectedVehicle.length > 0) {

          $('#vehicle tbody tr.selected').toggleClass('selected');

          $('#vh-' + that.selectedVehicle[0]).prop('checked', false);

          that.selectedVehicle = [];
        }

        $('#vh-' + data.id).prop('checked', true);

        that.selectedVehicle.push(data.id);

        that.idUserSelected = data.id;

      } else {

        $('#vh-' + data.id).prop('checked', false);

        that.selectedVehicle.splice(index, 1);

        that.idUserSelected = undefined;

      }

      $(this).toggleClass('selected');

      that.detectChanges.detectChanges();

    });
  }

  close(value: any) {
    this.dialogRef.close(value);
  }

  addSelection() {
   
    this.routingPlanning.changeDrivers(this.data.RouteId, this.idUserSelected).subscribe((data)=>{

      this.dialogRef.close(data);
    });

  }

}
