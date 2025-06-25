import { UsersAction, UsersActionTypes } from './state-users.actions';
import { User, Company } from '@optimroute/backend';

export const STATEUSERS_FEATURE_KEY = 'stateUsers';

/**
 * Interface for the 'StateUsers' data used in
 *  - StateUsersState, and
 *  - stateUsersReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Users {
    users: User[];
    selectedId: number;
    loading: boolean;
    loaded: boolean;
    adding: boolean;
    updating: boolean;
    deleting: boolean;
    updated: boolean;
    added: boolean;
    error?: Error;
}

export interface StateUsersState {
    readonly vehicles: Users;
}

export interface StateUsersPartialState {
    readonly [STATEUSERS_FEATURE_KEY]: StateUsersState;
}

export interface StateUsersState {
    readonly users: Users;
}

export const initialState: Users = {
    users: [{
        createdAt:"",
        email:"",
        id:0,
        preferences:{
            interface:{
                autoEvaluation:false,
                deliveryPointListFields:{
                    arrival:false,
                    customerWaitTime:false,
                    limitTime:false,
                    readyTime:false,
                    travelDistance:false,
                    travelTime:false,
                    vehicleWaitTime:false,
                },
                expandRouteOptions:false,
                expandRoutes:false,
                expandZoneOptions:false,
                expandZones:false
            },
            optimization:{
                createSession:{
                    createDeliveryPoints:false,
                    createDeliveryZones:false,
                    createUnassignedZone:false,
                    setUnassignedZone:false,
                    updateDeliveryPoints: false,
                    autoSaveSession: false
                },
                defaultServiceTime:0,
                minServiceTimeStat:0,
                maxServiceTimeStat:0,
                defaultSettings:{
                    deliverySchedule:{
                        end:0,
                        start:0
                    },
                    explorationLevel:0,
                    forceDepartureTime:false,
                    ignoreCapacityLimit:false,
                    optimizationParameters:{
                        preference:{
                            customerSatisfaction:0,
                            numVehicles:0,
                            travelDistance:0,
                            vehicleTimeBalance:0
                        }
                    },
                    optimizeFromIndex:0,
                    traffic:{
                        range1:{
                            active:false,
                            increaseProportion:0,
                            timeInterval:{
                                end:0,
                                start:0
                            }
                        },
                        range2:{
                            active:false,
                            increaseProportion:0,
                            timeInterval:{
                                end:0,
                                start:0
                            },
                        },
                        range3:{
                            active:false,
                            increaseProportion:0,
                            timeInterval:{
                                end:0,
                                start:0
                            },
                        }                    
                    },
                    useAllVehicles:false

                },
                warehouse:{
                    address:"",
                    coordinates:{
                        latitude:0,
                        longitude:0
                    },
                }

            },
            printing:{
                printProperties:{
                    customerCode:false,
                    customerName:false,
                    customerWaitTime:false,
                    deliveryTimeLimit:false,
                    load:false,
                    opening:false,
                    order:false,
                    originalZone:false,
                    plannedArrivalTime:false,
                    summaryPage:false
                }
            },
            controlPanel: {
                assignmentNextDay: false,
                refreshTime: 0
            },
            management: {
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
                usePointSaved: false
            }
        },
        name:"",
        nationalId:"",
        phone:"",
        surname:"",
        deliveryPointNationalId: "",
        deliveryPointCity: "",
        deliveryPointPostalCode: "",
        deliveryPointAdress: "",
        deliveryPointEmail: "",
        delveryPointName: "",
        subscription:{
            basePaid:false,
            basePriceEuroCents:0,
            paymentPeriodicityMonths:0,
            periodicPriceEuroCents:0,
        },
        address:{
            city:"",
            countryCode:"",
            province:"",
            streetAddress:"",
            zipCode:""
        },
        company:new Company(),
        updatedAt:"",
        profiles:[],
        isActive: false,
        country: '',
        countryCode: ''
    }],
    selectedId: -1,
    loading: false,
    loaded: false,
    adding: false,
    updating: false,
    deleting: false,
    updated: false,
    added: false
};


export function UsersReducer(
    state: Users = initialState,
    action: UsersAction,
): Users {
    switch (action.type) {
        case UsersActionTypes.LOAD_USERS: {
            return {
                ...state,
                loading: true,
            };
        }
        case UsersActionTypes.LOAD_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload.Users,
                loading: false,
                loaded: true,
            };
        }
        case UsersActionTypes.LOAD_USERS_FAIL: {
            return {
                ...state,
                loading: false,
            };
        }
        case UsersActionTypes.ADD_USER: {
            return {
                ...state,
                adding: true,
                added: false
            };
        }
        case UsersActionTypes.ADD_USER_SUCCESS: {
            return {
                ...state,
                adding: false,
                added: true
            };
        }
        case UsersActionTypes.ADD_USER_FAIL: {
            return {
                ...state,
                adding: false,
                added: false
            };
        }
        case UsersActionTypes.UPDATE_USER: {
            return {
                ...state,
                updating: true,
                updated: false
            };
        }
        case UsersActionTypes.UPDATE_USER_SUCCESS: {
            return {
                ...state,
                updating: false,
                updated: true
            };
        }
        case UsersActionTypes.UPDATE_USER_FAIL: {
            return {
                ...state,
                updating: false,
                updated: false
            };
        }
        case UsersActionTypes.DELETE_USER: {
            return {
                ...state,
                deleting: true,
            };
        }
        case UsersActionTypes.DELETE_USER_SUCCESS: {
            const users = state.users.filter(v => v.id !== action.payload.id);
            return {
                ...state,
                users: users,
                deleting: false,
            };
        }
        case UsersActionTypes.DELETE_USER_FAIL: {
            return {
                ...state,
                deleting: false,
            };
        }
        case UsersActionTypes.LOGOUT_USERS: {
            return initialState;
        }
        default:
            return state;
    }
}
