import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromStateRegister from './+state/state-register.reducer';
import { StateRegisterEffects } from './+state/state-register.effects';
import { StateRegisterFacade } from './+state/state-register.facade';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(
            fromStateRegister.STATEREGISTER_FEATURE_KEY,
            fromStateRegister.reducer,
        ),
        EffectsModule.forFeature([StateRegisterEffects]),
    ],
    providers: [StateRegisterFacade],
})
export class StateRegisterModule {}
