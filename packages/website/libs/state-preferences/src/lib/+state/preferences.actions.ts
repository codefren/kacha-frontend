import { Action } from '@ngrx/store';
import {
    InterfacePreferences,
    IP,
    PP,
    PrintingPreferences,
    OP,
    OptimizationPreferences,
    TrafficRange,
    ManagementPreferences,
    MN,
    ControlPanelPreferences,
    CP,
    GeolocationPreferences,
    APP,
    AppPreferences,
    OR,
    OrdersPreferences,
    FR,
    FranchisePreferences,
    PRP,
    ProductsPreferences,
    Delivery,
} from '@optimroute/backend';
import { Preferences } from './preferences.reducer';
import { Coordinates } from '@optimroute/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardPreferences, DB, OPA, Payment } from '../../../../backend/src/lib/types/preferences.type';

export enum PreferencesActionTypes {
    LOAD_PREFERENCES = '[Preferences] LOAD_PREFERENCES',
    LOAD_PREFERENCES_SUCCESS = '[Preferences] LOAD_PREFERENCES_SUCCESS',
    LOAD_PREFERENCES_FAIL = '[Preferences] LOAD_PREFERENCES_FAIL',
    LOAD_PRODUCT_PREFERENCES = '[Preferences] LOAD_PRODUCT_PREFERENCES',
    LOAD_PRODUCT_PREFERENCES_SUCCESS = '[Preferences] LOAD_PRODUCT_PREFERENCES_SUCCESS',
    LOAD_PRODUCT_PREFERENCES_FAIL = '[Preferences] LOAD_PREFERENCES_FAIL',
    LOAD_FRANCHISES_PREFERENCES = '[Preferences] LOAD_FRANCHISES_PREFERENCES',
    LOAD_FRANCHISES_PREFERENCES_SUCCESS = '[Preferences] LOAD_FRANCHISES_PREFERENCES_SUCCESS',
    LOAD_FRANCHISES_PREFERENCES_FAIL = '[Preferences] LOAD_FRANCHISES_PREFERENCES_FAIL',
    LOAD_GEOLOCATION_PREFERENCES = '[Preferences] LOAD_GEOLOCATION_PREFERENCES',
    LOAD_GEOLOCATION_PREFERENCES_SUCCESS = '[Preferences] LOAD_GEOLOCATION_PREFERENCES_SUCCESS',
    LOAD_GEOLOCATION_PREFERENCES_FAIL = '[Preferences] LOAD_PREFERENCES_FAIL',

    LOAD_COMPANY_PREPARATION_PREFERENCES = '[Preferences] LOAD_COMPANY_PREPARATION_PREFERENCES',
    LOAD_COMPANY_PREPARATION_PREFERENCES_SUCCESS = '[Preferences] LOAD_COMPANY_PREPARATION_PREFERENCES_SUCCESS',
    LOAD_COMPANY_PREPARATION_PREFERENCES_FAIL = '[Preferences] LOAD_COMPANY_PREPARATION_PREFERENCES_FAIL',


    TOGGLE_OPTIMIZATION_PREFERENCE_OPTION = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_OPTION',
    TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_FAIL',


    TOGGLE_OPTIMIZATION_PREFERENCE_ACTION = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_ACTION',
    TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_SUCCESS = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_SUCCESS',
    TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_FAIL = '[Preferences] TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_FAIL',


    TOGGLE_DASHBOARD_PREFERENCE_ACTION = '[Preferences] TOGGLE_DASHBOARD_PREFERENCE_ACTION',
    TOGGLE_DASHBOARD_PREFERENCE_ACTION_SUCCESS = '[Preferences] TOGGLE_DASHBOARD_PREFERENCE_ACTION_SUCCESS',
    TOGGLE_DASHBOARD_PREFERENCE_ACTION_FAIL = '[Preferences] TOGGLE_DASHBOARD_PREFERENCE_ACTION_FAIL',

    TOGGLE_INTERFACE_PREFERENCE_OPTION = '[Preferences] TOGGLE_INTERFACE_PREFERENCE_OPTION',
    TOGGLE_INTERFACE_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_INTERFACE_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_INTERFACE_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_INTERFACE_PREFERENCE_OPTION_FAIL',
    TOGGLE_MANAGEMENT_PREFERENCE_OPTION = '[Preferences] TOGGLE_MANAGEMENT_PREFERENCE_OPTION',
    TOGGLE_MANAGEMENT_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_MANAGEMENT_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_MANAGEMENT_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_MANAGEMENT_PREFERENCE_OPTION_FAIL',
    TOGGLE_PRINTING_PREFERENCE_OPTION = '[Preferences] TOGGLE_PRINTING_PREFERENCE_OPTION',
    TOGGLE_PRINTING_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_PRINTING_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_PRINTING_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_PRINTING_PREFERENCE_OPTION_FAIL',
    TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION = '[Preferences] TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION',
    TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_FAIL',

    TOGGLE_APP_PREFERENCE_OPTION = '[Preferences] TOGGLE_APP_PREFERENCE_OPTION',
    TOGGLE_APP_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_APP_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_APP_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_APP_PREFERENCE_OPTION_FAIL',

    TOGGLE_FRANCHISE_PREFERENCE_OPTION = '[Preferences] TOGGLE_FRANCHISE_PREFERENCE_OPTION',
    TOGGLE_FRANCHISE_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_FRANCHISE_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_FRANCHISE_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_FRANCHISE_PREFERENCE_OPTION_FAIL',

    TOGGLE_PRODUCT_PREFERENCE_OPTION = '[Preferences] TOGGLE_PRODUCT_PREFERENCE_OPTION',
    TOGGLE_PRODUCT_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_PRODUCT_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_PRODUCT_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_PRODUCT_PREFERENCE_OPTION_FAIL',

    TOGGLE_ORDERS_PREFERENCE_OPTION = '[Preferences] TOGGLE_ORDERS_PREFERENCE_OPTION',
    TOGGLE_ORDERS_PREFERENCE_OPTION_SUCCESS = '[Preferences] TOGGLE_ORDERS_PREFERENCE_OPTION_SUCCESS',
    TOGGLE_ORDERS_PREFERENCE_OPTION_FAIL = '[Preferences] TOGGLE_ORDERS_PREFERENCE_OPTION_FAIL',

    GET_WAREHOUSE_COORDINATES = '[Preferences] GET_WAREHOUSE_COORDINATES',
    GET_WAREHOUSE_COORDINATES_SUCCESS = '[Preferences] GET_WAREHOUSE_COORDINATES_SUCCESS',
    GET_WAREHOUSE_COORDINATES_FAIL = '[Preferences] GET_WAREHOUSE_COORDINATES_FAIL',
    UPDATE_WAREHOUSE = '[Preferences] UPDATE_WAREHOUSE',
    UPDATE_WAREHOUSE_SUCCESS = '[Preferences] UPDATE_WAREHOUSE_SUCCESS',
    UPDATE_WAREHOUSE_FAIL = '[Preferences] UPDATE_WAREHOUSE_FAIL',
    UPDATE_DEFAULT_SERVICE_TIME = '[Preferences] UPDATE_DEFAULT_SERVICE_TIME',
    UPDATE_DEFAULT_SERVICE_TIME_SUCCESS = '[Preferences] UPDATE_DEFAULT_SERVICE_TIME_SUCCESS',
    UPDATE_DEFAULT_SERVICE_TIME_FAIL = '[Preferences] UPDATE_DEFAULT_SERVICE_TIME_FAIL',

    UPDATE_ADDRESES_ORDER_RANGE = '[Preferences] UPDATE_ADDRESES_ORDER_RANGE',
    UPDATE_ADDRESES_ORDER_RANGE_SUCCESS = '[Preferences] UPDATE_ADDRESES_ORDER_RANGE_SUCCESS',
    UPDATE_ADDRESES_ORDER_RANGE_FAIL = '[Prefereces] UPDATE_ADDRESES_ORDER_RANGE_FAIL',

    UPDATE_AUTOMATIC_END_ROUTE_TIME = '[Preferences] UPDATE_AUTOMATIC_END_ROUTE_TIME',
    UPDATE_AUTOMATIC_END_ROUTE_TIME_SUCCESS = '[Preferences] UPDATE_AUTOMATIC_END_ROUTE_TIME_SUCCESS',
    UPDATE_AUTOMATIC_END_ROUTE_TIME_FAIL = '[Preferences] UPDATE_AUTOMATIC_END_ROUTE_TIME_FAIL',

    UPDATE_ORDER_MAX_TIME = '[Preferences] UPDATE_ORDER_MAX_TIME',
    UPDATE_ORDER_MAX_TIME_SUCCESS = '[Preferences] UPDATE_ORDER_MAX_TIME_SUCCESS',
    UPDATE_ORDER_MAX_TIME_FAIL = '[Preferences] UPDATE_ORDER_MAX_TIME_FAIL',

    UPDATE_MIN_AVG_SERVICE_TIME = '[Preferences] UPDATE_MIN_AVG_SERVICE_TIME',
    UPDATE_MIN_AVG_SERVICE_TIME_SUCCESS = '[Preferences] UPDATE_MIN_AVG_SERVICE_TIME_SUCCESS',
    UPDATE_MIN_AVG_SERVICE_TIME_FAIL = '[Preferences] UPDATE_MIN_AVG_SERVICE_TIME_FAIL',


    UPDATE_MAX_AVG_SERVICE_TIME = '[Preferences] UPDATE_MAX_AVG_SERVICE_TIME',
    UPDATE_MAX_AVG_SERVICE_TIME_SUCCESS = '[Preferences] UPDATE_MAX_AVG_SERVICE_TIME_SUCCESS',
    UPDATE_MAX_AVG_SERVICE_TIME_FAIL = '[Preferences] UPDATE_MAX_AVG_SERVICE_TIME_FAIL',

    UPDATE_ORDER_SYNC_EACH_TIME = '[Preferences] UPDATE_ORDER_SYNC_EACH_TIME',
    UPDATE_ORDER_SYNC_EACH_TIME_SUCCESS = '[Preferences] UPDATE_ORDER_SYNC_EACH_TIME_SUCCESS',
    UPDATE_ORDER_SYNC_EACH_TIME_FAIL = '[Preferences] UPDATE_ORDER_SYNC_EACH_TIME_FAIL',

    UPDATE_STOPPED_COMMERCIAL_MAX_TIME = '[Preferences] UPDATE_STOPPED_COMMERCIAL_MAX_TIME',
    UPDATE_STOPPED_COMMERCIAL_MAX_TIME_SUCCESS = '[Preferences] UPDATE_STOPPED_COMMERCIAL_MAX_TIME_SUCCESS',
    UPDATE_STOPPED_COMMERCIAL_MAX_TIME_FAIL = '[Preferences] UPDATE_STOPPED_COMMERCIAL_MAX_TIME_FAIL',

    UPDATE_STOPPED_DRIVER_MAX_TIME = '[Preferences] UPDATE_STOPPED_DRIVER_MAX_TIME',
    UPDATE_STOPPED_DRIVER_MAX_TIME_SUCCESS = '[Preferences] UPDATE_STOPPED_DRIVER_MAX_TIME_SUCCESS',
    UPDATE_STOPPED_DRIVER_MAX_TIME_FAIL = '[Preferences] UPDATE_STOPPED_DRIVER_MAX_TIME_FAIL',

    UPDATE_ORDER_SYNC_TIME = '[Preferences] UPDATE_ORDER_SYNC_TIME',
    UPDATE_ORDER_SYNC_TIME_SUCCESS = '[Preferences] UPDATE_ORDER_SYNC_TIME_SUCCESS',
    UPDATE_ORDER_SYNC_TIME_FAIL = '[Preferences] UPDATE_ORDER_SYNC_TIME_FAIL',

    UPDATE_DEFAULT_REFRESH_TIME = '[Preferences] UPDATE_DEFAULT_REFRESH_TIME',
    UPDATE_DEFAULT_REFRESH_TIME_SUCCESS = '[Preferences] UPDATE_DEFAULT_REFRESH_TIME_SUCCESS',
    UPDATE_DEFAULT_REFRESH_TIME_FAIL = '[Preferences] UPDATE_DEFAULT_REFRESH_TIME_FAIL',

    UPDATE_MIN_SERVICE_TIME_STAT = '[Preferences] UPDATE_MIN_SERVICE_TIME_STAT',
    UPDATE_MIN_SERVICE_TIME_STAT_SUCCESS = '[Preferences] UPDATE_MIN_SERVICE_TIME_STAT_SUCCESS',
    UPDATE_MIN_SERVICE_TIME_STAT_FAIL = '[Preferences] UPDATE_MIN_SERVICE_TIME_STAT_FAIL',

    UPDATE_MAX_SERVICE_TIME_STAT = '[Preferences] UPDATE_MAX_SERVICE_TIME_STAT',
    UPDATE_MAX_SERVICE_TIME_STAT_SUCCESS = '[Preferences] UPDATE_MAX_SERVICE_TIME_STAT_SUCCESS',
    UPDATE_MAX_SERVICE_TIME_STAT_FAIL = '[Preferences] UPDATE_MAX_SERVICE_TIME_STAT_FAIL',

    UPDATE_DEFAULT_DELIVERY_SCHEDULE = '[Preferences] UPDATE_DEFAULT_DELIVERY_SCHEDULE',
    UPDATE_DEFAULT_DELIVERY_SCHEDULE_SUCCESS = '[Preferences] UPDATE_DEFAULT_DELIVERY_SCHEDULE_SUCCESS',
    UPDATE_DEFAULT_DELIVERY_SCHEDULE_FAIL = '[Preferences] UPDATE_DEFAULT_DELIVERY_SCHEDULE_FAIL',

    UPDATE_SCHEDULE_GEOLOCATION = '[Preferences]  UPDATE_SCHEDULE_GEOLOCATION',
    UPDATE_SCHEDULE_GEOLOCATION_SUCCESS = '[Preferences]  UPDATE_SCHEDULE_GEOLOCATION_SUCCESS',
    UPDATE_SCHEDULE_GEOLOCATION_FAIL = '[Preferences]  UPDATE_SCHEDULE_GEOLOCATION_FAIL',

    UPDATE_TRAFFIC = '[Preferences] UPDATE_TRAFFIC',
    UPDATE_TRAFFIC_SUCCESS = '[Preferences] UPDATE_TRAFFIC_SUCCESS',
    UPDATE_TRAFFIC_FAIL = '[Preferences] UPDATE_TRAFFIC_FAIL',
    LOGOUT = '[Preferences] LOGOUT',

    UPDATE_ORDERRANGE_ADDRESS = '[Preferences]  UPDATE_ORDERRANGE_ADDRESS',
    UPDATE_ORDERRANGE_ADDRESS_SUCCESS = '[Preferences]  UPDATE_ORDERRANGE_ADDRESS_SUCCESS',
    UPDATE_ORDERRANGE_ADDRESS_FAIL = '[Preferences]  UPDATE_ORDERRANGE_ADDRESS_FAIL',

    UPDATE_RANGE_DISTANCE = '[Preferences]  UPDATE_RANGE_DISTANCE',
    UPDATE_RANGE_DISTANCE_SUCCESS = '[Preferences]  UPDATE_RANGE_DISTANCE_SUCCESS',
    UPDATE_RANGE_DISTANCE_FAIL = '[Preferences]  UPDATE_RANGE_DISTANCE_FAIL',

    UPDATE_MINPAYMENT = '[Preferences] UPDATE_MINPAYMENT',
    UPDATE_MINPAYMENT_SUCCESS = '[Preferences] UPDATE_MINPAYMENT_SUCCESS',
    UPDATE_MINPAYMENT_FAIL = '[Preferences] UPDATE_MINPAYMENT_FAIL',


    UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET = '[Preferences] UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET',
    UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_SUCCESS = '[Preferences] UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_SUCCESS',
    UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_FAIL = '[Preferences] UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_FAIL',

    /* AllowChangeOrderPaymentStatus */
    UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS = '[Preferences] UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS',
    UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_SUCCESS = '[Preferences] UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_SUCCESS',
    UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_FAIL = '[Preferences] UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_FAIL',

    UPDATE_PREPAID_PAYMENT = ' [Preferences] UPDATE_PREPAID_PAYMENT',
    UPDATE_PREPAID_PAYMENT_SUCCESS = '[Preferences] UPDATE_PREPAID_PAYMENT_SUCCESS',
    UPDATE_PREPAID_PAYMENT_FAIL = '[Preferences] UPDATE_PREPAID_PAYMENT_FAIL',

    UPDATE_PREFERENCE_DELIVERY='[Preference] UPDATE_PREFERENCE_DELIVERY',
    UPDATE_PREFERENCE_DELIVERY_SUCCESS='[Preference] UPDATE_PREFERENCE_DELIVERY_SUCCESS',
    UPDATE_PREFERENCE_DELIVERY_FAIL='[Preference] UPDATE_PREFERENCE_DELIVERY_FAIL',



    CREATE_PREFERENCE_DELIVERY='[Preference] CREATE_PREFERENCE_DELIVERY',
    CREATE_PREFERENCE_DELIVERY_SUCCESS='[Preference] CREATE_PREFERENCE_DELIVERY_SUCCESS',
    CREATE_PREFERENCE_DELIVERY_FAIL='[Preference] CREATE_PREFERENCE_DELIVERY_FAIL',

    UPDATE_DELIVERY_RATES='[Preferences] UPDATE_DELIVERY_RATES',
    UPDATE_DELIVERY_RATES_SUCCESS='[Preferences] UPDATE_DELIVERY_RATES_SUCCESS',
    UPDATE_DELIVERY_RATES_FAIL='[Preferences] UPDATE_DELIVERY_RATES_FAIL',

    UPDATE_ALLOW_BUY_WITHOUT_MINIMUN='[Preferences] UPDATE_ALLOW_BUY_WITHOUT_MINIMUN',
    UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_SUCCESS='[Preferences] UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_SUCCESS',
    UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_FAIL='[Preferences] UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_FAIL',
    
    UPDATE_RETURN_MAIL_BOX_ORDER = '[Preferences] UPDATE_RETURN_MAIL_BOX_ORDER',
    UPDATE_RETURN_MAIL_BOX_ORDER_SUCCESS = '[Preferences] UPDATE_RETURN_MAIL_BOX_ORDER_SUCCESS',
    UPDATE_RETURN_MAIL_BOX_ORDER_FAIL = '[Preferences] UPDATE_RETURN_MAIL_BOX_ORDER_FAIL',

    UPDATE_SUM_DELIVERY_PRICE_TO_TICKET = '[Preferences] UPDATE_SUM_DELIVERY_PRICE_TO_TICKET',
    UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_SUCCESS = '[Preferences] UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_SUCCESS',
    UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_FAIL = '[Preferences] UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_FAIL',

    UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER = '[Preferences] UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER',
    UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_SUCCESS = '[Preferences] UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_SUCCESS',
    UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_FAIL = '[Preferences] UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_FAIL',
    

    UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN='[Preferences] UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN',
    UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_SUCCESS='[Preferences] UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_SUCCESS',
    UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_FAIL='[Preferences] UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_FAIL',

    LOAD_DASHBOARD_PREFERENCES = '[Preferences] LOAD_DASHBOARD_PREFERENCES',
    LOAD_DASHBOARD_PREFERENCES_SUCCESS = '[Preferences] LOAD_DASHBOARD_PREFERENCES_SUCCESS',
    LOAD_DASHBOARD_PREFERENCES_FAIL = '[Preferences] LOAD_DASHBOARD_PREFERENCES_FAIL',

    UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE='[Preferences] UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE',
    UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_SUCCESS='[Preferences] UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_SUCCESS',
    UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_FAIL='[Preferences] UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_FAIL',

    UPDATE_DELAY_WHEN_REVIEWING_TIME='[Preferences] UPDATE_DELAY_WHEN_REVIEWING_TIME',
    UPDATE_DELAY_WHEN_REVIEWING_TIME_SUCCESS='[Preferences] UPDATE_DELAY_WHEN_REVIEWING_TIME_SUCCESS',
    UPDATE_DELAY_WHEN_REVIEWING_TIME_FAIL='[Preferences] UPDATE_DELAY_WHEN_REVIEWING_TIME_FAIL',

    UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE='[Preferences] UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE',
    UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_SUCCESS='[Preferences] UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_SUCCESS',
    UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_FAIL='[Preferences] UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_FAIL',

    UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME='[Preferences] UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME',
    UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_SUCCESS='[Preferences] UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_SUCCESS',
    UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_FAIL='[Preferences] UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_FAIL',
}

export class LoadPreferences implements Action {
    readonly type = PreferencesActionTypes.LOAD_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadPreferencesSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadPreferencesFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LoadDashboardPreferencesAction implements Action {
    readonly type = PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadDashboardPreferencesActionSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadDashboardPreferencesActionFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class LoadProductPreferences implements Action {
    readonly type = PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadProductPreferencesSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadProductPreferencesFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LoadFranchisesPreferences implements Action {
    readonly type = PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadFranchisesPreferencesSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadFranchisesPreferencesFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class LoadGeolocationPreferences implements Action {
    readonly type = PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadGeolocationPreferencesSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadGeolocationPreferencesFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class LoadCompanyPreparationPreferences implements Action {
    readonly type = PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES;
    constructor(public payload: any) {}
}

export class LoadCompanyPreparationPreferencesSuccess implements Action {
    readonly type = PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadCompanyPreparationPreferencesFail implements Action {
    readonly type = PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ToggleOptimizationPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION;
    constructor(
        public key: OP,
        public value: OptimizationPreferences['createSession'][OP],
    ) {}
}

export class ToggleOptimizationPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_SUCCESS;
    constructor(
        public key: OP,
        public value: OptimizationPreferences['createSession'][OP],
    ) {}
}

export class ToggleOptimizationPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ToggleOptimizationPreferenceAction implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_ACTION;
    constructor(
        public key: OPA,
        public value: OptimizationPreferences[OPA],
    ) {}
}

export class ToggleOptimizationPreferenceActionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_SUCCESS;
    constructor(
        public key: OPA,
        public value: OptimizationPreferences[OPA],
    ) {}
}

export class ToggleOptimizationPreferenceActionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_ACTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}




export class ToggleDashboardPreferenceAction implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_DASHBOARD_PREFERENCE_ACTION;
    constructor(
        public key: DB,
        public value: DashboardPreferences[DB],
    ) {}
}

export class ToggleDashboardPreferenceActionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_DASHBOARD_PREFERENCE_ACTION_SUCCESS;
    constructor(
        public key: DB,
        public value: DashboardPreferences[DB],
    ) {}
}

export class ToggleDashboardPreferenceActionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_DASHBOARD_PREFERENCE_ACTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}





export class ToggleControlPanelPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION;
    constructor(public key: CP, public value: ControlPanelPreferences[CP]) {}
}

export class ToggleControlPanelPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: CP, public value: ControlPanelPreferences[CP]) {}
}

export class ToggleControlPanelPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleAppPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION;
    constructor(public key: APP, public value: AppPreferences[APP]) {}
}

export class ToggleAppPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: APP, public value: AppPreferences[APP]) {}
}

export class ToggleAppPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleFranchisePreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION;
    constructor(public key: FR, public value: FranchisePreferences['products'][FR]) {}
}

export class ToggleFranchisePreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: FR, public value: FranchisePreferences['products'][FR]) {}
}

export class ToggleFranchisePreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleProductPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION;
    constructor(public key: PRP, public value: ProductsPreferences[PRP]) {}
}

export class ToggleProductPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: PRP, public value: ProductsPreferences[PRP]) {}
}

export class ToggleProductPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleOrdersPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION;
    constructor(public key: OR, public value: OrdersPreferences[OR]) {}
}

export class ToggleOrdersPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: OR, public value: OrdersPreferences[OR]) {}
}

export class ToggleOrdersPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleInterfacePreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION;
    constructor(public key: IP, public value: InterfacePreferences[IP]) {}
}

export class ToggleInterfacePreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: IP, public value: InterfacePreferences[IP]) {}
}

export class ToggleInterfacePreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ToggleManamgementPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION;
    constructor(public key: MN, public value: ManagementPreferences[MN]) {}
}

export class ToggleManamgementPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: MN, public value: ManagementPreferences[MN]) {}
}

export class ToggleManamgementPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class TogglePrintingPreferenceOption implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRINTING_PREFERENCE_OPTION;
    constructor(public key: PP, public value: PrintingPreferences[PP]) {}
}

export class TogglePrintingPreferenceOptionSuccess implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRINTING_PREFERENCE_OPTION_SUCCESS;
    constructor(public key: PP, public value: PrintingPreferences[PP]) {}
}

export class TogglePrintingPreferenceOptionFail implements Action {
    readonly type = PreferencesActionTypes.TOGGLE_PRINTING_PREFERENCE_OPTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class GetWarehouseCoordinatesAction implements Action {
    readonly type = PreferencesActionTypes.GET_WAREHOUSE_COORDINATES;
    constructor(public payload: { address: string }) {}
}
export class GetWarehouseCoordinatesSuccessAction implements Action {
    readonly type = PreferencesActionTypes.GET_WAREHOUSE_COORDINATES_SUCCESS;
    constructor(
        public payload: { warehouse: { address: string; coordinates: Coordinates } },
    ) {}
}
export class GetWarehouseCoordinatesFailAction implements Action {
    readonly type = PreferencesActionTypes.GET_WAREHOUSE_COORDINATES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}
export class UpdateWarehouseAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_WAREHOUSE;
    constructor(
        public payload: { warehouse: { address: string; coordinates: Coordinates } },
    ) {}
}
export class UpdateWarehouseSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_WAREHOUSE_SUCCESS;
    constructor(
        public payload: { warehouse: { address: string; coordinates: Coordinates } },
    ) {}
}
export class UpdateWarehouseFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_WAREHOUSE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateDefaultServiceTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME;
    constructor(public payload: { defaultServiceTime: number }) {}
}
export class UpdateDefaultServiceTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME_SUCCESS;
    constructor(public payload: { defaultServiceTime: number }) {}
}
export class UpdateDefaultServiceTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateDefaultRefreshAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME;
    constructor(public payload: { refreshTime: number }) {}
}
export class UpdateDefaultRefreshSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME_SUCCESS;
    constructor(public payload: { refreshTime: number }) {}
}
export class UpdateDefaultRefreshFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateMinServiceTimeStatAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT;
    constructor(public payload: { minServiceTimeStat: number }) {}
}
export class UpdateMinServiceTimeStatSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT_SUCCESS;
    constructor(public payload: { minServiceTimeStat: number }) {}
}
export class UpdateMinServiceTimeStatFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateMaxServiceTimeStatAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT;
    constructor(public payload: { maxServiceTimeStat: number }) {}
}
export class UpdateMaxServiceTimeStatSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT_SUCCESS;
    constructor(public payload: { maxServiceTimeStat: number }) {}
}
export class UpdateMaxServiceTimeStatFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateAutomaticEndRouteTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME;
    constructor(public payload: { endRouteTime: number }) {}
}
export class UpdateAutomaticEndRouteTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME_SUCCESS;
    constructor(public payload: { endRouteTime: number }) {}
}
export class UpdateAutomaticEndRouteTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateOrderMaxTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_MAX_TIME;
    constructor(public payload: { orderMaxTime: number }) {}
}
export class UpdateOrderMaxTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_MAX_TIME_SUCCESS;
    constructor(public payload: { orderMaxTime: number }) {}
}
export class UpdateOrderMaxTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_MAX_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateMinAvgServiceTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME;
    constructor(public payload: { minAvgServiceTime: number }) {}
}
export class UpdateMinAvgServiceTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME_SUCCESS;
    constructor(public payload: { minAvgServiceTime: number }) {}
}
export class UpdateMinAvgServiceTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateMaxAvgServiceTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME;
    constructor(public payload: { maxAvgServiceTime: number }) {}
}
export class UpdateMaxAvgServiceTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME_SUCCESS;
    constructor(public payload: { maxAvgServiceTime: number }) {}
}
export class UpdateMaxAvgServiceTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class UpdateOrderSyncEachTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME;
    constructor(public payload: { orderSyncEachTime: number }) {}
}
export class UpdateOrderSyncEachTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME_SUCCESS;
    constructor(public payload: { orderSyncEachTime: number }) {}
}
export class UpdateOrderSyncEachTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateStoppedCommercialMaxTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_COMMERCIAL_MAX_TIME;
    constructor(public payload: { stoppedCommercialMaxtime: number }) {}
}
export class UpdateStoppedCommercialMaxTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_COMMERCIAL_MAX_TIME_SUCCESS;
    constructor(public payload: { stoppedCommercialMaxtime: number }) {}
}
export class UpdateStoppedCommercialMaxTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_COMMERCIAL_MAX_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateStoppedDriverMaxTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_DRIVER_MAX_TIME;
    constructor(public payload: { stoppedDriverMaxtime: number }) {}
}
export class UpdateStoppedDriverMaxTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_DRIVER_MAX_TIME_SUCCESS;
    constructor(public payload: { stoppedDriverMaxtime: number }) {}
}
export class UpdateStoppedDriverMaxTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_STOPPED_DRIVER_MAX_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateOrderSyncTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME;
    constructor(public payload: { orderSyncTime: number }) {}
}
export class UpdateOrderSyncTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME_SUCCESS;
    constructor(public payload: { orderSyncTime: number }) {}
}
export class UpdateOrderSyncTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateDefaultDeliveryScheduleAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE;
    constructor(public payload: { deliverySchedule: { start?: number; end?: number } }) {}
}
export class UpdateDefaultDeliveryScheduleSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE_SUCCESS;
    constructor(public payload: { deliverySchedule: { start?: number; end?: number } }) {}
}
export class UpdateDefaultDeliveryScheduleFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}
export class UpdateTrafficAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TRAFFIC;
    constructor(
        public payload: {
            traffic: {
                range1?: TrafficRange;
                range2?: TrafficRange;
                range3?: TrafficRange;
            };
        },
    ) {}
}
export class UpdateTrafficSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TRAFFIC_SUCCESS;
    constructor(
        public payload: {
            traffic: {
                range1?: TrafficRange;
                range2?: TrafficRange;
                range3?: TrafficRange;
            };
        },
    ) {}
}
export class UpdateTrafficFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TRAFFIC_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class Logout implements Action {
    readonly type = PreferencesActionTypes.LOGOUT;
}

export class UpdateScheduleGeolocationAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION;
    constructor(public payload: { schedule: GeolocationPreferences }) {}
}

export class UpdateScheduleGeolocationSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION_SUCCESS;
    constructor(public payload: { schedule: GeolocationPreferences }) {}
}

export class UpdateScheduleGeolocationFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* Addreses range */

export class UpdateAddresesOrderRangeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE;
    constructor(public payload: { addresses: { orderRange: { address: string } } }) {}
}
export class UpdateAddresesOrderRangeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE_SUCCESS;
    constructor(public payload: { addresses: { orderRange: { address: string } } }) {}
}
export class UpdateAddresesOrderRangeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}
/*  end addreses range*/

export class UpdateRangeDistanceAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RANGE_DISTANCE;
    constructor(public payload: { addresses: { orderRange: { allowedRadius: number } } }) {}
}
export class UpdateRangeDistanceSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RANGE_DISTANCE_SUCCESS;
    constructor(public payload: { addresses: { orderRange: { allowedRadius: number } } }) {}
}
export class UpdateRangeDistanceFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RANGE_DISTANCE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* updateRangeMinPayment */

export class UpdateMinPaymentAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MINPAYMENT;
    constructor(public payload: { payment: { minPayment: number } }) {}
}
export class UpdateMinPaymentSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MINPAYMENT_SUCCESS;
    constructor(public payload: { payment: { minPayment: number } }) {}
}
export class UpdateMinPaymentFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_MINPAYMENT_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class UpdateSumQuantityBuyWithoutMinimunToTicketAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET;
    constructor(public payload: { payment: { sumQuantityBuyWithoutMinimunToTicket: boolean } }) {}
}
export class UpdateSumQuantityBuyWithoutMinimunToTicketActionSuccess implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_SUCCESS;
    constructor(public payload: { payment: { sumQuantityBuyWithoutMinimunToTicket: boolean } }) {}
}
export class UpdateSumQuantityBuyWithoutMinimunToTicketActionFail implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* AllowChangeOrderPaymentStatus */
export class UpdateAllowChangeOrderPaymentStatusAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS;
    constructor(public payload: { payment: { allowChangeOrderPaymentStatus: boolean } }) {}
}
export class UpdateAllowChangeOrderPaymentStatusActionSuccess implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_SUCCESS;
    constructor(public payload: { payment: { allowChangeOrderPaymentStatus: boolean } }) {}
}
export class UpdateAllowChangeOrderPaymentStatusActionFail implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}
/* end AllowChangeOrderPaymentStatus */


/* end updateRangeMinPayment */

/* updateRangePrepaidPayment */

export class UpdatePrepaidPaymentAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREPAID_PAYMENT;
    constructor(public payload: { payment: { prepaidPayment: any } }) {}
}
export class UpdatePrepaidPaymentSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREPAID_PAYMENT_SUCCESS;
    constructor(public payload: { payment: { prepaidPayment: any } }) {}
}
export class UpdatePrepaidPaymentFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREPAID_PAYMENT_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* end updateRangePrepaidPayment */



export class CreatePreferenceDeliveryAction implements Action {
    readonly type = PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY;
    constructor(
        public payload: { delivery: Delivery },
    ) {}
}
export class CreatePreferenceDeliverySuccessAction implements Action {
    readonly type = PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY_SUCCESS;
    constructor(
      public payload: { delivery: Delivery },
    ) {}
}
export class CreatePreferenceDeliveryFailAction implements Action {
    readonly type = PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class UpdatePreferenceDeliveryAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY;
    constructor(
        public payload: { delivery: Delivery },
    ) {}
}
export class UpdatePreferenceDeliverySuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY_SUCCESS;
    constructor(
      public payload: { delivery: Delivery },
    ) {}
}
export class UpdatePreferenceDeliveryFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


/* allowBuyWithoutMinimum */
export class UpdateAllowBuyWithoutMinimumAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN;
    constructor(public payload: { payment: { allowBuyWithoutMinimun: any } }) {}
}
export class UpdateAllowBuyWithoutMinimumSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_SUCCESS;
    constructor(public payload: { payment: { allowBuyWithoutMinimun: any } }) {}
}
export class UpdateAllowBuyWithoutMinimumFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



/* END allowBuyWithoutMinimum */
export class UpdateReturnToMailBoxOrderAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER;
    constructor(public payload: { returnToMailBoxOrder: any  }) {}
}
export class UpdateReturnToMailBoxOrderActionSuccess implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER_SUCCESS;
    constructor(public payload: { returnToMailBoxOrder: any  }) {}
}
export class UpdateReturnToMailBoxOrderActionFail implements Action {
    readonly type = PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export class UpdateSumDeliveryPriceToTicketAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET;
    constructor(public payload: { payment: { sumDeliveryPriceToTicket: boolean } }) {}
}
export class UpdateSumDeliveryPriceToTicketActionSuccess implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_SUCCESS;
    constructor(public payload: { payment: { sumDeliveryPriceToTicket: boolean } }) {}
}
export class UpdateSumDeliveryPriceToTicketActionFail implements Action {
    readonly type = PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class UpdateTimeReturnToMailBoxOrderAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER;
    constructor(public payload: { timeReturnToMailBoxOrder: any  }) {}
}
export class UpdateTimeReturnToMailBoxOrderActionSuccess implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_SUCCESS;
    constructor(public payload: { timeReturnToMailBoxOrder: any  }) {}
}
export class UpdateTimeReturnToMailBoxOrderActionFail implements Action {
    readonly type = PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}




/* quantityBuyWithoutMinimum */
export class UpdateQuantityBuyWithoutMinimumAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN;
    constructor(public payload: { payment: { quantityBuyWithoutMinimun: any } }) {}
}
export class UpdateQuantityBuyWithoutMinimumSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_SUCCESS;
    constructor(public payload: { payment: { quantityBuyWithoutMinimun: any } }) {}
}
export class UpdateQuantityBuyWithoutMinimumFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* END quantityBuyWithoutMinimum */


/* updateQuantityDelayModifySchedule */

export class UpdateQuantityDelayModifyScheduleAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE;
    constructor(public payload: { quantityDelayModifySchedule: number }) {}
}
export class UpdateQuantityDelayModifyScheduleSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_SUCCESS;
    constructor(public payload: { quantityDelayModifySchedule: number }) {}
}
export class UpdateQuantityDelayModifyScheduleFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* end updateQuantityDelayModifySchedule */


/*UpdateDelayWhenPassingTime */

export class UpdateDelayWhenPassingTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DELAY_WHEN_REVIEWING_TIME;
    constructor(public payload: { delayWhenPassingTime: number }) {}
}
export class UpdateDelayWhenPassingTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DELAY_WHEN_REVIEWING_TIME_SUCCESS;
    constructor(public payload: { delayWhenPassingTime: number }) {}
}
export class UpdateDelayWhenPassingTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_DELAY_WHEN_REVIEWING_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* end UpdateDelayWhenPassingTime */


/* UpdateQuantityAdvancesModifySchedule */

export class UpdateQuantityAdvancesModifyScheduleAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE;
    constructor(public payload: { quantityAdvancesModifySchedule: number }) {}
}
export class UpdateQuantityAdvancesModifyScheduleSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_SUCCESS;
    constructor(public payload: { quantityAdvancesModifySchedule: number }) {}
}
export class UpdateQuantityAdvancesModifyScheduleFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* end UpdateQuantityAdvancesModifySchedule */


/* UpdateAdvanceWhenAnticipatingTime */

export class UpdateAdvanceWhenAnticipatingTimeAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME;
    constructor(public payload: { advanceWhenAnticipatingTime: number }) {}
}
export class UpdateAdvanceWhenAnticipatingTimeSuccessAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_SUCCESS;
    constructor(public payload: { advanceWhenAnticipatingTime: number }) {}
}
export class UpdateAdvanceWhenAnticipatingTimeFailAction implements Action {
    readonly type = PreferencesActionTypes.UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

/* end UpdateAdvanceWhenAnticipatingTime */



export type PreferencesAction =
    | LoadPreferences
    | LoadPreferencesSuccess
    | LoadPreferencesFail
    | ToggleOptimizationPreferenceOption
    | ToggleOptimizationPreferenceOptionSuccess
    | ToggleOptimizationPreferenceOptionFail
    | ToggleInterfacePreferenceOption
    | ToggleInterfacePreferenceOptionSuccess
    | ToggleInterfacePreferenceOptionFail
    | TogglePrintingPreferenceOption
    | TogglePrintingPreferenceOptionSuccess
    | TogglePrintingPreferenceOptionFail
    | GetWarehouseCoordinatesAction
    | GetWarehouseCoordinatesSuccessAction
    | GetWarehouseCoordinatesFailAction
    | UpdateWarehouseAction
    | UpdateWarehouseSuccessAction
    | UpdateWarehouseFailAction
    | UpdateAddresesOrderRangeAction
    | UpdateAddresesOrderRangeSuccessAction
    | UpdateAddresesOrderRangeFailAction
    | UpdateDefaultServiceTimeAction
    | UpdateDefaultServiceTimeSuccessAction
    | UpdateDefaultServiceTimeFailAction
    | UpdateDefaultDeliveryScheduleAction
    | UpdateDefaultDeliveryScheduleSuccessAction
    | UpdateDefaultDeliveryScheduleFailAction
    | UpdateTrafficAction
    | UpdateTrafficSuccessAction
    | UpdateTrafficFailAction
    | ToggleManamgementPreferenceOption
    | ToggleManamgementPreferenceOptionSuccess
    | ToggleManamgementPreferenceOptionFail
    | ToggleControlPanelPreferenceOption
    | ToggleControlPanelPreferenceOptionSuccess
    | ToggleControlPanelPreferenceOptionFail
    | UpdateDefaultRefreshAction
    | UpdateDefaultRefreshSuccessAction
    | UpdateDefaultRefreshFailAction
    | UpdateAutomaticEndRouteTimeAction
    | UpdateAutomaticEndRouteTimeSuccessAction
    | UpdateAutomaticEndRouteTimeFailAction
    | Logout
    | UpdateMinServiceTimeStatAction
    | UpdateMinServiceTimeStatSuccessAction
    | UpdateMinServiceTimeStatFailAction
    | UpdateMaxServiceTimeStatAction
    | UpdateMaxServiceTimeStatSuccessAction
    | UpdateMaxServiceTimeStatFailAction
    | UpdateOrderMaxTimeAction
    | UpdateOrderMaxTimeSuccessAction
    | UpdateOrderMaxTimeFailAction
    | UpdateOrderSyncTimeAction
    | UpdateOrderSyncTimeSuccessAction
    | UpdateOrderSyncTimeFailAction
    | UpdateStoppedCommercialMaxTimeAction
    | UpdateStoppedCommercialMaxTimeSuccessAction
    | UpdateStoppedCommercialMaxTimeFailAction
    | UpdateStoppedDriverMaxTimeAction
    | UpdateStoppedDriverMaxTimeSuccessAction
    | UpdateStoppedDriverMaxTimeFailAction
    | UpdateScheduleGeolocationAction
    | UpdateScheduleGeolocationSuccessAction
    | UpdateScheduleGeolocationFailAction
    | UpdateMinAvgServiceTimeAction
    | UpdateMinAvgServiceTimeSuccessAction
    | UpdateMinAvgServiceTimeFailAction
    | UpdateOrderSyncEachTimeAction
    | UpdateOrderSyncEachTimeSuccessAction
    | UpdateOrderSyncEachTimeFailAction
    | ToggleAppPreferenceOption
    | ToggleAppPreferenceOptionSuccess
    | ToggleAppPreferenceOptionFail
    | ToggleOrdersPreferenceOption
    | ToggleOrdersPreferenceOptionSuccess
    | ToggleOrdersPreferenceOptionFail
    | ToggleFranchisePreferenceOption
    | ToggleFranchisePreferenceOptionSuccess
    | ToggleFranchisePreferenceOptionFail
    | ToggleProductPreferenceOption
    | ToggleProductPreferenceOptionSuccess
    | ToggleProductPreferenceOptionFail
    | UpdateRangeDistanceAction
    | UpdateRangeDistanceSuccessAction
    | UpdateRangeDistanceFailAction
    | UpdateMinPaymentAction
    | UpdateMinPaymentSuccessAction
    | UpdateMinPaymentFailAction
    | UpdatePrepaidPaymentAction
    | UpdatePrepaidPaymentSuccessAction
    | UpdatePrepaidPaymentFailAction
    | UpdatePreferenceDeliveryAction
    | UpdatePreferenceDeliverySuccessAction
    | UpdatePreferenceDeliveryFailAction
    | CreatePreferenceDeliveryAction
    | CreatePreferenceDeliverySuccessAction
    | CreatePreferenceDeliveryFailAction
    | LoadProductPreferences
    | LoadProductPreferencesSuccess
    | LoadProductPreferencesFail
    | LoadFranchisesPreferences
    | LoadFranchisesPreferencesSuccess
    | LoadFranchisesPreferencesFail
    | LoadGeolocationPreferences
    | LoadGeolocationPreferencesSuccess
    | LoadGeolocationPreferencesFail
    | UpdateAllowBuyWithoutMinimumAction
    | UpdateAllowBuyWithoutMinimumSuccessAction
    | UpdateAllowBuyWithoutMinimumFailAction
    | UpdateQuantityBuyWithoutMinimumAction
    | UpdateQuantityBuyWithoutMinimumSuccessAction
    | UpdateQuantityBuyWithoutMinimumFailAction
    | LoadCompanyPreparationPreferences
    | LoadCompanyPreparationPreferencesSuccess
    | LoadCompanyPreparationPreferencesFail
    | UpdateReturnToMailBoxOrderAction
    | UpdateReturnToMailBoxOrderActionSuccess
    | UpdateReturnToMailBoxOrderActionFail
    | UpdateTimeReturnToMailBoxOrderAction
    | UpdateTimeReturnToMailBoxOrderActionSuccess
    | UpdateTimeReturnToMailBoxOrderActionFail
    | UpdateSumQuantityBuyWithoutMinimunToTicketAction
    | UpdateSumQuantityBuyWithoutMinimunToTicketActionSuccess
    | UpdateSumQuantityBuyWithoutMinimunToTicketActionFail
    | UpdateAllowChangeOrderPaymentStatusAction
    | UpdateAllowChangeOrderPaymentStatusActionSuccess
    | UpdateAllowChangeOrderPaymentStatusActionFail   
    | UpdateSumDeliveryPriceToTicketAction
    | UpdateSumDeliveryPriceToTicketActionSuccess
    | UpdateSumDeliveryPriceToTicketActionFail
    | UpdateMaxAvgServiceTimeAction
    | UpdateMaxAvgServiceTimeSuccessAction
    | UpdateMaxAvgServiceTimeFailAction
    | ToggleOptimizationPreferenceAction
    | ToggleOptimizationPreferenceActionSuccess
    | ToggleOptimizationPreferenceActionFail
    | LoadDashboardPreferencesAction
    | LoadDashboardPreferencesActionSuccess
    | LoadDashboardPreferencesActionFail
    | UpdateQuantityDelayModifyScheduleAction
    | UpdateQuantityDelayModifyScheduleSuccessAction
    | UpdateQuantityDelayModifyScheduleFailAction
    | UpdateDelayWhenPassingTimeAction
    | UpdateDelayWhenPassingTimeSuccessAction
    | UpdateDelayWhenPassingTimeFailAction
    | UpdateQuantityAdvancesModifyScheduleAction
    | UpdateQuantityAdvancesModifyScheduleSuccessAction
    | UpdateQuantityAdvancesModifyScheduleFailAction
    | UpdateAdvanceWhenAnticipatingTimeAction
    | UpdateAdvanceWhenAnticipatingTimeSuccessAction
    | UpdateAdvanceWhenAnticipatingTimeFailAction;


export const fromPreferencesActions = {
    LoadPreferences,
    LoadPreferencesSuccess,
    LoadPreferencesFail,
    ToggleOptimizationPreferenceOption,
    ToggleOptimizationPreferenceOptionSuccess,
    ToggleOptimizationPreferenceOptionFail,
    ToggleInterfacePreferenceOption,
    ToggleInterfacePreferenceOptionSuccess,
    ToggleInterfacePreferenceOptionFail,
    TogglePrintingPreferenceOption,
    TogglePrintingPreferenceOptionSuccess,
    TogglePrintingPreferenceOptionFail,
    GetWarehouseCoordinatesAction,
    GetWarehouseCoordinatesSuccessAction,
    GetWarehouseCoordinatesFailAction,
    UpdateWarehouseAction,
    UpdateWarehouseSuccessAction,
    UpdateWarehouseFailAction,
    UpdateAddresesOrderRangeAction,
    UpdateAddresesOrderRangeSuccessAction,
    UpdateAddresesOrderRangeFailAction,
    UpdateDefaultServiceTimeAction,
    UpdateDefaultServiceTimeSuccessAction,
    UpdateDefaultServiceTimeFailAction,
    UpdateDefaultDeliveryScheduleAction,
    UpdateDefaultDeliveryScheduleSuccessAction,
    UpdateDefaultDeliveryScheduleFailAction,
    UpdateTrafficAction,
    UpdateTrafficSuccessAction,
    UpdateTrafficFailAction,
    ToggleManamgementPreferenceOption,
    ToggleManamgementPreferenceOptionSuccess,
    ToggleManamgementPreferenceOptionFail,
    ToggleControlPanelPreferenceOption,
    ToggleControlPanelPreferenceOptionSuccess,
    ToggleControlPanelPreferenceOptionFail,
    UpdateDefaultRefreshAction,
    UpdateDefaultRefreshSuccessAction,
    UpdateDefaultRefreshFailAction,
    UpdateAutomaticEndRouteTimeAction,
    UpdateAutomaticEndRouteTimeSuccessAction,
    UpdateAutomaticEndRouteTimeFailAction,
    Logout,
    UpdateMinServiceTimeStatAction,
    UpdateMinServiceTimeStatSuccessAction,
    UpdateMinServiceTimeStatFailAction,
    UpdateMaxServiceTimeStatAction,
    UpdateMaxServiceTimeStatSuccessAction,
    UpdateMaxServiceTimeStatFailAction,
    UpdateOrderMaxTimeAction,
    UpdateOrderMaxTimeSuccessAction,
    UpdateOrderMaxTimeFailAction,
    UpdateOrderSyncTimeAction,
    UpdateOrderSyncTimeSuccessAction,
    UpdateOrderSyncTimeFailAction,
    UpdateStoppedCommercialMaxTimeAction,
    UpdateStoppedCommercialMaxTimeSuccessAction,
    UpdateStoppedCommercialMaxTimeFailAction,
    UpdateStoppedDriverMaxTimeAction,
    UpdateStoppedDriverMaxTimeSuccessAction,
    UpdateStoppedDriverMaxTimeFailAction,
    UpdateScheduleGeolocationAction,
    UpdateScheduleGeolocationSuccessAction,
    UpdateScheduleGeolocationFailAction,
    UpdateMinAvgServiceTimeAction,
    UpdateMinAvgServiceTimeSuccessAction,
    UpdateMinAvgServiceTimeFailAction,
    UpdateOrderSyncEachTimeAction,
    UpdateOrderSyncEachTimeSuccessAction,
    UpdateOrderSyncEachTimeFailAction,
    ToggleAppPreferenceOption,
    ToggleAppPreferenceOptionSuccess,
    ToggleAppPreferenceOptionFail,
    ToggleOrdersPreferenceOption,
    ToggleOrdersPreferenceOptionSuccess,
    ToggleOrdersPreferenceOptionFail,
    ToggleFranchisePreferenceOption,
    ToggleFranchisePreferenceOptionSuccess,
    ToggleFranchisePreferenceOptionFail,
    ToggleProductPreferenceOption,
    ToggleProductPreferenceOptionSuccess,
    ToggleProductPreferenceOptionFail,
    UpdateRangeDistanceAction,
    UpdateRangeDistanceSuccessAction,
    UpdateRangeDistanceFailAction,
    UpdateMinPaymentAction,
    UpdateMinPaymentSuccessAction,
    UpdateMinPaymentFailAction,
    UpdatePrepaidPaymentAction,
    UpdatePrepaidPaymentSuccessAction,
    UpdatePrepaidPaymentFailAction,
    UpdatePreferenceDeliveryAction,
    UpdatePreferenceDeliverySuccessAction,
    UpdatePreferenceDeliveryFailAction,
    CreatePreferenceDeliveryAction,
    CreatePreferenceDeliverySuccessAction,
    CreatePreferenceDeliveryFailAction,
    LoadProductPreferences,
    LoadProductPreferencesSuccess,
    LoadProductPreferencesFail,
    LoadFranchisesPreferences,
    LoadFranchisesPreferencesSuccess,
    LoadFranchisesPreferencesFail,
    LoadGeolocationPreferences,
    LoadGeolocationPreferencesSuccess,
    LoadGeolocationPreferencesFail,
    UpdateAllowBuyWithoutMinimumAction,
    UpdateAllowBuyWithoutMinimumSuccessAction,
    UpdateAllowBuyWithoutMinimumFailAction,
    UpdateQuantityBuyWithoutMinimumAction,
    UpdateQuantityBuyWithoutMinimumSuccessAction,
    UpdateQuantityBuyWithoutMinimumFailAction,
    LoadCompanyPreparationPreferences,
    LoadCompanyPreparationPreferencesSuccess,
    LoadCompanyPreparationPreferencesFail,
    UpdateReturnToMailBoxOrderAction,
    UpdateReturnToMailBoxOrderActionSuccess,
    UpdateReturnToMailBoxOrderActionFail,
    UpdateTimeReturnToMailBoxOrderAction,
    UpdateTimeReturnToMailBoxOrderActionSuccess,
    UpdateTimeReturnToMailBoxOrderActionFail,
    UpdateSumQuantityBuyWithoutMinimunToTicketAction,
    UpdateSumQuantityBuyWithoutMinimunToTicketActionSuccess,
    UpdateSumQuantityBuyWithoutMinimunToTicketActionFail,
    UpdateAllowChangeOrderPaymentStatusAction,
    UpdateAllowChangeOrderPaymentStatusActionSuccess,
    UpdateAllowChangeOrderPaymentStatusActionFail,
    UpdateSumDeliveryPriceToTicketAction,
    UpdateSumDeliveryPriceToTicketActionSuccess,
    UpdateSumDeliveryPriceToTicketActionFail,
    UpdateMaxAvgServiceTimeAction,
    UpdateMaxAvgServiceTimeSuccessAction,
    UpdateMaxAvgServiceTimeFailAction,
    ToggleOptimizationPreferenceAction,
    ToggleOptimizationPreferenceActionSuccess,
    ToggleOptimizationPreferenceActionFail,
    LoadDashboardPreferencesAction,
    LoadDashboardPreferencesActionSuccess,
    LoadDashboardPreferencesActionFail,
    UpdateQuantityDelayModifyScheduleAction,
    UpdateQuantityDelayModifyScheduleSuccessAction,
    UpdateQuantityDelayModifyScheduleFailAction,
    UpdateDelayWhenPassingTimeAction,
    UpdateDelayWhenPassingTimeSuccessAction,
    UpdateDelayWhenPassingTimeFailAction,
    UpdateQuantityAdvancesModifyScheduleAction,
    UpdateQuantityAdvancesModifyScheduleSuccessAction,
    UpdateQuantityAdvancesModifyScheduleFailAction,
    UpdateAdvanceWhenAnticipatingTimeAction,
    UpdateAdvanceWhenAnticipatingTimeSuccessAction,
    UpdateAdvanceWhenAnticipatingTimeFailAction
};
