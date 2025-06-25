import 'reflect-metadata';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { addSVGIconsToRegistry } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { customMatIconsData } from '../assets/custom-mat-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { takeUntil } from 'rxjs/operators';
declare function init_plugins();

@Component({
    selector: 'easyroute-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'optimroute';
    isLogin = false;
    loggingIn$: Subject<boolean>;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private translate: TranslateService,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        public authService: AuthLocalService,
        public router: Router,
        private profileFacade: ProfileSettingsFacade,
        update: SwUpdate,
        snackbar: MatSnackBar,
        private easyRouteFacade: StateEasyrouteFacade
    ) {
        update.available.subscribe((event) => {
            update.activateUpdate().then(() => {
                const snack = snackbar.open('Actualización disponible', 'Recargar!');

                snack.onAction().subscribe(() => {
                    window.location.reload(true);
                });
            });
            setInterval(() => {
                update.checkForUpdate().then(() => {
                    console.log('service worked!');
                });
            }, 10000);
        });

        this.router.events.subscribe((val) => {
            // see also
            if (val instanceof NavigationEnd) {
                if (
                    this.router.routerState.snapshot.url === '/login' ||
                    this.router.routerState.snapshot.url === '/login/recover' ||
                    this.router.routerState.snapshot.url.includes('/login/reset-password')
                ) {
                    this.isLogin = true;
                } else {
                    this.isLogin = false;
                }
            }
        });
        this.translate.setDefaultLang('es');
        this.translate.addLangs(['en', 'es']);
        this.translate.use('es');
        addSVGIconsToRegistry(iconRegistry, sanitizer, customMatIconsData);
    }

    ngOnInit() {
        init_plugins();
        if (this.authService.isLogged()) {
            this.authService.loggedFacade();
        }
        this.loggingIn$ = this.authService.getIsLoggingIn$();
        this.easyRouteFacade.isAuthenticated$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(( isAuthenticated: boolean ) => {  
        if ( isAuthenticated ) {
            this.profileFacade.loadAll();
        }
        });
        
        this.authService.cargarStorage();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
