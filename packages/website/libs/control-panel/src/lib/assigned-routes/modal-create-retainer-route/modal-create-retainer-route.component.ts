import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
declare var $: any;

@Component({
  selector: 'easyroute-modal-create-retainer-route',
  templateUrl: './modal-create-retainer-route.component.html',
  styleUrls: ['./modal-create-retainer-route.component.scss']
})
export class ModalCreateRetainerRouteComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal,
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
      lengthMenu: [50, 100],
      scrollY: '35vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#delivery-zones').DataTable().columns.adjust();
        }, 1);
      },
      dom: `
        <'row p-0'
          <'col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
          <'col-lg-6 col-12 label-search'fr>
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
      ]
    })
    $('.optimroute-integration-table').find('.label-search').html(`
      
      <div class="form-group row pl-0 pr-0 justify-content-center"> 
        <div class="col-md-12 col-12 p-0">
            <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar zona">
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
      var index = $.inArray(data.id, that.selected);
      if (index === -1) {
        if (that.selected.length > 0) {
          $('#delivery-zones tbody tr.selected').toggleClass('selected');
          that.selected = [];
        }
        that.selected.push(data.id);
      } else {
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
          that.selectedVehicle = [];
        }
        that.selectedVehicle.push(data.id);
      } else {
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
      } else {
        that.selectedPoints.splice(index, 1);
      }
      $(this).toggleClass('selected');
      that.detectChanges.detectChanges();
    });
  }

  close(value: any) {
    this.dialogRef.close(value);
  }




  initStep2(){
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
      lengthMenu: [50, 100],
      scrollY: '35vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#vehicle').DataTable().columns.adjust();
        }, 1);
      },
      dom: `
        <'row p-0'
          <'col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
          <'col-lg-6 col-12 label-search'fr>
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
          sortable: false,
          title: this._translate.instant('GENERAL.NAME'),
        },
        {
          data: 'registration',
          sortable: false
        },
      ]
    })
    $('.optimroute-integration-table').find('.label-search').html(`
      
      <div class="form-group row pl-0 pr-0 justify-content-center"> 
        <div class="col-md-12 col-12 p-0">
            <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar zona">
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
      lengthMenu: [50, 100],
      scrollY: '35vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
        $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#delivery_points').DataTable().columns.adjust();
        }, 1);
      },
      dom: `
        <'row p-0'
          <'col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
          <'col-lg-6 col-12 label-search'fr>
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
          sortable: false,
          title: this._translate.instant('GENERAL.NAME'),
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
          title: this._translate.instant('GENERAL.SURNAME'),
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
      ]
    })
    $('.optimroute-integration-table').find('.label-search').html(`
      
      <div class="form-group row pl-0 pr-0 justify-content-center"> 
        <div class="col-md-12 col-12 p-0">
            <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar zona">
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
}
