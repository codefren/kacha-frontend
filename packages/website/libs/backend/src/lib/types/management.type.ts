import { Zone } from './delivery-zones.type';
import { Vehicle } from './vehicles.type';

export interface DeliveryPointsManagement {
    zones: Zone[];
}

export interface VehiclesManagement {
    vehicles: Vehicle[];
}

export interface DeliveryPoint {
    id?: number;
    identifier: string;
    zoneId?: number;
    name: string;
    address: string;
    serviceTime: number;
    demand: number;
    priority: number;
    comments: string;
}

export type MT = DeliveryPoint | Vehicle;

export type KV = keyof Vehicle;

export type KDP = keyof DeliveryPoint;
