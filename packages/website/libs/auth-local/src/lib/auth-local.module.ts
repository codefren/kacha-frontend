import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificaTokenGuard } from './guards/verifica-token.guard';
import { AdminGuard } from './guards/admin.guard';
import { DemoGuard } from './guards/demo.guard';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { StateUsersModule } from '@optimroute/state-users';
import { StateRoutePlanningModule } from '@optimroute/state-route-planning';
import { StateCompaniesModule } from '@optimroute/state-companies';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { StatePreferencesModule } from '@optimroute/state-preferences';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { TermsGuard } from './guards/terms.guard';
import { AdministrativeGuard } from './guards/administrative.guard';
import { PlanningRouteGuard } from './guards/planning-route.guard';
import { LogisticGuard } from './guards/logistic.guard';
import { CommercialGuard } from './guards/commercial.guard';
import { StateVehiclesModule } from '@optimroute/state-vehicles';
import { StateGeolocationModule } from '@optimroute/state-geolocation';
import { InvoiceGuard } from './guards/invoice.guard';
import { ChatGuard } from './guards/chat.guard';
@NgModule({
    imports: [
        CommonModule,
        StateUsersModule,
        StateRoutePlanningModule,
        StateEasyrouteModule,
        StateCompaniesModule,
        StateDeliveryZonesModule,
        StatePreferencesModule,
        StateProfileSettingsModule,
        StateVehiclesModule,
        StateGeolocationModule
    ],
    providers: [
        VerificaTokenGuard,
        AdminGuard,
        DemoGuard,
        TermsGuard,
        AdministrativeGuard,
        PlanningRouteGuard,
        LogisticGuard,
        CommercialGuard,
        InvoiceGuard,
        ChatGuard
    ],
})
export class AuthLocalModule { }
