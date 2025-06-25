import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Profile } from '@optimroute/backend';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { StateUsersFacade, Users } from '@optimroute/state-users';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'easyroute-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
    //users$: Observable<User[]>;
    profile$: Observable<Profile>;
    unsubscribe$ = new Subject<void>();
    subscribe: any;
    me: boolean;

    constructor(
        private usersFacade: StateUsersFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        private profileFacade: ProfileSettingsFacade,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.subscribe = this.route.data
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {
                this.me = data.me ? data.me : false;
                this.loadState();
            });
    }
    private loadState() {
        /* this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((isAuthenticated) => {
                if (isAuthenticated) {
                    this.usersFacade.loadAll(this.me);
                    this.profileFacade.loadAll();
                }
            }); */
        this.profile$ = this.profileFacade.profile$;
        //this.users$ = this.usersFacade.allUsers$;
    }

    deleteUser(id: number) {
        this.usersFacade.deleteUser(id);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
