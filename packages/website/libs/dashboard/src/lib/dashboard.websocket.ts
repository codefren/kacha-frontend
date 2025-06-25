import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '@optimroute/env/environment';
import Pusher, { Channel } from 'pusher-js';
import { BackendService } from '@optimroute/backend';
import { BehaviorSubject } from 'rxjs';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})


export class WebSocketService implements OnDestroy {
    private socket$: WebSocketSubject<{}>;
    private pusher: Pusher;
    private channel: Channel;
    public sync: BehaviorSubject<object> = new BehaviorSubject({});
    constructor(
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

         this.profileFacade.profile$.pipe(take(1)).subscribe((data)=>{
            this.channel = this.pusher.subscribe('private-company-dashboard-refresher.'+ data.company.id);
            // listen event
            this.channel.bind('company-dashboard-refresher', (data) => { // event name
                if(data){
                    console.log(data);
                    this.sync.next(data);
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
