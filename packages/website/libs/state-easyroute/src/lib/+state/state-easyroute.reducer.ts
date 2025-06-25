import { StateEasyrouteAction, StateEasyrouteActionTypes } from './state-easyroute.actions';
import { State } from '@ngrx/store';

export const STATEEASYROUTE_FEATURE_KEY = 'stateEasyroute';

/**
 * Interface for the 'StateEasyroute' data used in
 *  - StateEasyrouteState, and
 *  - stateEasyrouteReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface StateEasyroute {
    isAuthenticated: boolean;
    helpGuideId?: number;
    showTipsModal: boolean;
}

export interface StateEasyrouteState {
    readonly [STATEEASYROUTE_FEATURE_KEY]: StateEasyroute;
}

export const initialState: StateEasyroute = {
    isAuthenticated: false,
    helpGuideId: null,
    showTipsModal: false
};

export function stateEasyrouteReducer(
    state: StateEasyroute = initialState,
    action: StateEasyrouteAction,
): StateEasyroute {
    switch (action.type) {
        case StateEasyrouteActionTypes.AUTHENTICATE: {
            return {
                ...state,
                isAuthenticated: true
            };
        }
        case StateEasyrouteActionTypes.LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}
