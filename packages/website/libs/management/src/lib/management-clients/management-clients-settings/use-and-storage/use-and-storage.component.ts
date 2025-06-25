import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagementPreferences, MN } from '../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-use-and-storage',
  templateUrl: './use-and-storage.component.html',
  styleUrls: ['./use-and-storage.component.scss']
})
export class UseAndStorageComponent implements OnInit, OnDestroy {

  managementPreferences$: Observable<ManagementPreferences>;

  constructor(
    private facade: PreferencesFacade,
  ) { }

  ngOnInit() {
    this.managementPreferences$ = this.facade.managementPreferences$;

  }

  toggleManagementPreference(key: MN, value: ManagementPreferences[MN]) {
    this.facade.toggleManagementPreferences(key, value);
}

useDeliveryPointPersistedServiceTime(key: MN, value: ManagementPreferences[MN]) {
  this.facade.toggleManagementPreferences(key, value);

 
}

  ngOnDestroy() {
   /*  this.unsubscribe$.next();
    this.unsubscribe$.complete(); */
  }

}
