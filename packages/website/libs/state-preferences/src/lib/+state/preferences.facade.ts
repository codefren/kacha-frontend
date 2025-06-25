import { Injectable } from '@angular/core';
import {
    InterfacePreferences,
    IP,
    PP,
    PrintingPreferences,
    OP,
    OptimizationPreferences,
    TrafficRange,
    MN,
    ManagementPreferences,
    ControlPanelPreferences,
    CP,
    GeolocationPreferences,
    APP,
    AppPreferences,
    OrdersPreferences,
    OR,
    FR,
    FranchisePreferences,
    PRP,
    ProductsPreferences,
    Delivery,
    OPA,
    DB,
} from '@optimroute/backend';
import { select, Store } from '@ngrx/store';
import {
    LoadPreferences,
    ToggleInterfacePreferenceOption,
    TogglePrintingPreferenceOption,
    ToggleOptimizationPreferenceOption,
    fromPreferencesActions,
    UpdateDefaultServiceTimeAction,
    UpdateMinServiceTimeStatAction,
    UpdateMaxServiceTimeStatAction,
    UpdateDefaultDeliveryScheduleAction,
    UpdateTrafficAction,
    Logout,
    ToggleManamgementPreferenceOption,
    ToggleControlPanelPreferenceOption,
    UpdateDefaultRefreshAction,
    UpdateAutomaticEndRouteTimeAction,
    UpdateOrderMaxTimeAction,
    UpdateOrderSyncTimeAction,
    UpdateStoppedCommercialMaxTimeAction,
    UpdateStoppedDriverMaxTimeAction,
    UpdateRangeDistanceAction,
    UpdateScheduleGeolocationAction,
    UpdateMinAvgServiceTimeAction,
    UpdateOrderSyncEachTimeAction,
    ToggleAppPreferenceOption,
    ToggleOrdersPreferenceOption,
    ToggleFranchisePreferenceOption,
    ToggleProductPreferenceOption,
    LoadProductPreferences,
    LoadFranchisesPreferences,
    LoadGeolocationPreferences,
    LoadCompanyPreparationPreferences,
    UpdateMaxAvgServiceTimeAction,
    ToggleOptimizationPreferenceAction,
    LoadDashboardPreferencesAction,
    ToggleDashboardPreferenceAction,
    UpdateQuantityDelayModifyScheduleAction,
    UpdateDelayWhenPassingTimeAction,
    UpdateQuantityAdvancesModifyScheduleAction,
    UpdateAdvanceWhenAnticipatingTimeAction
} from './preferences.actions';
import { PreferencesState } from './preferences.reducer';
import { preferencesQuery } from './preferences.selectors';

@Injectable()
export class PreferencesFacade {
    preferences$ = this.store.pipe(select(preferencesQuery.getAllPreferences));
    loaded$ = this.store.pipe(select(preferencesQuery.getLoaded));
    optimizationPreferences$ = this.store.pipe(
        select(preferencesQuery.getOptimizationPreferences),
    );
    panelControlPreferencs$ = this.store.pipe(
        select(preferencesQuery.getControlPanelPreferences),
    );
    interfacePreferences$ = this.store.pipe(
        select(preferencesQuery.getInterfacePreferences),
    );

    managementPreferences$ = this.store.pipe(
        select(preferencesQuery.getManagementPreferences),
    );

    geolocationPreferences$ = this.store.pipe(
        select(preferencesQuery.getGeolocationPreferences),
    );

    printingPreferences$ = this.store.pipe(select(preferencesQuery.getPrintingPreferences));

    ordersPreferences$ = this.store.pipe(select(preferencesQuery.getOrdersPreferences));

    appPreferences$ = this.store.pipe(select(preferencesQuery.getAppPreferences));

    franchisePreferences$ = this.store.pipe(
        select(preferencesQuery.getFranchisePreferences),
    );

    productPreferences$ = this.store.pipe(select(preferencesQuery.getProductPreferences));

    addresses$ = this.store.pipe(select(preferencesQuery.getAddresses));

    payment$ = this.store.pipe(select(preferencesQuery.getPayment));

    delivery$ = this.store.pipe(select(preferencesQuery.getDelivery));

    dashboard$ = this.store.pipe(select(preferencesQuery.getDashboardPreferences));

    constructor(private store: Store<PreferencesState>) {}

    loadAllPreferences() {
        this.store.dispatch(new LoadPreferences({}));
    }

    loadProductPreferences() {
        this.store.dispatch(new LoadProductPreferences({}));
    }

    loadCompanyPreparationPreferences() {
        this.store.dispatch(new LoadCompanyPreparationPreferences({}));
    }


    loadFranchisesPreferences() {
        this.store.dispatch(new LoadFranchisesPreferences({}));
    }


    loadDashboardPreferences(){
        this.store.dispatch(new LoadDashboardPreferencesAction({}));
    }


    loadGeolocationPreferences() {
        this.store.dispatch(new LoadGeolocationPreferences({}));
    }

    // OPTIMIZATION PREFERENCES

    updateWarehouse(address: string) {
        this.store.dispatch(
            new fromPreferencesActions.GetWarehouseCoordinatesAction({
                address: address,
            }),
        );
    }

    updateDefaultDischargingTime(value: number) {
        this.store.dispatch(
            new UpdateDefaultServiceTimeAction({ defaultServiceTime: value }),
        );
    }

    updateDefaultRefreshTime(value: number) {
        this.store.dispatch(new UpdateDefaultRefreshAction({ refreshTime: value }));
    }

    updateMinServiceTimeStat(value: number) {
        this.store.dispatch(
            new UpdateMinServiceTimeStatAction({ minServiceTimeStat: value }),
        );
    }

    updateMaxServiceTimeStat(value: number) {
        this.store.dispatch(
            new UpdateMaxServiceTimeStatAction({ maxServiceTimeStat: value }),
        );
    }

    updateAutomaticEndRouteTime(endRouteTime: number) {
        this.store.dispatch(new UpdateAutomaticEndRouteTimeAction({ endRouteTime }));
    }

    updateOrderMaxTime(orderMaxTime: number) {
        this.store.dispatch(new UpdateOrderMaxTimeAction({ orderMaxTime }));
    }

    updateMinAvgServiceTime(minAvgServiceTime: number) {
        this.store.dispatch(new UpdateMinAvgServiceTimeAction({ minAvgServiceTime }));
    }

    updateMaxAvgServiceTime(maxAvgServiceTime: number) {
        this.store.dispatch(new UpdateMaxAvgServiceTimeAction({ maxAvgServiceTime }));
    }

    updateOrderSyncEachTime(orderSyncEachTime: number) {
        this.store.dispatch(new UpdateOrderSyncEachTimeAction({ orderSyncEachTime }));
    }
    updateStoppedCommercialMaxTime(stoppedCommercialMaxtime: number) {
        this.store.dispatch(
            new UpdateStoppedCommercialMaxTimeAction({ stoppedCommercialMaxtime }),
        );
    }

    updateStoppedDriverMaxTime(stoppedDriverMaxtime: number) {
        this.store.dispatch(new UpdateStoppedDriverMaxTimeAction({ stoppedDriverMaxtime }));
    }

    updateOrderSyncTime(orderSyncTime: number) {
        this.store.dispatch(new UpdateOrderSyncTimeAction({ orderSyncTime }));
    }

    updateDefaultDeliverySchedule(value: { start?: number; end?: number }) {
        this.store.dispatch(
            new UpdateDefaultDeliveryScheduleAction({ deliverySchedule: value }),
        );
    }

    toggleOptimizationPreference(
        key: OP,
        value: OptimizationPreferences['createSession'][OP],
    ) {
        this.store.dispatch(new ToggleOptimizationPreferenceOption(key, value));
    }

    toggleOptimization(key: OPA, value){
        this.store.dispatch(new ToggleOptimizationPreferenceAction(key, value));
    }

    toggleDashboard(key: DB, value){
        this.store.dispatch(new ToggleDashboardPreferenceAction(key, value))
    }

    toggleControlPanelPreference(key: CP, value: ControlPanelPreferences[CP]) {
        this.store.dispatch(new ToggleControlPanelPreferenceOption(key, value));
    }

    toggleOrdersPreference(key: OR, value: OrdersPreferences[OR]) {
        this.store.dispatch(new ToggleOrdersPreferenceOption(key, value));
    }

    toggleAppPreference(key: APP, value: AppPreferences[APP]) {
        this.store.dispatch(new ToggleAppPreferenceOption(key, value));
    }

    toggleFranchisePreference(key: FR, value: FranchisePreferences['products'][FR]) {
        this.store.dispatch(new ToggleFranchisePreferenceOption(key, value));
    }

    toggleProductPreference(key: PRP, value: ProductsPreferences[PRP]) {
        this.store.dispatch(new ToggleProductPreferenceOption(key, value));
    }

    updateTraffic(traffic: {
        range1?: TrafficRange;
        range2?: TrafficRange;
        range3?: TrafficRange;
    }) {
        this.store.dispatch(new UpdateTrafficAction({ traffic }));
    }

    // INTERFACE PREFERENCES

    toggleInterfacePreference(key: IP, value: InterfacePreferences[IP]) {
        this.store.dispatch(new ToggleInterfacePreferenceOption(key, value));
    }

    toggleManagementPreferences(key: MN, value: ManagementPreferences[MN]) {
        this.store.dispatch(new ToggleManamgementPreferenceOption(key, value));
    }

    // PRINTING PREFERENCES

    togglePrintingPreference(key: PP, value: PrintingPreferences[PP]) {
        this.store.dispatch(new TogglePrintingPreferenceOption(key, value));
    }

    logout() {
        this.store.dispatch(new Logout());
    }

    updateScheduleGeolocation(schedule: GeolocationPreferences) {
        this.store.dispatch(new UpdateScheduleGeolocationAction({ schedule }));
    }

    changeScheduleGeolocation() {}
    
    updateAddresesOrderRange(addreses: string) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateAddresesOrderRangeAction({
                addresses: {
                    orderRange: {
                        address: addreses,
                    },
                },
            }),
        );
    }

    updateRangeDistance(allowedRadius: number) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateRangeDistanceAction({
                addresses: {
                    orderRange: {
                        allowedRadius: allowedRadius,
                    },
                },
            }),
        );
    }

    updateMinPayment(minPayment: any) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateMinPaymentAction({
                payment: {
                    minPayment: minPayment,
                },
            }),
        );
    }

    updatePrepaidPayment(prepaidPayment: any) {
        this.store.dispatch(
            new fromPreferencesActions.UpdatePrepaidPaymentAction({
                payment: {
                    prepaidPayment: prepaidPayment,
                },
            }),
        );
    }

    updateAllowBuyWithoutMinimum(allowBuyWithoutMinimum: boolean) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateAllowBuyWithoutMinimumAction({
                payment: {
                    allowBuyWithoutMinimun: allowBuyWithoutMinimum,
                },
            }),
        );
    }


    updateReturnToMailBoxOrder(returnToMailBoxOrder: boolean) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateReturnToMailBoxOrderAction({
                returnToMailBoxOrder
            }),
        );
    }

    updateTimeReturnToMailBoxOrder(timeReturnToMailBoxOrder: number){
        this.store.dispatch(
            new fromPreferencesActions.UpdateTimeReturnToMailBoxOrderAction({
                timeReturnToMailBoxOrder
            }),
        );
    }

    updateQuantityBuyWithoutMinimum(quantityBuyWithoutMinimun: any) {
        this.store.dispatch(
            new fromPreferencesActions.UpdateQuantityBuyWithoutMinimumAction({
                payment: {
                    quantityBuyWithoutMinimun: quantityBuyWithoutMinimun,
                },
            }),
        );
    }


    UpdateSumDeliveryPriceToTicket(sumDeliveryPriceToTicket: boolean){
        this.store.dispatch(
            new fromPreferencesActions.UpdateSumDeliveryPriceToTicketAction({
                payment: {
                    sumDeliveryPriceToTicket
                }
            })
        );
    }


    UpdatesSmQuantityBuyWithoutMinimunToTicket(sumQuantityBuyWithoutMinimunToTicket: boolean){
        this.store.dispatch(
            new fromPreferencesActions.UpdateSumQuantityBuyWithoutMinimunToTicketAction({
                payment: {
                    sumQuantityBuyWithoutMinimunToTicket
                }
            })
        );
    }

    UpdatesAllowChangeOrderPaymentStatus(allowChangeOrderPaymentStatus: boolean){
        console.log(allowChangeOrderPaymentStatus, 'UpdatesAllowChangeOrderPaymentStatus farcade')
        this.store.dispatch(
            new fromPreferencesActions.UpdateAllowChangeOrderPaymentStatusAction({
                payment: {
                    allowChangeOrderPaymentStatus
                }
            })
        );
    }



    updatePreferenceDelivery(delivery: Delivery){
        this.store.dispatch(new fromPreferencesActions.UpdatePreferenceDeliveryAction({delivery}));
    }


    createPreferenceDelivery(delivery: Delivery){
        this.store.dispatch(new fromPreferencesActions.CreatePreferenceDeliveryAction({delivery}));
    }
    

    updateQuantityDelayModifySchedule(quantityDelayModifySchedule: number) {

        this.store.dispatch(new UpdateQuantityDelayModifyScheduleAction({quantityDelayModifySchedule}));
    }

    updateDelayWhenPassingTime(delayWhenPassingTime: number) {
        this.store.dispatch(new UpdateDelayWhenPassingTimeAction({ delayWhenPassingTime }));
    }

    updateQuantityAdvancesModifySchedule(quantityAdvancesModifySchedule: number) {

        this.store.dispatch(new UpdateQuantityAdvancesModifyScheduleAction({quantityAdvancesModifySchedule}));
    }

    updateAdvanceWhenAnticipatingTime(advanceWhenAnticipatingTime: number) {
        this.store.dispatch(new UpdateAdvanceWhenAnticipatingTimeAction({ advanceWhenAnticipatingTime }));
    }
    

}
