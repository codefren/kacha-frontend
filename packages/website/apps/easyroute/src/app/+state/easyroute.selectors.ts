import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EASYROUTE_FEATURE_KEY, EasyrouteState } from './easyroute.reducer';

// Lookup the 'Easyroute' feature state managed by NgRx
const getEasyrouteState = createFeatureSelector<EasyrouteState>(EASYROUTE_FEATURE_KEY);

const getLoaded = createSelector(
    getEasyrouteState,
    (state: EasyrouteState) => state.loaded,
);
const getError = createSelector(
    getEasyrouteState,
    (state: EasyrouteState) => state.error,
);

const getAllEasyroute = createSelector(
    getEasyrouteState,
    getLoaded,
    (state: EasyrouteState, isLoaded) => {
        return isLoaded ? state.list : [];
    },
);
const getSelectedId = createSelector(
    getEasyrouteState,
    (state: EasyrouteState) => state.selectedId,
);
const getSelectedEasyroute = createSelector(
    getAllEasyroute,
    getSelectedId,
    (easyroute, id) => {
        const result = easyroute.find(it => it['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);

export const easyrouteQuery = {
    getLoaded,
    getError,
    getAllEasyroute,
    getSelectedEasyroute,
};
