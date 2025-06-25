import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GeolocationEntity, StateGeolocationState } from './state-geolocation.reducer';
import { LoadStateGeolocation, StateGeolocationUpdate, StateGeolocationShow, StateGeolocationSelected, StateGeolocationHoverIn, StateGeolocationHoverOut, StateGeolocationShowSelected, StateGeolocationShowSelectedUser, StateGeolocationLogOut } from './state-geolocation.actions';
import { stateGeolocationQuery } from './state-geolocation.selectors';
@Injectable()
export class GeolocationFacade {

    constructor(private store: Store<StateGeolocationState>){}
    geolocation$ = this.store.pipe(select(stateGeolocationQuery.getAllStateGeolocation));
    show$ = this.store.pipe(select(stateGeolocationQuery.getShow));
    loading$ = this.store.pipe(select(stateGeolocationQuery.getLoading))
    hoverId$ = this.store.pipe(select(stateGeolocationQuery.getHoverId));
    selectedId$ = this.store.pipe(select(stateGeolocationQuery.getSelectedId));
    showAllSelected$ = this.store.pipe(select(stateGeolocationQuery.getShowAllSelectedUsers));
    load(geolocation: GeolocationEntity[]){

        this.store.dispatch(new LoadStateGeolocation({ geolocation }))
    }

    update(geolocation: GeolocationEntity[]){
        this.store.dispatch(new StateGeolocationUpdate({ geolocation }))
    }

    show(show:boolean){
        this.store.dispatch(new StateGeolocationShow({ show }));
    }

    selectGeo(id: number){
        this.store.dispatch(new StateGeolocationSelected({ id }))
    }

    hoverIn(id: number){
        this.store.dispatch(new StateGeolocationHoverIn({ id }))
    }

    hoverOut(id: number){
        this.store.dispatch(new StateGeolocationHoverOut({ id }))
    }

    selected(id: number, show: boolean){
        this.store.dispatch(new StateGeolocationShowSelected({ id, show }));
    }

    showAllSelected(show: boolean){
        this.store.dispatch(new StateGeolocationShowSelectedUser({show}));
    }

    logout(){
        this.store.dispatch(new StateGeolocationLogOut());
    }
}