import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ControlPanelPreferences, CP, Profile } from '@optimroute/backend';
import { dayTimeAsStringToSeconds } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

declare function init_plugins();

@Component({
  selector: 'easyroute-times-schedules',
  templateUrl: './times-schedules.component.html',
  styleUrls: ['./times-schedules.component.scss']
})
export class TimesSchedulesComponent implements OnInit {

  refreshMinutesUpdate: number;
  refreshMinutesChangedUpdate = false;
  refreshSecondsUpdate: number;
  refreshSecondsChangedUpdate = false;


  controlPanelPreferences$: Observable<ControlPanelPreferences>;

  unsubscribe$ = new Subject<void>();

  profile: Profile;

  time: number = -1;

  ROUTES_AND_CALCULATED_ROUTES: string;



  constructor(
    private facade: PreferencesFacade,
    private facadeProfile: ProfileSettingsFacade,
    private detectChange: ChangeDetectorRef,
    private translate: TranslateService,
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

    this.ROUTES_AND_CALCULATED_ROUTES = this.translate.instant(
      'PREFERENCES.MESSAGE.ROUTES_AND_CALCULATED_ROUTES',
    );

    setTimeout(init_plugins, 1000);

    this.controlPanelPreferences$ = this.facade.panelControlPreferencs$;

    this.controlPanelPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((cp) => {

      this.refreshMinutesUpdate = Math.floor(cp.refreshTime / 60);
      this.refreshSecondsUpdate = cp.refreshTime % 60;

      if (cp.endRouteTime > 0) {
        this.time = cp.endRouteTime;
      }

    });
  }

  updateDefaultRefreshTime() {
    if (this.refreshMinutesChangedUpdate || this.refreshSecondsChangedUpdate) {
        this.refreshMinutesChangedUpdate = false;
        this.refreshSecondsChangedUpdate = false;
        this.facade.updateDefaultRefreshTime(
            this.refreshMinutesUpdate * 60 + this.refreshSecondsUpdate,
        );
    }
  }

  clearAutomaticRouteEndTime() {
    this.time = undefined;
    this.facade.updateAutomaticEndRouteTime(-1);
    this.detectChange.detectChanges();
  }

  updateAutomaticEndRouteTime(value: any) {
    this.facade.updateAutomaticEndRouteTime(dayTimeAsStringToSeconds(value));
  }

  toggleControlPanelPreference(key: CP, value: ControlPanelPreferences[CP]) {
    this.facade.toggleControlPanelPreference(key, value);
  }


}
