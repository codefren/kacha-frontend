import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { EasyrouteEffects } from './easyroute.effects';
import { LoadEasyroute, EasyrouteLoaded } from './easyroute.actions';

describe('EasyrouteEffects', () => {
    let actions: Observable<any>;
    let effects: EasyrouteEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NxModule.forRoot(),
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
            ],
            providers: [
                EasyrouteEffects,
                DataPersistence,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(EasyrouteEffects);
    });

    describe('loadEasyroute$', () => {
        it('should work', () => {
            actions = hot('-a-|', { a: new LoadEasyroute() });
            expect(effects.loadEasyroute$).toBeObservable(
                hot('-a-|', { a: new EasyrouteLoaded([]) }),
            );
        });
    });
});
