import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { take } from 'rxjs/operators';
import { Zone } from '@optimroute/backend';
declare var $;

@Component({
  selector: 'easyroute-modal-integration-routes',
  templateUrl: './modal-integration-routes.component.html',
  styleUrls: ['./modal-integration-routes.component.scss']
})
export class ModalIntegrationRoutesComponent implements OnInit {
  data: any;
  table:any;
  selected: any = [];
  zones: Zone[];
  zoneSelected: string = '';
  constructor(
    public activateModal: NgbActiveModal,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    public authLocal: AuthLocalService,
    public zoneFacade: StateDeliveryZonesFacade
  ) { }

  ngOnInit() {
    this.selected = [];
    this.zoneFacade.loadAll();
    this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{
        if(loaded){
            this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
                this.zones = data.filter(x => x.isActive === true);
                this.initDataTable();
            });
        }
    })
  }

initDataTable(zone?: string) {
  let that = this;
  this.selected = [];
  let url = zone ? environment.apiUrl + 'delivery_zone_datatables?show=active&id='+ zone : environment.apiUrl + 'delivery_zone_datatables?show=active';
  let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
  let DataTableEspa = environment.DataTableEspaniol;
  this.table = $('#delivery-zones').DataTable({
    destroy: true,
    serverSide: true,
    processing: true,
    stateSave: true,
    cache: false,
    lengthMenu: [50, 100],
    scrollY: '35vh',
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
          $('#delivery-zones').DataTable().columns.adjust();
      }, 1);
    },
    dom:`
      <'row p-0'
        <'col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
        <'col-lg-6 col-12 label-search'fr>
      >
      <"top-button-hide"><'point table-responsive't>
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
              this.initDataTable();
          });
        },
      },
      rowCallback: (row, data) => {
        if ($.inArray(data.id, this.selected) !== -1) {
            $(row).addClass('selected');
        }
        $(row).addClass('point');
      },
      columns: [
        {
          data: 'id',
          title: this._translate.instant('DELIVERY_ZONES.ID'),
          render: (data, type, row) => {
              let id = data;
              if (id.length > 30) {
                  id = id.substr(0, 29) + '...';
              }
              return (
                  '<span data-toggle="tooltip" data-placement="top" title="' +
                  data +
                  '">' +
                  id +
                  '</span>'
              );
          },
          className: 'withdTo'
      },
      {
          data: 'name',
          title: this._translate.instant('DELIVERY_ZONES.NAME_'),
          render: (data, type, row) => {
              let name = data == null ? '' : data;
              if (name && name.length > 30) {
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
      },
      
      {
          data: 'color',
          title: this._translate.instant('DELIVERY_ZONES.COLOR'),
          render: (data, type, row) => {
              return (`
                <div class="row justify-content-center backgroundColorRow">
                  <div class="div-color-datatables" style="background-color: ${ data }"></div>
                </div>
              `);
          },
      },
      ]
  });
  let options = '';
      this.zones.forEach((zone)=>{

          let zoneName = zone.name;
  
          if (zoneName && zoneName.length > 20) {

            zoneName = zoneName.substr(0, 16) + '...';

          }

          if(this.zoneSelected && this.zoneSelected === zone.id){

              options += '<option title="' + zone.name + '" value="'+zone.id +'" selected>'+ zoneName  +'</option>'

          } else {

              options += '<option title="' + zone.name + '" value="'+zone.id +'">'+ zoneName +'</option>'

          }
          
      });
  $('.optimroute-integration-table').find('.label-search').html(`
    
    <div class="form-group row pl-0 pr-0 justify-content-center"> 
      <div class="col-md-12 col-12 p-0">
          <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
              
              <!-- select de búsqueda -->
                <select class="form-control-sm select-search-datatables select-filter
                    mt-1 mb-2 mt-md-0 mb-lg-0 mr-lg-4 pl-0 pr-0" style="height: 35px !important;"
                >
                    <option value="">Filtrar por zona</option>
                    `+ options +`
                </select>
    
              <div class="input-group input-search" style="width: initial !important;">
                  <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar clientes">
                  <span class="input-group-append">
                      <span class="input-group-text table-append">
                          <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                      </span>
                  </span>
              </div>
          </div>
      </div>
    </div>
  `);

  $('.select-search-datatables').on('change', function (){
    that.zoneSelected = this.value;
    that.selected = [];
    that.initDataTable(this.value);
});
  $('#search-modal').on( 'keyup', function () {
    $('#delivery-zones').DataTable().search( this.value ).draw();
  });

  $('.dataTables_filter').removeAttr("class");


  this.initEvents('#delivery-zones tbody', this.table);
}


initEvents(tbody: any, table: any, that = this) {
  $(tbody).unbind();
  this.select(tbody, table);
}
select(tbody: any, table: any, that = this) {
  $(tbody).on('click', 'tr', function() {
      let data = table.row($(this)).data();
      var index = $.inArray(data, that.selected);
      if (index === -1) {
          that.selected.push(data);
      } else {
          that.selected.splice(index, 1);
      }
      $(this).toggleClass('selected');
      that.detectChanges.detectChanges();
  });
}
closeModal(){
  this.activateModal.close(this.selected);

}

modalDismiss(){
  this.activateModal.close([]);
}



}
