import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { GeolocationPreferences } from '@optimroute/backend';
import { dayTimeAsStringToSeconds } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-alert-time',
  templateUrl: './alert-time.component.html',
  styleUrls: ['./alert-time.component.scss']
})
export class AlertTimeComponent implements OnInit {
  
  geolocationPreferences$: Observable<GeolocationPreferences>;

  unsubscribe$ = new Subject<void>();

  stoppedCommercialMaxTime: number = -1;
  stoppedDriverMaxTime: number = -1;

  constructor(
    private facade: PreferencesFacade,
    private detectChanges: ChangeDetectorRef,
    private facadeProfile: ProfileSettingsFacade,

  ) { }

  ngOnInit() {

    this.geolocationPreferences$ = this.facade.geolocationPreferences$;

    this.geolocationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((uc) => {

      if (uc && uc.stoppedCommercialMaxTime && uc.stoppedCommercialMaxTime > 0) {
          this.stoppedCommercialMaxTime = uc.stoppedCommercialMaxTime;
      }

      if (uc && uc.stoppedDriverMaxTime && uc.stoppedDriverMaxTime > 0) {
          this.stoppedDriverMaxTime = uc.stoppedDriverMaxTime;
      }

      window.scroll(0,0);
    });

    this.facade.loadGeolocationPreferences();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateStoppedCommercialMaxTime(value) {
    this.facade.updateStoppedCommercialMaxTime(dayTimeAsStringToSeconds(value));
  }

  updateStoppedDriverMaxTime(value) {
    this.facade.updateStoppedDriverMaxTime(dayTimeAsStringToSeconds(value));
  }
  

}
