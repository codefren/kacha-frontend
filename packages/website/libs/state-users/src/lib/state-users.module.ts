import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StateUsersFacade } from './+state/state-users.facade';
import { STATEUSERS_FEATURE_KEY, UsersReducer } from './+state/state-users.reducer';
import { initialState as UserInitialState } from 'libs/state-profile-settings/src/lib/+state/profile-settings.reducer';
import { StateUsersEffects } from './+state/state-users.effects'
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(STATEUSERS_FEATURE_KEY, UsersReducer, {
            initialState: UserInitialState,
        }),
        EffectsModule.forFeature([StateUsersEffects]),
    ],
    providers: [StateUsersFacade],
})
export class StateUsersModule {}
