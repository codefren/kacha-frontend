import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/nx';

import { EasyrouteEffects } from './easyroute.effects';
import { EasyrouteFacade } from './easyroute.facade';

import { easyrouteQuery } from './easyroute.selectors';
import { LoadEasyroute, EasyrouteLoaded } from './easyroute.actions';
import {
    EasyrouteState,
    Entity,
    initialState,
    easyrouteReducer,
} from './easyroute.reducer';

interface TestSchema {
    easyroute: EasyrouteState;
}

describe('EasyrouteFacade', () => {
    let facade: EasyrouteFacade;
    let store: Store<TestSchema>;
    let createEasyroute;

    beforeEach(() => {
        createEasyroute = (id: string, name = ''): Entity => ({
            id,
            name: name || `name-${id}`,
        });
    });

    describe('used in NgModule', () => {
        beforeEach(() => {
            @NgModule({
                imports: [
                    StoreModule.forFeature('easyroute', easyrouteReducer, { initialState }),
                    EffectsModule.forFeature([EasyrouteEffects]),
                ],
                providers: [EasyrouteFacade],
            })
            class CustomFeatureModule {}

            @NgModule({
                imports: [
                    NxModule.forRoot(),
                    StoreModule.forRoot({}),
                    EffectsModule.forRoot([]),
                    CustomFeatureModule,
                ],
            })
            class RootModule {}
            TestBed.configureTestingModule({ imports: [RootModule] });

            store = TestBed.get(Store);
            facade = TestBed.get(EasyrouteFacade);
        });

        /**
         * The initially generated facade::loadAll() returns empty array
         */
        it('loadAll() should return empty list with loaded == true', async done => {
            try {
                let list = await readFirst(facade.allEasyroute$);
                let isLoaded = await readFirst(facade.loaded$);

                expect(list.length).toBe(0);
                expect(isLoaded).toBe(false);

                facade.loadAll();

                list = await readFirst(facade.allEasyroute$);
                isLoaded = await readFirst(facade.loaded$);

                expect(list.length).toBe(0);
                expect(isLoaded).toBe(true);

                done();
            } catch (err) {
                done.fail(err);
            }
        });

        /**
         * Use `EasyrouteLoaded` to manually submit list for state management
         */
        it('allEasyroute$ should return the loaded list; and loaded flag == true', async done => {
            try {
                let list = await readFirst(facade.allEasyroute$);
                let isLoaded = await readFirst(facade.loaded$);

                expect(list.length).toBe(0);
                expect(isLoaded).toBe(false);

                store.dispatch(
                    new EasyrouteLoaded([createEasyroute('AAA'), createEasyroute('BBB')]),
                );

                list = await readFirst(facade.allEasyroute$);
                isLoaded = await readFirst(facade.loaded$);

                expect(list.length).toBe(2);
                expect(isLoaded).toBe(true);

                done();
            } catch (err) {
                done.fail(err);
            }
        });
    });
});
