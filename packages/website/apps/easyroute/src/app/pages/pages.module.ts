import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PAGES_ROUTES } from './pages.routes'
import { AuthLocalModule } from '@optimroute/auth-local';
import { SharedModule } from '@optimroute/shared';
import { BackendModule } from '@optimroute/backend';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';

@NgModule({
  declarations: [],
  imports: [
    PAGES_ROUTES,
    CommonModule,
    SharedModule,
    AuthLocalModule,
    BackendModule,
    StateDeliveryZonesModule,
    AuthLocalModule,
    StateProfileSettingsModule,

  ],
  exports: [],
  entryComponents: []
})
export class PagesModule { }
