export interface Zone {
    id?: string;
    name: string;
    color: string;
    identifier: string;
    zoneSettings: ZoneSettings;
    isActive: boolean;
    order: number;
    Company?: {
        id: number;
    },
    vehicles?: number[]
    deliveryZoneSpecificationType?:[]
}

export interface ZoneSettings {
    forceDepartureTime: boolean;
    ignoreCapacityLimit: boolean;
    useAllVehicles: boolean;
    optimizeFromIndex: number;
    deliverySchedule: {
        start: number;
        end: number;
    };
    optimizationParameters: {
        sizeOfFleet: boolean;
        totalTime: boolean;
        customerWaitTime: boolean;
        delayTime: boolean;
        travelTime: boolean;
        travelDistance: boolean;
    };
}
