import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { StateCompaniesState } from './state-companies.reducer';
import { stateCompaniesQuery } from './state-companies.selectors';
import {
    AddCompany,
    UpdateCompany,
    DeleteCompany,
    LoadCompanies,
    UpdateDemoCompany,
    UpdateActiveCompany,
    Logout,
    UpdateActiveCompanyModule,
    AddCompanyModule,
} from './state-companies.actions';
import { User, createUserDto, Company, CompanyModuleInterface } from '@optimroute/backend';

@Injectable()
export class StateCompaniesFacade {
    loaded$ = this.store.pipe(select(stateCompaniesQuery.getLoaded));
    selectedStateUsers$ = this.store.pipe(
        select(stateCompaniesQuery.getSelectedStateCompanies),
    );
    loading$ = this.store.pipe(select(stateCompaniesQuery.getLoading));
    adding$ = this.store.pipe(select(stateCompaniesQuery.getAdding));
    added$ = this.store.pipe(select(stateCompaniesQuery.getAdded));
    updating$ = this.store.pipe(select(stateCompaniesQuery.getUpdating));
    updated$ = this.store.pipe(select(stateCompaniesQuery.getUpdated));
    deleting$ = this.store.pipe(select(stateCompaniesQuery.getDeleting));
    allUsers$ = this.store.pipe(select(stateCompaniesQuery.getAllCompanies));
    selectedVehicles$ = this.store.pipe(select(stateCompaniesQuery.getSelectedCompanies));

    constructor(private store: Store<StateCompaniesState>) {}

    loadAll(me: boolean = false) {
        this.store.dispatch(new LoadCompanies({ me }));
    }

    addCompany(c: Company) {
        this.store.dispatch(new AddCompany({ company: c }));
    }

    editCompany(id: number, c: Partial<Company>) {
        this.store.dispatch(new UpdateCompany({ id, company: c }));
    }

    deleteCompany(id: number) {
        this.store.dispatch(new DeleteCompany({ id }));
    }

    updateDemoCompany(id, c: any) {
        this.store.dispatch(new UpdateDemoCompany({ id, company: c }));
    }

    updateActiveCompany(id, c: any) {
        this.store.dispatch(new UpdateActiveCompany({ id, company: c }));
    }

    addCompanyModule(c: CompanyModuleInterface) {
        this.store.dispatch(new AddCompanyModule({ companyModule: c }));
    }

    updateActiveCompanyModule(id, cm: any) {
        this.store.dispatch(new UpdateActiveCompanyModule({ id, companyModule: cm }));
    }

    logout() {
        this.store.dispatch(new Logout());
    }
}
