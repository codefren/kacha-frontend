import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ProfileSettingsState } from './profile-settings.reducer';
import { ProfileSettingsQuery } from './profile-settings.selectors';
import { Profile } from '@optimroute/backend';
import { LoadAllAction, UpdateAction, Logout, UpdateAcceptTermsAction, ChangeGuideShowTips, UpdateHelGuideId, LoadHelpGuideStep, EndHelpGuideStep, ChangePlanAction, ChangePriceAction, ChangeNoveltyLast } from './profile-settings.actions';

@Injectable()
export class ProfileSettingsFacade {
    loaded$ = this.store.pipe(select(ProfileSettingsQuery.getLoaded));
    loading$ = this.store.pipe(select(ProfileSettingsQuery.getLoading));
    updating$ = this.store.pipe(select(ProfileSettingsQuery.getUpdating));
    profile$ = this.store.pipe(select(ProfileSettingsQuery.getProfile));
    guide$ = this.store.pipe(select(ProfileSettingsQuery.getGuide));
    userId$ = this.store.pipe(select(ProfileSettingsQuery.getUserId))
    constructor(private store: Store<ProfileSettingsState>) {}

    loadAll() {
        this.store.dispatch(new LoadAllAction());
    }

    updateProfile(profile: Partial<Profile>) {
        this.store.dispatch(new UpdateAction(profile));
    }

    updateAcceptTermes(value: boolean) {
        this.store.dispatch(
            new UpdateAcceptTermsAction({ accept: value }),
        );
    }

    changeShowTipsModal(showTipsModal: boolean){
        this.store.dispatch(new ChangeGuideShowTips({ showTipsModal }));
    }

    changeNoveltyLast(noveltyLast: boolean){
        this.store.dispatch(new ChangeNoveltyLast({ noveltyLast }));
    }

    updateHelpGuideId(helpGuideId: number) {
        this.store.dispatch(new UpdateHelGuideId({ helpGuideId }));
    }

    loadHelpGuideStep(id: number){
        this.store.dispatch(new LoadHelpGuideStep({ id }));
    }

    endHelpGuideStep(){
        this.store.dispatch(new EndHelpGuideStep());
    }

    changePlanAction(companyProfileTypeId: number){
        this.store.dispatch(new ChangePlanAction({ companyProfileTypeId }));
    }

    changePrice(price: string ,companyProfileTypeId: number){
        this.store.dispatch(new ChangePriceAction({ price, companyProfileTypeId  }));
    }


    logout(){
        this.store.dispatch(new Logout());
    }
}
