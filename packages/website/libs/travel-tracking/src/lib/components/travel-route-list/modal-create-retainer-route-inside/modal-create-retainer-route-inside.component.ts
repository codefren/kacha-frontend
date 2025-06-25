import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
declare var $: any;
@Component({
  selector: 'easyroute-modal-create-retainer-route-inside',
  templateUrl: './modal-create-retainer-route-inside.component.html',
  styleUrls: ['./modal-create-retainer-route-inside.component.scss']
})
export class ModalCreateRetainerRouteInsideComponent implements OnInit {

  cssStyle: string = 'btn btn-primary mr-2';

  routeId:number;

  step = 3;

  selected = [];

  selectedVehicle = [];

  selectedPoints = [];

  table: any;

  zones: any = [];

  zoneSelected: any;

  idRoute: any;

  constructor(
    public dialogRef: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef
  ) { }

   ngOnInit() {
    
    this.step = 1;

    setTimeout(()=>{
     // this.initDataTable();
     this.initStep3();
    }, 1000);
    
        
  }

 
  initEventsPoints(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectPoints(tbody, table);
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
  }

  close(value: any) {
    this.dialogRef.close(value);
  }


  initStep3(){
    if (this.table) {
     
      this.table.state.clear();
  }
    let that = this;
    let url = environment.apiUrl + 'route_planning/route/'+ this.idRoute +'/pending_delivery_point';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.table = $('#delivery_points_inside').DataTable({
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
          $('#delivery_points_inside').DataTable().columns.adjust();
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
            this.initStep3();
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
    $('.optimroute-integration-table-inside').find('.label-search').html(`

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
      $('#delivery_points_inside').DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");


    this.initEventsPoints('#delivery_points_inside tbody', this.table);
  }

  back(){
    this.step-=1;
    if(this.step === 1){
      setTimeout(()=>{
        this.initStep3();
      }, 1000);
    } else if(this.step === 2) {
     
    } else {
      
    }
  }

  next(){
    this.step+=1;
    if(this.step === 1){
     /*  setTimeout(()=>{
        this.initDataTable();
      }, 1000); */
    } else if(this.step === 2) {
     
    } else {
      
    }
  }


  create(){

    let structure: any = {};

    structure.routeId = this.idRoute;

    structure.vehicles = [this.selectedVehicle];

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
