import { Action } from '@ngrx/store';
import { Point } from '@optimroute/backend';
import { HttpErrorResponse } from '@angular/common/http';

export enum StatePointsActionTypes {
    LOAD_POINTS = '[POINTS] LOAD_POINTS',
    LOAD_POINTS_SUCCESS = '[POINTS] LOAD_POINTS_SUCCESS',
    LOAD_POINTS_FAIL = '[POINTS] LOAD_POINTS_FAIL',
    ADD_POINT = '[POINTS] ADD_POINT',
    ADD_POINT_SUCCESS = '[POINTS] ADD_POINT_SUCCESS',
    ADD_POINT_FAIL = '[POINTS] ADD_POINT_FAIL',
    UPDATE_POINT = '[POINTS] UPDATE_POINT',
    UPDATE_POINT_SUCCESS = '[POINTS] UPDATE_POINT_SUCCESS',
    UPDATE_POINT_FAIL = '[POINTS] UPDATE_POINT_FAIL',

    LOGOUT_POINTS = '[LOGOUT_POINTS] LOGOUT_POINTS'
}

export class LoadPoints implements Action {
    readonly type = StatePointsActionTypes.LOAD_POINTS;
}

export class LoadPointsSuccess implements Action {
    readonly type = StatePointsActionTypes.LOAD_POINTS_SUCCESS;
    constructor(public payload: { points: Point[] }) {}
}

export class LoadPointsFail implements Action {
    readonly type = StatePointsActionTypes.LOAD_POINTS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class AddPoints implements Action {
    readonly type = StatePointsActionTypes.ADD_POINT;
    constructor(public payload: { point: Point }) {}
}

export class AddPointsSuccess implements Action {
    readonly type = StatePointsActionTypes.ADD_POINT_SUCCESS;
    constructor(public payload: { point: Point }) {}
}

export class AddPointsFail implements Action {
    readonly type = StatePointsActionTypes.ADD_POINT_FAIL;
    constructor(public payload: { point: Point }) {}
}

export class UpdatePoint implements Action {
    readonly type = StatePointsActionTypes.UPDATE_POINT;
    constructor(public payload: { id: string, point: Partial<Point> }) {}
}

export class UpdatePointSuccess implements Action {
    readonly type = StatePointsActionTypes.UPDATE_POINT_SUCCESS;
    constructor(public payload: { id: string; point: Partial<Point> }) {}
}

export class UpdatePointFail implements Action {
    readonly type = StatePointsActionTypes.UPDATE_POINT_FAIL;
    constructor(public payload: { points: Point }) {}
}

export type StatePointsAction = 
    | LoadPoints
    | LoadPointsSuccess
    | LoadPointsFail
    | AddPoints
    | AddPointsSuccess
    | AddPointsFail
    | UpdatePoint
    | UpdatePointSuccess
    | UpdatePointFail;

export const fromStatePointsActions = {
    LoadPoints,
    LoadPointsSuccess,
    LoadPointsFail,
    AddPoints,
    AddPointsSuccess,
    AddPointsFail,
    UpdatePoint,
    UpdatePointSuccess,
    UpdatePointFail
};
