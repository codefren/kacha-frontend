import { StatePointsAction, StatePointsActionTypes } from './state-points.actions';
import { Point } from '@optimroute/backend';
export const STATEPOINTS_FEATURE_KEY = 'statePoints';

/**
 * Interface for the 'StatePoints' data used in
 *  - StatePointsState, and
 *  - statePointsReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Points {
    points: Point[];
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


export interface StatePointsState {
    readonly points: Points;
}

export interface StatePointsPartialState {
    readonly [STATEPOINTS_FEATURE_KEY]: StatePointsState;
}

export const initialStatePoints: Points = {
    added: false,
    adding: false,
    deleting: false,
    loaded: false,
    loading: false,
    points: [],
    selectedId: 0,
    updated: false,
    updating: false
};

export function statePointsReducer(
    state: Points = initialStatePoints,
    action: StatePointsAction,
): Points {
    switch (action.type) {
        case StatePointsActionTypes.LOAD_POINTS: {
            return {
                ...state,
                loading: true,
            }
            break;
        }
        case StatePointsActionTypes.LOAD_POINTS_SUCCESS: {
            return {
                ...state,
                loading: false,
                loaded: true
            }
            break;
        }
        case StatePointsActionTypes.LOAD_POINTS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false
            }
            break;
        }
        case StatePointsActionTypes.ADD_POINT: {
            return {
                ...state,
                adding: true
            }
            break;
        }
        case StatePointsActionTypes.ADD_POINT_SUCCESS: {
            return {
                ...state,
                adding: false,
                added: true
            }
            break;
        }
        case StatePointsActionTypes.ADD_POINT_FAIL: {
            return {
                ...state,
                adding: false,
                added: false
            }
            break;
        }
        case StatePointsActionTypes.UPDATE_POINT: {
            return {
                ...state,
                updating: true,
                updated: false
            }
            break;
        }
        case StatePointsActionTypes.UPDATE_POINT_SUCCESS: {
            return {
                ...state,
                updating: false,
                updated: true
            }
            break;
        }
        case StatePointsActionTypes.UPDATE_POINT_FAIL: {
            return {
                ...state,
                updating: false,
                updated: false
            }
            break;
        }
        default:
            return state;
    }
}
