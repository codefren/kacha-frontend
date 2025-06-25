import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    STATEGEOLOCATION_FEATURE_KEY,
    StateGeolocationState,
} from './state-geolocation.reducer';

// Lookup the 'StateGeolocation' feature state managed by NgRx
const getStateGeolocationState = createFeatureSelector<StateGeolocationState>(
    STATEGEOLOCATION_FEATURE_KEY,
);

const getLoaded = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.loaded,
);
const getError = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.error,
);

const getShow = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.show
);

const getLoading = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.loading
);

const getAllStateGeolocation = createSelector(
    getStateGeolocationState,
    getLoaded,
    (state: StateGeolocationState, isLoaded) => {
        return isLoaded ? state.list : [];
    },
);

const getHoverId = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.hoverId
)

const getSelectedId = createSelector(
    getStateGeolocationState,
    (state: StateGeolocationState) => state.selectedId,
);
const getSelectedStateGeolocation = createSelector(
    getAllStateGeolocation,
    getSelectedId,
    (stateGeolocation, id) => {
        const result = stateGeolocation.find((it) => it['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);

const getShowAllSelectedUsers = createSelector (
    getStateGeolocationState,
    (state: StateGeolocationState) => state.showSelected
);

export const stateGeolocationQuery = {
    getLoaded,
    getError,
    getAllStateGeolocation,
    getSelectedStateGeolocation,
    getShow,
    getLoading,
    getHoverId,
    getSelectedId,
    getShowAllSelectedUsers
};
