import { Component, OnInit } from '@angular/core';
import { MN, ManagementPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable } from 'rxjs';

@Component({
  selector: 'easyroute-use-and-storage',
  templateUrl: './use-and-storage.component.html',
  styleUrls: ['./use-and-storage.component.scss']
})
export class UseAndStorageComponent implements OnInit {

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
