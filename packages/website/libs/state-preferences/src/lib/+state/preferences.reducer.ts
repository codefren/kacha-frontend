import { PreferencesAction, PreferencesActionTypes } from './preferences.actions';
import {
    InterfacePreferences,
    PrintingPreferences,
    OptimizationPreferences,
    ManagementPreferences,
    ControlPanelPreferences,
    OrdersPreferences,
    GeolocationPreferences,
    AppPreferences,
    FranchisePreferences,
    ProductsPreferences,
    Addresses,
    Payment,
    Delivery,
    DashboardPreferences
} from '@optimroute/backend';
import { Time } from '@angular/common';
import { AnyFn } from '@ngrx/store/src/selector';
import { secondsToDayTimeAsString } from '@optimroute/shared';
import * as _ from 'lodash';
import { act } from '@ngrx/effects';

export const PREFERENCES_FEATURE_KEY = 'preferences';

/**
 * Interface for the 'Preferences' data used in
 *  - PreferencesState, and
 *  - preferencesReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */

export interface PreferencesPartialState {
    readonly [PREFERENCES_FEATURE_KEY]: PreferencesState;
}

export interface Preferences {
    optimization: OptimizationPreferences;
    interface: InterfacePreferences;
    printing: PrintingPreferences;
    management: ManagementPreferences;
    controlPanel: ControlPanelPreferences;
    orders: OrdersPreferences;
    Geolocation: GeolocationPreferences;
    app: AppPreferences;
    franchise: FranchisePreferences;
    product: ProductsPreferences;
    dashboard: DashboardPreferences;
    addresses: Addresses;
    payment: Payment;
    delivery: Delivery[];
    loaded?: boolean;
    userId?: number;
}

export interface PreferencesState {
    readonly preferences: Preferences;
}

export const preferencesInitialState: Preferences = {
    optimization: {
        allowUpdateDelayTime: false,
        createZoneWithPointsClosed: false,
        selectAsignationDateBeforePlanning: false,
        activateEmailNotLoadRoute: false,
        activateDeliveryNoteIntegration: false,
        activateRouteIntegration: false,
        activateCreateDeliveryPointByIntegration: false,
        hourTime:0,
        scheduledDay:'',
        emailNotLoadRoute:'',
        allowJoinIntegrationSession: false,
        showInformativeTableAssignedRoutes: false,
        loadSessionIntoRoutePlanning: false,
        warehouse: {
            address: '',
            coordinates: null,
        },
        addresses: {
            orderRange: {
                address: '',
                allowedRadius: 0,
            },
        },
        payment: {
            minPayment: 0,
            prepaidPayment: 0,
            allowBuyWithoutMinimun: false,
            quantityBuyWithoutMinimun: 0,
        },
        defaultSettings: {
            deliverySchedule: {},
            explorationLevel: 5,
            forceDepartureTime: false,
            ignoreCapacityLimit: false,
            optimizationParameters: {
                preference: {
                    customerSatisfaction: 0,
                    numVehicles: 0,
                    travelDistance: 0,
                    vehicleTimeBalance: 0,
                },
            },
            optimizeFromIndex: 1,
            traffic: {
                range1: {
                    active: false,
                    increaseProportion: 0,
                    timeInterval: { start: 0, end: 0 },
                },
                range2: {
                    active: false,
                    increaseProportion: 0,
                    timeInterval: { start: 0, end: 0 },
                },
                range3: {
                    active: false,
                    increaseProportion: 0,
                    timeInterval: { start: 0, end: 0 },
                },
            },
            useAllVehicles: false,
        },
        dischargingMinutes: 0,
        dischargingSeconds: 0,
        minServiceTimeStat: 0,
        maxServiceTimeStat: 0,
        createSession: {
            createDeliveryPoints: true,
            updateDeliveryPoints: false,
            createDeliveryZones: true,
            createUnassignedZone: true,
            setUnassignedZone: true,
            autoSaveSession: true,
            autoEvaluateOnCharge: false,
            joinDeliveryPointOnCharge: false,
            automaticallyExportAssign: false
        },
        allowDelayTime: false,
        updateScheduleAppByDelay: false,
        quantityDelayModifySchedule: 0,
        delayWhenPassingTime: 0,
        quantityAdvancesModifySchedule: 0,
        advanceWhenAnticipatingTime: 0,
        superviseDataUpdate: false,
        allowArriveEarlier: false,
        allowArriveEarlierDistance: 0,
        allowArriveEarlierTime: 0

    },
    franchise: {
        products: {
            updateProductName: false,
            updateProductDescription: false,
            updateProductCategory: false,
            updateProductSubCategory: false,
            updateProductFilters: false,
            updateProductShowInApp: false,
            updateProductPromotion: false,
            updateProductImages: false,
            updateProductHighlight: false,
            updateProductIsActive: false,
            updateProductPrice: false,
            updateProductQuantity: false,
            updateCategoryName: false,
            updateCategoryIsActive: false,
            updateCategoryImages: false,
            updateSubCategoryName: false,
            updateSubCategoryIsActive: false,
            updateSubCategoryCategory: false,
            updateSubCategoryFilters: false,
            updateFilterName: false,
            updateFilterIsActive: false,
            updateFilterSubCategory: false,
            updateMeasureName: false,
            updateMeasureIsActive: false,
            updateMeasureActivateEquivalentAmount: false,
            updateMeasureEquivalentAmount: false,
        },
    },
    interface: {
        autoEvaluation: false,
        customerWaitTime: false,
        expandRouteOptions: false,
        expandRoutes: false,
        expandZoneOptions: false,
        expandZones: false,
        limitTime: false,
        readyTime: false,
        travelDistance: false,
        travelTime: false,
        arrival: false,
        vehicleWaitTime: false,
        openTime: false,
        demand: false,
        volumetric: false,
        deliverytime: false,
        optionMenu: '',
        population: false,
        skill: false,
        allowDelayTime: false,
        routeSpecification: false,
        serviceCost: false,
        postalCode: false,
        box: false,
        ShowCapacity:false,
        ShowDemand: false,
        ShowDriver: false,
        ShowRegistration: false,
        ShowVolumen: false

    },
    printing: {
        summaryPage: false,
        originalZone: false,
        customerName: false,
        customerCode: false,
        order: false,
        opening: false,
        deliveryTimeLimit: false,
        plannedArrivalTime: false,
        load: false,
        customerWaitTime: false,
        grid: false,
        lines: false,
        optionMenu: '',
    },
    management: {
        usePointSaved: false,
        updateDeliveryPointAddressOnOpt: false,
        updateDeliveryPointDeliveryEndOnOpt: false,
        updateDeliveryPointDeliveryStartOnOpt: false,
        updateDeliveryPointNameOnOpt: false,
        updateDeliveryPointZoneIdOnOpt: false,
        updateDeliveryZoneColor: false,
        updateDeliveryZoneColorOnOpt: false,
        updateDeliveryZoneDeliveryEndOnOpt: false,
        updateDeliveryZoneDeliveryStartOnOpt: false,
        updateDeliveryZoneForceDepartureTimeOnOpt: false,
        updateDeliveryZoneIgnoreCapacityLimitOnOpt: false,
        updateDeliveryZoneNameOnOpt: false,
        useDeliveryPointPersistedAddress: false,
        useDeliveryPointPersistedDeliveryStart: false,
        useDeliveryPointPersistedScheduleEnd: false,
        useDeliveryPointPersistedServiceTime: false,
        useDeliveryZonePersistedColor: false,
        useDeliveryZonePersistedDeliveryEnd: false,
        useDeliveryZonePersistedDeliveryStart: false,
        useDeliveryZonePersistedForceDeparture: false,
        useDeliveryZonePersistedIgnoreCapacityLimit: false,
        useDeliveryZonePersistedName: false,
        useDeliveryZonePersistedUseAllVehicles: false,
        useDeliveryZonePersistedOrder: false,
        updateDeliveryZoneUseAllVehiclesOnOpt: false,
        useDeliveryPointPersistedName: false,
        updateDeliveryPointLeadTimeOnOpt: false,
        updateDeliveryZoneMaxDelayTimeOnOpt: false,
        useDeliveryPointPersistedLeadTime: false,
        updateDeliveryPointDelayTimeOnOpt: false,
        useDeliveryPointPersistedZoneId: false,
        useDeliveryZonePersistedMaxDelayTime: false,
        useDeliveryPointPersistedEmail:false,
        useDeliveryPointPersistedPhoneNumber:false,
        useDeliveryPointPersistedTimeSpecification:false,
        useDeliveryPointPersistedSendDeliveryNoteMail:false,
        updateOptimizationParametersCostDistance: false,
        updateOptimizationParametersCostDuration: false,
        updateOptimizationParametersCostVehicleWaitTime: false,
        useOptimizationParametersCostDistance: false,
        useOptimizationParametersCostDuration: false,
        useOptimizationParametersCostVehicleWaitTime: false,
        useDeliveryPointPersistedDelayTime: false,
        updateOptimizationParametersExplorationLevel: false,
        useOptimizationParametersExplorationLevel: false,
        activateAvgCalcServiceTime: false,
        minAvgServiceTime: 0,
        maxAvgServiceTime: 0,
        useAvgServiceTime: false,
        driverVerifyClientTime: false,
        saveOnDraw: false,
        useDeliveryPointPersistedPopulation: false,
        updateDeliveryPointPopulation: false,
        useDeliveryPointDeliveryZoneSpecification: false,
        updateDeliveryPointDeliveryZoneSpecification: false,
        updateDeliveryPointPostalCode: false,
        updateDeliveryPointEmail: false,
        updateDeliveryPointPhoneNumber: false,
        activateCubicMeterConverter: false,
        cubicMeterConverter: 0,
        activateEvaluateAssignAutomatic: false,
        useDeliveryPointPersistedPostalCode: false,
        sendJointDeliveryPointsDeliveryNotes: false,
        updateDeliveryPointPersistedSendDeliveryNoteMail: false
    },
    Geolocation: {
        stoppedCommercialMaxTime: 0,
        stoppedDriverMaxTime: 0,
        activeFriday: false,
        activeMonday: false,
        activeSaturday: false,
        activeSunday: false,
        activeThursday: false,
        activeTuesday: false,
        activeWednesday: false,
        endTimeFriday: 0,
        endTimeMonday: 0,
        endTimeSaturday: 0,
        endTimeSunday: 0,
        endTimeThursday: 0,
        endTimeTuesday: 0,
        endTimeWednesday: 0,
        startTimeFriday: 0,
        startTimeMonday: 0,
        startTimeSaturday: 0,
        startTimeSunday: 0,
        startTimeThursday: 0,
        startTimeTuesday: 0,
        startTimeWednesday: 0
    },
    controlPanel: {
        assignedNextDay: false,
        refreshTime: 0,
        endRouteTime: 0,
        useOptMaxServiceTimeStat: false,
        activateSendDeliveryNotes: false,
        activateRouteSchedule: false,
    },
    orders: {
        orderMaxTime: -1,
        orderSyncTime: -1,
        orderSyncEachTime: -1,
        assignedNextDay: false,
        acceptSameDay: false,
        activeFriday: false,
        activeMonday: false,
        activeSaturday: false,
        activeSunday: false,
        activeThursday: false,
        activeTuesday: false,
        activeWednesday: false,
        sendOnlyBeforeDay: false,
        changeAutomaticClientStatus: false,
        changeMaxTime: 0
    },
    app: {
        useDeliveryNoteSignature: false,
        usePickupBoxes: false,
        useRefunds: false,
        orderLimitDay: 0,
        clearOrderWithoutPreparation: false,
        dayClearOrderWithoutPreparation: 0,
        multipleOrderBox: false,
        returnToMailBoxOrder: false,
        timeReturnToMailBoxOrder: 0,
        updateLastPriceOnOrder: false,
        allowDeliveryNoteStatus: false,
        allowAutoSell: false,
        autoFinishRouteOnLastPoint: false,
        allowRouteOrderChange: false,
        autoCheckProductDeliveryNote: false,
        blockOrderDayModification: false,
        automaticLogoutTime: 0,
        allowAutomaticLogoutTime: false,
        applyRadiusActionClients: false,
        rangeDistanceInMeter: 0,
        digitalSignature: false,
        photographyStamp: false,
        scanDeliveryNote: false,
        allowModifyDeliveryNote: false,
        allowUpdatingClientInformation: false,
        allowUpdateClientSchedule: false,
        deliveryTimeAsOpeningHours:false,
        serviceUpdateSchedule: false,
        allowUpdateClientPhoto: false,
        serviceUpdatePhoto: false,
        allowChangeMainAddress: false,
        serviceUpdateMainAddress: false,
        allowUpdateClientPhone: false,
        serviceUpdatePhone: false,
        useObservation: false,
        everyRequired: false,
        appAllowOutOfRange: false,
        markArrivalExitRadiusAction: false,
        arrivalExitRangeDistanceInMeter: 0,
        showRefuelingSection: false,
        allowEditClientInApp:false
    },
    product: {
        updateProductName: false,
        updateProductDescription: false,
        updateProductCategory: false,
        updateProductSubCategory: false,
        updateProductFilters: false,
        updateProductShowInApp: false,
        updateProductPromotion: false,
        updateProductImages: false,
        updateProductHighlight: false,
        updateProductIsActive: false,
        updateProductPrice: false,
        updateProductQuantity: false,
        updateCategoryName: false,
        updateCategoryIsActive: false,
        updateCategoryImages: false,
        updateSubCategoryName: false,
        updateSubCategoryIsActive: false,
        updateSubCategoryCategory: false,
        updateSubCategoryFilters: false,
        updateFilterName: false,
        updateFilterIsActive: false,
        updateFilterSubCategory: false,
        updateMeasureName: false,
        updateMeasureIsActive: false,
        updateMeasureActivateEquivalentAmount: false,
        updateMeasureEquivalentAmount: false,
        useStock: false,
        allowDiscount: false,
        equivalentFormatCalculatePrice: false
    },
    addresses: {
        orderRange: {
            address: '',
            allowedRadius: 0,
        },
    },
    payment: {
        minPayment: 0,
        prepaidPayment: 0,
        allowBuyWithoutMinimun: false,
        quantityBuyWithoutMinimun :0,
    },
    dashboard: {
        showCosts: false
    },
    delivery: [],
    loaded: false,
};

export function preferencesReducer(
    state: Preferences = preferencesInitialState,
    action: PreferencesAction,
): Preferences {
    switch (action.type) {
        case PreferencesActionTypes.LOAD_PREFERENCES_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...action.payload.optimization,
                    dischargingSeconds: action.payload.optimization.defaultServiceTime % 60,
                    dischargingMinutes: Math.floor(
                        action.payload.optimization.defaultServiceTime / 60,
                    ),
                },
                Geolocation: action.payload.geolocation,
                interface: action.payload.interface,
                printing: action.payload.printing,
                management: action.payload.management,
                controlPanel: action.payload.controlpanel,
                orders: action.payload.orders,
                app: {
                    ...state.app,
                    useDeliveryNoteSignature: action.payload.app.useDeliveryNoteSignature,
                    useObservation: action.payload.app.useObservation,
                    usePickupBoxes: action.payload.app.usePickupBoxes,
                    useRefunds: action.payload.app.useRefunds,
                    orderLimitDay: action.payload.app.orderLimitDay,
                    updateLastPriceOnOrder: action.payload.app.updateLastPriceOnOrder,
                    allowDeliveryNoteStatus: action.payload.app.allowDeliveryNoteStatus,
                    allowAutoSell: action.payload.app.allowAutoSell,
                    autoFinishRouteOnLastPoint: action.payload.app.autoFinishRouteOnLastPoint,
                    allowRouteOrderChange: action.payload.app.allowRouteOrderChange,
                    autoCheckProductDeliveryNote: action.payload.app.autoCheckProductDeliveryNote,
                    blockOrderDayModification: action.payload.app.blockOrderDayModification,
                    allowAutomaticLogoutTime: action.payload.app.allowAutomaticLogoutTime,
                    automaticLogoutTime: action.payload.app.automaticLogoutTime,
                    applyRadiusActionClients:  action.payload.app.applyRadiusActionClients,
                    rangeDistanceInMeter:  action.payload.app.rangeDistanceInMeter,
                    markArrivalExitRadiusAction:  action.payload.app.markArrivalExitRadiusAction,
                    arrivalExitRangeDistanceInMeter:  action.payload.app.arrivalExitRangeDistanceInMeter,
                    digitalSignature: action.payload.app.digitalSignature,
                    photographyStamp: action.payload.app.photographyStamp,
                    everyRequired: action.payload.app.everyRequired,
                    scanDeliveryNote: action.payload.app.scanDeliveryNote,
                    allowModifyDeliveryNote: action.payload.app.allowModifyDeliveryNote,
                    appAllowOutOfRange: action.payload.app.appAllowOutOfRange,
                    allowUpdatingClientInformation: action.payload.app.allowUpdatingClientInformation,
                    allowUpdateClientSchedule: action.payload.app.allowUpdateClientSchedule,
                    deliveryTimeAsOpeningHours: action.payload.app.deliveryTimeAsOpeningHours,
                    serviceUpdateSchedule: action.payload.app.serviceUpdateSchedule,
                    allowUpdateClientPhoto: action.payload.app.allowUpdateClientPhoto,
                    serviceUpdatePhoto: action.payload.app.serviceUpdatePhoto,
                    allowChangeMainAddress: action.payload.app.allowChangeMainAddress,
                    serviceUpdateMainAddress: action.payload.app.serviceUpdateMainAddress,
                    allowUpdateClientPhone: action.payload.app.allowUpdateClientPhone,
                    serviceUpdatePhone: action.payload.app.serviceUpdatePhone,
                    showRefuelingSection: action.payload.app.showRefuelingSection,
                    allowEditClientInApp: action.payload.app.allowEditClientInApp

                },
                product: action.payload.product ? action.payload.product : state.product ,
                franchise: action.payload.franchise ? action.payload.franchise : state.franchise ,
                addresses: action.payload.addresses,
                payment: action.payload.payment ? action.payload.payment : state.payment,
                delivery: action.payload.delivery ? action.payload.delivery : state.delivery,
                loaded: true
            };
        }
        case PreferencesActionTypes.LOAD_PREFERENCES_FAIL: {
            return { ...state, loaded: false };
        }
        case PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES_SUCCESS: {
            return {
                ...state,
                product: action.payload ? action.payload : state.product,
                loaded: true,
            };
        }


        case PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES_SUCCESS: {
            return {
                ...state,
                dashboard: {
                    showCosts: action.payload.showCosts ? action.payload.showCosts : false
                },
                loaded: true,
            };
        }

        case PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES_FAIL: {
            return {
                ...state,
                loaded: false,
            };
        }



        case PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES_SUCCESS: {
            return {
                ...state,
                app: {
                    ...state.app,
                    clearOrderWithoutPreparation: action.payload.clearOrderWithoutPreparation,
                    dayClearOrderWithoutPreparation: action.payload.dayClearOrderWithoutPreparation,
                    multipleOrderBox: action.payload.multipleOrderBox,
                    returnToMailBoxOrder: action.payload.returnToMailBoxOrder,
                    timeReturnToMailBoxOrder: action.payload.timeReturnToMailBoxOrder
                }
            }
        }
        case PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER_SUCCESS: {
            return {
                ...state,
                app: {
                    ...state.app,
                    returnToMailBoxOrder: action.payload.returnToMailBoxOrder
                }
            }
        }

        case PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES_FAIL: {
            return { ...state, loaded: false };
        }

        case PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES_SUCCESS: {
            return {
                ...state,
                franchise: action.payload,
                loaded: true,
            };
        }
        case PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES_FAIL: {
            return { ...state, loaded: false };
        }

        case PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES: {
            return {
                ...state,
                loaded: false,
            };
        }
        case PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES_SUCCESS: {
            return {
                ...state,
                Geolocation: action.payload,
                loaded: true,
            };
        }
        case PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES_FAIL: {
            return { ...state, loaded: false };
        }

        case PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_SUCCESS: {
            const optimizationPreferences: OptimizationPreferences = {
                ...state.optimization,
                createSession: {
                    ...state.optimization.createSession,
                    [action.key]: action.value,
                },
            };
            return { ...state, optimization: optimizationPreferences };
        }

        case PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_SUCCESS: {
            const optimizationPreferences: OptimizationPreferences = {
                ...state.optimization,
                [action.key]: action.value,
            };
            return { ...state, optimization: optimizationPreferences };
        }

        case PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION_SUCCESS: {
            const appPreferences: AppPreferences = {
                ...state.app,
                [action.key]: action.value,
            };
            return { ...state, app: appPreferences };
        }

        case PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION_SUCCESS: {
            const franchisePreferences: FranchisePreferences = {
                ...state.franchise,
                products: {
                    ...state.franchise.products,
                    [action.key]: action.value,
                },
            };
            return { ...state, franchise: franchisePreferences };
        }

        case PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION_SUCCESS: {
            const productPreferences: ProductsPreferences = {
                ...state.product,
                [action.key]: action.value,
            };
            return { ...state, product: productPreferences };
        }

        case PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION_SUCCESS: {
            const ordersPreferences: OrdersPreferences = {
                ...state.orders,
                [action.key]: action.value,
            };
            return { ...state, orders: ordersPreferences };
        }

        case PreferencesActionTypes.TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_SUCCESS: {
            const controlPanelPreferences: ControlPanelPreferences = {
                ...state.controlPanel,
                [action.key]: action.value,
            };
            return { ...state, controlPanel: controlPanelPreferences };
        }
        case PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION: {
            return {
                ...state,
                loaded: false,
            };
        }

        case PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_SUCCESS: {
            console.log(action.payload);
            return {
                ...state,
                app: {
                    ...state.app,
                    timeReturnToMailBoxOrder: action.payload.timeReturnToMailBoxOrder
                }
            }
        }


        case PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_FAIL: {
            return {
                ...state,
                app: {
                    ...state.app,
                }
            }
        }

        case PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION_SUCCESS: {
            const interfacePreferences: InterfacePreferences = {
                ...state.interface,
                [action.key]: action.value,
            };
            return { ...state, interface: interfacePreferences, loaded: true };
        }
        case PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION_SUCCESS: {
            const managementPreferences: ManagementPreferences = {
                ...state.management,
                [action.key]: action.value,
            };
            return { ...state, management: managementPreferences, loaded: false };
        }
        case PreferencesActionTypes.TOGGLE_PRINTING_PREFERENCE_OPTION_SUCCESS: {
            const printingPreferences: PrintingPreferences = {
                ...state.printing,
                [action.key]: action.value,
            };
            return { ...state, printing: printingPreferences };
        }
        case PreferencesActionTypes.UPDATE_WAREHOUSE_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    warehouse: action.payload.warehouse,
                },
            };
        }
        case PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    addresses: action.payload.addresses,
                },
            };
        }
        case PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    dischargingSeconds: action.payload.defaultServiceTime % 60,
                    dischargingMinutes: Math.floor(action.payload.defaultServiceTime / 60),
                },
            };
        }

        case PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    minServiceTimeStat: action.payload.minServiceTimeStat,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_SUCCESS: {
            return {
                ...state,
                payment: {
                    ...state.payment,
                    sumDeliveryPriceToTicket: action.payload.payment.sumDeliveryPriceToTicket
                }
            }
        }

        case PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_SUCCESS: {
            return {
                ...state,
                payment: {
                    ...state.payment,
                    sumQuantityBuyWithoutMinimunToTicket: action.payload.payment.sumQuantityBuyWithoutMinimunToTicket
                }
            }
        }

        case PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_SUCCESS: {
            return {
                ...state,
                payment: {
                    ...state.payment,
                    allowChangeOrderPaymentStatus: action.payload.payment.allowChangeOrderPaymentStatus
                }
            }
        }

        case PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    maxServiceTimeStat: action.payload.maxServiceTimeStat,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME_SUCCESS: {
            return {
                ...state,
                management: {
                    ...state.management,
                    minAvgServiceTime: action.payload.minAvgServiceTime,
                },
            };
        }


        case PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME_SUCCESS: {
            return {
                ...state,
                management: {
                    ...state.management,
                    maxAvgServiceTime: action.payload.maxAvgServiceTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME_SUCCESS: {
            return {
                ...state,
                orders: {
                    ...state.orders,
                    orderSyncEachTime: action.payload.orderSyncEachTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME_SUCCESS: {
            return {
                ...state,
                controlPanel: {
                    ...state.controlPanel,
                    refreshTime: action.payload.refreshTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME_SUCCESS: {
            return {
                ...state,
                orders: {
                    ...state.orders,
                    orderSyncTime: action.payload.orderSyncTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME_SUCCESS: {
            return {
                ...state,
                controlPanel: {
                    ...state.controlPanel,
                    endRouteTime: action.payload.endRouteTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_ORDER_MAX_TIME_SUCCESS: {
            return {
                ...state,
                orders: {
                    ...state.orders,
                    orderMaxTime: action.payload.orderMaxTime,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE_SUCCESS: {
            console.log(action.payload.deliverySchedule);
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    defaultSettings: {
                        ...state.optimization.defaultSettings,
                        deliverySchedule: {
                            ...state.optimization.defaultSettings.deliverySchedule,
                            ...action.payload.deliverySchedule,
                        },
                    },
                },
            };
        }
        case PreferencesActionTypes.UPDATE_TRAFFIC_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    defaultSettings: {
                        ...state.optimization.defaultSettings,
                        traffic: {
                            ...state.optimization.defaultSettings.traffic,
                            ...action.payload.traffic,
                        },
                    },
                },
            };
        }

        case PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION: {
            return {
                ...state,
                loaded: false,
            };
        }

        case PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION_SUCCESS: {
            return {
                ...state,
                Geolocation: action.payload.schedule,
                loaded: true,
            };
        }

        case PreferencesActionTypes.LOGOUT: {
            return preferencesInitialState;
        }

        case PreferencesActionTypes.UPDATE_RANGE_DISTANCE_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    addresses: action.payload.addresses,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_MINPAYMENT_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    payment: action.payload.payment,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_PREPAID_PAYMENT_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    payment: action.payload.payment,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    payment: action.payload.payment,
                },
            };
        }

        case PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_SUCCESS: {
            return {
                ...state,
                optimization: {
                    ...state.optimization,
                    payment: action.payload.payment,
                },
            };
        }
        case PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY_SUCCESS: {
            let deliveries = _.cloneDeep(state.delivery);
            deliveries.push(action.payload.delivery);
            return {
                 ...state,
                 delivery: deliveries
             };
        }

        case PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY_SUCCESS: {
            let index = _.cloneDeep(state.delivery.findIndex(x => x.id == action.payload.delivery.id));
            let deliveries = _.cloneDeep(state.delivery);
            deliveries[index] = {
                ...action.payload.delivery
            }
            return {
                 ...state,
                 delivery: deliveries.sort((a, b) =>  b.price - a.price )
             };
        }

        default: {
            return state;
        }
    }
}
