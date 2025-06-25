import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferencesComponent } from './preferences.component';
import { SharedModule, Language, ToDayTimePipe } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { StatePreferencesModule } from '@optimroute/state-preferences';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileMenuModule } from '../../../../apps/easyroute/src/app/layout/profile-menu/profile-menu.module';
import { SchedulesPreferencesComponent } from './schedules-preferences/schedules-preferences.component';
import { ValorationPreferenceComponent } from './valoration-preference/valoration-preference.component';
import { AppLitePreferencesComponent } from './app-lite-preferences/app-lite-preferences.component';
import { PreferencesDeliveryNotesComponent } from './preferences-delivery-notes/preferences-delivery-notes.component';
import { CompanyPrefereceBillComponent } from './company-preferece-bill/company-preferece-bill.component';
import { PromotionPreferencesComponent } from './promotion-preferences/promotion-preferences.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PlanRoutesComponent } from './ruta/plan-routes/plan-routes.component';
import { PlannerVisualizationComponent } from './ruta/planner-visualization/planner-visualization.component';
import { SummaryBoxesComponent } from './travel-tracking/summary-boxes/summary-boxes.component';
import { DeliveryNoteInvoiceComponent } from './travel-tracking/delivery-note-invoice/delivery-note-invoice.component';
import { TimesSchedulesComponent } from './travel-tracking/times-schedules/times-schedules.component';
import { DashboardSettingsComponent } from './travel-tracking/dashboard-settings/dashboard-settings.component';
import { RouteSpecificationComponent } from './route-specification/route-specification.component';
import { DataUsageStorageRouteComponent } from './data-usage-storage-route/data-usage-storage-route.component';
import { ModalRouteSpecificationComponent } from './route-specification/modal-route-specification/modal-route-specification.component';
import { VehicleSpecificationComponent } from './vehicle/vehicle-specification/vehicle-specification.component';
import { VehicleTypesComponent } from './vehicle/vehicle-types/vehicle-types.component';
import { VehicleDigitalAccessoriesComponent } from './vehicle/vehicle-digital-accessories/vehicle-digital-accessories.component';
import { VehicleMaterialAccessoriesComponent } from './vehicle/vehicle-material-accessories/vehicle-material-accessories.component';
import { VehicleMandatoryReviewsComponent } from './vehicle/vehicle-mandatory-reviews/vehicle-mandatory-reviews.component';
import { VehicleSupplementsComponent } from './vehicle/vehicle-supplements/vehicle-supplements.component';
import { ModalAddServiceComponent } from './vehicle/vehicle-specification/modal-add-service/modal-add-service.component';
import { ModalAddVehicleTypeComponent } from './vehicle/vehicle-types/modal-add-vehicle-type/modal-add-vehicle-type.component';
import { ModalAddAccesoriesComponent } from './vehicle/vehicle-digital-accessories/modal-add-accesories/modal-add-accesories.component';
import { ModalAddMaterialAccessoriesComponent } from './vehicle/vehicle-material-accessories/modal-add-material-accessories/modal-add-material-accessories.component';
import { ModalAddMandatoryComponent } from './vehicle/vehicle-mandatory-reviews/modal-add-mandatory/modal-add-mandatory.component';
import { ModalAddSupplementsComponent } from './vehicle/vehicle-supplements/modal-add-supplements/modal-add-supplements.component';
import { VehicleStatusComponent } from './vehicle-maintenance/vehicle-status/vehicle-status.component';
import { PredefinedRevisionsComponent } from './vehicle-maintenance/predefined-revisions/predefined-revisions.component';
import { ModalAddPrefefinedComponent } from './vehicle-maintenance/predefined-revisions/modal-add-prefefined/modal-add-prefefined.component';
import { ModalDeletePredefinedComponent } from './vehicle-maintenance/predefined-revisions/modal-delete-predefined/modal-delete-predefined.component';
import { DriverAppComponent } from './app/driver-app/driver-app.component';
import { CommercialAppComponent } from './app/commercial-app/commercial-app.component';
import { DrivingLicensesComponent } from './user/driving-licenses/driving-licenses.component';
import { ModalDrivingLicensesComponent } from './user/driving-licenses/modal-driving-licenses/modal-driving-licenses.component';
import { OtherLicensesComponent } from './user/other-licenses/other-licenses.component';
import { ModalOtherLicensesComponent } from './user/other-licenses/modal-other-licenses/modal-other-licenses.component';
import { TimeSpecificationComponent } from './client/time-specification/time-specification.component';
import { ModalTimeSpecificationComponent } from './client/time-specification/modal-time-specification/modal-time-specification.component';
import { DownloadTimesComponent } from './client/download-times/download-times.component';
import { DelaysComponent } from './client/delays/delays.component';
import { UseAndStorageComponent } from './client/use-and-storage/use-and-storage.component';
import { DataUpdateComponent } from './client/data-update/data-update.component';
import { ScheduleConfigurationComponent } from './geolocation/schedule-configuration/schedule-configuration.component';
import { AlertTimeComponent } from './geolocation/alert-time/alert-time.component';
import { BillsSettingsComponent } from './bills-settings/bills-settings.component';
import { ProductSettingsComponent } from './products/product-settings/product-settings.component';
import { CategoriesComponent } from './products/categories/categories.component';
import { SubCategoriesComponent } from './products/sub-categories/sub-categories.component';
import { FiltersComponent } from './products/filters/filters.component';
import { FormatsComponent } from './products/formats/formats.component';
import { FranchiseProductComponent } from './franchise-product/franchise-product.component';
import { OrderSettingComponent } from './order-setting/order-setting.component';
import { ModalSendStoreComponent } from './products/categories/modal-send-store/modal-send-store.component';
import { ModalAddGeneralCategoryComponent } from './products/categories/modal-add-general-category/modal-add-general-category.component';
import { StructureComponent } from './cost/structure/structure.component';
import { AutomationComponent } from './cost/automation/automation.component';
import { RatesComponent } from './cost/rates/rates.component';
import { SettingCalculationPeriodComponent } from './cost/structure/setting-calculation-period/setting-calculation-period.component';
import { SettingStructureComponent } from './cost/structure/setting-structure/setting-structure.component';
import { ModalEditSubCategoryComponent } from './products/categories/modal-edit-sub-category/modal-edit-sub-category.component';
import { ChatSendingSettingComponent } from './chat/chat-sending-setting/chat-sending-setting.component';
import { ChatStorageSettingComponent } from './chat/chat-storage-setting/chat-storage-setting.component';
import { TypePackageSettingComponent } from './dock/type-package-setting/type-package-setting.component';
import { ModalAddTypePackageComponent } from './dock/type-package-setting/modal-add-type-package/modal-add-type-package.component';
import { VehicleStatusSettingComponent } from './dock/vehicle-status-setting/vehicle-status-setting.component';
import { ModalAddVehicleStatusComponent } from './dock/vehicle-status-setting/modal-add-vehicle-status/modal-add-vehicle-status.component';
import { ParcelScanPackageSettingComponent } from './parcel-scan-package-setting/parcel-scan-package-setting.component';
import { FirstSheetSettingComponent } from './sheet-route/first-sheet-setting/first-sheet-setting.component';
import { ModalFormFieldComponent } from './sheet-route/modal-form-field/modal-form-field.component';
import { LastSheetSettingComponent } from './sheet-route/last-sheet-setting/last-sheet-setting.component';
import { ExpensesConceptSettingComponent } from './sheet-route/expenses-concept-setting/expenses-concept-setting.component';
import { ModalExpenseTypeComponent } from './sheet-route/expenses-concept-setting/modal-expense-type/modal-expense-type.component';
import { ModalAddGeneralSubCategoryComponent } from './products/sub-categories/modal-add-general-sub-category/modal-add-general-sub-category.component';
import { ModalEditSubCategorySettingsComponent } from './products/sub-categories/modal-edit-sub-category-settings/modal-edit-sub-category-settings.component';
import { MultiStoreComponent } from './multi-store/multi-store.component';
import { ModalAddFiltersSettingsComponent } from './products/filters/modal-add-filters-settings/modal-add-filters-settings.component';
import { ModalAddFormatsSettingsComponent } from './products/formats/modal-add-formats-settings/modal-add-formats-settings.component';
import { MeasureModalActiveComponent } from './products/formats/measure-modal-active/measure-modal-active.component';
import {HelpComponent} from '../../../help/src/lib/help.component';
import { BillsNoticesComponent } from './bills-settings/bills-notices/bills-notices.component';
import { ReportsSettingsComponent } from './reports-settings/reports-settings.component';
import { RouteIntegrationComponent } from './integration/route-integration/route-integration.component';
import { DeliveryNoteIntegrationComponent } from './integration/delivery-note-integration/delivery-note-integration.component';
import { FormIntegrationComponent } from './integration/route-integration/form-integration/form-integration.component';
import { FormDeliveryNoteIntegrationComponent } from './integration/delivery-note-integration/form-delivery-note-integration/form-delivery-note-integration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalActionsIntegrationComponent } from './integration/modal-actions-integration/modal-actions-integration.component';
@NgModule({
    imports: [
        CommonModule,
        ProfileMenuModule,
        StatePreferencesModule,
        StateEasyrouteModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: '',
                component: PreferencesComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        PreferencesComponent,
        SchedulesPreferencesComponent,
        ValorationPreferenceComponent,
        AppLitePreferencesComponent,
        PreferencesDeliveryNotesComponent,
        CompanyPrefereceBillComponent,
        PromotionPreferencesComponent,
        NotificationsComponent,
        PlanRoutesComponent,
        PlannerVisualizationComponent,
        SummaryBoxesComponent,
        DeliveryNoteInvoiceComponent,
        TimesSchedulesComponent,
        DashboardSettingsComponent,
        RouteSpecificationComponent,
        DataUsageStorageRouteComponent,
        ModalRouteSpecificationComponent,
        VehicleSpecificationComponent,
        VehicleTypesComponent,
        VehicleDigitalAccessoriesComponent,
        VehicleMaterialAccessoriesComponent,
        VehicleMandatoryReviewsComponent,
        VehicleSupplementsComponent,
        ModalAddServiceComponent,
        ModalAddVehicleTypeComponent,
        ModalAddAccesoriesComponent,
        ModalAddMaterialAccessoriesComponent,
        ModalAddMandatoryComponent,
        ModalAddSupplementsComponent,
        VehicleStatusComponent,
        PredefinedRevisionsComponent,
        ModalAddPrefefinedComponent,
        ModalDeletePredefinedComponent,
        DriverAppComponent,
        CommercialAppComponent,
        DrivingLicensesComponent,
        ModalDrivingLicensesComponent,
        OtherLicensesComponent,
        ModalOtherLicensesComponent,
        TimeSpecificationComponent,
        ModalTimeSpecificationComponent,
        DownloadTimesComponent,
        DelaysComponent,
        UseAndStorageComponent,
        DataUpdateComponent,
        ScheduleConfigurationComponent,
        AlertTimeComponent,
        BillsSettingsComponent,
        ProductSettingsComponent,
        CategoriesComponent,
        SubCategoriesComponent,
        FiltersComponent,
        FormatsComponent,
        FranchiseProductComponent,
        OrderSettingComponent,
        ModalSendStoreComponent,
        ModalAddGeneralCategoryComponent,
        StructureComponent,
        AutomationComponent,
        RatesComponent,
        SettingCalculationPeriodComponent,
        SettingStructureComponent,
        ModalEditSubCategoryComponent,
        ChatSendingSettingComponent,
        ChatStorageSettingComponent,
        TypePackageSettingComponent,
        ModalAddTypePackageComponent,
        VehicleStatusSettingComponent,
        ModalAddVehicleStatusComponent,
        ParcelScanPackageSettingComponent,
        FirstSheetSettingComponent,
        ModalFormFieldComponent,
        LastSheetSettingComponent,
        ExpensesConceptSettingComponent,
        ModalExpenseTypeComponent,
        ModalAddGeneralSubCategoryComponent,
        ModalEditSubCategorySettingsComponent,
        MultiStoreComponent,
        ModalAddFiltersSettingsComponent,
        ModalAddFormatsSettingsComponent,
        MeasureModalActiveComponent,
        HelpComponent,
        BillsNoticesComponent,
        ReportsSettingsComponent,
        RouteIntegrationComponent,
        DeliveryNoteIntegrationComponent,
        FormIntegrationComponent,
        FormDeliveryNoteIntegrationComponent,
        ModalActionsIntegrationComponent
    ],
    providers: [Language, ToDayTimePipe],
    entryComponents:[
        ModalRouteSpecificationComponent,
        ModalAddServiceComponent,
        ModalAddVehicleTypeComponent,
        ModalAddAccesoriesComponent,
        ModalAddMaterialAccessoriesComponent,
        ModalAddMandatoryComponent,
        ModalAddSupplementsComponent,
        ModalAddPrefefinedComponent,
        ModalDeletePredefinedComponent,
        ModalDrivingLicensesComponent,
        ModalOtherLicensesComponent,
        ModalTimeSpecificationComponent,
        ModalAddGeneralCategoryComponent,
        ModalEditSubCategoryComponent,
        ModalAddTypePackageComponent,
        ModalAddVehicleStatusComponent,
        ModalFormFieldComponent,
        ModalExpenseTypeComponent,
        ModalAddGeneralSubCategoryComponent,
        ModalAddFiltersSettingsComponent,
        ModalAddFormatsSettingsComponent,
        MeasureModalActiveComponent,
        BillsNoticesComponent,
        ReportsSettingsComponent
    ]
})
export class PreferencesModule {}
