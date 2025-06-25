import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { AppPreferences, MN, ManagementPreferences } from 'libs/backend/src/lib/types/preferences.type';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { PreferencesFacade } from 'libs/state-preferences/src/lib/+state/preferences.facade';
import { Observable, Subject } from 'rxjs';

declare var $;
@Component({
  selector: 'easyroute-commercial-app',
  templateUrl: './commercial-app.component.html',
  styleUrls: ['./commercial-app.component.scss']
})
export class CommercialAppComponent implements OnInit {

  managementPreferences$: Observable<ManagementPreferences>;

  unsubscribe$ = new Subject<void>();

  constructor(
    private facade: PreferencesFacade,
    private toastService: ToastService,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.facade.loadCompanyPreparationPreferences();
    this.managementPreferences$ = this.facade.managementPreferences$;
  }

  toggleManagementPreference(key: MN, value: ManagementPreferences[MN]) {
    this.facade.toggleManagementPreferences(key, value);
}

 

}
