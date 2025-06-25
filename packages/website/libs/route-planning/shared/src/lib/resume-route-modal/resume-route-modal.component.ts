import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '@optimroute/backend';
import { secondsToAbsoluteTime } from '@optimroute/shared';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { secondsToAbsoluteTimeAlterne, secondsToAbsoluteTimeAlterneWithoutDay } from 'libs/shared/src/lib/util-functions/time-format';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-resume-route-modal',
  templateUrl: './resume-route-modal.component.html',
  styleUrls: ['./resume-route-modal.component.scss']
})
export class ResumeRouteModalComponent implements OnInit, OnDestroy {

  zoneInfoChips: {
    deliveryPoints: number;
    demand: number;
    vehicles: number;
    vehiclesCapacity: number;
    isEvaluated: number;
    travelDistance: number;
    travelTime: number;
    delayTime: number;
    vehicleWaitTime: number;
    time: number;
    costTotal: number;
    volumetric:number
  };
  routeInfoChips: {
      time: number;
      travelDistance: number;
      vehicleWaitTime: number;
      delayTime: number;
      vehicles: number;
      costTotal: number;
     // volumetric:number;
  };
  private unsubscribe$ = new Subject<void>();

  profile: Profile;

  constructor(public activeModal: NgbActiveModal,
    private facade: RoutePlanningFacade,
    public facadeProfile: ProfileSettingsFacade,
    ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }
    });

    this.facade.allZonesInfoChips$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (zoneInfoChips) => {
          this.zoneInfoChips = zoneInfoChips;
          console.log(zoneInfoChips, 'infor');
      },
    );

    this.facade.allRoutesInfoChips$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (routeInfoChips) => {
          console.log(routeInfoChips);
          this.routeInfoChips = routeInfoChips;
      },
    );
  }


  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  convertSecondtoTimeAbsolute(seconds: number){
    return secondsToAbsoluteTimeAlterneWithoutDay(seconds);
  }

  close(){
    this.activeModal.dismiss();
  }

  moduleCost(){

    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
        return true;
    } else {
        return false;
    }
}

formatEuro(quantity) {
  return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(quantity);

}

formatEuroCost(quantity) {
  return new Intl.NumberFormat('de-DE', {
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(quantity);

}

}
