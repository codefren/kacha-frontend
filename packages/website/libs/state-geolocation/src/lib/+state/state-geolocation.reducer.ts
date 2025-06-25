import {
    StateGeolocationAction,
    StateGeolocationActionTypes,
} from './state-geolocation.actions';
import * as _ from 'lodash';

export const STATEGEOLOCATION_FEATURE_KEY = 'stateGeolocation';

/**
 * Interface for the 'StateGeolocation' data used in
 *  - StateGeolocationState, and the reducer function
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface GeolocationEntity {
    id: number;
    name: string;
    email: string;
    lat: number;
    lng: number;
    localizationLastUpdate: string;
    violatedConstraintStoppedDriver: boolean;
    violatedConstraintStoppedCommercial: boolean;
    isDriver: boolean;
    user_profile: any[];
    user_vehicle: any[];
    stoppedTime: number;
    selected: boolean;
}

export class GeolocationEntity implements GeolocationEntity {
    constructor(){
        this.id = 0;
        this.name = '' ;
        this.email = '';
        this.lat = 0;
        this.lng = 0;
        this.localizationLastUpdate = '';
        this.violatedConstraintStoppedDriver = false;
        this.violatedConstraintStoppedCommercial = false;
        this.user_profile = [];
        this.user_vehicle = [];
        this.isDriver = false;
        this.stoppedTime = 0;
        this.selected = false;
    }
}

export interface StateGeolocationState {
    list: GeolocationEntity[]; // list of StateGeolocation; analogous to a sql normalized table
    selectedId?: number; // which StateGeolocation record has been selected
    loaded: boolean; // has the StateGeolocation list been loaded
    error?: any; // last none error (if any)
    show: boolean;
    loading: boolean;
    hoverId: number;
    showSelected: boolean;
}

export interface StateGeolocationPartialState {
    readonly [STATEGEOLOCATION_FEATURE_KEY]: StateGeolocationState;
}

export const initialState: StateGeolocationState = {
    list: [],
    loaded: false,
    show: false,
    loading: false,
    hoverId: -1,
    showSelected: false
};

export function reducer(
    state: StateGeolocationState = initialState,
    action: StateGeolocationAction,
): StateGeolocationState {
    switch (action.type) {

        case StateGeolocationActionTypes.LoadStateGeolocation: {
            return {
                ...state,
                loading: true,
            };
        }

        case StateGeolocationActionTypes.StateGeolocationLoaded: {
            return {
                ...state,
                list: action.payload.geolocation,
                loaded: true,
                loading: false
            };
        }

        case StateGeolocationActionTypes.StateGeolocationUpdateSuccess: {
            return {
                ...state,
                list: action.payload.geolocation,
                loaded: true
            } 
        }
        case StateGeolocationActionTypes.StateGeolocationShow: {
            return {
                ...state,
                loading: true
            }
        }
        case StateGeolocationActionTypes.StateGeolocationShowSuccess: {
            return {
                ...state,
                show: action.payload.show
            }
        }

        case StateGeolocationActionTypes.StateGeolocationSelected: {
           
            return {
                ...state,
                selectedId: action.payload.id
            }
        }


        case StateGeolocationActionTypes.StateGeolocationHoverIn: {

            return {
                ...state,
                hoverId: action.payload.id
            }
        }

        case StateGeolocationActionTypes.StateGeolocationHoverOut: {
            
            return {
                ...state,
                hoverId: action.payload.id
            }
        }

        case StateGeolocationActionTypes.StateGeolocationShowSelected: {
            let geolocation = _.cloneDeep(state.list);
            geolocation.find(x => +x.id === +action.payload.id).selected = action.payload.show;

            return {
                ...state,
                list: geolocation
            }
        }

        case StateGeolocationActionTypes.StateGeolocationShowSelectedUser: {
            return {
                ...state,
                showSelected: action.payload.show
            }
        }

        case StateGeolocationActionTypes.StateGeolocationLogOut: {
            return initialState;
        }
        
        
    }
    return state;
}
