import { Action } from '@ngrx/store';
import { Vehicle } from '@optimroute/backend';
import { HttpErrorResponse } from '@angular/common/http';

export enum VehiclesActionTypes {
    LOAD_VEHICLES = '[Vehicles] LOAD_VEHICLES',
    LOAD_VEHICLES_SUCCESS = '[Vehicles] LOAD_VEHICLES_SUCCESS',
    LOAD_VEHICLES_FAIL = '[Vehicles] LOAD_VEHICLES_FAIL',
    ADD_VEHICLE = '[Vehicles] ADD_VEHICLE',
    ADD_VEHICLE_SUCCESS = '[Vehicles] ADD_VEHICLE_SUCCESS',
    ADD_VEHICLE_FAIL = '[Vehicles] ADD_VEHICLE_FAIL',
    UPDATE_VEHICLE = '[Vehicles] UPDATE_VEHICLE',
    UPDATE_VEHICLE_SUCCESS = '[Vehicles] UPDATE_VEHICLE_SUCCESS',
    UPDATE_VEHICLE_FAIL = '[Vehicles] UPDATE_VEHICLE_FAIL',
    DELETE_VEHICLE = '[Vehicles] DELETE_VEHICLE',
    DELETE_VEHICLE_SUCCESS = '[Vehicles] DELETE_VEHICLE_SUCCESS',
    DELETE_VEHICLE_FAIL = '[Vehicles] DELETE_VEHICLE_FAIL',
    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION = '[Vehicles] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION',
    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS = '[Vehicles] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS',
    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL = '[Vehicles] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL',
    LOGOUT_VEHICLE = '[Vehicles] LOGOUT_VEHICLE'
}

export class LoadVehicles implements Action {
    readonly type = VehiclesActionTypes.LOAD_VEHICLES;
}

export class LoadVehiclesSuccess implements Action {
    readonly type = VehiclesActionTypes.LOAD_VEHICLES_SUCCESS;
    constructor(public payload: { vehicles: Vehicle[] }) {}
}

export class LoadVehiclesFail implements Action {
    readonly type = VehiclesActionTypes.LOAD_VEHICLES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class AddVehicle implements Action {
    readonly type = VehiclesActionTypes.ADD_VEHICLE;
    constructor(public payload: { vehicle: Vehicle }) {}
}

export class AddVehicleSuccess implements Action {
    readonly type = VehiclesActionTypes.ADD_VEHICLE_SUCCESS;
    constructor(public payload: { vehicle: Vehicle }) {}
}

export class AddVehicleFail implements Action {
    readonly type = VehiclesActionTypes.ADD_VEHICLE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateVehicle implements Action {
    readonly type = VehiclesActionTypes.UPDATE_VEHICLE;
    constructor(public payload: { id: number; vehicle: Partial<Vehicle>, zoneId?: number }) {}
}

export class UpdateVehicleSuccess implements Action {
    readonly type = VehiclesActionTypes.UPDATE_VEHICLE_SUCCESS;
    constructor(public payload: { id: number; vehicle: Partial<Vehicle> }) {}
}

export class UpdateVehicleFail implements Action {
    readonly type = VehiclesActionTypes.UPDATE_VEHICLE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class DeleteVehicle implements Action {
    readonly type = VehiclesActionTypes.DELETE_VEHICLE;
    constructor(public payload: { id: number }) {}
}

export class DeleteVehicleSuccess implements Action {
    readonly type = VehiclesActionTypes.DELETE_VEHICLE_SUCCESS;
    constructor(public payload: { id: number }) {}
}

export class DeleteVehicleFail implements Action {
    readonly type = VehiclesActionTypes.DELETE_VEHICLE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LogoutVehicle implements Action {
    readonly type = VehiclesActionTypes.LOGOUT_VEHICLE;
}

export type VehiclesAction =
    | LoadVehicles
    | LoadVehiclesSuccess
    | LoadVehiclesFail
    | AddVehicle
    | AddVehicleSuccess
    | AddVehicleFail
    | UpdateVehicle
    | UpdateVehicleSuccess
    | UpdateVehicleFail
    | DeleteVehicle
    | DeleteVehicleSuccess
    | DeleteVehicleFail
    | LogoutVehicle;

export const fromVehiclesActions = {
    LoadVehicles,
    LoadVehiclesSuccess,
    LoadVehiclesFail,
    AddVehicle,
    AddVehicleSuccess,
    AddVehicleFail,
    UpdateVehicle,
    UpdateVehicleSuccess,
    UpdateVehicleFail,
    DeleteVehicle,
    DeleteVehicleSuccess,
    DeleteVehicleFail,
    LogoutVehicle
};
