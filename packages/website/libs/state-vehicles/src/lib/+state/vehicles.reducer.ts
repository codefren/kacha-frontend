import { VehiclesAction, VehiclesActionTypes } from './vehicles.actions';
import { Vehicle } from '@optimroute/backend';
import * as _ from 'lodash';

export const VEHICLES_FEATURE_KEY = 'vehicles';

export interface Vehicles {
    vehicles: Vehicle[];
    selectedId: number;
    loading: boolean;
    loaded: boolean;
    adding: boolean;
    added: boolean;
    updating: boolean;
    updated: boolean;
    deleting: boolean;
    deleted: boolean;
    error?: Error;
}

export interface VehiclesState {
    readonly vehicles: Vehicles;
}

export const initialState: Vehicles = {
    vehicles: [
        {
            id: 0,
            name: '',
            deliveryZoneId: '1',
            capacity: 0,
            deliveryWindowEnd: 0,
            deliveryWindowStart: 0,
            schedules: []
        }],
    selectedId: -1,
    loading: false,
    loaded: false,
    adding: false,
    updating: false,
    deleting: false,
    deleted: false,
    added: false,
    updated: false
};

export function vehiclesReducer(
    state: Vehicles = initialState,
    action: VehiclesAction,
): Vehicles {
    switch (action.type) {
        case VehiclesActionTypes.LOAD_VEHICLES: {
            return {
                ...state,
                loading: true,
            };
        }
        case VehiclesActionTypes.LOAD_VEHICLES_SUCCESS: {
            console.log(action.payload);
            return {
                ...state,
                vehicles: action.payload.vehicles,
                loading: false,
                loaded: true,
            };
        }
        case VehiclesActionTypes.LOAD_VEHICLES_FAIL: {
            return {
                ...state,
                loading: false,
            };
        }
        case VehiclesActionTypes.ADD_VEHICLE: {
            return {
                ...state,
                adding: true,
                added: false
            };
        }
        case VehiclesActionTypes.ADD_VEHICLE_SUCCESS: {
            return {
                ...state,
                vehicles: [...state.vehicles, action.payload.vehicle],
                adding: false,
                added: true
            };
        }
        case VehiclesActionTypes.ADD_VEHICLE_FAIL: {
            return {
                ...state,
                adding: false,
            };
        }
        case VehiclesActionTypes.UPDATE_VEHICLE: {
            return {
                ...state,
                updating: true,
                updated: false
            };
        }
        case VehiclesActionTypes.UPDATE_VEHICLE_SUCCESS: {
            console.log(action.payload.vehicle);
            const vehicles = state.vehicles.map(v => {
                if (v.id !== action.payload.id) return v;
                else {
                    return { ...v, ...action.payload.vehicle };
                }
            });
            return {
                ...state,
                vehicles: vehicles,
                updating: false,
                updated: true
            };
        }
        case VehiclesActionTypes.UPDATE_VEHICLE_FAIL: {
            return {
                ...state,
                updating: false,
            };
        }
        case VehiclesActionTypes.DELETE_VEHICLE: {
            return {
                ...state,
                deleting: true,
                deleted: false
            };
        }
        case VehiclesActionTypes.DELETE_VEHICLE_SUCCESS: {
            const vehicles = state.vehicles.filter(v => v.id !== +action.payload.id);
            return {
                ...state,
                vehicles: vehicles,
                deleting: false,
                deleted: true
            };
        }
        case VehiclesActionTypes.DELETE_VEHICLE_FAIL: {
            return {
                ...state,
                deleting: false,
            };
        }
        case VehiclesActionTypes.LOGOUT_VEHICLE: {
            return initialState;
        }

        default:
            return state;
    }
}
