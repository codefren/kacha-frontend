import { Injectable } from '@angular/core';
import { Effect, ofType } from '@ngrx/effects';
import { StateProfileSettingsService } from '../state-profile-settings.service';
import { Actions } from '@ngrx/effects';
import { concatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    ProfileSettingsActionType,
    LoadAllAction,
    LoadAllSuccessAction,
    LoadAllFailAction,
    UpdateAction,
    UpdateSuccessAction,
    UpdateFailAction,
    UpdateAcceptTermsAction,
    UpdateAcceptTermsSuccessAction,
    UpdateAcceptTermsFailAction,
    ChangeGuideShowTips,
    ChangeGuideShowTipsSuccess,
    ChangeGuideShowTipsFail,
    UpdateHelGuideId,
    UpdateHelGuideIdSuccess,
    UpdateHelGuideIdFail,
    LoadHelpGuideStep,
    LoadHelpGuideStepSuccess,
    LoadHelpGuideStepFail,
    EndHelpGuideStep,
    EndHelpGuideStepSuccess,
    EndHelpGuideStepFail,
    ChangePlanAction,
    ChangePlanActionSuccess,
    ChangePlanActionFail,
    ChangePriceAction,
    ChangePriceActionSuccess,
    ChangePriceActionFail,
    ChangeNoveltyLast,
    ChangeNoveltyLastSuccess,
    ChangeNoveltyLastFail,
} from './profile-settings.actions';
import { ToastService } from '@optimroute/shared';

@Injectable()
export class ProfileSettingsEffects {
    @Effect()
    load$ = this.actions$.pipe(ofType<LoadAllAction>(ProfileSettingsActionType.LOAD_ALL)).pipe(
        concatMap(() =>
            this.service.getProfileSettings().pipe(
                map(results => new LoadAllSuccessAction(results)),
                catchError(error => of(new LoadAllFailAction({ error }))),
            ),
        ),
    );

    @Effect()
    update$ = this.actions$.pipe(ofType<UpdateAction>(ProfileSettingsActionType.UPDATE)).pipe(
        concatMap(action =>
            this.service.saveProfileSettings(action.payload).pipe(
                map(results => new UpdateSuccessAction(action.payload)),
                catchError(error => of(new UpdateFailAction({ error }))),
            ),
        ),
    );


    @Effect()
    updateAcceptTerms$ = this.actions$
        .pipe(ofType<UpdateAcceptTermsAction>(
            ProfileSettingsActionType.UPDATE_ACCEPT_TERMS,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.updateAcceptTerms(payload.accept).pipe(
                    map(
                        result =>
                            new UpdateAcceptTermsSuccessAction(
                                payload,
                            ),
                    ),
                    catchError(error =>
                        of(
                            new UpdateAcceptTermsFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateAcceptTimeFail$ = this.actions$
        .pipe(ofType<UpdateAcceptTermsFailAction>(
            ProfileSettingsActionType.UPDATE_ACCEPT_TERMS_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );



    @Effect()
    showGuideModal$ = this.actions$
        .pipe(ofType<ChangeGuideShowTips>(
            ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.noShowModal(payload.showTipsModal).pipe(
                    map(
                        result =>
                            new ChangeGuideShowTipsSuccess(
                                payload,
                            ),
                    ),
                    catchError(error =>
                        of(
                            new ChangeGuideShowTipsFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    showGuideModalFail$ = this.actions$
        .pipe(ofType<ChangeGuideShowTipsFail>(
            ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );




    @Effect()
    noveltyLast$ = this.actions$
        .pipe(ofType<ChangeNoveltyLast>(
            ProfileSettingsActionType.CHANGE_NOVELTY_LAST,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.noNoveltyLastModal(payload.noveltyLast).pipe(
                    map(
                        result =>
                            new ChangeNoveltyLastSuccess(
                                payload,
                            ),
                    ),
                    catchError(error =>
                        of(
                            new ChangeNoveltyLastFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    noveltyLastFail$ = this.actions$
        .pipe(ofType<ChangeNoveltyLastFail>(
            ProfileSettingsActionType.CHANGE_NOVELTY_LAST_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );



    @Effect()
    helpGuideId$ = this.actions$
        .pipe(ofType<UpdateHelGuideId>(
            ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.updateHelpGuideId(payload.helpGuideId).pipe(
                    map(
                        result =>
                            new UpdateHelGuideIdSuccess(
                                result,
                            ),
                    ),
                    catchError(error =>
                        of(
                            new UpdateHelGuideIdFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    helpGuideIdFail$ = this.actions$
        .pipe(ofType<ChangeGuideShowTipsFail>(
            ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    loadHelpGuideStep$ = this.actions$
        .pipe(ofType<LoadHelpGuideStep>(
            ProfileSettingsActionType.LOAD_HELP_GUIDE_STEP,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.loadHelpGuideStep(payload.id).pipe(
                    map(
                        result =>
                            new LoadHelpGuideStepSuccess(
                                result,
                            ),
                    ),
                    catchError(error =>
                        of(
                            new LoadHelpGuideStepFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadHelpGuideStepFail$ = this.actions$
        .pipe(ofType<LoadHelpGuideStepFail>(
            ProfileSettingsActionType.LOAD_HELP_GUIDE_STEP_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );



    @Effect()
    endHelpGuideStep$ = this.actions$
        .pipe(ofType<EndHelpGuideStep>(
            ProfileSettingsActionType.END_HELP_GUIDE_STEP,
        ))
        .pipe(
            map(action => action),
            concatMap(payload =>
                this.service.noShowModal(false).pipe(
                    map(
                        result =>
                            new EndHelpGuideStepSuccess(
                            ),
                    ),
                    catchError(error =>
                        of(
                            new EndHelpGuideStepFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    endHelpGuideStepFail$ = this.actions$
        .pipe(ofType<EndHelpGuideStepFail>(
            ProfileSettingsActionType.END_HELP_GUIDE_STEP_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    @Effect()
    changePlan$ = this.actions$
        .pipe(ofType<ChangePlanAction>(
            ProfileSettingsActionType.CHANGE_PLAN_ACTION,
        ))
        .pipe(
            map(action => action),
            concatMap(action =>
                this.service.changePlanAction(action.payload.companyProfileTypeId).pipe(
                    map(
                        result =>
                            new ChangePlanActionSuccess(action.payload
                            ),
                    ),
                    catchError(error =>
                        of(
                            new ChangePlanActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changePlanFail$ = this.actions$
        .pipe(ofType<ChangePlanActionFail>(
            ProfileSettingsActionType.CHANGE_PLAN_ACTION_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );



    @Effect()
    changePrice$ = this.actions$
        .pipe(ofType<ChangePriceAction>(
            ProfileSettingsActionType.CHANGE_PRICE_ACTION,
        ))
        .pipe(
            map(action => action),
            concatMap(action =>
                this.service.changePrice(action.payload.price).pipe(
                    map(
                        result =>
                            new ChangePriceActionSuccess(action.payload
                            ),
                    ),
                    catchError(error =>
                        of(
                            new ChangePriceActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changePriceFail$ = this.actions$
        .pipe(ofType<ChangePriceActionFail>(
            ProfileSettingsActionType.CHANGE_PRICE_ACTION_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    constructor(private service: StateProfileSettingsService, private actions$: Actions, private toastService: ToastService) { }
}
