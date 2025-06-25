import {
    ProfileSettingsAction,
    ProfileSettingsActionType,
} from './profile-settings.actions';
import { Action } from '@ngrx/store';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from './profile-settings.facade';

export const PROFILE_SETTINGS_FEATURE_KEY = 'profileSettings';

export interface ProfileSettingsState {
    profile: Profile;
    loading: boolean;
    loaded: boolean;
    updating: boolean;
}

export const initialState: ProfileSettingsState = {
    profile: {
        email: '',
        showTipsModal: true,
        noveltyLast: true,
        helpGuideId: null,
        profile: {
            id: 0,
            name: '',
            surname: '',
            companyName: '',
            nationalId: '',
            phone: ''
        },
        profiles:[],
        address: {
            countryCode: '-',
            streetAddress: '',
            city: '',
            province: '',
            zipCode: '',
        },
        company:{
            billingEmail: '',
            city: '',
            country:'',
            countryCode: '',
            id: 0,
            name: '',
            province: '',
            serviceTypeId: 0,
            streetAddress: '',
            zipCode: '',
            accountNumber: '',
            createdAt: '',
            createdBy: {
                email:'',
                name: ''
            },
            trial: false,
            termsAccepted: false,
            lastMonthPaid: false,
            setupPaid: false,
            urlLogo: null,
            active_modules: []
        },        
    },
    loading: false,
    loaded: false,
    updating: false,
   
};

export function reducer(
    state: ProfileSettingsState = initialState,
    action: ProfileSettingsAction,
): ProfileSettingsState {
    switch (action.type) {
        case ProfileSettingsActionType.LOAD_ALL: {
            return { ...state, loading: true };
        }
        case ProfileSettingsActionType.LOAD_ALL_SUCCESS: {
           console.log(action.payload);
            return {
                ...state,
                profile: {
                    email: action.payload.email,
                    showTipsModal: action.payload.showTipsModal,
                    noveltyLast: action.payload.noveltyLast,
                    helpGuideId: action.payload.helpGuideId,
                    profile: {
                        ...action.payload.profile,
                    },
                    profiles:action.payload.profiles,
                    
                    address: {
                        ...action.payload.address,
                    },
                    company: {
                        ...action.payload.company,
                        subscriptions:
                            action.payload.company.subscriptions ?
                                action.payload.company.subscriptions.filter(x => x.stripe_status === 'active' || x.stripe_status === 'trialing')
                                : []
                    },
                    userId: action.payload.id
                    
                },
                
                loading: false,
                loaded: true,
            };
        }
        case ProfileSettingsActionType.LOAD_ALL_FAIL: {
            return { ...state, loading: false };
        }

        case ProfileSettingsActionType.UPDATE: {
            return { ...state, updating: true };
        }
        case ProfileSettingsActionType.UPDATE_SUCCESS: {
            return {
                ...state,
                updating: false,
                profile: {
                    ...state.profile,
                    profile: {
                        ...state.profile.profile,
                        ...action.payload.profile,
                    },
                    address: {
                        ...state.profile.address,
                        ...action.payload.address,
                    }
                },
            };
        }
        case ProfileSettingsActionType.UPDATE_FAIL: {
            return { ...state, updating: false };
        }

        case ProfileSettingsActionType.LOGOUT: {
            return initialState;
        }

        case ProfileSettingsActionType.UPDATE_ACCEPT_TERMS: {
            return {
                ...state,
                loaded: false
            }
        }
        case ProfileSettingsActionType.UPDATE_ACCEPT_TERMS_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    company: {
                        ...state.profile.company,
                        termsAccepted: true
                    }
                },
                loaded: true
            }
        }

        case ProfileSettingsActionType.CHANGE_GUIDE_SHOW_TIPS_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    showTipsModal: action.payload.showTipsModal
                }
            }
        }

        case ProfileSettingsActionType.CHANGE_NOVELTY_LAST_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    noveltyLast: action.payload.noveltyLast
                }
            }
        }

        case ProfileSettingsActionType.UPDATE_HELP_GUIDE_ID_SUCCESS: {
            console.log(action.payload);
            return {
                ...state,
                profile: {
                    ...state.profile,
                    helpGuideId: action.payload.id,
                    helpGuide: {
                        ...action.payload
                    }
                }
            }
        }

        case ProfileSettingsActionType.LOAD_HELP_GUIDE_STEP_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    helpGuide: {
                        ...action.payload
                    }
                }
            }
        }

        case ProfileSettingsActionType.END_HELP_GUIDE_STEP_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    showTipsModal: false,
                    noveltyLast: false,
                    endHelpGuide: true
                }
            }
        }

        case ProfileSettingsActionType.CHANGE_PLAN_ACTION_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    company: {
                        ...state.profile.company,
                        companyProfileTypeId: action.payload.companyProfileTypeId
                    }
                }
            }
        }

        case ProfileSettingsActionType.CHANGE_PRICE_ACTION_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    company: {
                        ...state.profile.company,
                        companyProfileTypeId: action.payload.companyProfileTypeId
                    }
                }
            }
        }


        default:
            return state;
    }
}
