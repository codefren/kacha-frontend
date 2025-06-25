import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
declare var $: any;
@Component({
  selector: 'easyroute-modal-create-retainer-route',
  templateUrl: './modal-create-retainer-route.component.html',
  styleUrls: ['./modal-create-retainer-route.component.scss']
})
export class ModalCreateRetainerRouteComponent implements OnInit {

  cssStyle: string = 'btn btn-primary mr-2';

  constructor(
    public dialogRef: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef) { }

  step = 1;
  selected = [];
  selectedVehicle = [];
  selectedPoints = [];
  table: any;
  zones: any = [];
  zoneSelected: any;

  ngOnInit() {
    
    this.step = 1;

    setTimeout(()=>{
      this.initDataTable();
    }, 1000);
    
        
  }

  initDataTable() {

    if (this.table) {
     
      this.table.state.clear();
    }
    
    let that = this;
    let url = environment.apiUrl + 'delivery_zone_datatables?show=active';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.table = $('#delivery-zones').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [5, 100],
     // scrollY: '35vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
       
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#delivery-zones').DataTable().columns.adjust();
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
            this.initDataTable();
          });
        },
      },
      rowCallback: (row, data) => {
       
        if ($.inArray(data.id, this.selected) !== -1) {
         
          $(row).addClass('selected');

          setTimeout(()=>{
            $('#ck-' + data.id.replace(' ', '-')).prop('checked', true);
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
            
            let id = data.replace(' ', '-');

            return (`
                <div class="row justify-content-center backgroundColorRow">
                  <div class="round round-little text-center">
                    <input type="checkbox"  id="ck-${id}"/>
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
              '<span data-toggle="tooltip" data-placement="top" title="' + data +'">'+'#' + id +'</span>'
            );
          },
          className: 'text-left'
        },
        {
          data: 'name',
          sortable: false,
          
          buttons: false,
          className: 'text-left',
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
          sortable: false,
          buttons: false,
          //className: 'text-left',
          title: this._translate.instant('DELIVERY_ZONES.COLOR'),
          render: (data, type, row) => {
            return `<div style="background-color:${data};height:25px;width:7rem;border-radius: 5px;opacity: 0.8; margin: 0 auto;"></div>`;
        },
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
    $('#search-modal').on('keyup', function () {
      $('#delivery-zones').DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");


    this.initEvents('#delivery-zones tbody', this.table);
  }


  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.select(tbody, table);
  }

  initEventsVehicle(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectVehicle(tbody, table);
  }
  initEventsPoints(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectPoints(tbody, table);
  }
  select(tbody: any, table: any, that = this) {

    
    $(tbody).on('click', 'tr', function () {

      let data = table.row($(this)).data();

      let id = data.id.replace(' ', '-');

      var index = $.inArray(data.id, that.selected);

      if (index === -1) {


        if (that.selected.length > 0) {

          $('#delivery-zones tbody tr.selected').toggleClass('selected');


          $('#ck-' + that.selected[0].replace(' ', '-')).prop('checked', false);

          that.selected = [];
        }

        $('#ck-' + id).prop('checked', true);

        that.selected.push(data.id);

      } else {

        $('#ck-' + id).prop('checked', false);

        that.selected.splice(index, 1);

      }

      $(this).toggleClass('selected');

      that.detectChanges.detectChanges();

    });
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

      } else {

        $('#vh-' + data.id).prop('checked', false);

        that.selectedVehicle.splice(index, 1);

      }

      $(this).toggleClass('selected');

      that.detectChanges.detectChanges();

    });
  }

  selectPoints(tbody: any, table: any, that = this){

    $(tbody).on('click', 'tr', function () {

      let data = table.row($(this)).data();

      var index = that.selectedPoints.findIndex(x => x.id == data.id);

      if (index === -1) {

        that.selectedPoints.push(data);

        $('#dp-' + data.id).prop('checked', true);
          

      } else {

        let remove = that.selectedPoints.find(x => x.id == data.id);

        $('#dp-' + remove.id).prop('checked', false);

        that.selectedPoints.splice(index, 1);
      }

      $(this).toggleClass('selected');

      that.detectChanges.detectChanges();

    });

    console.log(that.selectedPoints)
  }

  close(value: any) {
    this.dialogRef.close(value);
  }




  initStep2(){
    if (this.table) {
     
      this.table.state.clear();
  }

    let that = this;
    let url = environment.apiUrl + 'vehicle_datatables?isActive=true';
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
            this.initDataTable();
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
              '<span data-toggle="tooltip" data-placement="top" title="' +
              data +
              '">' +
              id +
              '</span>'
            );
          },
          className: 'text-left',
        },
        {
          data: 'driver',
          title: this._translate.instant('VEHICLES.DRIVER'),
          render: (data, type, row) => {
            let id = data;
            if (id.length > 30) {
              id = id.substr(0, 29) + '...';
            }
            return (
              '<span data-toggle="tooltip" data-placement="top" title="' +
              data + 
              '">' +
              data +
              '</span>'
            );
          },
          className: 'text-left',
        },
        {
          data: 'name',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('GENERAL.NAME'),
        },
        {
          data: 'registration',
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

  initStep3(){
    if (this.table) {
     
      this.table.state.clear();
  }
    let that = this;
    let url = environment.apiUrl + 'delivery_point_datatables?showActive=true';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.table = $('#delivery_points').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [5, 100],
     // scrollY: '35vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
       
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
       
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#delivery_points').DataTable().columns.adjust();
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
            this.initDataTable();
          });
        },
      },
      rowCallback: (row, data) => {

        if ( this.selectedPoints.find(x => x.id === data.id )) {
          $(row).addClass('selected');
          setTimeout(()=>{
            $('#dp-' + data.id).prop('checked', true);
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
                    <input type="checkbox"  id="dp-${data}"/>
                    <label></label>
                  </div>
                </div>
            `);
        }
        },
        {
          data: 'id',
          sortable: false,
          title: this._translate.instant('TRAVEL_TRACKING.CODE'),
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
          className: 'text-left',
        },
        {
          data: 'name',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('TRAVEL_TRACKING.CLIENT_'),
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
        },
        {
          data: 'address',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('TRAVEL_TRACKING.ADDRESS'),
          render: (data, type, row) => {
            let id = data;
            if (id.length > 29) {
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
      $('#delivery_points').DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");


    this.initEventsPoints('#delivery_points tbody', this.table);
  }

  back(){
    this.step-=1;
    if(this.step === 1){
      setTimeout(()=>{
        this.initDataTable();
      }, 1000);
    } else if(this.step === 2) {
      setTimeout(()=>{
        this.initStep2();
      }, 1000);
    } else {
      setTimeout(()=>{
        this.initStep3();
      }, 1000);
    }
  }

  next(){
    this.step+=1;
    if(this.step === 1){
      setTimeout(()=>{
        this.initDataTable();
      }, 1000);
    } else if(this.step === 2) {
      setTimeout(()=>{
        this.initStep2();
      }, 1000);
    } else {
      setTimeout(()=>{
        this.initStep3();
      }, 1000);
    }
  }


  create(){
    let structure: any = {};
    structure.deliveryZones = this.selected;
    structure.vehicles = this.selectedVehicle;
    structure.deliveryPoints = this.selectedPoints.map((data)=>{
      return {
        id: data.id,
        name: data.name
      }
    });
    this.close([true, structure]);
  }

  showAddres(data: any){

    let show : any;

    if (data.length > 29) {
      show = data.substr(0, 29) + '...';
    }

    return show;

  }

}
