import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '@optimroute/backend';

export enum UsersActionTypes {
    LOAD_USERS = '[USERS] LOAD_USERS',
    LOAD_USERS_SUCCESS = '[USERS] LOAD_USERS_SUCCESS',
    LOAD_USERS_FAIL = '[USERS] LOAD_USERS_FAIL',
    ADD_USER = '[USERS] ADD_USER',
    ADD_USER_SUCCESS = '[USERS] ADD_USER_SUCCESS',
    ADD_USER_FAIL = '[USERS] ADD_USER_FAIL',
    UPDATE_USER = '[USERS] UPDATE_USER',
    UPDATE_USER_SUCCESS = '[USERS] UPDATE_USER_SUCCESS',
    UPDATE_USER_FAIL = '[USERS] UPDATE_USER_FAIL',
    DELETE_USER = '[USERS] DELETE_USER',
    DELETE_USER_SUCCESS = '[USERS] DELETE_USER_SUCCESS',
    DELETE_USER_FAIL = '[USERS] DELETE_USER_FAIL',
    LOAD_USERS_DRIVER = '[USERS_DRIVER] LOAD_USERS_DRIVER',
    LOAD_USERS_DRIVER_SUCCESS = '[USERS_DRIVER] LOAD_USERS_DRIVER_SUCCESS',
    LOAD_USERS_DRIVER_FAIL = '[USERS_DRIVER] LOAD_USERS_DRIVER_FAIL',
    LOAD_VEHICLE_TYPE = '[USERS_DRIVER] LOAD_VEHICLE_TYPE',
    LOAD_VEHICLE_TYPE_SUCCESS = '[USERS_DRIVER] LOAD_VEHICLE_TYPE_SUCCESS',
    LOAD_VEHICLE_TYPE_FAIL = '[USERS_DRIVER] LOAD_VEHICLE_TYPE_FAIL',
    LOGOUT_USERS = '[LOGOUT_USERS] LOGOUT_USERS'
}

export class LoadUsers implements Action {
    readonly type = UsersActionTypes.LOAD_USERS;
    constructor(public payload: { me: boolean }) {}
}

export class LoadUsersSuccess implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_SUCCESS;
    constructor(public payload: { Users: User[] }) {}
}

export class LoadUsersFail implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LoadUsersDrivers implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_DRIVER;
}


export class LoadUsersDriverSuccess implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_DRIVER_SUCCESS;
    constructor(public payload: { Users: User[] }) {}
}

export class LoadUsersDriverFail implements Action {
    readonly type = UsersActionTypes.LOAD_USERS_DRIVER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LoadVehicleTypes implements Action {
    readonly type = UsersActionTypes.LOAD_VEHICLE_TYPE;
}


export class LoadVehicleTypesSuccess implements Action {
    readonly type = UsersActionTypes.LOAD_VEHICLE_TYPE_SUCCESS;
    constructor(public payload: { vehiclesTypes: any[] }) {}
}

export class LoadVehicleTypesFail implements Action {
    readonly type = UsersActionTypes.LOAD_VEHICLE_TYPE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class AddUser implements Action {
    readonly type = UsersActionTypes.ADD_USER;
    constructor(public payload: { user: User }) {}
}

export class AddUsersuccess implements Action {
    readonly type = UsersActionTypes.ADD_USER_SUCCESS;
    constructor(public payload: { user: User }) {}
}

export class AddUserFail implements Action {
    readonly type = UsersActionTypes.ADD_USER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateUser implements Action {
    readonly type = UsersActionTypes.UPDATE_USER;
    constructor(public payload: { id: number; user: Partial<User> }) {}
}

export class UpdateUsersuccess implements Action {
    readonly type = UsersActionTypes.UPDATE_USER_SUCCESS;
    constructor(public payload: { id: number; user: Partial<User> }) {}
}

export class UpdateUserFail implements Action {
    readonly type = UsersActionTypes.UPDATE_USER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class DeleteUser implements Action {
    readonly type = UsersActionTypes.DELETE_USER;
    constructor(public payload: { id: number }) {}
}

export class DeleteUsersuccess implements Action {
    readonly type = UsersActionTypes.DELETE_USER_SUCCESS;
    constructor(public payload: { id: number }) {}
}

export class DeleteUserFail implements Action {
    readonly type = UsersActionTypes.DELETE_USER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class LogoutUsers implements Action{
    readonly type = UsersActionTypes.LOGOUT_USERS;
}
export type UsersAction =
    | LoadUsers
    | LoadUsersSuccess
    | LoadUsersFail
    | AddUser
    | AddUsersuccess
    | AddUserFail
    | UpdateUser
    | UpdateUsersuccess
    | UpdateUserFail
    | DeleteUser
    | DeleteUsersuccess
    | DeleteUserFail
    | LoadUsersDrivers
    | LoadUsersDriverSuccess
    | LoadUsersDriverFail
    | LogoutUsers
    | LoadVehicleTypes
    | LoadVehicleTypesSuccess
    | LoadVehicleTypesFail;

export const fromUsersActions = {
    LoadUsers,
    LoadUsersSuccess,
    LoadUsersFail,
    AddUser,
    AddUsersuccess,
    AddUserFail,
    UpdateUser,
    UpdateUsersuccess,
    UpdateUserFail,
    DeleteUser,
    DeleteUsersuccess,
    DeleteUserFail,
    LoadUsersDrivers,
    LoadUsersDriverSuccess,
    LoadUsersDriverFail,
    LogoutUsers,
    LoadVehicleTypes,
    LoadVehicleTypesSuccess,
    LoadVehicleTypesFail
    
};
