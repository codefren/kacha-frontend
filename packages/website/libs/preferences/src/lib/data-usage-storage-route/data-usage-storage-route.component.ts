import { Component, OnInit } from '@angular/core';
import { MN, ManagementPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable } from 'rxjs';

@Component({
  selector: 'easyroute-data-usage-storage-route',
  templateUrl: './data-usage-storage-route.component.html',
  styleUrls: ['./data-usage-storage-route.component.scss']
})
export class DataUsageStorageRouteComponent implements OnInit {

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

}
