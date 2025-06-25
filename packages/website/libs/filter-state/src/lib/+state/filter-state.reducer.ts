import { FilterStateAction, FilterStateActionTypes } from './filter-state.actions';
import * as _ from 'lodash';
export const FILTERSTATE_FEATURE_KEY = 'filterState';

/**
 * Interface for the 'FilterState' data used in
 *  - FilterStateState, and the reducer function
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {
    name: string;
    values: any;
}

export interface FilterStateState {
    list: Entity[]; // list of FilterState; analogous to a sql normalized table
    selectedId?: string | number; // which FilterState record has been selected
    loaded: boolean; // has the FilterState list been loaded
    error?: any; // last none error (if any)
}

export interface FilterStatePartialState {
    readonly [FILTERSTATE_FEATURE_KEY]: FilterStateState;
}

export const initialState: FilterStateState = {
    list: [],
    loaded: false,
};

export function reducer(
    state: FilterStateState = initialState,
    action: FilterStateAction,
): FilterStateState {
    switch (action.type) {
        case FilterStateActionTypes.FilterStateAdd: {

            const filters = _.cloneDeep(state.list);

            

            if(filters && filters.length > 0 && filters.find(x => x.name === action.payload.entity.name)){

                const index = filters.findIndex(x => x.name === action.payload.entity.name);
                filters[index] = {
                    ...action.payload.entity
                }

            } else {
                filters.push(action.payload.entity);
            }

            state = {
                ...state,
                list: filters,
                loaded: true,
            };
            break;
        }
    }
    return state;
}
