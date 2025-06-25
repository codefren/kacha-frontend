import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileSettingsFacade } from '../../../../../libs/state-profile-settings/src/lib/+state/profile-settings.facade';
import { Profile } from '../../../../../libs/backend/src/lib/types/profile.type';
import * as moment from 'moment';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PreferencesFacade } from '@optimroute/state-preferences';
declare function init_plugins();
declare var Intercom: any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {

    isLogin = false;
    profile: Profile;
    unsubscribe$ = new Subject<void>();
    constructor(private translate: TranslateService,
                private facadePreferences: PreferencesFacade,
                public facadeProfile: ProfileSettingsFacade) { }

    ngOnInit() {
    setTimeout(function(){ init_plugins() }, 1000);
    //this.facadeProfile.loadAll();
        this.facadeProfile.loaded$.pipe(take(1)).subscribe( (loaded)=>{
            if(loaded){
                this.facadeProfile.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
                    this.profile = data;
                    Intercom('boot',{
                        app_id: 'jd1lg48u',
                        email: data.email,
                        user_id: data.userId
                    });
                });

                this.facadePreferences.loaded$.pipe(take(1)).subscribe((loaded)=>{
                    if(!loaded){
                        this.facadePreferences.loadAllPreferences();
                    }
                });

            }
        });

    }
    ngOnDestroy() {
        this.unsubscribe$.complete();
        this.unsubscribe$.next();
        Intercom('shutdown',{
            app_id: 'jd1lg48u'
        });

    }

    defeatedDemo(){
        if(this.profile.email !== "" && this.profile && this.profile.company && this.profile.company.subscriptions.length === 0){
            let value = moment(this.profile.company.endDemoDate).diff(moment()) > 0
            return value;
        }else
        {
            false;
        }
    }

    demoDay() {
        if (this.defeatedDemo()) {
            // return 5;
            return moment(this.profile.company.endDemoDate).diff(moment(), 'days') + 1;
        } else {
            return 0;
        }
    }


}
