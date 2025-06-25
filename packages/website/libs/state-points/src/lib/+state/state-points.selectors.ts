import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STATEPOINTS_FEATURE_KEY, Points } from './state-points.reducer';

// Lookup the 'StatePoints' feature state managed by NgRx
const getStatePointsState = createFeatureSelector<Points>(
    STATEPOINTS_FEATURE_KEY,
);

const getLoaded = createSelector(
    getStatePointsState,
    (state: Points) => state.error,
);
const getError = createSelector(
    getStatePointsState,
    (state: Points) => state.error,
);

const getAllStatePoints = createSelector(
    getStatePointsState,
    getLoaded,
    (state: Points, isLoaded) => {
        return isLoaded ? state.points : [];
    },
);
const getSelectedId = createSelector(
    getStatePointsState,
    (state: Points) => state.selectedId,
);
const getSelectedStatePoints = createSelector(
    getAllStatePoints,
    getSelectedId,
    (statePoints, id) => {
        const result = statePoints.find((it) => it['id'] === ''+id);
        return result ? Object.assign({}, result) : undefined;
    },
);

const getLoading = createSelector(
    getStatePointsState,
    (state: Points) => state.loading,
);


const getAdding = createSelector(
    getStatePointsState,
    (state: Points) => state.adding,
);
const getUpdating = createSelector(
    getStatePointsState,
    (state: Points) => state.updating,
);

const getUpdated = createSelector(
    getStatePointsState,
    (state: Points) => state.updated,
);
const getAdded = createSelector(
    getStatePointsState,
    (state: Points) => state.added,
);


export const statePointsQuery = {
    getLoaded,
    getError,
    getAllStatePoints,
    getSelectedStatePoints,
    getLoading,
    getAdding,
    getUpdating,
    getUpdated,
    getAdded
};
