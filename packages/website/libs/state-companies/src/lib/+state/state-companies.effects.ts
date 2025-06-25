import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromCompanies from './state-companies.actions';
import { CompaniesActionTypes, AddCompanyModuleFail } from './state-companies.actions';
import { StateCompaniesService } from '../state-companies.service';
import { ToastService } from '@optimroute/shared';
import { map, concatMap, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class StateCompaniesEffects {
    @Effect()
    loadCompanies$ = this.actions$
        .pipe(ofType<fromCompanies.LoadCompanies>(CompaniesActionTypes.LOAD_COMPANIES))
        .pipe(
            map((action) => action.payload.me),
            concatMap((me) =>
                this.service.loadCompanies(me).pipe(
                    map(
                        (result) =>
                            new fromCompanies.LoadCompaniesSuccess({
                                companies: result.data,
                            }),
                    ),
                    catchError((error) =>
                        of(new fromCompanies.LoadCompaniesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadCompaniesFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.LoadCompaniesFail>(
                CompaniesActionTypes.LOAD_COMPANIES_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    addCompanies$ = this.actions$
        .pipe(ofType<fromCompanies.AddCompany>(CompaniesActionTypes.ADD_COMPANY))
        .pipe(
            map((action) => action.payload.company),
            concatMap((company) =>
                this.service.addCompany(company).pipe(
                    map(
                        (newCompany) =>
                            new fromCompanies.AddCompanySuccess({
                                company: newCompany.data,
                            }),
                    ),
                    catchError((error) => of(new fromCompanies.AddCompanyFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addCompaniesFail$ = this.actions$
        .pipe(ofType<fromCompanies.AddCompanyFail>(CompaniesActionTypes.ADD_COMPANY_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.status),
                    x.payload.error,
                );
            }),
        );

    @Effect()
    updateCompany$ = this.actions$
        .pipe(ofType<fromCompanies.UpdateCompany>(CompaniesActionTypes.UPDATE_COMPANY))
        .pipe(
            concatMap((action) =>
                this.service.updateCompany(action.payload.id, action.payload.company).pipe(
                    tap((result: any) => {}),
                    switchMap((results) => [
                        new fromCompanies.UpdateCompanySuccess({
                            id: action.payload.id,
                            company: results ? results.data : action.payload,
                        }),
                    ]),
                    catchError((error) => of(new fromCompanies.UpdateCompanyFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateCompanyFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateCompanyFail>(
                CompaniesActionTypes.UPDATE_COMPANY_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.status),
                    x.payload.error.error,
                );
            }),
        );

    @Effect()
    updateDemoCompany$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateDemoCompany>(
                CompaniesActionTypes.UPDATE_COMPANY_DEMO,
            ),
        )
        .pipe(
            concatMap((action) =>
                this.service
                    .updateDemoCompany(action.payload.id, action.payload.company)
                    .pipe(
                        switchMap((results) => {
                            console.log('results', results);
                           return  [
                                new fromCompanies.UpdateDemoCompanySuccess({
                                    id: action.payload.id,
                                    company: results.data,
                                }),
                            ]
                        }),
                        catchError((error) =>
                            of(new fromCompanies.UpdateDemoCompanyFail(error)),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateDemoCompanyFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateDemoCompanyFail>(
                CompaniesActionTypes.UPDATE_COMPANY_DEMO_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                console.log(x);
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.status),
                    x.payload.error.error,
                );
            }),
        );

    @Effect()
    updateActiveCompany$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateActiveCompany>(
                CompaniesActionTypes.UPDATE_COMPANY_ACTIVE,
            ),
        )
        .pipe(
            concatMap((action) =>
                this.service
                    .updateActiveCompany(action.payload.id, action.payload.company)
                    .pipe(
                        switchMap((results) => [
                            new fromCompanies.UpdateActiveCompanySuccess({
                                id: action.payload.id,
                                company: results.data,
                            }),
                        ]),
                        catchError((error) =>
                            of(new fromCompanies.UpdateActiveCompanyFail(error)),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateActiveCompanyFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateActiveCompanyFail>(
                CompaniesActionTypes.UPDATE_COMPANY_ACTIVE_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    addCompaniesModule$ = this.actions$
        .pipe(
            ofType<fromCompanies.AddCompanyModule>(CompaniesActionTypes.ADD_COMPANY_MODULE),
        )
        .pipe(
            map((action) => action.payload.companyModule),
            concatMap((companyModule) =>
                this.service.addCompanyModule(companyModule).pipe(
                    map(
                        (newCompanyModule) =>
                            new fromCompanies.AddCompanyModuleSuccess({
                                companyModule: newCompanyModule.data,
                            }),
                    ),
                    catchError((error) =>
                        of(new fromCompanies.AddCompanyModuleFail(error)),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addCompaniesModuleFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.AddCompanyModuleFail>(
                CompaniesActionTypes.ADD_COMPANY_MODULE_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.status),
                    x.payload.error,
                );
            }),
        );

    @Effect()
    updateActiveCompanyModule$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateActiveCompanyModule>(
                CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE,
            ),
        )
        .pipe(
            concatMap((action) =>
                this.service
                    .updateActiveCompanyModule(
                        action.payload.id,
                        action.payload.companyModule,
                    )
                    .pipe(
                        switchMap((results) => [
                            new fromCompanies.UpdateActiveCompanyModuleSuccess({
                                id: action.payload.id,
                                companyModule: results.data,
                            }),
                        ]),
                        catchError((error) =>
                            of(new fromCompanies.UpdateActiveCompanyModuleFail(error)),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateActiveCompanyModuleFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.UpdateActiveCompanyModuleFail>(
                CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    deleteCompany$ = this.actions$
        .pipe(ofType<fromCompanies.DeleteCompany>(CompaniesActionTypes.DELETE_COMPANY))
        .pipe(
            map((action) => action.payload.id),
            concatMap((id) =>
                this.service.deleteCompany(id).pipe(
                    switchMap(() => [new fromCompanies.DeleteCompanySuccess({ id })]),
                    catchError((error) =>
                        of(new fromCompanies.DeleteCompanySuccess(error)),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    deleteUserFail$ = this.actions$
        .pipe(
            ofType<fromCompanies.DeleteCompanyFail>(
                CompaniesActionTypes.DELETE_COMPANY_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );
    constructor(
        private service: StateCompaniesService,
        private actions$: Actions,
        private toastService: ToastService,
    ) {}
}
