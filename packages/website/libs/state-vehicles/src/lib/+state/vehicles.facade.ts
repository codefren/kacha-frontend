import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { VehiclesState } from './vehicles.reducer';
import { vehiclesQuery } from './vehicles.selectors';
import { LoadVehicles, AddVehicle, UpdateVehicle, DeleteVehicle, LogoutVehicle, UpdateVehicleSuccess } from './vehicles.actions';
import { Vehicle } from '@optimroute/backend';

@Injectable()
export class VehiclesFacade {
    state$ = this.store.pipe(select(vehiclesQuery.getState));
    loaded$ = this.store.pipe(select(vehiclesQuery.getLoaded));
    loading$ = this.store.pipe(select(vehiclesQuery.getLoading));
    adding$ = this.store.pipe(select(vehiclesQuery.getAdding));
    added$ = this.store.pipe(select(vehiclesQuery.getAdded));
    updated$ = this.store.pipe(select(vehiclesQuery.getUpdated));
    updating$ = this.store.pipe(select(vehiclesQuery.getUpdating));
    deleting$ = this.store.pipe(select(vehiclesQuery.getDeleting));
    deleted$ = this.store.pipe(select(vehiclesQuery.getDeleted));
    allVehicles$ = this.store.pipe(select(vehiclesQuery.getAllVehicles));
    selectedVehicles$ = this.store.pipe(select(vehiclesQuery.getSelectedVehicles));

    constructor(private store: Store<VehiclesState>) {}

    loadAll() {
        this.store.dispatch(new LoadVehicles());
    }

    addVehicle(v: Vehicle) {
        this.store.dispatch(new AddVehicle({ vehicle: v }));
    }

    editVehicleSuccess(id: number, v: Partial<Vehicle>) {
        this.store.dispatch(new UpdateVehicleSuccess({ id, vehicle: v }));
    }

    editVehicle(id: number, v: Partial<Vehicle>, zoneId?: number) {
        this.store.dispatch(new UpdateVehicle({ id, vehicle: v, zoneId }));
    }

    deleteVehicle(id: number) {
        this.store.dispatch(new DeleteVehicle({ id }));
    }

    logout(){
        this.store.dispatch(new LogoutVehicle());
    }
}
