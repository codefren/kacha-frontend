import { Entity, EasyrouteState } from './easyroute.reducer';
import { easyrouteQuery } from './easyroute.selectors';

describe('Easyroute Selectors', () => {
    const ERROR_MSG = 'No Error Available';
    const getEasyrouteId = it => it['id'];

    let storeState;

    beforeEach(() => {
        const createEasyroute = (id: string, name = ''): Entity => ({
            id,
            name: name || `name-${id}`,
        });
        storeState = {
            easyroute: {
                list: [
                    createEasyroute('PRODUCT-AAA'),
                    createEasyroute('PRODUCT-BBB'),
                    createEasyroute('PRODUCT-CCC'),
                ],
                selectedId: 'PRODUCT-BBB',
                error: ERROR_MSG,
                loaded: true,
            },
        };
    });

    describe('Easyroute Selectors', () => {
        it('getAllEasyroute() should return the list of Easyroute', () => {
            const results = easyrouteQuery.getAllEasyroute(storeState);
            const selId = getEasyrouteId(results[1]);

            expect(results.length).toBe(3);
            expect(selId).toBe('PRODUCT-BBB');
        });

        it('getSelectedEasyroute() should return the selected Entity', () => {
            const result = easyrouteQuery.getSelectedEasyroute(storeState);
            const selId = getEasyrouteId(result);

            expect(selId).toBe('PRODUCT-BBB');
        });

        it("getLoaded() should return the current 'loaded' status", () => {
            const result = easyrouteQuery.getLoaded(storeState);

            expect(result).toBe(true);
        });

        it("getError() should return the current 'error' storeState", () => {
            const result = easyrouteQuery.getError(storeState);

            expect(result).toBe(ERROR_MSG);
        });
    });
});
