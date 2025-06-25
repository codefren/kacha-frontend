import { Action } from '@ngrx/store';
import { Company, CompanyModuleInterface } from '@optimroute/backend';
import { HttpErrorResponse } from '@angular/common/http';
export enum CompaniesActionTypes {
    LOAD_COMPANIES = '[COMPANIES] LOAD_COMPANIES',
    LOAD_COMPANIES_SUCCESS = '[COMPANIES] LOAD_COMPANIES_SUCCESS',
    LOAD_COMPANIES_FAIL = '[COMPANIES] LOAD_COMPANIES_FAIL',
    ADD_COMPANY = '[COMPANIES] ADD_COMPANY',
    ADD_COMPANY_SUCCESS = '[COMPANIES] ADD_COMPANY_SUCCESS',
    ADD_COMPANY_FAIL = '[COMPANIES] ADD_COMPANY_FAIL',
    UPDATE_COMPANY = '[COMPANIES] UPDATE_COMPANY',
    UPDATE_COMPANY_SUCCESS = '[COMPANIES] UPDATE_COMPANY_SUCCESS',
    UPDATE_COMPANY_FAIL = '[COMPANIES] UPDATE_COMPANY_FAIL',
    DELETE_COMPANY = '[COMPANIES] DELETE_COMPANY',
    DELETE_COMPANY_SUCCESS = '[COMPANIES] DELETE_COMPANY_SUCCESS',
    DELETE_COMPANY_FAIL = '[COMPANIES] DELETE_COMPANY_FAIL',
    UPDATE_COMPANY_DEMO = '[COMPANIES] UPDATE_COMPANY_DEMO',
    UPDATE_COMPANY_DEMO_SUCCESS = '[COMPANIES] UPDATE_COMPANY_DEMO_SUCCES',
    UPDATE_COMPANY_DEMO_FAIL = '[COMPANIES] UPDATE_COMPANY_DEMO_FAIL',
    UPDATE_COMPANY_ACTIVE = '[COMPANIES] UPDATE_COMPANY_ACTIVE',
    UPDATE_COMPANY_ACTIVE_SUCCESS = '[COMPANIES] UPDATE_COMPANY_ACTIVE_SUCCESS',
    UPDATE_COMPANY_ACTIVE_FAIL = '[COMPANIES] UPDATE_COMPANY_ACTIVE_FAIL',
    ADD_COMPANY_MODULE = '[COMPANY_MODULE] ADD_COMPANY_MODULE',
    ADD_COMPANY_MODULE_SUCCESS = '[COMPANY_MODULE] ADD_COMPANY_MODULE_SUCCESS',
    ADD_COMPANY_MODULE_FAIL = '[COMPANY_MODULE] ADD_COMPANY_MODULE_FAIL',
    UPDATE_COMPANY_MODULE_ACTIVE = '[COMPANY_MODULE] UPDATE_COMPANY_MODULE_ACTIVE',
    UPDATE_COMPANY_MODULE_ACTIVE_SUCCESS = '[COMPANY_MODULE] UPDATE_COMPANY_MODULE_ACTIVE_SUCCESS',
    UPDATE_COMPANY_MODULE_ACTIVE_FAIL = '[COMPANY_MODULE] UPDATE_COMPANY_MODULE_ACTIVE_FAIL',
    LOGOUT = '[COMPANIES] LOGOUT',
}

export class LoadCompanies implements Action {
    readonly type = CompaniesActionTypes.LOAD_COMPANIES;
    constructor(public payload: { me: boolean }) {}
}

export class LoadCompaniesSuccess implements Action {
    readonly type = CompaniesActionTypes.LOAD_COMPANIES_SUCCESS;
    constructor(public payload: { companies: Company[] }) {}
}

export class LoadCompaniesFail implements Action {
    readonly type = CompaniesActionTypes.LOAD_COMPANIES_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class AddCompany implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY;
    constructor(public payload: { company: Company }) {}
}

export class AddCompanySuccess implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY_SUCCESS;
    constructor(public payload: { company: Company }) {}
}

export class AddCompanyFail implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateCompany implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateCompanySuccess implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_SUCCESS;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateCompanyFail implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateDemoCompany implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_DEMO;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateDemoCompanySuccess implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_DEMO_SUCCESS;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateDemoCompanyFail implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_DEMO_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateActiveCompany implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_ACTIVE;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateActiveCompanySuccess implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_ACTIVE_SUCCESS;
    constructor(public payload: { id: number; company: Partial<Company> }) {}
}

export class UpdateActiveCompanyFail implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_ACTIVE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class AddCompanyModule implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY_MODULE;
    constructor(public payload: { companyModule: CompanyModuleInterface }) {}
}

export class AddCompanyModuleSuccess implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY_MODULE_SUCCESS;
    constructor(public payload: { companyModule: CompanyModuleInterface }) {}
}

export class AddCompanyModuleFail implements Action {
    readonly type = CompaniesActionTypes.ADD_COMPANY_MODULE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class UpdateActiveCompanyModule implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE;
    constructor(
        public payload: { id: number; companyModule: Partial<CompanyModuleInterface> },
    ) {}
}

export class UpdateActiveCompanyModuleSuccess implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE_SUCCESS;
    constructor(
        public payload: { id: number; companyModule: Partial<CompanyModuleInterface> },
    ) {}
}

export class UpdateActiveCompanyModuleFail implements Action {
    readonly type = CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class DeleteCompany implements Action {
    readonly type = CompaniesActionTypes.DELETE_COMPANY;
    constructor(public payload: { id: number }) {}
}

export class DeleteCompanySuccess implements Action {
    readonly type = CompaniesActionTypes.DELETE_COMPANY_SUCCESS;
    constructor(public payload: { id: number }) {}
}

export class DeleteCompanyFail implements Action {
    readonly type = CompaniesActionTypes.DELETE_COMPANY_FAIL;
    constructor(public payload: { error: HttpErrorResponse }) {}
}

export class Logout implements Action {
    readonly type = CompaniesActionTypes.LOGOUT;
}

export type CompaniesAction =
    | LoadCompanies
    | LoadCompaniesSuccess
    | LoadCompaniesFail
    | AddCompany
    | AddCompanySuccess
    | AddCompanyFail
    | UpdateCompany
    | UpdateCompanySuccess
    | UpdateCompanyFail
    | DeleteCompany
    | DeleteCompanySuccess
    | DeleteCompanyFail
    | UpdateDemoCompany
    | UpdateDemoCompanySuccess
    | UpdateDemoCompanyFail
    | UpdateActiveCompany
    | UpdateActiveCompanySuccess
    | UpdateActiveCompanyFail
    | AddCompanyModule
    | AddCompanyModuleSuccess
    | AddCompanyModuleFail
    | UpdateActiveCompanyModule
    | UpdateActiveCompanyModuleSuccess
    | UpdateActiveCompanyModuleFail
    | Logout;

export const fromCompaniesActions = {
    LoadCompanies,
    LoadCompaniesSuccess,
    LoadCompaniesFail,
    AddCompany,
    AddCompanySuccess,
    AddCompanyFail,
    UpdateCompany,
    UpdateCompanySuccess,
    UpdateCompanyFail,
    DeleteCompany,
    DeleteCompanySuccess,
    DeleteCompanyFail,
    UpdateDemoCompany,
    UpdateDemoCompanySuccess,
    UpdateDemoCompanyFail,
    UpdateActiveCompany,
    UpdateActiveCompanySuccess,
    UpdateActiveCompanyFail,
    AddCompanyModule,
    AddCompanyModuleSuccess,
    AddCompanyModuleFail,
    UpdateActiveCompanyModule,
    UpdateActiveCompanyModuleSuccess,
    UpdateActiveCompanyModuleFail,
    Logout,
};
