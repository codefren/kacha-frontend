import { Action } from '@ngrx/store';
import { Zone } from '@optimroute/backend';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryZones } from './delivery-zones.reducer';
import { PlanningDeliveryZone } from '@optimroute/state-route-planning';

export enum DeliveryZonesActionTypes {
    LOAD_DELIVERY_ZONES = '[deliveryZones] LOAD_DELIVERY_ZONES',
    LOAD_DELIVERY_ZONES_SUCCESS = '[deliveryZones] LOAD_DELIVERY_ZONES_SUCCESS',
    LOAD_DELIVERY_ZONES_FAIL = '[deliveryZones] LOAD_DELIVERY_ZONES_FAIL',
    ADD_DELIVERY_ZONES = '[deliveryZones] ADD_DELIVERY_ZONES',
    ADD_DELIVERY_ZONES_SUCCESS = '[deliveryZones] ADD_DELIVERY_ZONES_SUCCESS',
    ADD_DELIVERY_ZONES_FAIL = '[deliveryZones] ADD_DELIVERY_ZONES_FAIL',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE = '[deliveryZones] ADD_ROUTE_PLANNING_DELIVERY_ZONE',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS = '[deliveryZones] ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL = '[deliveryZones] ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL',
    UPDATE_DELIVERY_ZONES = '[deliveryZones] UPDATE_DELIVERY_ZONES',
    UPDATE_DELIVERY_ZONES_SUCCESS = '[deliveryZones] UPDATE_DELIVERY_ZONES_SUCCESS',
    UPDATE_DELIVERY_ZONES_FAIL = '[deliveryZones] UPDATE_DELIVERY_ZONES_FAIL',
    REORDER_ZONE = '[deliveryZones] REORDER_ZONE',
    REORDER_ZONE_SUCCESS = '[deliveryZones] REORDER_ZONE_SUCCESS',
    REORDER_ZONE_FAIL = '[deliveryZones] REORDER_ZONE_FAIL',
    LOGOUT = '[deliveryZones] LOGOUT'
}

export class LoadDeliveryZones implements Action {
    readonly type = DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES;
}

export class LoadDeliveryZonesSuccess implements Action {
    readonly type = DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES_SUCCESS;
    constructor(public payload: { results: Zone[] }) {}
}

export class LoadDeliveryZonesFail implements Action {
    readonly type = DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES_FAIL;
    constructor(public payload: Error) {}
}

export class Logout implements Action {
    readonly type = DeliveryZonesActionTypes.LOGOUT;
}


export class AddDeliveryZones implements Action {
    readonly type = DeliveryZonesActionTypes.ADD_DELIVERY_ZONES;
    constructor(public payload: { zone: Zone }) {}
}

export class AddDeliveryZonesSuccess implements Action {
    readonly type = DeliveryZonesActionTypes.ADD_DELIVERY_ZONES_SUCCESS;
    constructor(public payload: { zone: Zone }) {}
}

export class AddDeliveryZonesFail implements Action {
    readonly type = DeliveryZonesActionTypes.ADD_DELIVERY_ZONES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class UpdateDeliveryZones implements Action {
    readonly type = DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES;
    constructor(public payload: { id: string; zone: Partial<Zone> }) {}
}

export class UpdateDeliveryZonesSuccess implements Action {
    readonly type = DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_SUCCESS;
    constructor(public payload: { id: string; zone: Partial<Zone> }) {}
}

export class UpdateDeliveryZonesFail implements Action {
    readonly type = DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ReorderDeliveryZones implements Action {
    readonly type = DeliveryZonesActionTypes.REORDER_ZONE;
    constructor(public payload: { id: string; order: number }) {}
}

export class ReorderDeliveryZonesSuccess implements Action {
    readonly type = DeliveryZonesActionTypes.REORDER_ZONE_SUCCESS;
    constructor(public payload: { id: string; order: number }) {}
}

export class ReorderDeliveryZonesFail implements Action {
    readonly type = DeliveryZonesActionTypes.REORDER_ZONE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export type DeliveryZonesAction =
    | LoadDeliveryZones
    | LoadDeliveryZonesSuccess
    | LoadDeliveryZonesFail
    | Logout
    | AddDeliveryZones
    | AddDeliveryZonesSuccess
    | AddDeliveryZonesFail
    | UpdateDeliveryZones
    | UpdateDeliveryZonesSuccess
    | UpdateDeliveryZonesFail
    | ReorderDeliveryZones
    | ReorderDeliveryZonesSuccess
    | ReorderDeliveryZonesFail
export const fromDeliveryZonesActions = {
    LoadDeliveryZones,
    LoadDeliveryZonesSuccess,
    LoadDeliveryZonesFail,
    AddDeliveryZones,
    AddDeliveryZonesSuccess,
    AddDeliveryZonesFail,
    UpdateDeliveryZones,
    UpdateDeliveryZonesSuccess,
    UpdateDeliveryZonesFail,
    ReorderDeliveryZones,
    ReorderDeliveryZonesSuccess,
    ReorderDeliveryZonesFail,
    Logout
};
