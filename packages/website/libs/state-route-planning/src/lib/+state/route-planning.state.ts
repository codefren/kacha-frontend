import { Vehicle } from '@optimroute/backend';

export enum RoutePlanningViewingMode {
    zones,
    routes,
}

export enum RoutePlanningMapStage {
    empty = 'empty',
    zones = 'zones',
    routes = 'routes',
}

export interface DeliveryPoint {
    id: number;
    identifier: string;
    address: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
    afterSession?: boolean;
    name: string;
    demand: number;
    volumetric: number;
    deliveryWindow: {
        start?: number;
        end?: number;
    };
    serviceTime: number;
    priority: number;
    deliveryNotes?: string;
    deliveryNoteCode?: string;
    requiredSignature?: boolean;
    taxPercent?: number;
    order: number;

    travelDistanceToNext?: number;
    travelTimeToNext?: number;
    vehicleWaitTime?: number;
    arrivalDayTime?: number;
    arrivalTime?: number;
    customerWaitTime?: number;
    delayTime?: number;
    leadTime?: number;
    allowedDelayTime?: number;
    orderId?: number;
    zoneId?: number;
    population?: string;
    deliveryType?: string;
    service?: any;
    fromPending?: boolean;
    orderNumber?: string;
    companyPreferenceDelayTimeId?: number;
    allowDelayTime?: boolean;
    companyPreferenceDelayTimeType?: any;
    deliveryZoneSpecification?: any;
    deliveryZoneSpecificationCode?: string;
    deliveryZoneSpecificationName?: string;
    postalCode?: string;
    cost?: number;
    box?: number;
}
export interface RoutePlanningDeliveryPoint extends DeliveryPoint {
    travelDistanceToNext?: number;
    travelTimeToNext?: number;
    vehicleWaitTime?: number;
    customerWaitTime?: number;
    delayTime?: number;
    isServicedLate?: boolean;
    arrivalDayTime?: number;
}

export interface RouteSettings extends PlanningDeliveryZoneSettings {
    optimizeFromIndex: number;
}

export interface PlanningDeliveryZoneSettings {
    forceDepartureTime: boolean;
    deliverySchedule: {
        start?: number;
        end?: number;
    };
    ignoreCapacityLimit: boolean;
    settingsUseSkills: boolean;
    useAllVehicles: boolean;
    optimizationParameters: OptimizationParameters;
    explorationLevel: number; // [1 - 5]
    maxDelayTime?: number;
}

export interface OptimizationParameters {
    preference: {
        numVehicles: number;
        travelDistance: number;
        customerSatisfaction: number;
        vehicleTimeBalance: number;
    };
}

export const initialQuantifiedOptimizationParameters: OptimizationParameters = {
    preference: {
        numVehicles: 100,
        travelDistance: 100,
        customerSatisfaction: 100,
        vehicleTimeBalance: 100,
    },
};
export const initialOrderedOptimizationParameters: OptimizationParameters = {
    preference: {
        numVehicles: 1,
        travelDistance: 2,
        customerSatisfaction: 3,
        vehicleTimeBalance: 4,
    },
};

export interface Route {
    id: number;
    geometry: string;
    vehicle: {
        capacity: number;
        id: number;
        inputId: number;
        name: string;
        vehicleId: number;
        userId: number;
        userFeeCostId?: number;
        idERP?: string;
        totalVolumetricCapacity?: number
        user?: {
            id: number;
            name: string;
            surname: string;
        }
    };
    vehicleId?: number;
    solutionId?: number;
    color: string;
    name: string;
    departureDayTime: number;
    travelTimeToFirst: number;
    travelDistanceToFirst: number;
    deliveryPoints?: RoutePlanningDeliveryPoint[];
    deliveryPointsUnassigned?: RoutePlanningDeliveryPoint[];
    time: number;
    travelTime: number;
    vehicleWaitTime: number;
    customerWaitTime: number;
    avgCustomerWaitTime?: number;
    delayTime: number;
    avgDelayTime?: number;
    travelDistance: number;
    depotArrivalDayTime: number;
    deliveryPointsServicedLate: number;
    settings: RouteSettings;
    toggle?: boolean;
    costTotal?: number;
}

export interface RouteStatus {
    displayed: boolean;
    selected: boolean;
    evaluating: boolean;
    progress: number;
    recomputing: boolean;
    error?: string;
}

export const initialRouteStatus: RouteStatus = {
    displayed: true,
    selected: true,
    evaluating: false,
    progress: 0,
    recomputing: false,
};

export interface DeliveryZoneStatus {
    selected: boolean;
    expanded: boolean;
    expandedSettings: boolean;
    expandedPoints: boolean;
    expandedRoutes: boolean;
    expandedRoutesSettings: boolean;
    optimized: boolean;
    evaluated: boolean;
    displayed: boolean;
    dirty: boolean;
    activeRoute: number;
}

export const initialDeliveryZoneStatus: DeliveryZoneStatus = {
    selected: false,
    expanded: false,
    expandedSettings: false,
    expandedPoints: false,
    expandedRoutes: false,
    expandedRoutesSettings: false,
    optimized: false,
    evaluated: false,
    displayed: false,
    dirty: false,
    activeRoute: -1,
};

export interface RoutePlanningSolution {
    id: number;
    type?: string;
    routes: Route[];
    totalTime: number;
    totalTravelTime: number;
    totalVehicleWaitTime: number;
    totalCustomerWaitTime: number;
    avgCustomerWaitTime: number;
    totalDelayTime: number;
    avgDelayTime: number;
    totalTravelDistance: number;
    costTotal?: number;
    totalDeliveryPointsServicedLate: number;
}

export interface PlanningDeliveryZone {
    id: number;
    name: string;
    identifier: string;
    color: string;
    sessionId: number;

    useDefaultSettings: boolean;
    settings: PlanningDeliveryZoneSettings;

    deliveryPoints: DeliveryPoint[];

    vehicles?: Vehicle[];

    isMultiZone: boolean;

    deliveryZones?: {
        [key: number]: PlanningDeliveryZone;
    };

    evaluation?: {
        error?: string;
        solution?: Route;
    };

    optimization?: {
        error?: string;
        solution?: RoutePlanningSolution;
        showRouteGeometry?: boolean;
    };

    geometry?: string;
    time?: number;
    travelDistance?: number;
    travelDistanceToFirst?: number;
    travelTime?: number;
    travelTimeToFirst?: number;
    customerWaitTime?: number;
    delayTime?: number;
    vehicleWaitTime?: number;
    depotArrivalDayTime?: number;
    departureDayTime?: number;
    crossDocking?: number;
    costTotal?: number;
    evaluated?: boolean;
    userFeeCostId?: number;
    lastModification?: Date;
    associatedRoute?: string;
    order?: number;
}

export interface PlanningSession {
    id: number;
    assignationDate?: string;
    depotPoint: {
        coordinates: {
            latitude: number;
            longitude: number;
        };
        address: string;
    };

    evaluate?: {
        avgCustomerWaitTime?: number;
        avgDelayTime?: number;
        totalCustomerWaitTime?: number;
        totalDelayTime?: number;
        totalDeliveryPointsServicedLate?: number;
        totalTime?: number;
        totalTravelDistance?: number;
        totalTravelTime?: number;
        totalVehicleWaitTime?: number;
    };

    deliveryZones: {
        [key: number]: PlanningDeliveryZone;
    };
}

export const initialOptimizationStatus = {
    loading: false,
    state: null,
    progress: 0,
};
export interface OptimizationStatus {
    loading: boolean;
    state: string;
    progress: number;
    error?: string;
}

export interface RoutePlanningState {
    showSelected: boolean;
    highlightedRoute: number;
    sidenavOpened: boolean;
    selectedDeliveryPoint: number;
    routeShowGeometry: number;
    zoneShowGeometry: number;
    ShowGeometry?: boolean;
    ShowGeometryZone?: boolean;
    hoveredDeliveryPoint: number;
    hoveredZone: number;
    depotOpened: boolean;
    useRouteColors: boolean;
    showOnlyOptimizedZones?: boolean;
    deliveryPointPending?: number;
    assignate?: boolean;

    optimizationStatus: {
        [key: number]: OptimizationStatus;
    };

    deliveryZonesStatus: { [key: number]: DeliveryZoneStatus };

    routesStatus: {
        [zoneIdKey: number]: {
            [routeIdKey: number]: RouteStatus;
        };
    };

    simulating: 'None' | 'All' | 'Selected';
    simulationTime: number;
    simulationVelocity: number;

    viewingMode: RoutePlanningViewingMode;

    loadingPlanningSession: boolean;
    loadedPlanningSession: boolean;
    planningSession: PlanningSession;
    saved?: any;
    adding?: boolean;
    moving?: boolean;
    moved?: boolean;
    added?: boolean;
    addZoneId?: number;
    closeComplete?: boolean;
}
