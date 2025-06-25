import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    STATEEASYROUTE_FEATURE_KEY,
    StateEasyrouteState,
    StateEasyroute,
} from './state-easyroute.reducer';

// Lookup the 'StateEasyroute' feature state managed by NgRx
const getStateEasyrouteState = createFeatureSelector<StateEasyroute>(
    STATEEASYROUTE_FEATURE_KEY,
);

const getIsAuthenticated = createSelector(
    getStateEasyrouteState,
    (state: StateEasyroute) => {
        return state.isAuthenticated;
    },
);

export const stateEasyrouteQuery = {
    getIsAuthenticated
};
