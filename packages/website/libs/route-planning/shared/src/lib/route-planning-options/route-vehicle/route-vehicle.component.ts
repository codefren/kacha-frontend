import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService, User, Vehicle, Zone } from '@optimroute/backend';
import { StateUsersFacade } from '@optimroute/state-users';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ServiceTypeVehicleComponent } from '../zone-vehicles/service-type-vehicle/service-type-vehicle.component';
import * as _ from 'lodash';
import { Route, RoutePlanningFacade } from '@optimroute/state-route-planning';

@Component({
  selector: 'easyroute-route-vehicle',
  templateUrl: './route-vehicle.component.html',
  styleUrls: ['./route-vehicle.component.scss']
})
export class RouteVehicleComponent implements OnInit {

  constructor(private dialog: NgbModal,
    private vehicleFacade: VehiclesFacade,
    private usersFacade: StateUsersFacade,
    private facade: RoutePlanningFacade,
    private backend: BackendService,
    private changeDetector: ChangeDetectorRef) { }

  @Input()
  vehicle: any;

  @Input()
  route: Route;

  @Input()
  zone: Zone

  drivers: Observable<User[]>

  unsubscribe$ = new Subject<void>();

  feetUser = [];

  ngOnInit() {
    this.getUsers();
    this.vehicleFacade.allVehicles$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((vehicles) => {
        if (vehicles) {
          console.log(vehicles, this.vehicle);
          this.vehicle = {
            ...vehicles.find(element => +element.id === +this.vehicle.vehicleId),
            deliveryWindowStart: this.vehicle.deliveryWindowStart,
            deliveryWindowEnd: this.vehicle.deliveryWindowEnd,
            userId: this.vehicle.userId,
            userFeeCostId: +this.vehicle.userFeeCostId
          }
            this.loadFeeCostDriver(this.vehicle.userId, +this.vehicle.id, false);
          try {
            this.changeDetector.detectChanges();
          } catch (e) {

          }

        }

      });
  }

  onChangeDriver(userId: number, vehicleId) {
    let vehicle = _.cloneDeep(this.vehicle);
    vehicle.userId = userId;
    this.facade.changeDriverVehicleRoute(this.zone.id, userId, this.route);
    this.drivers.pipe(take(1)).subscribe((users) => {
      this.feetUser[vehicleId] = [];
      if (users && users.find(x => x.id === +userId) && users.find(x => x.id == +userId).userTypeId && +users.find(x => x.id === +userId).userTypeId == 2) {
        this.loadFeeCostDriver(userId, vehicleId, true);
      }
    });

  }

  loadFeeCostDriver(userId: number, vehicleId: number, change: boolean = false) {
    this.backend.get('user_fee_cost_list/' + userId).pipe(take(1)).subscribe(({ data }) => {
      this.feetUser[vehicleId] = data;
      if (change) {
        let predetermined = this.feetUser[vehicleId].find(x => x.predetermined === true);
        if (predetermined) {
          this.facade.changeFeeRoute(userId, this.route.id, this.zone.id);
        }
      }
    });
  }


  changeFee(feeId) {
    this.facade.changeFeeRoute(feeId, this.route.id, this.zone.id);
  }

  trackById(index, item) {
    return item.id;
  }

  getUsers() {

    this.drivers = this.usersFacade.allUsersDrivers$;
  }


  viewService(vehicle) {

    const dialogRef = this.dialog.open(ServiceTypeVehicleComponent, {
      size: 'xs',
      centered: true,
      backdrop: 'static'
    });
    dialogRef.componentInstance.vehicle = vehicle;

    dialogRef.result.then((data) => {
    });
  }

}
