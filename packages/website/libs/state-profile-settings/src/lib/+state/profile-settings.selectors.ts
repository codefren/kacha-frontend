import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    ProfileSettingsState,
    PROFILE_SETTINGS_FEATURE_KEY,
} from './profile-settings.reducer';

const getProfileSettingsState = createFeatureSelector<ProfileSettingsState>(
    PROFILE_SETTINGS_FEATURE_KEY,
);

const getLoaded = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => state.loaded,
);

const getLoading = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => state.loading,
);

const getUpdating = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => state.updating,
);

const getProfile = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => state.profile,
);

const getUserId = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => state.profile.userId
)

const getGuide = createSelector(
    getProfileSettingsState,
    (state: ProfileSettingsState) => {
        return {
            helpGuideId: state.profile.helpGuideId,
            showTipsModal: state.profile.showTipsModal,
            helpGuide: state.profile.helpGuide,
            noveltyLast: state.profile.noveltyLast,
            endHelpGuide: state.profile.endHelpGuide
        }
    }
)

export const ProfileSettingsQuery = {
    getLoaded,
    getLoading,
    getUpdating,
    getProfile,
    getGuide,
    getUserId
};
