import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { Franchise } from '@optimroute/backend';
declare var $: any;
import * as moment from 'moment-timezone';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';

@Component({
  selector: 'easyroute-vehicle-history-list',
  templateUrl: './vehicle-history-list.component.html',
  styleUrls: ['./vehicle-history-list.component.scss']
})
export class VehicleHistoryListComponent implements OnInit {

  me: boolean;

  table: any;

  disabled: boolean;

  selected: any = [];

  timeInterval: any;

  refreshTime: number = environment.refresh_datatable_assigned;

  load: 'loading' | 'success' | 'error' = 'loading';

  loadVehicles: 'loading' | 'success' | 'error' = 'loading';

  driverList: any[] = [];

  VehicleList: any[] = [];

  filter: any = {
      userId: '',
      vehicleId: '',
  };

  change: string = 'historial';

  constructor(
    private Router: Router,
    private authLocal: AuthLocalService,
    private loading: LoadingService,
    private detectChanges: ChangeDetectorRef,
    private toastService: ToastService,
    private stateEasyrouteService: StateEasyrouteService,
    private _translate: TranslateService,
    private router: Router
  ) { }

  redirectConfig(){
      this.router.navigateByUrl('preferences?option=Vehicle');
  }
  
  ngOnInit() {
      this.cargar();
      this.getAllDriver();
      this.getVehicle();
  }

  cargar() {
      this.selected = [];
      let isSalesman = this.isSalesman() && this.me == false;
      //let url = environment.apiUrl + 'maintenance_datatable';
  
      let url =
          environment.apiUrl +
          'maintenance_historical_datatable?userId=' +
          this.filter.userId +
          '&vehicleId=' +
          this.filter.vehicleId;
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#manteanace';
      this.table = $(table).DataTable({
          destroy: true,
          //serverSide: true,
          processing: true,
          stateSave: true,
          responsive: true,
          cache: false,
          columnDefs: [{ orderData: 1, targets: [0] }],
          lengthMenu: [10, 100],
          stateSaveParams: function(settings, data) {
              data.search.search = '';
          },
          dom: `
          <'row'<'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
              <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
              <'col-sm-3 col-md-2 col-xl-1 col-12'
                  <'row p-0 justify-content-sm-end justify-content-center'B>
              >
          >
          <'row p-0 reset'
          <'offset-sm-6 offset-lg-6 offset-5'>
          <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
          >
      `,
          headerCallback: (thead, data, start, end, display) => {
              $('.buttons-collection').html(
                  '<i class="far fa-edit"></i>' +
                      ' ' +
                      this._translate.instant('GENERAL.SHOW/HIDE'),
              );
          },
  
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
  
                  $('#companies_processing').html(html);
  
                  $('#refrescar').click(() => {
                      this.cargar();
                  });
              },
          },
          columns: [
              {
                  data: 'user',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.DRIVER'),
                  render: (data, type, row) => {
                      if (data == null || data == 0) {
                          return '<span class="text center" aria-hidden="true"> No disponible</span>';
                      } else {
                          return (
                              '<span data-toggle="tooltip" data-placement="top" title="' +
                              '">' +
                              data.name +
                              ' ' +
                              data.surname +
                              '</span>'
                          );
                      }
                  },
              },
              {
                  data: 'vehicle.name',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.VEHICLE'),
                  render: (data, type, row) => {
                      if (data === null) {
                          return 'No disponible';
                      } else {
                          return data;
                      }
                  },
              },
              {
                  data: 'date',
                  type: 'date',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.MAINTENANCE_DATE'),
                  render: (data, type, row) => {
                      if (data === null) {
                          return 'No disponible';
                      } else {
                          return moment(data).format('DD/MM/YYYY HH:mm:ss');
                      }
                  },
              },
              {
                  data: 'maintenance_vehicle_state_type',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.VEHICLE_STATUS'),
  
                  render: (data, type, row) => {
                      if (data) {
                          let varClass = '';
                          //let maintenanceName = data.name ? data.name : null;
                          if (data === 'Bien') {
                              varClass = 'green';
                          }
                          if (data == 'Mal') {
                              varClass = 'red';
                          }
                          if (data == 'Regular') {
                              varClass = 'orange';
                          }
  
                          return (
                              '<div class="d-flex justify-content-center backgroundColorRow">' +
                              ' <div class="text-center no-point  col-12 p-0 m-0">' +
                              '<button style="font-size: 14px;" class="no-point btn btn-default warning ' +
                              varClass +
                              '">' +
                              data +
                              ' </button> ' +
                              '</div>' +
                              '</div>'
                          );
                      } else {
                          return `<span style="font-weight: bold; color: #837474;"> - - - </span>`;
                      }
                  },
              },
              {
                  data: 'maintenance_image_count',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.PHOTO'),
                  render: (data, type, row) => {
                      if (data > 0) {
                          return `
                            <div class="justify-content-center row reset">
                              <div class="success-chip">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                              </div>
                            </div>
                          `;
                      } else {
                          return `
                          <div class="justify-content-center row reset">
                            <div class="times-chip">
                              <i class="fas fa-times mt-2"></i>
                            </div>  
                          </div> 
                        `;
                      }
                  },
              },
  
              {
                  data: 'maintenance_vehicle_review_count',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.VERIFIED_TOTALS'),
                  render: (data, type, row) => {
                      let varClass = '';
  
                      let totalPreference = data;
  
                      let maintenanceVehicle = row.total_preference_review;
  
                      if (maintenanceVehicle == totalPreference) {
                          varClass = 'red';
                      }
  
                      if (data > 0) {
                          return (
                              '<span class="' +
                              varClass +
                              '"> ' +
                              totalPreference +
                              '/' +
                              maintenanceVehicle +
                              ' </span>'
                          );
                      }
  
                      return `<span style="font-weight: bold; color: #837474;"> - - - </span>`;
                  },
              },
  
              {
                  data: 'maintenance_status',
                  title: this._translate.instant('VEHICLE_MAINTENANCE.MAINTENANCE'),
                  render: (data, type, row) => {
                      let varClass = '';
  
                      if (data) {
                          if (data == 'Sin asignar') {
                              varClass = 'no-asigned';
                          }
                          if (data == 'En preparación' || data == 'En camino') {
                              varClass = 'blue';
                          }
                          if (data === 'Finalizado') {
                              varClass = 'green';
                          }
                          if (data == 'No entregado') {
                              varClass = 'red';
                          }
                          if (data == 'Pospuesto') {
                              varClass = 'orange';
                          }
                          if (data == 'Cancelada') {
                              varClass = 'yellow';
                          }
                          if (data === 'No realizado') {
                              varClass = '';
                          }
  
                          return (
                              '<div class="d-flex justify-content-center backgroundColorRow">' +
                              ' <div class="text-center  col-12 p-0 m-0">' +
                              '<button style="font-size: 14px;" class="no-point btn btn-default warning ' +
                              varClass +
                              '">' +
                              data +
                              ' </button> ' +
                              '</div>' +
                              '</div>'
                          );
                      } else {
                          return `<span style="font-weight: bold;"> no disponible </span>`;
                      }
                  },
              },
              {
                  data: null,
                  sortable: false,
                  searchable: false,
                  title: this._translate.instant('GENERAL.ACTIONS'),
                  render: (data, type, row) => {
                      let botones = '';
                      botones += `
                  <div class="text-center editar point">
                      <i class="fas fa-eye fa-2x " style="color: #24397c;"></i>
                  </div>
              `;
                      return botones;
                  },
              },
          ],
      });
      $('.dataTables_filter').html(`
  <div class="row p-0 justify-content-sm-end justify-content-center">
      <div class="input-group datatables-input-group-width mr-xl-2">
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
  
      /* this.initEvents(table + ' tbody', this.table); */
      this.initEvents('#manteanace tbody', this.table);
  }

  initEvents(tbody: any, table: any, that = this) {
      $(tbody).unbind();
  
      window.clearInterval(this.timeInterval);
  
      this.timeInterval = window.setInterval(() => {
          this.table.ajax.reload();
      }, this.refreshTime);
  
      this.editar(tbody, table);
  
      this.isActive(tbody, table);
  }

  editar(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.editar', function() {
          let data = table.row($(this).parents('tr')).data();
          that.Router.navigate(['vehicle-maintenance/history', data.id]);
      });
  }
  
  select(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'tr', function() {
          let data = table.row($(this)).data();
  
          var index = $.inArray(+data.id, that.selected);
  
          if (index === -1) {
              that.selected.push(+data.id);
          } else {
              that.selected.splice(index, 1);
          }
  
          $(this).toggleClass('selected');
  
          that.detectChanges.detectChanges();
      });
  }

  isActive(tbody: any, table: any, that = this) {
      $(tbody).on('click', '.isActive', function() {
          let data = table.row($(this).parents('tr')).data();
          // that.OnChangeCheckActive(data.id, !data.activeInApp, data);
      });
  }

  editActiveCompany(franchiseId: number, element: any) {
      this.loading.showLoading();
  
      this.stateEasyrouteService.updateFranchise(franchiseId, element).subscribe(
          (data: any) => {
              this.toastService.displayWebsiteRelatedToast(
                  this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                  this._translate.instant('GENERAL.ACCEPT'),
              );
              this.table.ajax.reload();
              this.loading.hideLoading();
          },
          (error) => {
              this.loading.hideLoading();
  
              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
      );
  }

  isSalesman() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
          : false;
  }

  getAllDriver() {
    this.load = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getAllDriver().subscribe(
            (data: any) => {
                this.driverList = data.data;

                this.load = 'success';

                this.detectChanges.detectChanges();

                this.loading.hideLoading();
            },
            (error) => {
                this.load = 'error';

                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }


  

  getVehicle() {
      this.loadVehicles = 'loading';
  
      setTimeout(() => {
          this.stateEasyrouteService.getVehicle().subscribe(
              (data: any) => {
                  this.VehicleList = data.data;
  
                  this.loadVehicles = 'success';
  
                  this.detectChanges.detectChanges();
  
                  this.loading.hideLoading();
              },
              (error) => {
                  this.loadVehicles = 'error';
  
                  this.loading.hideLoading();
  
                  this.toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              },
          );
      }, 1000);
  }

  changeDriver(driverId: string) {
      this.filter.userId = driverId;
  
      this.cargar();
  }

  changeVehicle(vehicleId: string) {
      this.filter.vehicleId = vehicleId;
  
      this.cargar();
  }

  changePage(name: string){
     
      switch (name) {
          case 'vehicle-maintenance':
              this.change = name;
              this.router.navigate(['/vehicle-maintenance']);
              break;
  
              case 'historial':
                  this.change = name;
                  this.router.navigate(['/vehicle-maintenance/history']);
              break;
      
          default:
              break;
      }
  }

}
