import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PlanningDeliveryZone, RoutePlanningFacade } from '@optimroute/state-route-planning';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoadingService } from '@optimroute/shared';

@Component({
  selector: 'easyroute-change-route-modal',
  templateUrl: './change-route-modal.component.html',
  styleUrls: ['./change-route-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeRouteModalComponent implements OnInit {

  deliveryPoint: any;
  zones: {
    [key: number]: PlanningDeliveryZone;
  };
  zoneOptim: any;
  selectedZoneId: any;
  _selectedZoneId: any;
  selectedRouteId: number;
  _selectedRouteId: number;
  _order: number;
  order: number;
  constructor(private activeModal: NgbActiveModal,
    private facade: RoutePlanningFacade,
    private loading: LoadingService,
    private detectChange: ChangeDetectorRef) { }

  ngOnInit() {
    this.facade.allZones$.pipe(take(1)).subscribe((data) => {
      if (data) {
        this.zones = data;
        this.zoneOptim = this.zonesPickFunction(data);
      }
    });
    
  }

  closeDialog() {
        this.activeModal.close();
  }

  zoneChanged() {
    console.log(this._selectedZoneId);
     this._selectedRouteId = +Object.keys(
          this.zoneOptim[this._selectedZoneId].routes,
      )[0];
    this._order = Math.max(
        1,
        Math.min(this._order, this.zones[this._selectedZoneId].deliveryPoints.length),
    );
    console.log(this._selectedRouteId);
  }

  changeRoute() {
    this.loading.showLoading();
    this.facade.moveUnassignedDeliveryPoint(this._selectedRouteId, this.selectedRouteId, [
      {
        id: this.deliveryPoint.id
      }
    ],
    this._selectedZoneId,
      this.selectedZoneId);
    this.facade.allRoutesStatus$.subscribe(
      (routeStatus: { [zoneId: number]: { [routeId: number]: { evaluating: boolean; } } } ) => {
        if(routeStatus && routeStatus != null && routeStatus[this.selectedZoneId] !== null){
          const zone = routeStatus[this.selectedZoneId][this.selectedRouteId];
          if (zone && !zone.evaluating) {
            this.loading.hideLoading();
            this.activeModal.close();
          }
        }
      });
  }

    zonesPickFunction(zones) {
      const object: any = {};
      for (const zoneId in zones) {
          if (
              zones[zoneId] &&
              zones[zoneId].optimization &&
              zones[zoneId].optimization.solution
          )
              object[zoneId] = {
                  // id: zoneId,
                  id: zones[zoneId].id,
                  name: zones[zoneId].name,
                  amountDeliveryPoints: zones[zoneId].deliveryPoints.length,
                  routes:
                      zones[zoneId] &&
                      zones[zoneId].optimization &&
                      zones[zoneId].optimization.solution &&
                      zones[zoneId].optimization.solution.routes
                          ? this.routesPickFunction(
                                zones[zoneId].optimization.solution.routes,
                            )
                          : {},
              };
      }
      return object;
  }
  routesPickFunction(routes) {
      const object: any = {};
      for (const index in routes) {
          object[routes[index].id] = {
              // id: routeId,
              route: routes[index],
              id: routes[index].id,
              amountDeliveryPoints:routes[index] && routes[index].deliveryPoints ? routes[index].deliveryPoints.length : 0,
          };
      }
      return object;
  }
}
