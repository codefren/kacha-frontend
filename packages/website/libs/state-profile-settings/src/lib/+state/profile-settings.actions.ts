import { Action } from '@ngrx/store';
import { Profile, ProfileInfo, Address, Company, CompanyProfile } from '@optimroute/backend';
import { HttpErrorResponse } from '@angular/common/http';

export enum ProfileSettingsActionType {
    LOAD_ALL = '[Profile Settings] LOAD_ALL',
    LOAD_ALL_SUCCESS = '[Profile Settings] LOAD_ALL_SUCCESS',
    LOAD_ALL_FAIL = '[Profile Settings] LOAD_ALL_FAIL',
    UPDATE = '[Profile Settings] UPDATE',
    UPDATE_SUCCESS = '[Profile Settings] UPDATE_SUCCESS',
    UPDATE_FAIL = '[Profile Settings] UPDATE_FAIL',
    UPDATE_ACCEPT_TERMS = '[Preferences] UPDATE_ACCEPT_TERMS',
    UPDATE_ACCEPT_TERMS_SUCCESS = '[Preferences] UPDATE_ACCEPT_TERMS_SUCCESS',
    UPDATE_ACCEPT_TERMS_FAIL = '[Preferences] UPDATE_ACCEPT_TERMS_FAIL',
    CHANGE_GUIDE_SHOW_TIPS = '[Preferences] CHANGE_GUIDE_SHOW_TIPS',
    CHANGE_GUIDE_SHOW_TIPS_SUCCESS = '[Preferences] CHANGE_GUIDE_SHOW_TIPS_SUCCESS',
    CHANGE_GUIDE_SHOW_TIPS_FAIL = '[Preferences] CHANGE_GUIDE_SHOW_TIPS_FAIL',



    CHANGE_NOVELTY_LAST = '[Preferences] CHANGE_NOVELTY_LAST',
    CHANGE_NOVELTY_LAST_SUCCESS = '[Preferences] CHANGE_NOVELTY_LAST_SUCCESS',
    CHANGE_NOVELTY_LAST_FAIL = '[Preferences] CHANGE_NOVELTY_LAST_FAIL',

    UPDATE_HELP_GUIDE_ID = '[Preferences] UPDATE_HELP_GUIDE_ID',
    UPDATE_HELP_GUIDE_ID_SUCCESS = '[Preferences] UPDATE_HELP_GUIDE_ID_SUCCESS',
    UPDATE_HELP_GUIDE_ID_FAIL = '[Preferences] UPDATE_HELP_GUIDE_ID_FAIL',
    LOAD_HELP_GUIDE_STEP = '[Preferences] LOAD_HELP_GUIDE_STEP',
    LOAD_HELP_GUIDE_STEP_SUCCESS = '[Preferences] LOAD_HELP_GUIDE_STEP_SUCCESS',
    LOAD_HELP_GUIDE_STEP_FAIL = '[Preferences] LOAD_HELP_GUIDE_STEP_FAIL',
    END_HELP_GUIDE_STEP = '[Preferences] END_HELP_GUIDE_STEP',
    END_HELP_GUIDE_STEP_SUCCESS = '[Preferences] END_HELP_GUIDE_STEP_SUCCESS',
    END_HELP_GUIDE_STEP_FAIL = '[Preferences] END_HELP_GUIDE_STEP_FAIL',
    CHANGE_PLAN_ACTION = '[Preferences] CHANGE_PLAN_ACTION',
    CHANGE_PLAN_ACTION_SUCCESS = '[Preferences] CHANGE_PLAN_ACTION_SUCCESS',
    CHANGE_PLAN_ACTION_FAIL = '[Preferences] CHANGE_PLAN_ACTION_FAIL',
    CHANGE_PRICE_ACTION = '[Preferences] CHANGE_PRICE_ACTION',
    CHANGE_PRICE_ACTION_SUCCESS = '[Preferences] CHANGE_PRICE_ACTION_SUCCESS',
    CHANGE_PRICE_ACTION_FAIL = '[Preferences] CHANGE_PRICE_ACTION_FAIL',
    LOGOUT = '[Profile Settings] LOGOUT',
}

export class LoadAllAction implements Action {
    readonly type = ProfileSettingsActionType.LOAD_ALL;
    constructor() {}
}
export class LoadAllSuccessAction implements Action {
    readonly type = ProfileSettingsActionType.LOAD_ALL_SUCCESS;
    constructor(
        public payload: {
            email: string;
            profile: ProfileInfo;
            address: Address;
            company: CompanyProfile,
            showTipsModal: boolean;
            noveltyLast: boolean;
            helpGuideId: number;
            id: number,
            profiles:[]
        },
    ) {}
}
export class LoadAllFailAction implements Action {
    readonly type = ProfileSettingsActionType.LOAD_ALL_FAIL;
    constructor(public payload: { error: Error }) {}
}

export class UpdateAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE;
    constructor(public payload: Partial<Profile>) {}
}
export class UpdateSuccessAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_SUCCESS;
    constructor(public payload: Partial<Profile>) {}
}
export class UpdateFailAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_FAIL;
    constructor(public payload: { error: Error }) {}
}
export class Logout implements Action{
    readonly type = ProfileSettingsActionType.LOGOUT;  
}

export class UpdateAcceptTermsAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_ACCEPT_TERMS;
    constructor(public payload: { accept: boolean }) {}
}
export class UpdateAcceptTermsSuccessAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_ACCEPT_TERMS_SUCCESS;
    constructor(public payload: { accept: boolean }) {}
}
export class UpdateAcceptTermsFailAction implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_ACCEPT_TERMS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class ChangeGuideShowTips implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS;
    constructor(public payload: { showTipsModal: boolean }) {}
}

export class ChangeGuideShowTipsSuccess implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS_SUCCESS;
    constructor(public payload: { showTipsModal: boolean }) {}
}

export class ChangeGuideShowTipsFail implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ChangeNoveltyLast implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_NOVELTY_LAST;
    constructor(public payload: { noveltyLast: boolean }) {}
}

export class ChangeNoveltyLastSuccess implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_NOVELTY_LAST_SUCCESS;
    constructor(public payload: { noveltyLast: boolean }) {}
}

export class ChangeNoveltyLastFail implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_NOVELTY_LAST_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateHelGuideId implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID;
    constructor(public payload: { helpGuideId: number }) {}
}

export class UpdateHelGuideIdSuccess implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID_SUCCESS;
    constructor(public payload: { 
        id: number, 
        step: number, 
        count: number, 
        title: string, 
        description: string,
        beforeUrl: string, 
        currentUrl: string,
        beforeStep: number,
        nextStep: number,
        nextUrl: string }) {}
}

export class UpdateHelGuideIdFail implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class LoadHelpGuideStep implements Action {
    readonly type = ProfileSettingsActionType.LOAD_HELP_GUIDE_STEP;
    constructor(public payload: { id: number }) {}
}

export class LoadHelpGuideStepSuccess implements Action {
    readonly type = ProfileSettingsActionType.LOAD_HELP_GUIDE_STEP_SUCCESS;
    constructor(public payload: { 
        id: number, 
        step: number, 
        count: number, 
        title: string, 
        description: string,
        beforeUrl: string, 
        currentUrl: string,
        beforeStep: number,
        nextStep: number,
        nextUrl: string }) {}
}

export class LoadHelpGuideStepFail implements Action {
    readonly type = ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class EndHelpGuideStep implements Action {
    readonly type = ProfileSettingsActionType.END_HELP_GUIDE_STEP;
}

export class EndHelpGuideStepSuccess implements Action {
    readonly type = ProfileSettingsActionType.END_HELP_GUIDE_STEP_SUCCESS;
}

export class EndHelpGuideStepFail implements Action {
    readonly type = ProfileSettingsActionType.END_HELP_GUIDE_STEP_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ChangePlanAction implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PLAN_ACTION;
    constructor( public payload: { companyProfileTypeId: number } ){ }
}

export class ChangePlanActionSuccess implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PLAN_ACTION_SUCCESS;
    constructor( public payload: { companyProfileTypeId: number } ){ }
}

export class ChangePlanActionFail implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PLAN_ACTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}


export class ChangePriceAction implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PRICE_ACTION;
    constructor( public payload: { price: string ,companyProfileTypeId: number } ){ }
}

export class ChangePriceActionSuccess implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PRICE_ACTION_SUCCESS;
    constructor( public payload: { price: string ,companyProfileTypeId: number } ){ }
}

export class ChangePriceActionFail implements Action {
    readonly type = ProfileSettingsActionType.CHANGE_PRICE_ACTION_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}



export type ProfileSettingsAction =
    | LoadAllAction
    | LoadAllSuccessAction
    | LoadAllFailAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | UpdateAcceptTermsAction
    | UpdateAcceptTermsSuccessAction
    | UpdateAcceptTermsFailAction
    | ChangeGuideShowTips
    | ChangeGuideShowTipsSuccess
    | ChangeGuideShowTipsFail
    | UpdateHelGuideId
    | UpdateHelGuideIdSuccess
    | UpdateHelGuideIdFail
    | LoadHelpGuideStep
    | LoadHelpGuideStep
    | LoadHelpGuideStepSuccess
    | LoadHelpGuideStepFail
    | EndHelpGuideStep
    | EndHelpGuideStepSuccess
    | EndHelpGuideStepFail
    | ChangePlanAction
    | ChangePlanActionSuccess
    | ChangePlanActionFail
    | ChangePriceAction
    | ChangePriceActionSuccess
    | ChangePriceActionFail
    | ChangeNoveltyLast
    | ChangeNoveltyLastSuccess
    | ChangeNoveltyLastFail
    | Logout;
