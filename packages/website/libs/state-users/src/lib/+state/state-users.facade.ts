import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { StateUsersState } from './state-users.reducer';
import { stateUsersQuery } from './state-users.selectors';
import { LoadUsers, AddUser, UpdateUser, DeleteUser, LoadUsersDrivers, LogoutUsers, LoadVehicleTypes } from './state-users.actions';
import { User } from '@optimroute/backend';

@Injectable()
export class StateUsersFacade {
    loaded$ = this.store.pipe(select(stateUsersQuery.getLoaded));
    selectedStateUsers$ = this.store.pipe(select(stateUsersQuery.getSelectedStateUsers));
    loading$ = this.store.pipe(select(stateUsersQuery.getLoading));
    adding$ = this.store.pipe(select(stateUsersQuery.getAdding));
    added$ = this.store.pipe(select(stateUsersQuery.getAdded));
    updating$ = this.store.pipe(select(stateUsersQuery.getUpdating));
    updated$ = this.store.pipe(select(stateUsersQuery.getUpdated));
    deleting$ = this.store.pipe(select(stateUsersQuery.getDeleting));
    allUsers$ = this.store.pipe(select(stateUsersQuery.getAllUsers));
    allUsersDrivers$ = this.store.pipe(select(stateUsersQuery.getAllUsersDriver));
    selectedVehicles$ = this.store.pipe(select(stateUsersQuery.getSelectedUsers));



    constructor(private store: Store<StateUsersState>) {}

    loadAll(me: boolean = false) {
        this.store.dispatch(new LoadUsers({ me }));
    }

    loadAllDriver() {
        this.store.dispatch(new LoadUsersDrivers());
    }

    loadVehicleType() {
        this.store.dispatch(new LoadVehicleTypes());
    }



    addUser(u: User) {
        this.store.dispatch(new AddUser({ user: u }));
    }

    editUser(id: number, u: Partial<User>) {
        this.store.dispatch(new UpdateUser({ id, user: u }));
    }

    deleteUser(id: number) {
        this.store.dispatch(new DeleteUser({ id }));
    }
    logout(){
        this.store.dispatch(new LogoutUsers());   
    }
}
