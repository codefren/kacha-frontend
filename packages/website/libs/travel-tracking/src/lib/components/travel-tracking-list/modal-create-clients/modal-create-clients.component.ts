import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { Zone } from '../../../../../../backend/src/lib/types/delivery-zones.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { RoutePlanningFacade } from '../../../../../../state-route-planning/src/lib/+state/route-planning.facade';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { environment } from '@optimroute/env/environment';
import { secondsToDayTimeAsString } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';

declare var $;
@Component({
  selector: 'easyroute-modal-create-clients',
  templateUrl: './modal-create-clients.component.html',
  styleUrls: ['./modal-create-clients.component.scss']
})
export class ModalCreateClientsComponent implements OnInit {

  isEvaluted: boolean = false;
  selectAll: boolean = false;
  selected: any = [];
  routePlanningDeliveryZoneId: number;
  tableClients: any;
  zones: Zone[];
  zoneSelected: string = '';
  tabOption: number = 1;
  next: number = 1;
  quantity: number = 0;
  description: string = '';
  showRoutes: boolean = true;
  constructor(
      public activeModal: NgbActiveModal,
      private authLocal: AuthLocalService,
      private _translate: TranslateService,
      private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
      this.description = '';
      this.cargar();
  }

  closeDialog(value: any) {

     this.activeModal.close(value);
  }

  submit(selecteds) {
    const data = {
        points: selecteds,
        route: this.zoneSelected
    }
    this.closeDialog(data);
  }

  changeOption(value) {

      this.next = 1;

      this.cargar();

  }

  cargar(zone?: string) {
      if (this.tableClients) {
          this.tableClients.clear();
          this.tableClients.state.clear();
      }
      this.detectChanges.detectChanges();
      let that = this;
      this.selected = [];

      let url = zone ? environment.apiUrl + 'delivery_point_datatables?deliveryZoneId=' + zone : environment.apiUrl + 'delivery_point_datatables';
      url += zone ? `&showActive=true` : `?showActive=true`;

      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = "#clients";

      this.tableClients = $(table).DataTable({
          paging: true,
          destroy: true,
          serverSide: true,
          processing: false,
          stateSave: true,
          cache: false,
          //scrollY: '30vh',
          stateSaveParams: function (settings, data) {
              data.search.search = "";
             // $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
          },
          initComplete: function (settings, data) {
              settings.oClasses.sScrollBody = "";
             /*  console.log($('#clients').DataTable());
              $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll'); */
          },
          drawCallback: (settings, json) => {
              setTimeout(() => {
                  $('#clients').DataTable().columns.adjust();
              }, 1);
          },
          lengthMenu: [5, 100],
          dom: `
              <'row p-0'
                  <'col-lg-8 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'>
                  <'col-lg-4 col-12 label-search'fr>
              >
              <"top-button-hide"><'point no-scroll-x table-responsive't>
              <'row reset'
               
                <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center  align-items-md-center'p>
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
                  let html = '<div class="container" style="padding: 10px;">';
                  html +=
                      '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                  html +=
                      '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                  html += '</div>';

                  $('#clients_processing').html(html);

                  $('#refrescar').click(() => {
                      this.cargar();
                  });
              },
          },
          rowCallback: (row, data) => {
            console.log('aqui cuando cambio');
              if ($.inArray(data.id, this.selected.map(x => x.id)) !== -1) {
                  $(row).addClass('selected');
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
                          <input type="checkbox" class="isActive" id="ck-${data.replace('(', '').replace(')', '')}"  />
                          <label></label>
                        </div>
                      </div>
                    `);
                  }
              },
              {
                  data: 'id',
                  sortable: false,
                  title: this._translate.instant('TRAVEL_TRACKING.ORDER'),
                  className: 'widthTd',
              },
              {
                  data: 'name',
                  sortable: false,
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
                  title: this._translate.instant('DELIVERY_POINTS.ADDRESS'),
                  render: (data, type, row) => {
                      let id = data;
                      if (id.length > 10) {
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
                  data: 'deliveryWindowStart',
                  sortable: false,
                  title: this._translate.instant('DELIVERY_POINTS.START'),
                  render: (data, type, row) => {
                      if (data != null) {
                          return '<span data-toggle="tooltip" data-placement="top" title="' +
                              data
                              ? secondsToDayTimeAsString(data)
                              : '00:00' + '">' + data
                                  ? secondsToDayTimeAsString(data)
                                  : '00:00' + '</span>';
                      } else {
                          return (
                              '<span data-toggle="tooltip" data-placement="top" title="' +
                              'Libre' +
                              '">' +
                              'Libre' +
                              '</span>'
                          );
                      }
                  },
              },
              {
                  data: 'deliveryWindowEnd',
                  sortable: false,
                  title: this._translate.instant('DELIVERY_POINTS.END'),
                  render: (data, type, row) => {
                      if (data != null) {
                          return '<span data-toggle="tooltip" data-placement="top" title="' +
                              data
                              ? secondsToDayTimeAsString(data)
                              : '00:00' + '">' + data
                                  ? secondsToDayTimeAsString(data)
                                  : '00:00' + '</span>';
                      } else {
                          return (
                              '<span data-toggle="tooltip" data-placement="top" title="' +
                              'Libre' +
                              '">' +
                              'Libre' +
                              '</span>'
                          );
                      }
                  },
              }
              
          ],
      });

      console.log(this.zones);
      let options = '';
      this.zones.forEach((zone) => {
          if (this.zoneSelected && this.zoneSelected === zone.id) {
              options += '<option value="' + zone.id + '" selected>' + zone.name + '</option>'
          } else {
              options += '<option value="' + zone.id + '">' + zone.name + '</option>'
          }

      });
      $('.optimroute-delivery-points').find('.label-search').html(`
  
          <div class="form-group row pl-0 pr-0 justify-content-center"> 

              <div class="col-md-12 col-12 p-0">

                  <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                      
                    <div class="input-group  mr-xl-3 mr-3" style="width: 100% !important;">
  
                        <input id="search-modal" type="text" class="form-control search-general
                                pull-right input-personalize-datatable-travel input-travel-search" placeholder="Buscar" style="max-width: 100%; font-size: 15px !important;">
                        <span class="input-group-append input-group-appenda">
                            <span class="input-group-text input-group-text-general-travel table-append">
                                <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                            </span>
                        </span>
                    </div>

                  </div>
              </div>
          </div>
      `);

      /* $('.select-search-datatables').on('change', function () {
          that.zoneSelected = this.value;
          that.selected = [];
          that.cargar(this.value);
      }); */
      $('#search-modal').on('keyup', function () {
          $('#clients').DataTable().search(this.value).draw();
      });

      $('.dataTables_filter').removeAttr("class");




      this.initEvents('#clients tbody', this.tableClients);
  }

  initEvents(tbody: any, table: any, that = this) {
      $(tbody).unbind();
      this.select(tbody, table);
  }

  nextOption() {
      this.next = 2;
  }


  editSelecteds() {
      this.next = 1;
      this.cargar();
  }

  select(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'tr', function () {


          if (that.tabOption === 1) {
              that.selectAll = true;
              let data = table.row($(this)).data();
              that.selectAll = true;
              var index = that.selected.findIndex(x => +x.id === +data.id);

              if (index === -1) {
                  that.selected.push({
                      id: data.id,
                      name: data.name
                  });


                  $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                  $(this).addClass('selected');
              } else {
                  that.selectAll = false;

                  that.selected.splice(index, 1);

                  $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

                  $(this).removeClass('selected');
              }

              that.tableClients.rows()[0].forEach((element) => {
                  if (that.selected.find(x => +x.id === +that.tableClients.row(element).data().id) === undefined) {
                      that.selectAll = false;
                  }
              });


              console.log(that.selected);

              that.detectChanges.detectChanges();
          } else {

              let data = table.row($(this)).data();
              var index = that.selected.findIndex(x => +x.id === +data.id);

              if (index === -1) {

                  if (that.selected && that.selected.length > 0) {
                      const eliminar = that.selected[0].id;

                      $('#ck-' + eliminar.replace('(', '').replace(')', '')).prop('checked', false);

                      $('#ck-' + eliminar.replace('(', '').replace(')', '')).parent().parent().parent().parent().removeClass('selected');

                      that.selected = [];
                  }

                  that.selected.push({
                      id: data.id,
                      name: data.name
                  });


                  $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                  $(this).addClass('selected');
              } else {
                  that.selectAll = false;

                  that.selected.splice(index, 1);

                  $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

                  $(this).removeClass('selected');
              }

              that.tableClients.rows()[0].forEach((element) => {
                  if (that.selected.find(x => +x.id === +that.tableClients.row(element).data().id) === undefined) {
                      that.selectAll = false;
                  }
              });


              console.log(that.selected);

              that.detectChanges.detectChanges();

          }

      });
  }

  selectAllFunc() {
      this.tableClients.rows()[0].forEach((element) => {
          let data = this.tableClients.row(element).data();
          var index = this.selected.findIndex(x => x.id === data.id);

          if (this.selectAll) {
              this.selected.push({
                  id: data.id,
                  name: data.name
              });

              $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

              $(this.tableClients.row(element).node()).addClass('selected');
          } else {
              $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

              $(this.tableClients.row(element).node()).removeClass('selected');

              this.selected.splice(index, 1);
          }

          this.detectChanges.detectChanges();
      });
  }


}
