import { DeliveryZonesAction, DeliveryZonesActionTypes } from './delivery-zones.actions';
import { Zone } from '@optimroute/backend';

export const DELIVERYZONES_FEATURE_KEY = 'deliveryZones';

export interface DeliveryZones {
    zones: Zone[];
    selectedId: string;
    loading: boolean;
    loaded: boolean;
    error?: Error;
    updating: boolean;
    added: boolean;
    updated: boolean;
    lastAdded?: Zone;
}

export interface DeliveryZonesState {
    readonly deliveryZones: DeliveryZones;
}

export const initialState: DeliveryZones = {
    zones: null,
    selectedId: '-1',
    loaded: false,
    loading: false,
    updating: false,
    added: false,
    updated: false
};

export function deliveryZonesReducer(
    state: DeliveryZones = initialState,
    action: DeliveryZonesAction,
): DeliveryZones {
    switch (action.type) {
        case DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES: {
            state = {
                ...state,
                loading: false,
            };
            break;
        }
        case DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES_SUCCESS: {
            state = {
                ...state,
                zones: action.payload.results,
                loading: false,
                loaded: true,
            };
            break;
        }
        case DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES_FAIL: {
            state = {
                ...state,
                loading: false,
            };
            break;
        }
        case DeliveryZonesActionTypes.LOGOUT: {
            state = initialState;
            break;
        }
        case DeliveryZonesActionTypes.ADD_DELIVERY_ZONES: {
            return {
                ...state,
                added: false,
            };
        }
        case DeliveryZonesActionTypes.ADD_DELIVERY_ZONES_SUCCESS: {
            return {
                ...state,
                zones: [action.payload.zone, ...state.zones],
                added: true,
                lastAdded: action.payload.zone
            };
        }
        case DeliveryZonesActionTypes.ADD_DELIVERY_ZONES_FAIL: {
            return {
                ...state,
                added: false,
            };
        }

        case DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES: {
            return {
                ...state,
                updating: true,
                updated: false,
            };
        }
        case DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_SUCCESS: {
            let zones;
            console.log(state.zones);
            /* if (state.zones !== undefined && state.zones !== null) {
                zones = state.zones.map((v) => {
                    if (v.id !== action.payload.id) return v;
                    else {
                        return { ...v, ...action.payload.zone };
                    }
                });
            } */
            return {
                ...state,
                zones: zones,
                updating: false,
                updated: true,
            };
        }
        case DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_FAIL: {
            return {
                ...state,
                updating: false,
                updated: false,
            };
        }
        case DeliveryZonesActionTypes.REORDER_ZONE: {
            return {
                ...state,
                updating: true,
                updated: false,
            };
        }
        case DeliveryZonesActionTypes.REORDER_ZONE_SUCCESS: {
            return {
                ...state,
                updating: false,
                updated: true,
            };
        }
        case DeliveryZonesActionTypes.REORDER_ZONE_FAIL: {
            return {
                ...state,
                updating: false,
                updated: false,
            };
        }
    }
    return state;
}
