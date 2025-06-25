import { Component, OnInit, OnDestroy } from '@angular/core';
import { Profile, Company } from '@optimroute/backend';
import { Observable, Subject } from 'rxjs';
import { StateCompaniesFacade } from '@optimroute/state-companies';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'optimroute-companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit, OnDestroy {
    companies$: Observable<Company[]>;
    profile$: Observable<Profile>;
    unsubscribe$ = new Subject<void>();
    subscribe: any;
    me: boolean = false;
    constructor(
        private companiesFacade: StateCompaniesFacade,
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
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((isAuthenticated) => {
                if (isAuthenticated) {
                    this.companiesFacade.loadAll(this.me);
                    // this.profileFacade.loadAll();
                }
            });
        this.profile$ = this.profileFacade.profile$;
        this.companies$ = this.companiesFacade.allUsers$;
    }

    addCompany(company: Company) {
        this.companiesFacade.addCompany(company);
    }

    editCompany(obj: [number, Partial<Company>]) {
        this.companiesFacade.editCompany(obj[0], obj[1]);
    }

    deleteCompany(id: number) {
        this.companiesFacade.deleteCompany(id);
    }

    editDemoCompany(obj: [number, any]) {
        this.companiesFacade.updateDemoCompany(obj[0], obj[1]);
    }

    editActiveCompany(obj: [number, any]) {
        this.companiesFacade.updateActiveCompany(obj[0], obj[1]);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.subscribe.unsubscribe();
    }
}
