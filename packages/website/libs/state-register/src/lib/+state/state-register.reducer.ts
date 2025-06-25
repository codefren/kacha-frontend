import { StateRegisterAction, StateRegisterActionTypes } from './state-register.actions';

export const STATEREGISTER_FEATURE_KEY = 'stateRegister';

/**
 * Interface for the 'StateRegister' data used in
 *  - StateRegisterState, and the reducer function
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Register {
    autonomous: boolean;
    companyProfileTypeId: string;
    name: string;
    countryCode: string;
    country: string;
    email: string;
    email_confirmation: string;
    phone: string;
    password: string;
    password_confirmation: string;
    acceptNewslettersAndOffers: boolean;
    termsAccepted: boolean;
    acceptPrivacyPolicy:boolean;
}

export interface StateRegisterState {
    register: Register; // list of StateRegister; analogous to a sql normalized table
    loaded: boolean; // has the StateRegister list been loaded
    error?: any; // last none error (if any)
    persisted: boolean;
}

export interface StateRegisterPartialState {
    readonly [STATEREGISTER_FEATURE_KEY]: StateRegisterState;
}

export const initialState: StateRegisterState = {
    register: {
        autonomous: false,
        companyProfileTypeId: "",
        name: "",
        countryCode: "ES",
        country: "España",
        email: "",
        email_confirmation: "",
        password: "",
        password_confirmation: "",
        acceptNewslettersAndOffers: false,
        termsAccepted: false,
        acceptPrivacyPolicy:false,
        phone: ''
    },
    loaded: false,
    persisted: false
};

export function reducer(
    state: StateRegisterState = initialState,
    action: StateRegisterAction,
): StateRegisterState {
    switch (action.type) {
        case StateRegisterActionTypes.LoadStateRegister: {
            return {
                ...state,
                loaded: true
            };
        }
        case StateRegisterActionTypes.UpdateOrCreateRegister: {
            return {
                ...state,
                register: action.payload.register
            }
        }
        case StateRegisterActionTypes.PersistRegister: {
            return {
                ...state,
                persisted: false
            }
        }
        case StateRegisterActionTypes.PersistRegisterSuccess: {
            return {
                ...state,
                persisted: true
            }
        }
        case StateRegisterActionTypes.PersistRegisterFail: {
            return {
                ...state,
                persisted: false
            }
        }
    }
    return state;
}
