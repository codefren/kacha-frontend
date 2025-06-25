import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLocalModule } from '@optimroute/auth-local';
import { SharedModule } from '@optimroute/shared';
import { BackendModule } from '@optimroute/backend';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { ProfileMenuComponent } from './profile-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
      ProfileMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthLocalModule,
    BackendModule,
    StateDeliveryZonesModule,
    AuthLocalModule,
    StateProfileSettingsModule,
    NgbModule

  ],
  exports: [
      ProfileMenuComponent
  ],
  entryComponents: []
})
export class ProfileMenuModule { }
