import { Action } from '@ngrx/store';
import {
    RoutePlanningViewingMode,
    PlanningDeliveryZoneSettings,
    RoutePlanningSolution,
    OptimizationParameters,
    Route,
    RoutePlanningDeliveryPoint,
    PlanningDeliveryZone,
} from './route-planning.state';
import { ImportedDeliveryPointDto } from '../../../../shared/src/lib/dto/imported-delivery-point.dto';
import { Vehicle, Zone } from '@optimroute/backend';
import { DeliveryPoint } from './route-planning.state';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';


export enum RoutePlanningActionTypes {
    // Selection and map display
    SELECT_ALL = '[Route Planning] SELECT_ALL',
    SELECT_ALL_ROUTES = '[Route Planning] SELECT_ALL_ROUTES',
    DESELECT_ALL = '[Route Planning] DESELECT_ALL',
    DESELECT_ALL_ROUTES = '[Route Planning] DESELECT_ALL_ROUTES',
    TOGGLE_SHOW_SELECTED = '[Route Planning] TOGGLE_SHOW_SELECTED',
    TOGGLE_SHOW_SELECTED_ROUTES = '[Route Planning] TOGGLE_SHOW_SELECTED_ROUTES',
    TOGGLE_SELECT_ZONE = '[Route Planning] TOGGLE_SELECT_ZONE',
    TOGGLE_ROUTE = '[Route Planning] TOGGLE_ROUTE',
    TOGGLE_SELECT_ROUTE = '[Route Planning] TOGGLE_SELECT_ROUTE',
    TOGGLE_ZONE_DISPLAYED = '[Route Planning] TOGGLE_ZONE_DISPLAYED',
    TOGGLE_ROUTE_DISPLAYED = '[Route Planning] TOGGLE_ROUTE_DISPLAYED',
    TOGGLE_EXPAND_ZONE = '[Route Planning] TOGGLE_EXPAND_ZONE',
    TOGGLE_EXPAND_ZONE_POINTS = '[Route Planning] TOGGLE_EXPAND_ZONE_POINTS',
    TOGGLE_EXPAND_ZONE_SETTINGS = '[Route Planning] TOGGLE_EXPAND_ZONE_SETTINGS',
    TOGGLE_EXPAND_ZONE_ROUTES = '[Route Planning] TOGGLE_EXPAND_ZONE_ROUTES',
    TOGGLE_EXPAND_ZONE_ROUTES_SETTINGS = '[Route Planning] TOGGLE_EXPAND_ZONE_ROUTES_SETTINGS',
    TOGGLE_SWITCH_MAP_VIEW = '[Route Planning] TOGGLE_SWITCH_MAP_VIEW',
    SELECT_DELIVERY_POINT = '[Route Planning] SELECT_DELIVERY_POINT',
    DESELECT_DELIVERY_POINT = '[Route Planning] DESELECT_DELIVERY_POINT',
    TOGGLE_DEPOT_OPENED = '[Route Planning] TOGGLE_DEPOT_OPENED',
    SET_DEPOT_POINT = '[Route Planning] SET_DEPOT_POINT',
    HIGHLIGHT_ROUTE = '[Route Planning] HIGHLIGHT_ROUTE',
    TOGGLE_USE_ROUTE_COLORS = '[Route Planning] TOGGLE_USE_ROUTE_COLORS',
    TOGGLE_SHOW_ONLY_OPTIMIZED_ZONES = '[Route Planning] TOGGLE_SHOW_ONLY_OPTIMIZED_ZONES',
    SET_HOVERED_ZONE = '[Route Planning] SET_HOVERED_ZONE',
    SET_HOVERED_DELIVERY_POINT = '[Route Planning] SET_HOVERED_DELIVERY_POINT',
    SET_ZONE_ACTIVE_ROUTE = '[Route Planning] SET_ZONE_ACTIVE_ROUTE',
    SHOW_GEOMETRY_ROUTE = '[Route Planning] SHOW_GEOMETRY_ROUTE',
    SHOW_GEOMETRY_ZONE = '[Route Planning] SHOW_GEOMETRY_ZONE',
    // Import / Creation VRP Plan
    IMPORT_VRP_PLAN_SESSION = '[Route Planning] IMPORT_VRP_PLAN_SESSION',
    CREATE_VRP_PLAN_SESSION = '[Route Planning] CREATE_VRP_PLAN_SESSION',
    VRP_PLAN_SESSION_SUCCESS = '[Route Planning] VRP_PLAN_SESSION_SUCCESS',
    VRP_PLAN_SESSION_FAIL = '[Route Planning] VRP_PLAN_SESSION_FAIL',

    // import template route
    IMPORT_TEMPLATE_ROUTE_SUCESS = '[Route Planning] IMPORT_TEMPLATE_ROUTE_SUCESS',

    // Optimization
    OPTIMIZE = '[Route Planning] OPTIMIZE',
    OPTIMIZE_SUCCESS = '[Route Planning] OPTIMIZE_SUCCESS',
    OPTIMIZE_FAIL = '[Route Planning] OPTIMIZE_FAIL',
    SET_OPTIMIZATION_STATUS = '[Route Planning] SET_OPTIMIZATION_STATUS',

    // Asign
    ASIGN = '[Route Planning] ASIGN',
    ASIGN_SUCCESS = '[Route Planning] ASIGN_SUCCESS',
    ASIGN_FAIL = '[Route Planning] ASIGN_FAIL',

    // Recomputation
    RECOMPUTE = '[Route Planning] RECOMPUTE',
    RECOMPUTE_SUCCESS = '[Route Planning] RECOMPUTE_SUCCESS',
    RECOMPUTE_FAIL = '[Route Planning] RECOMPUTE_FAIL',
    SET_RECOMPUTATION_PROGRESS = '[Route Planning] SET_RECOMPUTATION_PROGRESS',

    // Evaluation
    EVALUATE = '[Route Planning] EVALUATE',
    EVALUATE_SUCCESS = '[Route Planning] EVALUATE_SUCCESS',
    EVALUATE_FAIL = '[Route Planning] EVALUATE_FAIL',
    SET_EVALUATION_PROGRESS = '[Route Planning] SET_EVALUATION_PROGRESS',

    // Simulation
    SIMULATE_SELECTION = '[Route Planning] SIMULATE_SELECTION',
    SIMULATE_ALL = '[Route Planning] SIMULATE_ALL',
    SIMULATE_STOP = '[Route Planning] SIMULATE_STOP',
    CHANGE_SIMULATE_VELOCITY = '[Route Planning] CHANGE_SIMULATE_VELOCITY',
    SIMULATE_FAIL = '[Route Planning] SIMULATE_FAIL',
    SIMULATE_SUCCESS = '[Route Planning] SIMULATE_SUCCESS',

    // Join / Split Zone
    JOIN_ZONES = '[Route Planning] JOIN_ZONES',
    JOIN_ZONES_FAIL = '[Route Planning] JOIN_ZONES_FAIL',
    JOIN_ZONES_SUCCESS = '[Route Planning] JOIN_ZONES_SUCCESS',
    SPLIT_ZONES = '[Route Planning] SPLIT_ZONES',
    SPLIT_ZONES_FAIL = '[Route Planning] SPLIT_ZONES_FAIL',
    SPLIT_ZONES_SUCCESS = '[Route Planning] SPLIT_ZONES_SUCCESS',

    // Zone Name and Color
    UPDATE_ZONE_NAME = '[Route Planning] UPDATE_ZONE_NAME',
    UPDATE_ZONE_NAME_SUCCESS = '[Route Planning] UPDATE_ZONE_NAME_SUCCESS',
    UPDATE_ZONE_NAME_FAIL = '[Route Planning] UPDATE_ZONE_NAME_FAIL',
    UPDATE_ZONE_COLOR = '[Route Planning] UPDATE_ZONE_COLOR',
    UPDATE_ZONE_COLOR_SUCCESS = '[Route Planning] UPDATE_ZONE_COLOR_SUCCESS',
    UPDATE_ZONE_COLOR_FAIL = '[Route Planning] UPDATE_ZONE_COLOR_FAIL',

    // Route color
    UPDATE_ROUTE_COLOR = '[Route Planning] UPDATE_ROUTE_COLOR',
    UPDATE_ROUTE_COLOR_SUCCESS = '[Route Planning] UPDATE_ROUTE_COLOR_SUCCESS',
    UPDATE_ROUTE_COLOR_FAIL = '[Route Planning] UPDATE_ROUTE_COLOR_FAIL',

    // Export
    EXPORT = '[Route Planning] EXPORT',
    EXPORT_FAIL = '[Route Planning] EXPORT_FAIL',
    EXPORT_SUCCESS = '[Route Planning] EXPORT_SUCCESS',

    // ADD FEET

    ADD_FEET = '[Route Planning] ADD_FEET',
    ADD_FEET_FAIL = '[Route Planning] ADD_FEET_FAIL',
    ADD_FEET_SUCCESS = '[Route Planning] ADD_FEET_SUCCESS',

    // ADD CrossDocking

    ADD_CROSS_DOCKING = '[Route Planning] ADD_CROSS_DOCKING',
    ADD_CROSS_DOCKING_FAIL = '[Route Planning] ADD_CROSS_DOCKING_FAIL',
    ADD_CROSS_DOCKING_SUCCESS = '[Route Planning] ADD_CROSS_DOCKING_SUCCESS',

    // Print
    PRINT = '[Route Planning] PRINT',
    PRINT_SUCCESS = '[Route Planning] PRINT_SUCCESS',
    PRINT_FAIL = '[Route Planning] PRINT_FAIL',

    // Edit one delivery point
    UPDATE_DELIVERY_POINT_TIME_WINDOW = '[Route Planning] UPDATE_DELIVERY_POINT_TIME_WINDOW',
    UPDATE_DELIVERY_POINT_TIME_WINDOW_SUCCESS = '[Route Planning] UPDATE_DELIVERY_POINT_TIME_WINDOW_SUCCESS',
    UPDATE_DELIVERY_POINT_TIME_WINDOW_FAIL = '[Route Planning] UPDATE_DELIVERY_POINT_TIME_WINDOW_FAIL',
    PRIORITY_CHANGE = '[Route Planning] PRIORITY_CHANGE',
    PRIORITY_CHANGE_FAIL = '[Route Planning] PRIORITY_CHANGE_FAIL',
    PRIORITY_CHANGE_SUCCESS = '[Route Planning] PRIORITY_CHANGE_SUCCESS',

    MOVE_DELIVERY_POINT_ZONE = '[Route Planning] MOVE_DELIVERY_POINT_ZONE',
    MOVE_DELIVERY_POINT_ZONE_FAIL = '[Route Planning] MOVE_DELIVERY_POINT_ZONE_FAIL',
    MOVE_DELIVERY_POINT_ZONE_SUCCESS = '[Route Planning] MOVE_DELIVERY_POINT_ZONE_SUCCESS',

    MOVE_DELIVERY_POINT_ROUTE = '[Route Planning] MOVE_DELIVERY_POINT_ROUTE',
    MOVE_DELIVERY_POINT_ROUTE_FAIL = '[Route Planning] MOVE_DELIVERY_POINT_ROUTE_FAIL',
    MOVE_DELIVERY_POINT_ROUTE_SUCCESS = '[Route Planning] MOVE_DELIVERY_POINT_ROUTE_SUCCESS',

    UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW = '[Route Planning] UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW',
    UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_SUCCESS = '[Route Planning] UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_SUCCESS',
    UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_FAIL = '[Route Planning] UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_FAIL',

    // Zone Settings
    TOGGLE_CALCULATE_OWN_VEHICLES = '[Route Planning] TOGGLE_CALCULATE_OWN_VEHICLES',
    ADD_VEHICLES_TO_ZONE = '[Route Planning] ADD_VEHICLES_TO_ZONE',
    ADD_VEHICLES_TO_ZONE_FAIL = '[Route Planning] ADD_VEHICLES_TO_ZONE_FAIL',
    ADD_VEHICLES_TO_ZONE_SUCCESS = '[Route Planning] ADD_VEHICLES_TO_ZONE_SUCCESS',


    CHANGE_DRIVER_VEHICLE_ROUTE = '[Route Planning] CHANGE_DRIVER_VEHICLE_ROUTE',
    CHANGE_DRIVER_VEHICLE_ROUTE_SUCCCESS = '[Route Planning] CHANGE_DRIVER_VEHICLE_ROUTE_SUCCCESS',
    CHANGE_DRIVER_VEHICLE_ROUTE_FAIL = '[Route Planning] CHANGE_DRIVER_VEHICLE_ROUTE_FAIL',


    CHANGE_DRIVER_VEHICLE = '[Route Planning] CHANGE_DRIVER_VEHICLE',
    CHANGE_DRIVER_VEHICLE_SUCCCESS = '[Route Planning] CHANGE_DRIVER_VEHICLE_SUCCCESS',
    CHANGE_DRIVER_VEHICLE_FAIL = '[Route Planning] CHANGE_DRIVER_VEHICLE_FAIL',


    UPDATE_VEHICLE_FROM_ZONE = '[Route Planning] UPDATE_VEHICLE_FROM_ZONE',
    UPDATE_VEHICLE_FROM_ZONE_SUCCESS = '[Route Planning] UPDATE_VEHICLE_FROM_ZONE_SUCCESS',
    UPDATE_VEHICLE_FROM_ZONE_FAIL = '[Route Planning] UPDATE_VEHICLE_FROM_ZONE_FAIL',
    REMOVE_VEHICLE_FROM_ZONE = '[Route Planning] REMOVE_VEHICLE_FROM_ZONE',
    REMOVE_VEHICLE_FROM_ZONE_FAIL = '[Route Planning] REMOVE_VEHICLE_FROM_ZONE_FAIL',
    REMOVE_VEHICLE_FROM_ZONE_SUCCESS = '[Route Planning] REMOVE_VEHICLE_FROM_ZONE_SUCCESS',
    TOGGLE_USE_ALL_VEHICLES = '[Route Planning] TOGGLE_USE_ALL_VEHICLES',
    TOGGLE_USE_ALL_VEHICLES_SUCCESS = '[Route Planning] TOGGLE_USE_ALL_VEHICLES_SUCCESS',
    TOGGLE_USE_ALL_VEHICLES_FAIL = '[Route Planning] TOGGLE_USE_ALL_VEHICLES_FAIL',
    TOGGLE_IGNORE_CAPACITY_LIMIT = '[Route Planning] TOGGLE_IGNORE_CAPACITY_LIMIT',
    TOGGLE_IGNORE_CAPACITY_LIMIT_SUCCESS = '[Route Planning] TOGGLE_IGNORE_CAPACITY_LIMIT_SUCCESS',
    TOGGLE_IGNORE_CAPACITY_LIMIT_FAIL = '[Route Planning] TOGGLE_IGNORE_CAPACITY_LIMIT_FAIL',


    TOGGLE_USER_SKILLS = '[Route planning] TOGGLE_USER_SKILLS',
    TOGGLE_USER_SKILLS_SUCCESS = '[Route planning] TOGGLE_USER_SKILLS_SUCCESS',
    TOGGLE_USER_SKILLS_FAIL = '[Route planning] TOGGLE_USER_SKILLS_FAIL',

    UPDATE_OPTIMIZATION_PARAMETERS = '[Route Planning] UPDATE_OPTIMIZATION_PARAMETERS',
    UPDATE_OPTIMIZATION_PARAMETERS_SUCCESS = '[Route Planning] UPDATE_OPTIMIZATION_PARAMETERS_SUCCESS',
    UPDATE_OPTIMIZATION_PARAMETERS_FAIL = '[Route Planning] UPDATE_OPTIMIZATION_PARAMETERS_FAIL',

    UPDATE_EXPLORATION_LEVEL = '[Route Planning] UPDATE_EXPLORATION_LEVEL',
    UPDATE_EXPLORATION_LEVEL_SUCCESS = '[Route Planning] UPDATE_EXPLORATION_LEVEL_SUCCESS',
    UPDATE_EXPLORATION_LEVEL_FAIL = '[Route Planning] UPDATE_EXPLORATION_LEVEL_FAIL',

    TOGGLE_FORCE_DEPARTURE_TIME = '[Route Planning] TOGGLE_FORCE_DEPARTURE_TIME',
    TOGGLE_FORCE_DEPARTURE_TIME_SUCCESS = '[Route Planning] TOGGLE_FORCE_DEPARTURE_TIME_SUCCESS',
    TOGGLE_FORCE_DEPARTURE_TIME_FAIL = '[Route Planning] TOGGLE_FORCE_DEPARTURE_TIME_FAIL',
    UPDATE_DELIVERY_SCHEDULE = '[Route Planning] UPDATE_DELIVERY_SCHEDULE',
    UPDATE_DELIVERY_SCHEDULE_SUCCESS = '[Route Planning] UPDATE_DELIVERY_SCHEDULE_SUCCESS',
    UPDATE_DELIVERY_SCHEDULE_FAIL = '[Route Planning] UPDATE_DELIVERY_SCHEDULE_FAIL',

    // Route Settings
    TOGGLE_ROUTE_FORCE_DEPARTURE_TIME = '[Route Planning] TOGGLE_ROUTE_FORCE_DEPARTURE_TIME',
    TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_SUCCESS = '[Route Planning] TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_SUCCESS',
    TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_FAIL = '[Route Planning] TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_FAIL',

    UPDATE_ROUTE_OPTIMIZATION_PARAMETERS = '[Route Planning] UPDATE_ROUTE_OPTIMIZATION_PARAMETERS',
    UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_SUCCESS = '[Route Planning] UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_SUCCESS',
    UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_FAIL = '[Route Planning] UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_FAIL',

    UPDATE_ROUTE_EXPLORATION_LEVEL = '[Route Planning] UPDATE_ROUTE_EXPLORATION_LEVEL',
    UPDATE_ROUTE_EXPLORATION_LEVEL_SUCCESS = '[Route Planning] UPDATE_ROUTE_EXPLORATION_LEVEL_SUCCESS',
    UPDATE_ROUTE_EXPLORATION_LEVEL_FAIL = '[Route Planning] UPDATE_ROUTE_EXPLORATION_LEVEL_FAIL',

    UPDATE_MAX_DELAY_TIME = '[Route Planning] UPDATE_MAX_DELAY_TIME',
    UPDATE_MAX_DELAY_TIME_SUCCESS = '[Route Planning] UPDATE_MAX_DELAY_TIME_SUCCESS',
    UPDATE_MAX_DELAY_TIME_FAIL = '[Route Planning] UPDATE_MAX_DELAY_TIME_FAIL',

    UPDATE_LEAD_TIME = '[Route Planning] UPDATE_LEAD_TIME',
    UPDATE_LEAD_TIME_SUCCESS = '[Route Planning] UPDATE_LEAD_TIME_SUCCESS',
    UPDATE_LEAD_TIME_FAIL = '[Route Planning] UPDATE_LEAD_TIME_FAIL',

    UPDATE_OPTIMIZE_FROM_INDEX = '[Route Planning] UPDATE_OPTIMIZE_FROM_INDEX',
    UPDATE_OPTIMIZE_FROM_INDEX_SUCCESS = '[Route Planning] UPDATE_OPTIMIZE_FROM_INDEX_SUCCESS',
    UPDATE_OPTIMIZE_FROM_INDEX_FAIL = '[Route Planning] UPDATE_OPTIMIZE_FROM_INDEX_FAIL',

    SAVE_SESSION = '[Route planning] SAVE_SESSION',
    SAVE_SESSION_SUCCESS = '[Route planning] SAVE_SESSION_SUCCCESS',
    SAVE_SESSION_FAIL = '[Route planning] SAVE_SESSION_FAIL',

    DELETE_DELIVERY_POINT = '[Route planning] DELETE_DELIVERY_POINT',
    DELETE_DELIVERY_POINT_SUCCESS = '[Route planning] DELETE_DELIVERY_POINT_SUCCESS',
    DELETE_DELIVERY_POINT_FAIL = '[Route planning] DELETE_DELIVERY_POINT_FAIL',


    ADD_DELIVERY_POINT = '[Route planning] ADD_DELIVERY_POINT',
    ADD_DELIVERY_POINT_SUCCESS = '[Route planning] ADD_DELIVERY_POINT_SUCCESS',
    ADD_DELIVERY_POINT_FAIL = '[Route planning] ADD_DELIVERY_POINT_FAIL',



    ADD_PICK_UP = '[Route planning] ADD_PICK_UP',
    ADD_PICK_UP_SUCCESS = '[Route planning] ADD_PICK_UP_SUCCESS',
    ADD_PICK_UP_FAIL = '[Route planning] ADD_PICK_UP_FAIL',

    ADD_DELIVERY_POINT_EVALUATED = '[Route planning] ADD_DELIVERY_POINT_EVALUATED',
    ADD_DELIVERY_POINT_EVALUATED_SUCCESS = '[Route planning] ADD_DELIVERY_POINT_EVALUATED_SUCCESS',
    ADD_DELIVERY_POINT_EVALUATED_FAIL = '[Route planning] ADD_DELIVERY_POINT_EVALUATED_FAIL',

    ADD_PICK_UP_POINT_EVALUATED = '[Route planning] ADD_PICK_UP_POINT_EVALUATED',
    ADD_PICK_UP_POINT_EVALUATED_SUCCESS = '[Route planning] ADD_PICK_UP_POINT_EVALUATED_SUCCESS',
    ADD_PICK_UP_POINT_EVALUATED_FAIL = '[Route planning] ADD_PICK_UP_POINT_EVALUATED_FAIL',

    UPDATE_ROUTE_DELIVERY_SCHEDULE = '[Route Planning] UPDATE_ROUTE_DELIVERY_SCHEDULE',
    UPDATE_ROUTE_DELIVERY_SCHEDULE_SUCCESS = '[Route Planning] UPDATE_ROUTE_DELIVERY_SCHEDULE_SUCCESS',
    UPDATE_ROUTE_DELIVERY_SCHEDULE_FAIL = '[Route Planning] UPDATE_ROUTE_DELIVERY_SCHEDULE_FAIL',
    LOGOUT_ROUTE_PLANNING = '[Route Planning] LOGOUT_ROUTE_PLANNING',


    ASIGN_EVALUATED = '[Route Planning] ASIGN_EVALUATED',
    ASIGN_EVALUATED_SUCCESS = '[Route Planning] ASIGN_EVALUATED_SUCCESS',
    ASIGN_EVALUATED_FAIL = '[Route Planning] ASIGN_EVALUATED_FAIL',

    UPDATE_DELAY_TIME = '[Route Planning] UPDATE_DELAY_TIME',
    UPDATE_DELAY_TIME_SUCCESS = '[Route Planning] UPDATE_DELAY_TIME_SUCCESS',
    UPDATE_DELAY_TIME_FAIL = '[Route Planning] UPDATE_DELAY_TIME_FAIL',

    MOVE_UNASSIGNED_POINT = '[Route Planning] MOVE_UNASSIGNED_POINT',
    MOVE_UNASSIGNED_POINT_SUCCESS = '[Route Planning] MOVE_UNASSIGNED_POINT_SUCCESS',
    MOVE_UNASSIGNED_POINT_FAIL = '[Route Planning] MOVE_UNASSIGNED_POINT_FAIL',

    UPDATE_ALLOWED_DELAY_TIME = '[Route Planning] UPDATE_ALLOWED_DELAY_TIME',
    UPDATE_ALLOWED_DELAY_TIME_SUCCESS = '[Route Planning] UPDATE_ALLOWED_DELAY_TIME_SUCCESS',
    UPDATE_ALLOWED_DELAY_TIME_FAIL = '[Route Planning] UPDATE_ALLOWED_DELAY_TIME_FAIL',
    MOVE_MULTIPLE_DELIVERY_POINT = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT',
    MOVE_MULTIPLE_DELIVERY_POINT_SUCCESS = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT_SUCCESS',
    MOVE_MULTIPLE_DELIVERY_POINT_FAIL = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT_FAIL',

    DELETE_POINT_UNASSIGNED = '[Route Planning] DELETE_POINT_UNASSIGNED',
    DELETE_POINT_UNASSIGNED_SUCCESS = '[Route Planning] DELETE_POINT_UNASSIGNED_SUCCESS',
    DELETE_POINT_UNASSIGNED_FAIL = '[Route Planning] DELETE_POINT_UNASSIGNED_FAIL',

    MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED',
    MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_SUCCESS = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_SUCCESS',
    MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_FAIL = '[Route Planning] MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_FAIL',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE = '[Route Planning] ADD_ROUTE_PLANNING_DELIVERY_ZONE',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS = '[Route Planning] ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS',
    ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL = '[Route Planning] ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL',
    MOVE_POINT_FROM_MAP = '[Route Planning] MOVE_POINT_FROM_MAP',
    MOVE_POINT_FROM_MAP_SUCCESS = '[Route Planning] MOVE_POINT_FROM_MAP_SUCCESS',
    MOVE_POINT_FROM_MAP_FAIL = '[Route Planning] MOVE_POINT_FROM_MAP_FAIL',
    ROUTE_MOVE_POINT_FROM_MAP = '[Route Planning] ROUTE_MOVE_POINT_FROM_MAP',
    ROUTE_MOVE_POINT_FROM_MAP_SUCCESS = '[Route Planning] ROUTE_MOVE_POINT_FROM_MAP_SUCCESS',
    ROUTE_MOVE_POINT_FROM_MAP_FAIL = '[Route Planning] ROUTE_MOVE_POINT_FROM_MAP_FAIL',
    CREATE_ROUTE_WITH_ZONES = "[Route planning] CREATE_ROUTE_WITH_ZONES",
    GET_DELIVERY_POINT_PENDING_COUNT = "[Route planning] GET_DELIVERY_POINT_PENDING_COUNT",
    GET_DELIVERY_POINT_PENDING_COUNT_SUCCESS = "[Route planning] GET_DELIVERY_POINT_PENDING_COUNT_SUCCESS",
    GET_DELIVERY_POINT_PENDING_COUNT_FAIL = "[Route planning] GET_DELIVERY_POINT_PENDING_COUNT_FAIL",

    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION = "[Route planning] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION",
    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS = "[Route planning] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS",
    CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL = "[Route planning] CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL",


    CHANGE_VEHICLE_SCHEDULES_HOURS = '[Route planning]  CHANGE_VEHICLE_SCHEDULES_HOURS',
    CHANGE_VEHICLE_SCHEDULES_HOURS_SUCCESS = '[Route planning]  CHANGE_VEHICLE_SCHEDULES_HOURS_SUCCESS',
    CHANGE_VEHICLE_SCHEDULES_HOURS_FAIL = '[Route planning]  CHANGE_VEHICLE_SCHEDULES_HOURS_FAIL',

    JOIN_POINTS_AGGLOMERATION = "[Route planning] JOIN_POINTS_AGGLOMERATION",
    JOIN_POINTS_AGGLOMERATION_SUCCESS = "[Route planning] JOIN_POINTS_AGGLOMERATION_SUCCESS",
    JOIN_POINTS_AGGLOMERATION_FAIL = "[Route planning] JOIN_POINTS_AGGLOMERATION_FAIL",


    DELETE_ZONE_ROUTE = "[Route planning] DELETE_ZONE_ROUTE",
    DELETE_ZONE_ROUTE_SUCCESS = "[Route planning] DELETE_ZONE_ROUTE_SUCCESS",
    DELETE_ZONE_ROUTE_FAIL = "[Route planning] DELETE_ZONE_ROUTE_FAIL",

    CLOSE_COMPLETE_ACTION = "[Route planning] CLOSE_COMPLETE_ACTION",

    CHANGE_FEE_ROUTE = "[Route planning] CHANGE_FEE_ROUTE",
    CHANGE_FEE_ROUTE_SUCCESS = "[Route planning] CHANGE_FEE_ROUTE_SUCCESS",
    CHANGE_FEE_ROUTE_FAIL = "[Route planning] CHANGE_FEE_ROUTE_FAIL",

    LOAD_SESSION_INTO_PLANNING_ROUTE = "[Route planning] LOAD_SESSION_INTO_PLANNING_ROUTE",
    LOAD_SESSION_INTO_PLANNING_ROUTE_SUCCESS = "[Route planning] LOAD_SESSION_INTO_PLANNING_ROUTE_SUCCESS",
    LOAD_SESSION_INTO_PLANNING_ROUTE_FAIL = "[Route planning] LOAD_SESSION_INTO_PLANNING_ROUTE_FAIL",

}

export type RoutePlanningAction =
    | SelectAllAction
    | DeselectAllAction
    | SelectAllRoutesAction
    | DeselectAllRoutesAction
    | ToggleShowSelectedAction
    | ToggleSelectZoneAction
    | ToggleSelectRouteAction
    | ToggleZoneDisplayedAction
    | ToggleRouteDisplayedAction
    | ToggleExpandZoneAction
    | ToggleExpandZoneSettingsAction
    | ToggleExpandZonePointsAction
    | ToggleExpandZoneRoutesSettingsAction
    | ToggleExpandZoneRoutesAction
    | ToggleSwitchMapViewAction
    | SelectDeliveryPointAction
    | DeselectDeliveryPointAction
    | SetHoveredDeliveryPointAction
    | SetHoveredZoneAction
    | ToggleDepotOpenedAction
    | SetDepotPointAction
    | HighlightRouteAction
    | ToggleUseRouteColorsAction
    | ToggleShowOnlyOptimizedZonesAction
    | SimulateAllAction
    | SimulateSelectedAction
    | SimulateSuccessAction
    | SimulateFailAction
    | ChangeSimulateVelocityAction
    | StopSimulationAction
    | ImportPlanSessionAction
    | CreatePlanSessionAction
    | AddPlanSessionSuccessAction
    | AddPlanSessionFailAction
    | AsignAction
    | AsignSuccessAction
    | AsignFailAction
    | OptimizeAction
    | OptimizeSuccessAction
    | OptimizeFailAction
    | SetOptimizationStatus
    | RecomputeAction
    | RecomputeSuccessAction
    | RecomputeFailAction
    | SetRecomputationProgress
    | EvaluateAction
    | EvaluateSuccessAction
    | EvaluateFailAction
    | SetEvaluationProgress
    | JoinZonesAction
    | JoinZonesSuccessAction
    | JoinZonesFailAction
    | SplitZonesAction
    | SplitZonesSuccessAction
    | SplitZonesFailAction
    | UpdateZoneNameAction
    | UpdateZoneNameSuccessAction
    | UpdateZoneNameFailAction
    | UpdateZoneColorAction
    | UpdateZoneColorSuccessAction
    | UpdateZoneColorFailAction
    | UpdateRouteColorAction
    | UpdateRouteColorSuccessAction
    | UpdateRouteColorFailAction
    | PrintAction
    | PrintSuccessAction
    | PrintFailAction
    | ExportAction
    | ExportSuccessAction
    | ExportFailAction
    | MoveDeliveryPointZoneAction
    | MoveDeliveryPointZoneSuccessAction
    | MoveDeliveryPointZoneFailAction
    | MoveDeliveryPointRouteAction
    | MoveDeliveryPointRouteSuccessAction
    | MoveDeliveryPointRouteFailAction
    | PriorityChangeAction
    | PriorityChangeSuccessAction
    | PriorityChangeFailAction
    | AddVehicleToZoneAction
    | AddVehicleToZoneSuccessAction
    | AddVehicleToZoneFailAction
    | RemoveVehicleFromZoneAction
    | RemoveVehicleFromZoneSuccessAction
    | RemoveVehicleFromZoneFailAction
    | ToggleUseAllVehiclesAction
    | ToggleUseAllVehiclesSuccessAction
    | ToggleUseAllVehiclesFailAction
    | ToggleIgnoreCapacityLimitAction
    | ToggleIgnoreCapacityLimitSuccessAction
    | ToggleIgnoreCapacityLimitFailAction
    | UpdateOptimizationParametersAction
    | UpdateOptimizationParametersSuccessAction
    | UpdateOptimizationParametersFailAction
    | UpdateExplorationLevelAction
    | UpdateExplorationLevelSuccessAction
    | UpdateExplorationLevelFailAction
    | UpdateDeliveryScheduleAction
    | UpdateDeliveryScheduleSuccessAction
    | UpdateDeliveryScheduleFailAction
    | UpdateDeliveryPointTimeWindowAction
    | UpdateDeliveryPointTimeWindowSuccessAction
    | UpdateDeliveryPointTimeWindowFailAction
    | UpdateRouteDeliveryPointTimeWindowAction
    | UpdateRouteDeliveryPointTimeWindowSuccessAction
    | UpdateRouteDeliveryPointTimeWindowFailAction
    | ToggleForceDepartureTimeAction
    | ToggleForceDepartureTimeSuccessAction
    | ToggleForceDepartureTimeFailAction
    | SetZoneActiveRouteAction
    // Route Settings
    | ToggleRouteForceDepartureTimeAction
    | ToggleRouteForceDepartureTimeSuccessAction
    | ToggleRouteForceDepartureTimeFailAction
    | UpdateRouteDeliveryScheduleAction
    | UpdateRouteDeliveryScheduleSuccessAction
    | UpdateRouteDeliveryScheduleFailAction
    | UpdateRouteDeliveryScheduleAction
    | UpdateRouteDeliveryScheduleSuccessAction
    | UpdateRouteDeliveryScheduleFailAction
    | UpdateRouteExplorationLevelAction
    | UpdateRouteExplorationLevelSuccessAction
    | UpdateRouteExplorationLevelFailAction
    | UpdateMaxDelayTimeAction
    | UpdateMaxDelayTimeSuccessAction
    | UpdateMaxDelayFailAction
    | UpdateOptimizeFromIndexAction
    | UpdateOptimizeFromIndexSuccessAction
    | UpdateOptimizeFromIndexFailAction
    | UpdateRouteOptimizationParametersAction
    | UpdateRouteOptimizationParametersSuccessAction
    | UpdateRouteOptimizationParametersFailAction
    | LogoutRoutePlanning
    | SaveSessionAction
    | SaveSessionSuccessAction
    | SaveSessionFailAction
    | ShowRouteGeometry
    | ShowRouteGeometryZone
    | AsignEvaluatedAction
    | AsignEvaluatedSuccessAction
    | DeleteDeliveryPointAction
    | DeleteDeliveryPointSuccessAction
    | DeleteDeliveryPointFailAction
    | UpdateLeadTimeAction
    | UpdateLeadTimeSuccessAction
    | UpdateLeadTimeFailAction
    | UpdatedelayTimeAction
    | UpdateDelayTimeSuccessAction
    | UpdateDelayTimeFailAction
    | AddDeliveryPointAction
    | AddDeliveryPointSuccessAction
    | AddDeliveryPointFailAction
    | MoveUnassignedPointAction
    | MoveUnassignedPointSuccessAction
    | MoveUnassignedPointFailAction
    | AddDeliveryEvaluatedPointAction
    | AddDeliveryEvaluatedPointSuccessAction
    | AddDeliveryEvaluatedPointFailAction
    | UpdateAllowDelayTimeAction
    | UpdateAllowedDelayTimeSuccessAction
    | UpdateAllowedDelayTimeFailAction
    | MoveMultipleDeliveryPointAction
    | MoveMultipleDeliveryPointSuccessAction
    | MoveMultipleDeliveryPointFailAction
    | MoveMultipleDeliveryPointOptimizeAction
    | MoveMultipleDeliveryPointOptimizeSuccessAction
    | MoveMultipleDeliveryPointOptimizeFailAction
    | AddRoutePlanningDeliveryZone
    | AddRoutePlanningDeliveryZoneSuccess
    | AddRoutePlanningDeliveryZoneFail
    | MovePointFromMap
    | MovePointFromMapSuccess
    | MovePointFromMapFail
    | RouteMovePointFromMap
    | RouteMovePointFromMapSuccess
    | RouteMovePointFromMapFail
    | CreateRouteWithZonesAction
    | CreateRouteWithZonesFailAction
    | getDeliveryPointPendingCount
    | getDeliveryPointPendingCountSuccess
    | getDeliveryPointPendingCountFail
    | ToggleUserSkillsAction
    | ToggleUserSkillsSuccessAction
    | ToggleUserSkillsFailAction
    | ToggleRoute
    | AddDeliveryEvaluatedPointFailAction
    | AddPickUpEvaluatedPointAction
    | AddPickUpEvaluatedPointFailAction
    | AddPickUpPointAction
    | AddPickUpPointSuccessAction
    | AddPickUpPointFailAction
    | DeletePointUnassignedAction
    | DeletePointUnassignedSuccessAction
    | DeletePointUnassignedFailAction
    | changeVehicleScheduleSpecificationAction
    | changeVehicleScheduleSpecificationSuccessAction
    | changeVehicleScheduleSpecificationFailAction
    | ChangeDriverVehicleRouteAction
    | ChangeDriverVehicleRouteSuccessAction
    | ChangeDriverVehicleRouteFailAction
    | joinPointsAgglomerationAction
    | joinPointsAgglomerationSuccessAction
    | joinPointsAgglomerationFailAction
    | closeCompleteAction
    | changeVehicleSchedulesHoursAction
    | changeVehicleSchedulesHoursSuccessAction
    | changeVehicleSchedulesHoursFailAction
    | deleteZoneRouteAction
    | deleteZoneRouteSuccessAction
    | deleteZoneRouteFailAction
    | AddCrossDockingAction
    | AddCrossDockingSuccessAction
    | AddCrossDockingFailAction
    | ChangeDriverVehicleAction
    | ChangeDriverVehicleSuccessAction
    | ChangeDriverVehicleFailAction
    | AddFeetAction
    | AddFeetSuccessAction
    | AddFeetFailAction
    | ChangeFeeRouteAction
    | ChangeFeeRouteSuccessAction
    | ChangeFeeRouteFailAction
    | ImportTemplateRouteSucess
    | loadSessionIntoPlanningRouteAction
    | loadSessionIntoPlanningRouteSuccessAction
    | loadSessionIntoPlanningRouteFailAction
    | UpdateVehicleFromZoneAction
    | UpdateVehicleFromZoneSuccessAction
    | UpdateVehicleFromZoneFailAction;

export class SelectAllAction implements Action {
    readonly type = RoutePlanningActionTypes.SELECT_ALL;
    constructor() { }
}
export class DeselectAllAction implements Action {
    readonly type = RoutePlanningActionTypes.DESELECT_ALL;
    constructor() { }
}
export class SelectAllRoutesAction implements Action {
    readonly type = RoutePlanningActionTypes.SELECT_ALL_ROUTES;
    constructor() { }
}
export class DeselectAllRoutesAction implements Action {
    readonly type = RoutePlanningActionTypes.DESELECT_ALL_ROUTES;
    constructor() { }
}
export class ToggleShowSelectedAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_SHOW_SELECTED;
    constructor() { }
}
export class ToggleSelectZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_SELECT_ZONE;
    constructor(public payload: { zoneId: number }) { }
}


export class ToggleRoute implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ROUTE;
    constructor(public payload: { zoneId: number, routeIndex }) { }
}

export class ShowRouteGeometry implements Action {
    readonly type = RoutePlanningActionTypes.SHOW_GEOMETRY_ROUTE;
    constructor(public payload: { zoneId: number; routeId: number }) { }
}

export class ShowRouteGeometryZone implements Action {
    readonly type = RoutePlanningActionTypes.SHOW_GEOMETRY_ZONE;
    constructor(public payload: { zoneId: number }) { }
}

export class ToggleSelectRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_SELECT_ROUTE;
    constructor(public payload: { zoneId: number; routeId: number }) { }
}
export class ToggleZoneDisplayedAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ZONE_DISPLAYED;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleRouteDisplayedAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ROUTE_DISPLAYED;
    constructor(public payload: { zoneId: number; routeId: number }) { }
}
export class ToggleExpandZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleExpandZoneSettingsAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_SETTINGS;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleExpandZonePointsAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_POINTS;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleExpandZoneRoutesAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_ROUTES;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleExpandZoneRoutesSettingsAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_ROUTES_SETTINGS;
    constructor(public payload: { zoneId: number }) { }
}
export class ToggleSwitchMapViewAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_SWITCH_MAP_VIEW;
    constructor(public payload: { view: RoutePlanningViewingMode }) { }
}
export class SelectDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.SELECT_DELIVERY_POINT;
    constructor(public payload: { selectedPointId: number }) { }
}
export class DeselectDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.DESELECT_DELIVERY_POINT;
    constructor() { }
}
export class ToggleDepotOpenedAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_DEPOT_OPENED;
    constructor() { }
}
export class SetDepotPointAction implements Action {
    readonly type = RoutePlanningActionTypes.SET_DEPOT_POINT;
    constructor(
        public payload: {
            depotPoint: {
                name: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                };
                address: string;
            };
        },
    ) { }
}
export class SetZoneActiveRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.SET_ZONE_ACTIVE_ROUTE;
    constructor(public payload: { zoneId: number; routeId: number }) { }
}
export class SimulateAllAction implements Action {
    readonly type = RoutePlanningActionTypes.SIMULATE_ALL;
    constructor() { }
}
export class SimulateSelectedAction implements Action {
    readonly type = RoutePlanningActionTypes.SIMULATE_SELECTION;
    constructor() { }
}
export class SimulateSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.SIMULATE_SUCCESS;
    constructor() { }
}
export class SimulateFailAction implements Action {
    readonly type = RoutePlanningActionTypes.SIMULATE_FAIL;
    constructor() { }
}
export class StopSimulationAction implements Action {
    readonly type = RoutePlanningActionTypes.SIMULATE_STOP;
    constructor() { }
}
export class ChangeSimulateVelocityAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_SIMULATE_VELOCITY;
    constructor(public payload: { newVelocity: number }) { }
}

export class ImportPlanSessionAction implements Action {
    readonly type = RoutePlanningActionTypes.IMPORT_VRP_PLAN_SESSION;
    constructor(
        public payload: {
            deliveryPoints: ImportedDeliveryPointDto[];
            warehouse: any;
            assignationDate?: string;
            options: {
                createDeliveryPoints: boolean;
                updateDeliveryPoints: boolean;
                createDeliveryZones: boolean;
                createUnassignedZone: boolean;
                setUnassignedZone: boolean;
            };
            sessionType?: string;
            vehicle: any[];
        },
    ) { }
}
export class CreatePlanSessionAction implements Action {
    readonly type = RoutePlanningActionTypes.CREATE_VRP_PLAN_SESSION;
    constructor() { }
}

export class CreateRouteWithZonesAction implements Action {
    readonly type = RoutePlanningActionTypes.CREATE_ROUTE_WITH_ZONES;
    constructor(public payload: {
        warehouse: any;
        deliveryZones: string[],
        isError?: any
    }) { }
}

export class CreateRouteWithZonesFailAction implements Action {
    readonly type = RoutePlanningActionTypes.VRP_PLAN_SESSION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class AddPlanSessionSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.VRP_PLAN_SESSION_SUCCESS;
    constructor(public payload: any) { }
}

export class ImportTemplateRouteSucess implements Action {
    readonly type = RoutePlanningActionTypes.IMPORT_TEMPLATE_ROUTE_SUCESS;
    constructor(public payload: any) { }
}
export class AddPlanSessionFailAction implements Action {
    readonly type = RoutePlanningActionTypes.VRP_PLAN_SESSION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class OptimizeAction implements Action {
    readonly type = RoutePlanningActionTypes.OPTIMIZE;
    constructor(public payload: number[]) { }
}
export class OptimizeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.OPTIMIZE_SUCCESS;
    constructor(public payload: { zoneId: number; solution: RoutePlanningSolution }) { }
}
export class OptimizeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.OPTIMIZE_FAIL;
    constructor(public payload: { error: string; zoneIds: number[] }) { }
}


export class SetOptimizationStatus implements Action {
    readonly type = RoutePlanningActionTypes.SET_OPTIMIZATION_STATUS;
    constructor(public payload: { zoneId: number; state: string; progress: number }) { }
}

export class AsignAction implements Action {
    readonly type = RoutePlanningActionTypes.ASIGN;
    constructor(public payload: { dateAsign: string, routes: Route[], isError?: boolean }) { }
}


export class AsignEvaluatedAction implements Action {
    readonly type = RoutePlanningActionTypes.ASIGN_EVALUATED;
    constructor(public payload: { dateAsign: string, zoneIds: number[], isError?: boolean }) { }
}
export class AsignSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ASIGN_SUCCESS;
    constructor(public payload: { dateAsign: string, routes: Route[], isError?: boolean }) { }
}

export class AsignEvaluatedSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ASIGN_EVALUATED_SUCCESS;
    constructor(public payload: { dateAsign: string, zoneIds: number[] }) { }
}

export class AsignFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ASIGN_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class RecomputeAction implements Action {
    readonly type = RoutePlanningActionTypes.RECOMPUTE;
    constructor(
        public payload: {
            [routeId: number]: { zoneId: number; routeId: number; start?: number };
        },
    ) { }
}
export class RecomputeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.RECOMPUTE_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            route: Route;
        },
    ) { }
}
export class RecomputeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.RECOMPUTE_FAIL;
    constructor(
        public payload: {
            error: string;
            routes: { [routeId: number]: { zoneId: number; routeId: number } };
        },
    ) { }
}
export class SetRecomputationProgress implements Action {
    readonly type = RoutePlanningActionTypes.SET_RECOMPUTATION_PROGRESS;
    constructor(public payload: { zoneId: number; routeId: number; progress: number }) { }
}
export class EvaluateAction implements Action {
    readonly type = RoutePlanningActionTypes.EVALUATE;
    constructor(public payload: number[]) { }
}
export class EvaluateSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.EVALUATE_SUCCESS;
    constructor(public payload: any) { }
}
export class EvaluateFailAction implements Action {
    readonly type = RoutePlanningActionTypes.EVALUATE_FAIL;
    constructor(public payload: { error: {} }) { }
}
export class SetEvaluationProgress implements Action {
    readonly type = RoutePlanningActionTypes.SET_EVALUATION_PROGRESS;
    constructor(public payload: { zoneId: number; progress: number }) { }
}
export class JoinZonesAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_ZONES;
    constructor(public payload: { zones?: any, vehicles?: Vehicle[], settings?: { ignoreCapacityLimit: boolean, useAllVehicles: boolean, useSkills: boolean }, optimize?: boolean, isError?: string, evaluate?: boolean }) { }
}
export class JoinZonesSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_ZONES_SUCCESS;
    constructor(public payload: { zonesToJoin: number[]; newZone: any, vehicles?: Vehicle[] }) { }
}
export class JoinZonesFailAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_ZONES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class SplitZonesAction implements Action {
    readonly type = RoutePlanningActionTypes.SPLIT_ZONES;
    constructor(public payload: { zoneId: number; zonesToSplit: number[], evaluate?: boolean }) { }
}
export class SplitZonesSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.SPLIT_ZONES_SUCCESS;
    constructor(
        public payload: { zoneId: number; zonesToSplit: number[]; newZones: {}[] },
    ) { }
}
export class SplitZonesFailAction implements Action {
    readonly type = RoutePlanningActionTypes.SPLIT_ZONES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class UpdateZoneNameAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_NAME;
    constructor(public payload: { zoneId: number; name: string }) { }
}
export class UpdateZoneNameSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_NAME_SUCCESS;
    constructor(public payload: { zoneId: number; name: string }) { }
}
export class UpdateZoneNameFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_NAME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class UpdateZoneColorAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_COLOR;
    constructor(public payload: { zoneId: number; color: string }) { }
}
export class UpdateZoneColorSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_COLOR_SUCCESS;
    constructor(public payload: { zoneId: number; color: string }) { }
}
export class UpdateZoneColorFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ZONE_COLOR_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class UpdateRouteColorAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_COLOR;
    constructor(public payload: { zoneId: number; routeId: number; color: string }) { }
}
export class UpdateRouteColorSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_COLOR_SUCCESS;
    constructor(public payload: { zoneId: number; routeId: number; color: string }) { }
}
export class UpdateRouteColorFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_COLOR_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class PrintAction implements Action {
    readonly type = RoutePlanningActionTypes.PRINT;
    constructor() { }
}
export class PrintSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.PRINT_SUCCESS;
    constructor() { }
}
export class PrintFailAction implements Action {
    readonly type = RoutePlanningActionTypes.PRINT_FAIL;
    constructor() { }
}
export class ExportAction implements Action {
    readonly type = RoutePlanningActionTypes.EXPORT;
    constructor() { }
}
export class ExportSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.EXPORT_SUCCESS;
    constructor() { }
}
export class ExportFailAction implements Action {
    readonly type = RoutePlanningActionTypes.EXPORT_FAIL;
    constructor() { }
}

export class AddCrossDockingAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_CROSS_DOCKING;
    constructor(public payload: {
        crossDocking: number;
        zoneId: number;
        evaluated: boolean;
    }) { }
}
export class AddCrossDockingSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_CROSS_DOCKING_SUCCESS;
    constructor(public payload: {
        crossDocking: number;
        zoneId: number;
    }) { }
}
export class AddCrossDockingFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_CROSS_DOCKING_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class MoveDeliveryPointZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE;
    constructor(
        public payload: {
            deliveryPointId: number;
            oldZoneId: number;
            newZoneId: number;
            oldOrder: number;
            newOrder: number;
            isError: boolean;
            isEvaluated: boolean;
        },
    ) { }
}
export class MoveDeliveryPointZoneSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE_SUCCESS;
    constructor(
        public payload: {
            deliveryPointId: number;
            oldZoneId: number;
            newZoneId: number;
            oldOrder: number;
            newOrder: number;
            deliveryZones?: any;
        },
    ) { }
}
export class MoveDeliveryPointZoneFailAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE_FAIL;
    constructor(
        public payload: {
            error: HttpErrorResponse;
            originalPayload: {
                deliveryPointId: number;
                oldZoneId: number;
                newZoneId: number;
                oldOrder: number;
                newOrder: number;
                isError: boolean;
            };
        },
    ) { }
}

export class MoveDeliveryPointRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE;
    constructor(
        public payload: {
            deliveryPointId: number;
            oldZoneId: number;
            newZoneId: number;
            oldRouteId: number;
            newRouteId: number;
            oldOrder: number;
            newOrder: number;
            isError: boolean;
            isEvaluated: boolean;
        },
    ) { }
}
export class MoveDeliveryPointRouteSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE_SUCCESS;
    constructor(
        public payload: {
            deliveryPointId: number;
            oldZoneId: number;
            newZoneId: number;
            oldRouteId: number;
            newRouteId: number;
            oldOrder: number;
            newOrder: number;
            newRoutes: any;
        },
    ) { }
}
export class MoveDeliveryPointRouteFailAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE_FAIL;
    constructor(
        public payload: {
            error: HttpErrorResponse;
            originalPayload: {
                deliveryPointId: number;
                oldZoneId: number;
                newZoneId: number;
                oldRouteId: number;
                newRouteId: number;
                oldOrder: number;
                newOrder: number;
                isError: boolean;
            };
        },
    ) { }
}
export class PriorityChangeAction implements Action {
    readonly type = RoutePlanningActionTypes.PRIORITY_CHANGE;
    constructor(
        public payload: {
            zoneId: number;
            deliveryPointId: number;
            value: number;
        },
    ) { }
}
export class PriorityChangeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.PRIORITY_CHANGE_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            deliveryPointId: number;
            value: number;
        },
    ) { }
}
export class PriorityChangeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.PRIORITY_CHANGE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class AddVehicleToZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE;
    constructor(
        public payload: {
            zoneId: number;
            vehicles: Vehicle[];
            evaluated: boolean;
        },
    ) { }
}
export class AddVehicleToZoneSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE_SUCCESS;
    constructor(public payload: { zoneId: number; vehicles: Vehicle[] }) { }
}
export class AddVehicleToZoneFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}




export class ChangeDriverVehicleRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE;
    constructor(
        public payload: {
            zoneId: number;
            driver: number;
            route: Route
        },
    ) { }
}
export class ChangeDriverVehicleRouteSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE_SUCCCESS;
    constructor(public payload: {
        zoneId: number;
        driver: number;
        route: Route
    },) { }
}
export class ChangeDriverVehicleRouteFailAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}



export class ChangeFeeRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_FEE_ROUTE;
    constructor(
        public payload: {
            routeId: number;
            userFeeCostId: number;
            zoneId;
        },
    ) { }
}
export class ChangeFeeRouteSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_FEE_ROUTE_SUCCESS;
    constructor(public payload: {
        routeId: number;
        userFeeCostId: number;
        zoneId;
    },) { }
}

export class ChangeFeeRouteFailAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_FEE_ROUTE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}



export class ChangeDriverVehicleAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE;
    constructor(
        public payload: {
            zoneId: number;
            driver: number;
            vehicleId: number;
            User: any;
        },
    ) { }
}
export class ChangeDriverVehicleSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_SUCCCESS;
    constructor(public payload: {
        zoneId: number;
        driver: number;
        vehicleId: number;
        User: any;
    },) { }
}
export class ChangeDriverVehicleFailAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}





export class joinPointsAgglomerationAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION;
    constructor(
        public payload: {
            routePlanningDeliveryPoints: number[];
            sessionId: number
        },
    ) { }
}
export class joinPointsAgglomerationSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION_SUCCESS;
    constructor(public payload: {
        routePlanningDeliveryPoints: number[];
        sessionId: number
    }) { }
}
export class joinPointsAgglomerationFailAction implements Action {
    readonly type = RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}





export class UpdateVehicleFromZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE;
    constructor(
        public payload: { zoneId?: number; vehicleId: number; results: Partial<Vehicle> },
    ) { }
}

export class UpdateVehicleFromZoneSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE_SUCCESS;
    constructor(
        public payload: { zoneId?: number; vehicleId: number; results: Partial<Vehicle> },
    ) { }
}

export class UpdateVehicleFromZoneFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class RemoveVehicleFromZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE;
    constructor(public payload: { zoneId: number; vehicleId: number }) { }
}
export class RemoveVehicleFromZoneSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE_SUCCESS;
    constructor(public payload: { zoneId?: number; vehicleId: number }) { }
}
export class RemoveVehicleFromZoneFailAction implements Action {
    readonly type = RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE_FAIL;
    constructor(
        public payload: {
            error: HttpErrorResponse;
            originalPayload: { zoneId: number; vehicleId: number };
        },
    ) { }
}
export class ToggleUseAllVehiclesAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES;
    constructor(public payload: { zoneId: number; value: boolean }) { }
}

export class ToggleUseAllVehiclesSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES_SUCCESS;
    constructor(public payload: { zoneId: number }) { }
}

export class ToggleUseAllVehiclesFailAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class ToggleIgnoreCapacityLimitAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT;
    constructor(public payload: { zoneId: number; value: boolean }) { }
}

export class ToggleIgnoreCapacityLimitSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT_SUCCESS;
    constructor(public payload: { zoneId: number }) { }
}

export class ToggleIgnoreCapacityLimitFailAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}





export class ToggleUserSkillsAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USER_SKILLS;
    constructor(public payload: { zoneId: number; value: boolean }) { }
}

export class ToggleUserSkillsSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USER_SKILLS_SUCCESS;
    constructor(public payload: { zoneId: number }) { }
}

export class ToggleUserSkillsFailAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USER_SKILLS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class UpdateOptimizationParametersAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS;
    constructor(
        public payload: {
            zoneId: number;
            optimizationParameters: Partial<OptimizationParameters>;
        },
    ) { }
}
export class UpdateOptimizationParametersSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            optimizationParameters: Partial<OptimizationParameters>;
        },
    ) { }
}
export class UpdateOptimizationParametersFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateExplorationLevelAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL;
    constructor(public payload: { zoneId: number; value: number }) { }
}
export class UpdateExplorationLevelSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL_SUCCESS;
    constructor(public payload: { zoneId: number; value: number }) { }
}
export class UpdateExplorationLevelFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class HighlightRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.HIGHLIGHT_ROUTE;
    constructor(public payload: { routeId: number }) { }
}
export class ToggleUseRouteColorsAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_USE_ROUTE_COLORS;
    constructor() { }
}
export class ToggleShowOnlyOptimizedZonesAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_SHOW_ONLY_OPTIMIZED_ZONES;
    constructor() { }
}
export class SetHoveredZoneAction implements Action {
    readonly type = RoutePlanningActionTypes.SET_HOVERED_ZONE;
    constructor(public payload: { zoneId: number }) { }
}
export class SetHoveredDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.SET_HOVERED_DELIVERY_POINT;
    constructor(public payload: { deliveryPointId: number }) { }
}

export class UpdateDeliveryScheduleAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE;
    constructor(
        public payload: {
            zoneId: number;
            deliverySchedule: { start?: number; end?: number };
        },
    ) { }
}
export class UpdateDeliveryScheduleSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            deliverySchedule: { start?: number; end?: number };
        },
    ) { }
}
export class UpdateDeliveryScheduleFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateDeliveryPointTimeWindowAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_POINT_TIME_WINDOW;
    constructor(
        public payload: {
            zoneId: number;
            deliveryPointId: number;
            deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>;
            coordinates: {
                latitude: number;
                longitude: number;
            };
            address: string;
            serviceTime: number;
            leadTime?: number;
            allowedDelayTime?: number;
            deliveryType?: string;
            orderNumber?: string;
            companyPreferenceDelayTimeId?: number;
            allowDelayTime?: boolean;
        },
    ) { }
}
export class UpdateDeliveryPointTimeWindowSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_POINT_TIME_WINDOW_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            deliveryPointId: number;
            deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>;
            coordinates: {
                latitude: number;
                longitude: number;
            };
            address: string;
            serviceTime: number;
            leadTime?: number;
            allowedDelayTime?: number;
            deliveryType?: string;
            orderNumber?: string;
            companyPreferenceDelayTimeId?: number;
            allowDelayTime?: boolean;
        },
    ) { }
}
export class UpdateDeliveryPointTimeWindowFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELIVERY_POINT_TIME_WINDOW_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

///

export class UpdateRouteDeliveryPointTimeWindowAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            deliveryPointId: number;
            deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>;
            leadTime?: number,
            deliveryType?: string,
            orderNumber?: string,
            companyPreferenceDelayTimeId?: number,
            allowDelayTime?: boolean
        },
    ) { }
}
export class UpdateRouteDeliveryPointTimeWindowSuccessAction implements Action {
    readonly type =
        RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            deliveryPointId: number;
            deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>;
            leadTime?: number,
            deliveryType?: string,
            orderNumber?: string,
            companyPreferenceDelayTimeId?: number,
            allowDelayTime?: boolean
        },
    ) { }
}
export class UpdateRouteDeliveryPointTimeWindowFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class ToggleForceDepartureTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME;
    constructor(public payload: { zoneId: number; value: boolean }) { }
}
export class ToggleForceDepartureTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME_SUCCESS;
    constructor(public payload: { zoneId: number }) { }
}

export class ToggleForceDepartureTimeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

// Route Settings
export class ToggleRouteForceDepartureTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME;
    constructor(public payload: { zoneId: number; routeId: number; value: boolean }) { }
}
export class ToggleRouteForceDepartureTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_SUCCESS;
    constructor(public payload: { zoneId: number; routeId: number }) { }
}

export class ToggleRouteForceDepartureTimeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateRouteDeliveryScheduleAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            deliverySchedule: { start?: number; end?: number };
        },
    ) { }
}
export class UpdateRouteDeliveryScheduleSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            deliverySchedule: { start?: number; end?: number };
        },
    ) { }
}
export class UpdateRouteDeliveryScheduleFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateRouteOptimizationParametersAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            optimizationParameters: Partial<OptimizationParameters>;
        },
    ) { }
}
export class UpdateRouteOptimizationParametersSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_SUCCESS;
    constructor(
        public payload: {
            zoneId: number;
            routeId: number;
            optimizationParameters: Partial<OptimizationParameters>;
        },
    ) { }
}
export class UpdateRouteOptimizationParametersFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateRouteExplorationLevelAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL;
    constructor(public payload: { zoneId: number; routeId: number; value: number }) { }
}
export class UpdateRouteExplorationLevelSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL_SUCCESS;
    constructor(public payload: { zoneId: number; routeId: number; value: number }) { }
}
export class UpdateRouteExplorationLevelFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateMaxDelayTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME;
    constructor(public payload: { zoneId: number; value: number }) { }
}
export class UpdateMaxDelayTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME_SUCCESS;
    constructor(public payload: { zoneId: number; value: number }) { }
}
export class UpdateMaxDelayFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class UpdateLeadTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_LEAD_TIME;
    constructor(public payload: { zoneId: number; deliveryPointId: number, value: number }) { }
}
export class UpdateLeadTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_LEAD_TIME_SUCCESS;
    constructor(public payload: { zoneId: number, deliveryPointId: number, value: number }) { }
}
export class UpdateLeadTimeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_LEAD_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class UpdatedelayTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELAY_TIME;
    constructor(public payload: { zoneId: number; deliveryPointId: number, value: number }) { }
}
export class UpdateDelayTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELAY_TIME_SUCCESS;
    constructor(public payload: { zoneId: number, deliveryPointId: number, value: number }) { }
}
export class UpdateDelayTimeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_DELAY_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}
export class UpdateAllowDelayTimeAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ALLOWED_DELAY_TIME;
    constructor(public payload: { zoneId: number; deliveryPointId: number, value: number }) { }
}
export class UpdateAllowedDelayTimeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ALLOWED_DELAY_TIME_SUCCESS;
    constructor(public payload: { zoneId: number, deliveryPointId: number, value: number }) { }
}
export class UpdateAllowedDelayTimeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_ALLOWED_DELAY_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class UpdateOptimizeFromIndexAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX;
    constructor(public payload: { zoneId: number; routeId: number; value: number }) { }
}
export class UpdateOptimizeFromIndexSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX_SUCCESS;
    constructor(public payload: { zoneId: number; routeId: number; value: number }) { }
}
export class UpdateOptimizeFromIndexFailAction implements Action {
    readonly type = RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class SaveSessionAction implements Action {
    readonly type = RoutePlanningActionTypes.SAVE_SESSION
    constructor(public payload: { sessionId: number, data: any }) { }
}

export class SaveSessionSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.SAVE_SESSION_SUCCESS
    constructor(public payload: { sessionId: number, data: any }) { }
}

export class SaveSessionFailAction implements Action {
    readonly type = RoutePlanningActionTypes.SAVE_SESSION_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}



export class DeleteDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_DELIVERY_POINT
    constructor(public payload: { deliveryPointId: number, zoneId: number, evaluated: boolean }) { }
}

export class DeleteDeliveryPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_DELIVERY_POINT_SUCCESS
    constructor(public payload: { deliveryPointId: number, zoneId: number }) { }
}

export class DeleteDeliveryPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_DELIVERY_POINT_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}



export class AddDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT
    constructor(public payload: { deliveryPoints: number[], routePlanningDeliveryZoneId: number }) { }
}

export class AddDeliveryPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT_SUCCESS
    constructor(public payload: { deliveryPoints: DeliveryPoint[], routePlanningDeliveryZoneId: number }) { }
}

export class AddDeliveryPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}



export class AddPickUpPointAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP
    constructor(public payload: { deliveryPoints: any[], routePlanningDeliveryZoneId: number }) { }
}

export class AddPickUpPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP_SUCCESS
    constructor(public payload: { deliveryPoints: DeliveryPoint[], routePlanningDeliveryZoneId: number }) { }
}

export class AddPickUpPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}




export class AddDeliveryEvaluatedPointAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED
    constructor(public payload: { deliveryPoints: number[], routePlanningDeliveryZoneId: number }) { }
}

export class AddDeliveryEvaluatedPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED_SUCCESS
    constructor(public payload: {
        planningDeliveryZone: PlanningDeliveryZone,
        totalTime: number,
        totalTravelTime: number,
        totalCustomerWaitTime: number,
        totalVehicleWaitTime: number,
        totalDelayTime: number,
        totalTravelDistance: number,
        totalDeliveryPointsServicedLate: number,
        avgCustomerWaitTime: number,
        avgDelayTime: number
    }) { }
}

export class AddDeliveryEvaluatedPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class AddPickUpEvaluatedPointAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP_POINT_EVALUATED;
    constructor(public payload: { deliveryPoints: any[], routePlanningDeliveryZoneId: number }) { }
}





export class AddFeetAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_FEET;
    constructor(public payload: {
        zoneId: number;
        vehicleId: number;
        userFeeCostId: number;
        evaluated: boolean
    }) { }
}

export class AddFeetFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_FEET_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class AddFeetSuccessAction  implements Action {
    readonly type = RoutePlanningActionTypes.ADD_FEET_SUCCESS;
    constructor(public payload: {
        zoneId: number;
        vehicleId: number;
        userFeeCostId: number;
    }) { }
}








export class AddPickUpEvaluatedPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP_POINT_EVALUATED_SUCCESS;
    constructor(public payload: {
        planningDeliveryZone: PlanningDeliveryZone,
        totalTime: number,
        totalTravelTime: number,
        totalCustomerWaitTime: number,
        totalVehicleWaitTime: number,
        totalDelayTime: number,
        totalTravelDistance: number,
        totalDeliveryPointsServicedLate: number,
        avgCustomerWaitTime: number,
        avgDelayTime: number
    }) { }
}

export class AddPickUpEvaluatedPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.ADD_PICK_UP_POINT_EVALUATED_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class MoveUnassignedPointAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT
    constructor(public payload: {
        routeIdOri: number, routeId: number, unassignedDeliveryPoints: any[],
        zoneIdOri: number,
        zoneId: number
    }) { }
}

export class MoveUnassignedPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT_SUCCESS
    constructor(public payload: {
        routeIdOri: number,
        routeId: number,
        routes: Route[],
        unassignedDeliveryPoints: any[],
        zoneIdOri: number,
        zoneId: number
    }) { }
}

export class MoveUnassignedPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT_FAIL
    constructor(public payload: {
        error: HttpErrorResponse,
        routeIdOri: number,
        routeId: number,
        routes: Route[], unassignedDeliveryPoints: any[],
        zoneIdOri: number,
        zoneId: number
    }) { }
}

export class LogoutRoutePlanning implements Action {
    readonly type = RoutePlanningActionTypes.LOGOUT_ROUTE_PLANNING;
}


export class MoveMultipleDeliveryPointAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT
    constructor(public payload: {
        routePlanningDeliveryZoneIdOrig: number,
        routePlanningDeliveryZoneIdDest: number,
        routePlanningDeliveryPoints: number[],
        order: number,
        routeId?: number;
    }) { }
}


export class MoveMultipleDeliveryPointSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_SUCCESS
    constructor(public payload: { result: PlanningDeliveryZone[] }) { }
}

export class MoveMultipleDeliveryPointFailAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_FAIL
    constructor(public payload: {
        error: HttpErrorResponse
    }) { }
}

export class DeletePointUnassignedAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED
    constructor(public payload: {
        routeId: number;
        zoneId: number;
    }) { }
}

export class DeletePointUnassignedSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED_SUCCESS
    constructor(public payload: { routeId: number, zoneId: number }) { }
}

export class DeletePointUnassignedFailAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED_FAIL
    constructor(public payload: {
        error: HttpErrorResponse
    }) { }
}



export class MoveMultipleDeliveryPointOptimizeAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED
    constructor(public payload: {
        routeIdOrig: number,
        routeIdDest: number,
        zoneOrigId: number,
        zoneDestId: number,
        routePlanningRouteDeliveryPoints: number[],
        order: number
    }) { }
}

export class MoveMultipleDeliveryPointOptimizeSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_SUCCESS
    constructor(public payload: {
        routeIdOri: number,
        routeId: number,
        zoneOrigId: number,
        zoneDestId: number,
        routes: Route[]
    }) { }
}

export class MoveMultipleDeliveryPointOptimizeFailAction implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_FAIL
    constructor(public payload: {
        error: HttpErrorResponse
    }) { }
}

export class AddRoutePlanningDeliveryZone implements Action {
    readonly type = RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE;
    constructor(public payload: { zone: Zone, sessionId: number, vehicles: Vehicle[] }) { }
}

export class AddRoutePlanningDeliveryZoneSuccess implements Action {
    readonly type = RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS;
    constructor(public payload: { zone: PlanningDeliveryZone, sessionId: number, vehicles: Vehicle[] }) { }
}

export class AddRoutePlanningDeliveryZoneFail implements Action {
    readonly type = RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class MovePointFromMap implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_POINT_FROM_MAP
    constructor(public payload: { deliveryZoneId: number, deliveryPoints: any[] }) { }
}

export class MovePointFromMapSuccess implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_POINT_FROM_MAP_SUCCESS
    constructor(public payload: { routeMove: any }) { }
}

export class MovePointFromMapFail implements Action {
    readonly type = RoutePlanningActionTypes.MOVE_POINT_FROM_MAP_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class RouteMovePointFromMap implements Action {
    readonly type = RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP
    constructor(public payload: { routeId: number, deliveryPoints: any[] }) { }
}

export class RouteMovePointFromMapSuccess implements Action {
    readonly type = RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP_SUCCESS
    constructor(public payload: { routeMove: any }) { }
}

export class RouteMovePointFromMapFail implements Action {
    readonly type = RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class getDeliveryPointPendingCount implements Action {
    readonly type = RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT
    constructor() { }
}

export class getDeliveryPointPendingCountSuccess implements Action {
    readonly type = RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT_SUCCESS
    constructor(public payload: { count: number }) { }
}

export class getDeliveryPointPendingCountFail implements Action {
    readonly type = RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT_FAIL
    constructor(public payload: { error: HttpErrorResponse }) { }
}

export class changeVehicleScheduleSpecificationAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION;
    constructor(public payload: {
        vehicleId: number, zoneId: number, datos: {
            vehicleScheduleSpecificationId?: number,
            timeStart: number,
            timeEnd: number,
            deliveryPointScheduleTypeId?: number
        }
    }) { }
}

export class changeVehicleScheduleSpecificationSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS;
    constructor(public payload: {
        vehicleId: number, zoneId: number, datos: {
            vehicleScheduleSpecificationId?: number,
            timeStart: number,
            timeEnd: number,
            deliveryPointScheduleTypeId?: number
        }
    }) { }
}

export class changeVehicleScheduleSpecificationFailAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}




export class changeVehicleSchedulesHoursAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS;
    constructor(public payload: {
        vehicleId: number, zoneId: number, datos: {
            deliveryPointScheduleTypeId: number,
            vehicleScheduleDayId: number,
            vehicleScheduleHourId: number,
            timeStart: number,
            timeEnd: number,
            vehicleScheduleSpecificationId: number
        }
    }) { }
}

export class changeVehicleSchedulesHoursSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS_SUCCESS;
    constructor(public payload: {
        vehicleId: number, zoneId: number, datos: {
            deliveryPointScheduleTypeId: number,
            vehicleScheduleDayId: number,
            vehicleScheduleHourId: number,
            timeStart: number,
            timeEnd: number,
            vehicleScheduleSpecificationId: number
        }
    }) { }
}

export class changeVehicleSchedulesHoursFailAction implements Action {
    readonly type = RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export class closeCompleteAction implements Action {
    readonly type = RoutePlanningActionTypes.CLOSE_COMPLETE_ACTION;
    constructor(public payload: { closeComplete: boolean }) { }
}



export class deleteZoneRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_ZONE_ROUTE;
    constructor(public payload: { routePlanningZoneId: number }){}
}

export class deleteZoneRouteSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_ZONE_ROUTE_SUCCESS;
    constructor(public payload: { routePlanningZoneId: number }){}
}

export class deleteZoneRouteFailAction implements Action {
    readonly type = RoutePlanningActionTypes.DELETE_ZONE_ROUTE_FAIL;
    constructor(public payload: { routePlanningZoneId: number }){}
}


export class loadSessionIntoPlanningRouteAction implements Action {
    readonly type = RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE;
    constructor(public payload: { deliveryPoints: ImportedDeliveryPointDto[], sessionId: number }){}
}

export class loadSessionIntoPlanningRouteSuccessAction implements Action {
    readonly type = RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE_SUCCESS;
    constructor(public payload: {  deliveryZones: any; }){}
}


export class loadSessionIntoPlanningRouteFailAction implements Action {
    readonly type = RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) { }
}


export type PTO = keyof PlanningDeliveryZoneSettings['optimizationParameters'];


