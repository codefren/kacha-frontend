import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FILTERSTATE_FEATURE_KEY, FilterStateState } from './filter-state.reducer';

// Lookup the 'FilterState' feature state managed by NgRx
const getFilterStateState = createFeatureSelector<FilterStateState>(
    FILTERSTATE_FEATURE_KEY,
);


const getError = createSelector(
    getFilterStateState,
    (state: FilterStateState) => state.error,
);

const getAllFilterState = createSelector(
    getFilterStateState,
    (state: FilterStateState, isLoaded) => {
        return state.list;
    },
);
const getSelectedId = createSelector(
    getFilterStateState,
    (state: FilterStateState) => state.selectedId,
);
const getSelectedFilterState = createSelector(
    getAllFilterState,
    getSelectedId,
    (filterState, id) => {
        const result = filterState.find((it) => it['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);

export const filterStateQuery = {
    getError,
    getAllFilterState,
    getSelectedFilterState,
};
