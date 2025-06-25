import { EasyrouteAction, EasyrouteActionTypes } from './easyroute.actions';

export const EASYROUTE_FEATURE_KEY = 'easyroute';

/**
 * Interface for the 'Easyroute' data used in
 *  - EasyrouteState, and
 *  - easyrouteReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface EasyrouteState {
    list: Entity[]; // list of Easyroute; analogous to a sql normalized table
    selectedId?: string | number; // which Easyroute record has been selected
    loaded: boolean; // has the Easyroute list been loaded
    error?: any; // last none error (if any)
}

export interface EasyroutePartialState {
    readonly [EASYROUTE_FEATURE_KEY]: EasyrouteState;
}

export const initialState: EasyrouteState = {
    list: [],
    loaded: false,
};

export function easyrouteReducer(
    state: EasyrouteState = initialState,
    action: EasyrouteAction,
): EasyrouteState {
    switch (action.type) {
        case EasyrouteActionTypes.EasyrouteLoaded: {
            state = {
                ...state,
                list: action.payload,
                loaded: true,
            };
            break;
        }
    }
    return state;
}
