import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { Vehicle, Zone } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { dayTimeAsStringToSeconds, DeliveryZoneMessages, ToastService } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import * as _ from 'lodash';
import { combineLatest, pipe } from 'rxjs';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'easyroute-create-zone-modal',
  templateUrl: './create-zone-modal.component.html',
  styleUrls: ['./create-zone-modal.component.scss']
})
export class CreateZoneModalComponent implements OnInit {

  FormGroup: FormGroup;
  matcher = new ErrorStateMatcher();
  end: string;
  start: string;
  data: any;
  deliveryZone_messages: any;
  costDistance: string = 'costDistance';
  costDuration: string = 'costDuration';
  CostVehicleWaitTime: string = 'CostVehicleWaitTime';
  explorationLevel: string = 'explorationLevel';
  sessionId: number;
  availableVehicles: any[] = [];
  vehiclesInUse: Vehicle[] = [];
  selectedAvailableVehicles: Boolean[] = [];
  selectedUsedVehicles: Boolean[] = [];
  tabOption: number = 1;
  selected: any = [];
  zones: Zone[];
  table: any;
  zoneSelected: string = '';
  showZoneOld: boolean = true;
  mapView: number;
  constructor(
    private toastService: ToastService,
    private fb: FormBuilder,
    private facade: RoutePlanningFacade,
    public activeModal: NgbActiveModal,
    private _translate: TranslateService,
    private vehiclesFacade: VehiclesFacade,
    public zoneFacade: StateDeliveryZonesFacade,
    private authLocal: AuthLocalService,
    private detectChanges: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.tabOption = 1;

    this.changeOption(this.tabOption);
  }


  changeOption(value) {
    this.availableVehicles = [];
    if (value === 1) {
      combineLatest(
        this.vehiclesFacade.allVehicles$,
        this.facade.planningSessionVehicles$,
        this.facade.routePlanningVehicles$
      )
        .pipe(take(1))
        .subscribe((combinedObservables: [Vehicle[], {}, {}]) => {


          if (this.mapView !== 1) {
            if (combinedObservables[0] && combinedObservables[1]) {
              for (let zoneId in combinedObservables[1]) {

                this.vehiclesInUse = this.vehiclesInUse.concat(
                  combinedObservables[1][zoneId],
                );
              }
              for (let vehicle of combinedObservables[0].filter(
                (x) => x.userId && x.userId > 0,
              )) {
                if (!this.findVehicle(vehicle.id, combinedObservables[1]))
                  this.availableVehicles.push(vehicle);
              }
              this.selectedAvailableVehicles = new Array(
                this.availableVehicles.length,
              ).fill(false);
              this.selectedUsedVehicles = new Array(
                this.availableVehicles.length,
              ).fill(false);
            } else {
              this.availableVehicles = [];
              this.vehiclesInUse = [];
            }
          } else {
            if (combinedObservables[0] && combinedObservables[2]) {
              for (let zoneId in combinedObservables[2]) {

                this.vehiclesInUse = this.vehiclesInUse.concat(
                  combinedObservables[2][zoneId],
                );
              }
              for (let vehicle of combinedObservables[0].filter(
                (x) => x.userId && x.userId > 0,
              )) {
                if (!this.findVehicleRoute(vehicle.id, combinedObservables[2]))
                  this.availableVehicles.push(vehicle);
              }
              this.selectedAvailableVehicles = new Array(
                this.availableVehicles.length,
              ).fill(false);
              this.selectedUsedVehicles = new Array(
                this.availableVehicles.length,
              ).fill(false);
            } else {
              this.availableVehicles = [];
              this.vehiclesInUse = [];
            }
          }

        });
      this.initForm();
    } else {
      this.selected = [];
      this.zoneFacade.loadAll();
      this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded) => {
        if (loaded) {
          this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data) => {
            this.zones = data.filter(x => x.isActive === true);

            combineLatest(
              this.vehiclesFacade.allVehicles$,
              this.facade.planningSessionVehicles$,
              this.facade.routePlanningVehicles$
            )
              .pipe(take(1))
              .subscribe((combinedObservables: [Vehicle[], {}, {}]) => {
      
      
                if (this.mapView !== 1) {
                  if (combinedObservables[0] && combinedObservables[1]) {
                    for (let zoneId in combinedObservables[1]) {
      
                      this.vehiclesInUse = this.vehiclesInUse.concat(
                        combinedObservables[1][zoneId],
                      );
                    }
                    for (let vehicle of combinedObservables[0].filter(
                      (x) => x.userId && x.userId > 0,
                    )) {
                      if (!this.findVehicle(vehicle.id, combinedObservables[1]))
                        this.availableVehicles.push(vehicle);
                    }
                    this.selectedAvailableVehicles = new Array(
                      this.availableVehicles.length,
                    ).fill(false);
                    this.selectedUsedVehicles = new Array(
                      this.availableVehicles.length,
                    ).fill(false);
                  } else {
                    this.availableVehicles = [];
                    this.vehiclesInUse = [];
                  }
                } else {
                  if (combinedObservables[0] && combinedObservables[2]) {
                    for (let zoneId in combinedObservables[2]) {
      
                      this.vehiclesInUse = this.vehiclesInUse.concat(
                        combinedObservables[2][zoneId],
                      );
                    }
                    for (let vehicle of combinedObservables[0].filter(
                      (x) => x.userId && x.userId > 0,
                    )) {
                      if (!this.findVehicleRoute(vehicle.id, combinedObservables[2]))
                        this.availableVehicles.push(vehicle);
                    }
                    this.selectedAvailableVehicles = new Array(
                      this.availableVehicles.length,
                    ).fill(false);
                    this.selectedUsedVehicles = new Array(
                      this.availableVehicles.length,
                    ).fill(false);
                  } else {
                    this.availableVehicles = [];
                    this.vehiclesInUse = [];
                  }
                }
      
              });

            setTimeout(() => {
              this.initDataTable();
            }, 100)

          });
        }
      })
    }
  }



  initDataTable(zone?: string) {
    let that = this;
    this.selected = [];
    let url = zone ? environment.apiUrl + 'delivery_zone_datatables?show=active&id=' + zone : environment.apiUrl + 'delivery_zone_datatables?show=active';
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
        <"top-button-hide"><'point no-scroll-x't>
        <'row reset'
          <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
          <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
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

        {
          data: 'color',
          title: this._translate.instant('DELIVERY_ZONES.COLOR'),
          render: (data, type, row) => {
            return (`
                  <div class="row justify-content-center backgroundColorRow">
                    <div class="div-color-datatables" style="background-color: ${data}"></div>
                  </div>
                `);
          },
        },
      ]
    });
    let options = '';
    this.zones.forEach((zone) => {
      if (this.zoneSelected && this.zoneSelected === zone.id) {
        options += '<option value="' + zone.id + '" selected>' + zone.name + '</option>'
      } else {
        options += '<option value="' + zone.id + '">' + zone.name + '</option>'
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
                      `+ options + `
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

    $('.select-search-datatables').on('change', function () {
      that.zoneSelected = this.value;
      that.selected = [];
      that.initDataTable(this.value);
    });
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
  select(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'tr', function () {
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

  private findVehicle(vehicleId: number, vehiclesInZones: {}): boolean {
    let found = false;
    for (let zoneId in vehiclesInZones) {
      vehiclesInZones[zoneId].forEach((v) => {
        if (v.id === vehicleId) found = true;
      });
    }
    return found;
  }

  private findVehicleRoute(vehicleId: number, vehiclesInZones: {}): boolean {
    let found = false;
    for (let zoneId in vehiclesInZones) {
      vehiclesInZones[zoneId].forEach((v) => {
        if (+v.vehicleId === +vehicleId) found = true;
      });
    }
    return found;
  }

  async initForm() {
    let totalSeconds = 0;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    this.FormGroup = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50)],
      ],
      color: ['#000000', [Validators.required]],
      vehicles: [0, [Validators.required, Validators.min(1)]],
      /* settingsDeliveryScheduleStart: [ data.zone.settingsDeliveryScheduleStart?
        secondsToDayTimeAsString(data.zone.settingsDeliveryScheduleStart):'00:00' ],
        
      settingsDeliveryScheduleEnd: [ data.zone.settingsDeliveryScheduleEnd?
        secondsToDayTimeAsString(data.zone.settingsDeliveryScheduleEnd):'00:00' ], */
      settingsForcedeparturetime: [0],
      settingsIgnorecapacitylimit: [0],
      settingsUseallvehicles: [0],
      settingsOptimizationParametersCostDistance: [0],
      settingsOptimizationParametersCostDuration: [0],
      settingsOptimizationParametersCostVehicleWaitTime: [0],
      settingsExplorationlevel: [1]
      /*  hours: [hours],
       minutes:[minutes],
       seconds:[seconds] */
    },
      // { validator: this.checkStartAndEndTime }
    );

    let deliveryZone_messages = new DeliveryZoneMessages();
    this.deliveryZone_messages = deliveryZone_messages.getDeliveryZoneMessages();
  }

  closeDialog(value: any) {
    this.activeModal.close(value);
  }

  isFormInvalid(): boolean {
    return !this.FormGroup.valid;
  }
  submit() {
    let time: number =
      this.FormGroup.value.hours * 3600 +
      this.FormGroup.value.minutes * 60 +
      this.FormGroup.value.seconds;
    let dataform = _.cloneDeep(this.FormGroup.value);

    delete dataform.hours;
    delete dataform.minutes;
    delete dataform.seconds;
    dataform.vehicles = [dataform.vehicles];
    dataform.settingsOptimizationParametersMaxDelayTime = time;
    /* dataform.settingsDeliveryScheduleStart = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleStart);
    dataform.settingsDeliveryScheduleEnd = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleEnd); */
    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'), this._translate.instant('GENERAL.ACCEPT');
    } else {
      this.addZone(dataform);
      this.facade.added$.pipe(take(2)).subscribe((data) => {
        if (data) {
          this.facade.addedZoneId$.pipe(take(1)).subscribe((data) => {
            this.closeDialog(data);
          })
        }
      });

    }
  }

  addZone(zone: Zone) {
    let vehicles: Vehicle[] = [];
    console.log('vehicuslos disponibles', this.availableVehicles);

    if (zone.vehicles[0] > 0) {
      zone.vehicles.forEach((id) => {
        let vehicle = this.availableVehicles.find(x => +x.id === +id);
        if(vehicle){
          vehicles.push(vehicle);  
        }
      })
    } else {
      delete zone.vehicles;
    }

    console.log('antes de enviar', zone, vehicles);
    this.facade.addRoutePlanningDeliveryZone(zone, this.sessionId, vehicles);
  }
  checkStartAndEndTime(group: FormGroup) {
    let start = dayTimeAsStringToSeconds(group.controls.settingsDeliveryScheduleStart.value);
    let end = dayTimeAsStringToSeconds(group.controls.settingsDeliveryScheduleEnd.value);
    return end >= start ? null : { same: true };
  }


  modalDismiss() {
    this.activeModal.close([]);
  }

  async closeModal() {

  
    this.selected.forEach((element) => {

      console.log(this.availableVehicles);
      console.log('vehículo por zona', this.availableVehicles.filter(x => x.deliveryZoneId === element.id));

      element = {
        ...element,
        vehicles: this.availableVehicles.filter(x => x.deliveryZoneId === element.id).map((y)=> y.id)
      }

      console.log('elemento a agregar', element);
      this.addZone(element);
    });

    this.facade.added$.pipe(take(2)).subscribe((data) => {
      if (data) {
        this.facade.addedZoneId$.pipe(take(1)).subscribe((data) => {
          this.closeDialog(data);
        })
      }
    });
    this.activeModal.close(this.selected);

  }

}
