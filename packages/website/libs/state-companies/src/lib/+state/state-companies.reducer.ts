export const STATECOMPANIES_FEATURE_KEY = 'stateCompanies';

import { Company, CompanyModuleInterface } from '@optimroute/backend';
import { CompaniesAction, CompaniesActionTypes } from './state-companies.actions';

export const STATEUSERS_FEATURE_KEY = 'stateUsers';

/**
 * Interface for the 'StateUsers' data used in
 *  - StateUsersState, and
 *  - stateUsersReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Companies {
    company: Company[];
    selectedId: number;
    loading: boolean;
    loaded: boolean;
    adding: boolean;
    added: boolean;
    updating: boolean;
    updated: boolean;
    deleting: boolean;
    error?: Error;
    companyModule?: CompanyModuleInterface[];
}

export interface StateCompaniesState {
    readonly companies: Companies;
}

export interface StateCompaniesPartialState {
    readonly [STATEUSERS_FEATURE_KEY]: StateCompaniesState;
}

export const initialState: Companies = {
    company: [
        {
            billingEmail: '',
            city: '',
            countryCode: '',
            country: '',
            id: 0,
            name: '',
            nif: '',
            phone: '',
            province: '',
            serviceType: {
                id: 0,
                name: '',
            },
            streetAddress: '',
            zipCode: '',
            vehicles: 0,
            isActive: false,
            isDemo: false,
            isSupport: false,
            autonomous: false,
            promotionCovid: false,
            endDemoDate: '',
            startDemoDate: '',
            accountNumber: '',
            ftpUserName: '',
            ftpPassword: '',
            plan: {
                planId: 0,
                planRateId: 0,
                priceSetup: '',
                monthPrice: '',
            },
            companyProfile: {
                id: 0,
                name: '',
            },
        },
    ],
    selectedId: -1,
    loading: false,
    loaded: false,
    adding: false,
    updating: false,
    deleting: false,
    added: false,
    updated: false,
};

export function CompaniesReducer(
    state: Companies = initialState,
    action: CompaniesAction,
): Companies {
    switch (action.type) {
        case CompaniesActionTypes.LOAD_COMPANIES: {
            return {
                ...state,
                loading: true,
            };
        }
        case CompaniesActionTypes.LOAD_COMPANIES_SUCCESS: {
            console.log(action.payload);
            return {
                ...state,
                company: action.payload.companies,
                loading: false,
                loaded: true,
            };
        }
        case CompaniesActionTypes.LOAD_COMPANIES_FAIL: {
            return {
                ...state,
                loading: false,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY: {
            return {
                ...state,
                adding: true,
                added: false,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY_SUCCESS: {
            return {
                ...state,
                company: [action.payload.company, ...state.company],
                adding: false,
                added: true,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY_FAIL: {
            return {
                ...state,
                adding: false,
                added: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY: {
            return {
                ...state,
                updating: true,
                updated: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_SUCCESS: {
            let companies;
            if (state.company !== undefined) {
                companies = state.company.map((v) => {
                    if (v.id !== action.payload.id) return v;
                    else {
                        return { ...v, ...action.payload.company };
                    }
                });
            }
            return {
                ...state,
                company: companies,
                updating: false,
                updated: true,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_FAIL: {
            return {
                ...state,
                updating: false,
                updated: false,
            };
        }
        case CompaniesActionTypes.DELETE_COMPANY: {
            return {
                ...state,
                deleting: true,
            };
        }
        case CompaniesActionTypes.DELETE_COMPANY_SUCCESS: {
            const companies = state.company.filter((v) => v.id !== action.payload.id);
            return {
                ...state,
                company: companies,
                deleting: false,
            };
        }
        case CompaniesActionTypes.DELETE_COMPANY_FAIL: {
            return {
                ...state,
                deleting: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_DEMO_SUCCESS: {
            if(state.loaded){
                const companies = state.company.map((v) => {
                    if (v.id !== action.payload.id) return v;
                    else {
                        return { ...v, ...action.payload.company };
                    }
                });
                return {
                    ...state,
                    company: companies,
                    updating: false,
                };
            }
            
        }
        case CompaniesActionTypes.UPDATE_COMPANY_DEMO_FAIL: {
            return {
                ...state,
                updating: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_ACTIVE_SUCCESS: {
            const companies = state.company.map((v) => {
                if (v.id !== action.payload.id) return v;
                else {
                    return { ...v, ...action.payload.company };
                }
            });
            return {
                ...state,
                company: companies,
                updating: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_ACTIVE_FAIL: {
            return {
                ...state,
                updating: false,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY_MODULE: {
            return {
                ...state,
                adding: true,
                added: false,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY_MODULE_SUCCESS: {
            return {
                ...state,
                companyModule: [action.payload.companyModule, ...state.companyModule],
                adding: false,
                added: true,
            };
        }
        case CompaniesActionTypes.ADD_COMPANY_MODULE_FAIL: {
            return {
                ...state,
                adding: false,
                added: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE_SUCCESS: {
            const companyModule = state.companyModule.map((v) => {
                if (v.id !== action.payload.id) return v;
                else {
                    return { ...v, ...action.payload.companyModule };
                }
            });
            return {
                ...state,
                companyModule: companyModule,
                updating: false,
            };
        }
        case CompaniesActionTypes.UPDATE_COMPANY_MODULE_ACTIVE_FAIL: {
            return {
                ...state,
                updating: false,
            };
        }
        case CompaniesActionTypes.LOGOUT: {
            return initialState;
        }
        default:
            return state;
    }
}
