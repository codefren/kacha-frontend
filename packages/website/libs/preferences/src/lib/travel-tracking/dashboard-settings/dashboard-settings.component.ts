import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, DB, DashboardPreferences } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'easyroute-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {
  
  dashboard$: Observable<DashboardPreferences>;
  
  constructor(
    private fb: FormBuilder,
        private facade: PreferencesFacade,
        private toastService: ToastService,
        private detectChange: ChangeDetectorRef,
        private _translate: TranslateService,
        private translate: TranslateService,
        private backendService: BackendService,
        private detectChanges: ChangeDetectorRef,
        private statePreferencesService: StatePreferencesService,
        private facadeProfile: ProfileSettingsFacade,
        private loading: LoadingService,
        config: NgbTimepickerConfig,
        private activatedRoute: ActivatedRoute,
        private modal: NgbModal,
        public authLocal: AuthLocalService,
  ) { }

  ngOnInit() {

    this.dashboard$  = this.facade.dashboard$;

  }

  toggleDashBoardAction(
    key: DB,
    value: DashboardPreferences[DB],
  ) {
      this.facade.toggleDashboard(key, value);
  }

}
