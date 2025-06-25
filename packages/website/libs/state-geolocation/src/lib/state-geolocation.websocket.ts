import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { GeolocationFacade } from './+state/state-geolocation.facade';
import Pusher, { Channel } from 'pusher-js';
import { GeolocationEntity } from './+state/state-geolocation.reducer';
import { BackendService } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
    private socket$: WebSocketSubject<{}>;
    private pusher: Pusher;
    private channel: Channel;
    constructor(
        private geolocationFacade: GeolocationFacade,
        private backend: BackendService,
        private profileFacade: ProfileSettingsFacade
    ) {
        
    }

    connect(){
        this.pusher =  new Pusher('key_JdwDDV9sWV7kEhXgFGbEKtfjrkPdFeyc', {
            cluster: environment.geolocationWss.cluster,
            wsHost: environment.geolocationWss.wsHost,
            wssPort: environment.geolocationWss.wssPort,
            wsPort: environment.geolocationWss.wsPort,
            enableStats: environment.geolocationWss.enableStats,
            disableStats: true,
            forceTLS: environment.geolocationWss.forceTLS,
            enabledTransports: ['ws' , 'wss'],
            activityTimeout: 30000, // 30 seconds
            authEndpoint: environment.geolocationWss.authEndpoint,
            auth: {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.backend.getTokenLocalStorage()}`
              }
            }
          });
         this.pusher.connect();
        // Connect channel
        this.profileFacade.profile$.pipe(take(1)).subscribe((data)=>{
            console.log(data.company.id);
            this.channel = this.pusher.subscribe('private-company-geolocalization.' + data.company.id);
            // listen event
            this.channel.bind('company-geolocalization', (data) => { // event name
                if(data && data.users){
                    this.geolocationFacade.geolocation$.pipe(take(1)).subscribe((geolocationState)=>{
                        let geolocation: GeolocationEntity[] = data.users.length === 0 ? [] : data.users.map((geo)=>{
                            return {
                                ...geo,
                                lat: +geo.lat,
                                lng: +geo.lng,
                                name: geo.name + ' ' + geo.surname,
                                isDriver: geo.user_profile.find(x => x.profileId != 4) === undefined ? true: false,
                                stoppedTime: geo.stoppedTime,
                                selected: geolocationState && geolocationState.length > 0 ? geolocationState.find(x => x.id === geo.id) 
                                    ? geolocationState.find(x => x.id === geo.id).selected : false : false
                            }
                        });
                        this.geolocationFacade.load(geolocation);
                    })
                    
                }
                
            });
            this.channel.bind('pusher:subscription_succeeded', function() {
            });
        })
         
    }

    desconnect(){
        try{
            this.pusher.disconnect();
        }catch(e){
            console.log(e);
        }
    }
    
    ngOnDestroy() {
        this.socket$.complete();
    }
}
