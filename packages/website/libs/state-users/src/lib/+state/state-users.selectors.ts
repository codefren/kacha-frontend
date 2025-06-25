import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STATEUSERS_FEATURE_KEY, StateUsersState, Users } from './state-users.reducer';

// Lookup the 'StateUsers' feature state managed by NgRx
const getStateUsersState = createFeatureSelector<Users>(STATEUSERS_FEATURE_KEY);

const getLoaded = createSelector(
    getStateUsersState,
    (state: Users) => state.loaded,
);
const getError = createSelector(
    getStateUsersState,
    (state: Users) => state.error,
);

const getAllUsers = createSelector(
    getStateUsersState,
    getLoaded,
    (state: Users, isLoaded) => {
        return isLoaded ? state.users : [];
    },
);

const getAllUsersDriver = createSelector(
    getStateUsersState,
    getLoaded,
    (state: Users, isLoaded) => {
        return isLoaded ? state.users : [];
    },
);

const getSelectedId = createSelector(
    getStateUsersState,
    (state: Users) => state.selectedId,
);
const getSelectedStateUsers = createSelector(
    getAllUsers,
    getSelectedId,
    (stateUsers, id) => {
        const result = stateUsers.find((it) => it.id === id);
        return result ? Object.assign({}, result) : undefined;
    },
);
const getLoading = createSelector(
    getStateUsersState,
    (state: Users) => state.loading,
);
const getAdding = createSelector(
    getStateUsersState,
    (state: Users) => state.adding,
);
const getUpdating = createSelector(
    getStateUsersState,
    (state: Users) => state.updating,
);

const getUpdated = createSelector(
    getStateUsersState,
    (state: Users) => state.updated,
);
const getAdded = createSelector(
    getStateUsersState,
    (state: Users) => state.added,
);


const getDeleting = createSelector(
    getStateUsersState,
    (state: Users) => state.deleting,
);
const getSelectedUsers = createSelector(
    getAllUsers,
    getSelectedId,
    (vehicles, id) => {
        const result = vehicles.find(v => v['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);
export const stateUsersQuery = {
    getLoaded,
    getError,
    getAllUsers,
    getAllUsersDriver,
    getSelectedStateUsers,
    getLoading,
    getAdding,
    getUpdating,
    getDeleting,
    getSelectedUsers,
    getUpdated,
    getAdded
};
