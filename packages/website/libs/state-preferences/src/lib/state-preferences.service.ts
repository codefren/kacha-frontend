import { Injectable } from '@angular/core';
import {
    InterfacePreferences,
    IP,
    OP,
    OptimizationPreferences,
    PP,
    PrintingPreferences,
    BackendService,
    TrafficRange,
    MN,
    ManagementPreferences,
    ControlPanelPreferences,
    CP,
    APP,
    AppPreferences,
    OR,
    OrdersPreferences,
    FR,
    FranchisePreferences,
    PRP,
    ProductsPreferences,
    OPA,
    DB,
    DashboardPreferences,
} from '@optimroute/backend';
import { Observable, of } from 'rxjs';
import { Preferences } from './+state/preferences.reducer';

@Injectable({
    providedIn: 'root',
})
export class StatePreferencesService {
    getPreferences(): Observable<any> {
        return this.backendService.get('/user/me');
    }

    getProductosPreferences(): Observable<any>{
        return this.backendService.get('company_preference_product');
    }


    getDashboardPreferences(): Observable<any>{
        return this.backendService.get('company_preference_route_dashboard');
    }

    getCompanyPreferencePreparation(): Observable<any>{
        return this.backendService.get('company_preference_preparation');
    }

    getFranchisesPreferences(): Observable<any> {
        return this.backendService.get('company_preference_franchise_product');
    }

    getGeolocationPreferences(): Observable<any> {
        return this.backendService.get('company_preference_geolocation');
    }

    // OPTIMIZATION PREFERENCES FUNCTIONS

    getWarehouseCoordinates(address: string) {
        return this.backendService.post('/geocode', { addresses: [address] });
    }
    updateWarehouse(
        warehouse: Partial<{
            address: string;
            coordinates: { longitude: number; latitude: number };
        }>,
    ) {
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { warehouse } },
        });
    }

    updateServiceTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { defaultServiceTime: value } },
        });
    }
    updateMinServiceTimeStat(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { minServiceTimeStat: value } },
        });
    }
    updateMaxServiceTimeStat(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { maxServiceTimeStat: value } },
        });
    }
    updateRefreshTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { controlpanel: { refreshTime: value } },
        });
    }
    updateAutomaticEndRouteTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { controlpanel: { endRouteTime: value } },
        });
    }

    updateOrderMaxTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { orders: { orderMaxTime: value } },
        });
    }

    updateMinAvgServiceTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { management: { minAvgServiceTime: value } },
        });
    }


    updateMaxAvgServiceTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { management: { maxAvgServiceTime: value } },
        });
    }

    updateOrderSyncEachTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { orders: { orderSyncEachTime: value } },
        });
    }

    updateStoppedCommercialMaxTime(stoppedCommercialMaxTime: number) {
        return this.backendService.patch('/user/me', {
            preferences: { geolocation: { stoppedCommercialMaxTime } },
        });
    }

    updateStoppedDriverMaxTime(stoppedDriverMaxTime: number) {
        return this.backendService.patch('/user/me', {
            preferences: { geolocation: { stoppedDriverMaxTime } },
        });
    }

    updateScheduleGeolocation(schedule) {
        return this.backendService.post('company_preference_geolocation', schedule);
    }

    updateOrderSyncTime(value: number) {
        return this.backendService.patch('/user/me', {
            preferences: { orders: { orderSyncTime: value } },
        });
    }
    updateDeliverySchedule(value: { start?: number; end?: number }) {
        return this.backendService.patch('/user/me', {
            preferences: {
                optimization: { defaultSettings: { deliverySchedule: value } },
            },
        });
    }
    updateNofitications(data: any) {
        return this.backendService.put('user/me', data);
    }

    updateQuantityDelayModifySchedule(value: number) {

        return this.backendService.patch('/user/me', {
            preferences: {
                optimization: { quantityDelayModifySchedule: value },
            },
        });
    }

    updateDelayWhenPassingTime(value: number) {

        return this.backendService.patch('/user/me', {
            preferences: {
                optimization: { delayWhenPassingTime: value },
            },
        });
    }

    updateQuantityAdvancesModifySchedule(value: number) {

        return this.backendService.patch('/user/me', {
            preferences: {
                optimization: { quantityAdvancesModifySchedule: value },
            },
        });
    }

    updateAdvanceWhenAnticipatingTime(value: number) {

        return this.backendService.patch('/user/me', {
            preferences: {
                optimization: { advanceWhenAnticipatingTime: value },
            },
        });
    }

    toggleOptionsOptimizationPreference(
        key: OP,
        value: OptimizationPreferences['createSession'][OP],
    ) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { createSession: { ...object } } },
        });
    }

    toggleOptionsOptimizationPreferenceAction(
        key: OPA,
        value: OptimizationPreferences[OPA],
    ) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: { optimization:  { ...object }  },
        });
    }

    toggleDashboardPreferenceAction(
        key: DB,
        value: DashboardPreferences[DB],
    ) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.post('company_preference_route_dashboard', object);
    }

    toggleAppPreference(key: APP, value: AppPreferences[APP]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: {
                app: {
                    [key]: value,
                },
            },
        });
    }

    toggleFranchisePreference(key: FR, value: FranchisePreferences['products'][FR]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.post('company_preference_franchise_product', {
            [key]: value
        });
    }

    toggleProductPreference(key: PRP, value: ProductsPreferences[PRP]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.post('company_preference_product', 
            { 
                [key]: value
            }
        );
    }

    toggleOrdersPreference(key: OR, value: OrdersPreferences[OR]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: {
                orders: {
                    [key]: value,
                },
            },
        });
    }

    toggleOptionsControlPanelPreference(key: CP, value: ControlPanelPreferences[CP]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: { controlpanel: { ...object } },
        });
    }
    ToggleOptionsManamgementPreference(key: MN, value: ManagementPreferences[MN]) {
        console.log(key);
        console.log(value);
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: { management: object },
        });
    }

    updateTraffic(traffic: {
        range1?: TrafficRange;
        range2?: TrafficRange;
        range3?: TrafficRange;
    }) {
        return this.backendService.patch('/user/me', {
            preferences: { optimization: { defaultSettings: { traffic: traffic } } },
        });
    }

    // INTERFACE PREFERENCES FUNCTIONS

    toggleOptionsInterfacePreference(key: IP, value: InterfacePreferences[IP]) {
        const object = {} as any;
        object[key] = value;
        return this.backendService.patch('/user/me', {
            preferences: { interface: { deliveryPointListFields: object } },
        });
        //const interfacePreferences = { ...PREFERENCES.interfacePreferences, [key]: value };
        //PREFERENCES = { ...PREFERENCES, interfacePreferences };
        //return of(PREFERENCES);
    }

    // // PRINTING PREFERENCES FUNCTIONS

    // toggleOptionsPrintingPreference(key: PP, value: PrintingPreferences[PP]) {
    //     const printingPreferences = { ...PREFERENCES.printingPreferences, [key]: value };
    //     PREFERENCES = { ...PREFERENCES, printingPreferences };
    //     return of(PREFERENCES);
    // }

    updateRangeAddreses(
        addresses: Partial<{
            orderRange: {
                address: string;
            };
        }>,
    ) {
        return this.backendService.patch('/user/me', {
            preferences: { addresses },
        });
    }

    updateRangeDistance(
        addresses: Partial<{
            orderRange: {
                allowedRadius: number;
            };
        }>,
    ) {
        return this.backendService.patch('/user/me', {
            preferences: { addresses },
        });
    }

    updateMinPayment(minPayment: any) {
        return this.backendService.patch('/user/me', {
            preferences: { payment: minPayment },
        });
    }


    UpdateSumQuantityBuyWithoutMinimunToTicket(sumQuantityBuyWithoutMinimunToTicket){
        return this.backendService.patch('/user/me', {
            preferences: { payment: sumQuantityBuyWithoutMinimunToTicket },
        });
    }

    UpdateAllowChangeOrderPaymentStatus(allowChangeOrderPaymentStatus){
        return this.backendService.patch('/user/me', {
            preferences: { payment: allowChangeOrderPaymentStatus },
        });
    }


    UpdateSumDeliveryPriceToTicket(sumDeliveryPriceToTicket){
        return this.backendService.patch('/user/me', {
            preferences: { payment: sumDeliveryPriceToTicket },
        });
    }

    updatePrepaidPayment(prepaidPayment: any) {
        return this.backendService.patch('/user/me', {
            preferences: { payment: prepaidPayment },
        });
    }

    updateAllowBuyWithoutMinimum(allowBuyWithoutMinimun: any) {
        return this.backendService.patch('/user/me', {
            preferences: { payment: allowBuyWithoutMinimun },
        });
    }


    UpdateReturnToMailBoxOrder(returnToMailBoxOrder: any) {
        return this.backendService.post('company_preference_preparation', {
            returnToMailBoxOrder
        });
    }

    updateTimeReturnToMailBoxOrder(timeReturnToMailBoxOrder: number){
        return this.backendService.post('company_preference_preparation', {
            timeReturnToMailBoxOrder
        });
    }

    updateQuantityBuyWithoutMinimum(quantityBuyWithoutMinimun: any) {
        return this.backendService.patch('/user/me', {
            preferences: { payment: quantityBuyWithoutMinimun },
        });
    }

    createPrefereceDelivery(data: any){
        return this.backendService.post('company_preference_delivery' ,data);
    }

    UpdatePreferenceDelivery(data: any){
        return this.backendService.put('company_preference_delivery/'+ data.id ,data);
    }

    createPreferenceSchedule( data: any ) {
        return this.backendService.post( 'company_preference_delivery_schedule', data );
    }

    getPreferenceSchedule() {
        return this.backendService.get('company_preference_delivery_schedule_list');
    }

    updatePreferenceSchedule( idSchedule: number, data: any ) {
        return this.backendService.put( `company_preference_delivery_schedule/${ idSchedule }`, data );
    }

    deletePreferenceSchedule(idSchedule){
        return this.backendService.delete( `company_preference_delivery_schedule/${ idSchedule }` );
    }

    //get company_preference_maintenance
    getCompanyPreferenceMaintenance(){
        return this.backendService.get('company_preference_maintenance');
    }
    //get company_preference_notification
    getCompanyPreferenceNotification(){
        return this.backendService.get('company_preference_comments_app');
    }
    // add others comment
    createCommentsApp( data: any ) {
        return this.backendService.post(`company_preference_comments_app`, data );
    }
     // delete others comment
     deleteCommentsApp( id:any ) {
        return this.backendService.delete(`company_preference_comments_app/` + id );
    }
    // create integration email
    createIntegrationEmail( data: any ) {
        return this.backendService.post(`company_preference_integration`, data );
    }
    // update integration email
    updateIntegrationEmail( id: any, data: any ) {
        return this.backendService.put(`company_preference_integration/`+ id, data );
    }
     // delete integration email
     deleteIntegrationEmail( id:any ) {
        return this.backendService.delete(`company_preference_integration/` + id );
    }
    // UPDATE company_preference_maintenance
    updateCompanyPreferenceMaintenance( data: any ) {
        return this.backendService.post('company_preference_maintenance', data );
    }

    // getMaintenanceVehicleStateType
    getMaintenanceVehicleStateType(){
        return this.backendService.get('maintenance_vehicle_state_type');
    }
    // getMaintenancePreferenceVehicleStateType
    getMaintenancePreferenceVehicleStateType(){
        return this.backendService.get('maintenance_preference_vehicle_state_type');
    }
    // Create MaintenanceVehicleStateType
    createMaintenanceVehicleStateType( data: any ) {
        return this.backendService.post(`maintenance_review_type_by_company`, data );
    }
    // updateMaintenanceVehicleStateType
    updateMaintenanceVehicleStateType( data: any ) {
        return this.backendService.post(`maintenance_preference_vehicle_state_type`, data );
    }

     // getMaintenanceReviewType
     getMaintenanceReviewType(){
        return this.backendService.get('maintenance_review_type');
    }
    //getMaintenancePreferenceReview
    getMaintenancePreferenceReview(){
        return this.backendService.get('maintenance_preference_review');
    }
    // updateMaintenanceReviewType
    updateMaintenanceReviewType(data: any ) {
        return this.backendService.post( `maintenance_preference_review`, data );
    }

    // company preference bill
    //get company_preference_maintenance
    getCompanyPreferenceBill(){
        return this.backendService.get('company_preference_bill');
    }
    // UPDATE company_preference_maintenance
    updateCompanyPreferenceBill( data: any ) {
        return this.backendService.post('company_preference_bill', data );
    }


    constructor(private backendService: BackendService) {}
}
