import { Time } from '@angular/common';
import { Coordinates } from '@optimroute/shared';

export interface TrafficRange {
    active: boolean;
    timeInterval?: { start: number; end: number };
    increaseProportion?: number;
}

export interface OptimizationPreferences {
    warehouse: {
        coordinates: Coordinates;
        address: string;
    };
    addresses: {
        orderRange: {
            address?: string;
            allowedRadius?: number;
        };
    };
    payment: {
        minPayment?: number;
        prepaidPayment?: number;
        allowBuyWithoutMinimun? :boolean;
        quantityBuyWithoutMinimun? : number;
    };
    dischargingMinutes: number;
    dischargingSeconds: number;
    minServiceTimeStat: number;
    maxServiceTimeStat: number;
    selectAsignationDateBeforePlanning: boolean;
    activateEmailNotLoadRoute: boolean;
    activateDeliveryNoteIntegration:boolean;
    activateRouteIntegration:boolean;
    activateCreateDeliveryPointByIntegration: boolean;
    allowArriveEarlier: boolean;
    allowArriveEarlierTime: number;
    allowArriveEarlierDistance: number;
    loadSessionIntoRoutePlanning: boolean;
    hourTime: number;
    scheduledDay:string;
    emailNotLoadRoute:string;
    showInformativeTableAssignedRoutes:boolean;
    createZoneWithPointsClosed: boolean;
    defaultSettings?: {
        forceDepartureTime: boolean;
        ignoreCapacityLimit: boolean;
        useAllVehicles: boolean;
        optimizeFromIndex: number;
        explorationLevel: number;
        deliverySchedule: {
            start?: number;
            end?: number;
        };
        optimizationParameters: {
            preference: {
                travelDistance: number;
                numVehicles: number;
                customerSatisfaction: number;
                vehicleTimeBalance: number;
            };
        };
        traffic: {
            range1: TrafficRange;
            range2: TrafficRange;
            range3: TrafficRange;
        };
    };
    createSession: {
        createDeliveryPoints: boolean;
        updateDeliveryPoints: boolean;
        createDeliveryZones: boolean;
        createUnassignedZone: boolean;
        setUnassignedZone: boolean;
        autoSaveSession: boolean;
        autoEvaluateOnCharge: boolean,
        joinDeliveryPointOnCharge: boolean;
        automaticallyExportAssign: boolean;
    };
    allowDelayTime: boolean;
    allowUpdateDelayTime: boolean;
    allowJoinIntegrationSession: boolean;
    updateScheduleAppByDelay: boolean;
    quantityDelayModifySchedule: number;
    delayWhenPassingTime: number;
    quantityAdvancesModifySchedule: number;
    advanceWhenAnticipatingTime: number;
    superviseDataUpdate:Boolean
}
export interface InterfacePreferences {
    expandZoneOptions: boolean;
    expandZones: boolean;
    expandRoutes: boolean;
    expandRouteOptions: boolean;
    autoEvaluation: boolean;
    readyTime: boolean;
    limitTime: boolean;
    arrival: boolean;
    travelTime: boolean;
    travelDistance: boolean;
    vehicleWaitTime: boolean;
    customerWaitTime: boolean;
    openTime: boolean;
    demand: boolean;
    volumetric: boolean;
    deliverytime: boolean;
    optionMenu: string;
    population: boolean;
    skill: boolean;
    allowDelayTime: boolean;
    routeSpecification: boolean;
    serviceCost: boolean;
    postalCode: boolean;
    box: boolean;
    ShowRegistration:boolean;
    ShowCapacity:boolean;
    ShowVolumen:boolean;
    ShowDriver:boolean;
    ShowDemand:boolean;

}

export interface ManagementPreferences {
    updateDeliveryPointAddressOnOpt: boolean;
    updateDeliveryPointDeliveryEndOnOpt: boolean;
    updateDeliveryPointDeliveryStartOnOpt: boolean;
    updateDeliveryPointNameOnOpt: boolean;
    updateDeliveryPointZoneIdOnOpt: boolean;
    updateDeliveryPointLeadTimeOnOpt: boolean;
    updateDeliveryPointDelayTimeOnOpt: boolean;
    activateAvgCalcServiceTime: boolean;
    minAvgServiceTime: number;
    maxAvgServiceTime: number;
    driverVerifyClientTime: boolean;

    updateDeliveryZoneColor: boolean;
    updateDeliveryZoneColorOnOpt: boolean;
    updateDeliveryZoneDeliveryEndOnOpt: boolean;
    updateDeliveryZoneDeliveryStartOnOpt: boolean;
    updateDeliveryZoneForceDepartureTimeOnOpt: boolean;
    updateDeliveryZoneIgnoreCapacityLimitOnOpt: boolean;
    updateDeliveryZoneNameOnOpt: boolean;
    updateDeliveryZoneUseAllVehiclesOnOpt: boolean;
    updateDeliveryZoneMaxDelayTimeOnOpt: boolean;
    updateOptimizationParametersCostDistance: boolean;
    updateOptimizationParametersCostDuration: boolean;
    updateOptimizationParametersCostVehicleWaitTime: boolean;
    updateOptimizationParametersExplorationLevel: boolean;

    useDeliveryPointPersistedName: boolean;
    useDeliveryPointPersistedAddress: boolean;
    useDeliveryPointPersistedDeliveryStart: boolean;
    useDeliveryPointPersistedScheduleEnd: boolean;


    useDeliveryPointPersistedServiceTime: boolean;

    useDeliveryPointPersistedLeadTime: boolean;
    useDeliveryPointPersistedDelayTime: boolean;
    useDeliveryPointPersistedZoneId: boolean;
    useAvgServiceTime: boolean;

    useDeliveryZonePersistedColor: boolean;
    useDeliveryZonePersistedDeliveryEnd: boolean;
    useDeliveryZonePersistedDeliveryStart: boolean;
    useDeliveryZonePersistedForceDeparture: boolean;
    useDeliveryZonePersistedIgnoreCapacityLimit: boolean;
    useDeliveryZonePersistedName: boolean;
    useDeliveryZonePersistedUseAllVehicles: boolean;
    useDeliveryZonePersistedOrder: boolean;
    useDeliveryZonePersistedMaxDelayTime: boolean;
    useDeliveryPointPersistedEmail:boolean;
    useDeliveryPointPersistedPhoneNumber:boolean;
    useDeliveryPointPersistedTimeSpecification:boolean;
    useDeliveryPointPersistedSendDeliveryNoteMail:boolean;
    useDeliveryPointPersistedPostalCode:boolean;

    usePointSaved: boolean;
    useOptimizationParametersCostDistance: boolean;
    useOptimizationParametersCostDuration: boolean;
    useOptimizationParametersCostVehicleWaitTime: boolean;
    useOptimizationParametersExplorationLevel: boolean;

    useDeliveryPointPersistedPopulation: boolean;
    updateDeliveryPointPopulation: boolean;
    updateDeliveryPointPhoneNumber: boolean;
    updateDeliveryPointEmail: boolean;
    updateDeliveryPointPersistedSendDeliveryNoteMail: boolean;


    useDeliveryPointDeliveryZoneSpecification: boolean;
    updateDeliveryPointDeliveryZoneSpecification: boolean;
    updateDeliveryPointPostalCode: boolean;

    saveOnDraw:boolean;

    cubicMeterConverter: number;
    activateCubicMeterConverter: boolean;
    activateEvaluateAssignAutomatic: boolean;
    sendJointDeliveryPointsDeliveryNotes: boolean;
}

export interface ControlPanelPreferences {
    assignedNextDay: boolean;
    refreshTime: number;
    endRouteTime: number;
    useOptMaxServiceTimeStat: boolean;
    activateSendDeliveryNotes: boolean;
    activateRouteSchedule: boolean;
}

export interface OrdersPreferences {
    orderMaxTime: number;
    orderSyncTime: number;
    orderSyncEachTime: number;
    assignedNextDay: boolean;
    acceptSameDay: boolean;
    activeMonday: boolean;
    activeFriday: boolean;
    activeSaturday: boolean;
    activeSunday: boolean;
    activeThursday: boolean;
    activeTuesday: boolean;
    activeWednesday: boolean;
    sendOnlyBeforeDay: boolean;
    changeAutomaticClientStatus: boolean;
    changeMaxTime: number
}

export interface GeolocationPreferences {
    stoppedDriverMaxTime: number;
    stoppedCommercialMaxTime: number;
    activeFriday: boolean;
    activeMonday: boolean;
    activeSaturday: boolean;
    activeSunday: boolean;
    activeThursday: boolean;
    activeTuesday: boolean;
    activeWednesday: boolean;
    endTimeFriday: number;
    endTimeMonday: number;
    endTimeSaturday: number;
    endTimeSunday: number;
    endTimeThursday: number;
    endTimeTuesday: number;
    endTimeWednesday: number;
    startTimeFriday: number;
    startTimeMonday: number;
    startTimeSaturday: number;
    startTimeSunday: number;
    startTimeThursday: number;
    startTimeTuesday: number;
    startTimeWednesday: number;
}

export interface AppPreferences {
    useDeliveryNoteSignature: boolean;
    useObservation: boolean;
    usePickupBoxes: boolean;
    useRefunds: boolean;
    orderLimitDay: number;
    clearOrderWithoutPreparation: boolean;
    dayClearOrderWithoutPreparation: number;
    multipleOrderBox: boolean;
    returnToMailBoxOrder: boolean;
    timeReturnToMailBoxOrder: number;
    updateLastPriceOnOrder: boolean;
    allowDeliveryNoteStatus: boolean;
    allowAutoSell: boolean;
    autoFinishRouteOnLastPoint: boolean;
    allowRouteOrderChange: boolean;
    autoCheckProductDeliveryNote: boolean;
    blockOrderDayModification: boolean;
    allowAutomaticLogoutTime: boolean;
    automaticLogoutTime: number;
    applyRadiusActionClients: boolean;
    rangeDistanceInMeter: number;
    digitalSignature: boolean;
    photographyStamp: boolean;
    scanDeliveryNote: boolean;
    allowModifyDeliveryNote: boolean;
    everyRequired: boolean;
    appAllowOutOfRange: boolean;

    allowUpdatingClientInformation: boolean;
    allowUpdateClientSchedule: boolean;
    serviceUpdateSchedule: boolean;
    allowUpdateClientPhoto: boolean;
    serviceUpdatePhoto: boolean;
    allowChangeMainAddress: boolean;
    serviceUpdateMainAddress: boolean;
    allowUpdateClientPhone: boolean;
    serviceUpdatePhone: boolean;
    deliveryTimeAsOpeningHours:boolean;

    markArrivalExitRadiusAction: boolean;
    arrivalExitRangeDistanceInMeter: number;
    showRefuelingSection: boolean;
    allowEditClientInApp: boolean;

}

export interface FranchisePreferences {
    products: {
        // Product

        updateProductName: boolean;
        updateProductDescription: boolean;
        updateProductCategory: boolean;
        updateProductSubCategory: boolean;
        updateProductFilters: boolean;
        updateProductShowInApp: boolean;
        updateProductPromotion: boolean;
        updateProductImages: boolean;
        updateProductHighlight: boolean;
        updateProductIsActive: boolean;
        updateProductPrice: boolean;
        updateProductQuantity: boolean;

        // Category

        updateCategoryName: boolean;
        updateCategoryIsActive: boolean;
        updateCategoryImages: boolean;

        // SubCategory

        updateSubCategoryName: boolean;
        updateSubCategoryIsActive: boolean;
        updateSubCategoryCategory: boolean;
        updateSubCategoryFilters: boolean;

        // Filters

        updateFilterName: boolean;
        updateFilterIsActive: boolean;
        updateFilterSubCategory: boolean;

        // MEASURE

        updateMeasureName: boolean;
        updateMeasureIsActive: boolean;
        updateMeasureActivateEquivalentAmount: boolean;
        updateMeasureEquivalentAmount: boolean;

    };
}

export interface PrintingPreferences {
    summaryPage: boolean;
    originalZone: boolean;
    customerName: boolean;
    customerCode: boolean;
    order: boolean;
    opening: boolean;
    deliveryTimeLimit: boolean;
    plannedArrivalTime: boolean;
    optionMenu: string;
    load: boolean;
    customerWaitTime: boolean;
    grid: boolean;
    lines: boolean;
}
export interface DashboardPreferences {
    showCosts: boolean;
}
export interface ProductsPreferences {
    updateProductName: boolean;
    updateProductDescription: boolean;
    updateProductCategory: boolean;
    updateProductSubCategory: boolean;
    updateProductFilters: boolean;
    updateProductShowInApp: boolean;
    updateProductPromotion: boolean;
    updateProductImages: boolean;
    updateProductHighlight: boolean;
    updateProductIsActive: boolean;
    updateProductPrice: boolean;
    updateProductQuantity: boolean;
    allowDiscount: boolean;
    equivalentFormatCalculatePrice: boolean;

    // Category

    updateCategoryName: boolean;
    updateCategoryIsActive: boolean;
    updateCategoryImages: boolean;

    // SubCategory

    updateSubCategoryName: boolean;
    updateSubCategoryIsActive: boolean;
    updateSubCategoryCategory: boolean;
    updateSubCategoryFilters: boolean;

    // Filters

    updateFilterName: boolean;
    updateFilterIsActive: boolean;
    updateFilterSubCategory: boolean;

    // Measure

    updateMeasureName: boolean;
    updateMeasureIsActive: boolean;
    updateMeasureActivateEquivalentAmount: boolean;
    updateMeasureEquivalentAmount: boolean;

    //Stock
    useStock: boolean;
}

export interface Addresses {
    orderRange: {
        address: string;
        allowedRadius: number;
    };
}

export interface Payment {
    minPayment?: number;
    prepaidPayment?: number;
    allowBuyWithoutMinimun? :boolean;
    quantityBuyWithoutMinimun? : number;
    sumQuantityBuyWithoutMinimunToTicket?: boolean;
    sumDeliveryPriceToTicket?: boolean;
    allowChangeOrderPaymentStatus?:boolean;
}




export type IP = keyof InterfacePreferences;
export type PP = keyof PrintingPreferences;
export type PRP = keyof ProductsPreferences;
export type OP = keyof OptimizationPreferences['createSession'];
export type OPA = keyof OptimizationPreferences;
export type MN = keyof ManagementPreferences;
export type CP = keyof ControlPanelPreferences;
export type UC = keyof GeolocationPreferences;
export type APP = keyof AppPreferences;
export type OR = keyof OrdersPreferences;
export type DB = keyof DashboardPreferences;
export type FR = keyof FranchisePreferences['products'];
