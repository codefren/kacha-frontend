import { EasyrouteLoaded } from './easyroute.actions';
import {
    EasyrouteState,
    Entity,
    initialState,
    easyrouteReducer,
} from './easyroute.reducer';

describe('Easyroute Reducer', () => {
    const getEasyrouteId = it => it['id'];
    let createEasyroute;

    beforeEach(() => {
        createEasyroute = (id: string, name = ''): Entity => ({
            id,
            name: name || `name-${id}`,
        });
    });

    describe('valid Easyroute actions ', () => {
        it('should return set the list of known Easyroute', () => {
            const easyroutes = [
                createEasyroute('PRODUCT-AAA'),
                createEasyroute('PRODUCT-zzz'),
            ];
            const action = new EasyrouteLoaded(easyroutes);
            const result: EasyrouteState = easyrouteReducer(initialState, action);
            const selId: string = getEasyrouteId(result.list[1]);

            expect(result.loaded).toBe(true);
            expect(result.list.length).toBe(2);
            expect(selId).toBe('PRODUCT-zzz');
        });
    });

    describe('unknown action', () => {
        it('should return the initial state', () => {
            const action = {} as any;
            const result = easyrouteReducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });
});
