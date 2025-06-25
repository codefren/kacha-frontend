import { ModalChangeCompanyComponent } from './../../../../libs/shared/src/lib/components/modal-change-company/modal-change-company.component';
import { AgmCoreModule } from '@agm/core';
import { NgModule, Injectable, ErrorHandler, ClassProvider } from '@angular/core';
import * as Material from '@angular/material';
import { GestureConfig, MatSnackBar } from '@angular/material';
import { HAMMER_GESTURE_CONFIG, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../environments/environment';
import { EasyrouteEffects } from './+state/easyroute.effects';
import { EasyrouteFacade } from './+state/easyroute.facade';
import { BackendModule } from '@optimroute/backend';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {
    easyrouteReducer,
    initialState as easyrouteInitialState,
} from './+state/easyroute.reducer';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import * as Sentry from '@sentry/browser';

import { AuthLocalModule, VerificaTokenGuard, TermsGuard } from '@optimroute/auth-local';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './layout/header/header.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { LoadingComponent } from './component/loading/loading.component';
import { ModalEndHelpComponent } from './layout/header/modal-end-help/modal-end-help.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsModule } from '@easyroute/notifications'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

if (environment.sentryEnabled) {
    Sentry.init({
        dsn: 'https://5544a966162c4ef3bcef9be82c497787@o403785.ingest.sentry.io/5266798',
        environment: environment.name,
        enabled: environment.sentryEnabled,
        release: environment.version,
    });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    constructor() {}
    handleError(error) {
        Sentry.captureException(error.originalError || error);
        throw error;
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, PagesComponent, HeaderComponent, LoadingComponent, ModalEndHelpComponent, ModalChangeCompanyComponent],
    imports: [
        AuthLocalModule,
        BrowserModule,
        BrowserAnimationsModule,
        StateProfileSettingsModule,
        LoadingBarHttpClientModule,
        NgbModule,
        NgxMaskModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDxBPC3W7X91xH7eGTcwbKDtcw-WCRpGc4',
            libraries: ['places','geometry', 'drawing'],
        }),
        RouterModule.forRoot(
            [
                {
                    path: 'login',
                    loadChildren: '@optimroute/login#LoginModule',
                },
                {
                    path: '',
                    component: PagesComponent,
                    loadChildren: './pages/pages.module#PagesModule',
                    canActivate: [VerificaTokenGuard, TermsGuard],
                },
                {
                    path: '',
                    redirectTo: 'home',
                    pathMatch: 'full',
                }
            ],
            { useHash: true, onSameUrlNavigation: 'reload' },
        ),
        StoreModule.forRoot(
            { easyroute: easyrouteReducer },
            {
                initialState: { easyroute: easyrouteInitialState },
                metaReducers: !environment.production ? [storeFreeze] : [],
            },
        ),
        EffectsModule.forRoot([EasyrouteEffects]),
        !environment.production ? StoreDevtoolsModule.instrument({}) : [],
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler,
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
    ],
    entryComponents: [LoadingComponent, ModalEndHelpComponent, ModalChangeCompanyComponent],
    providers: [
        EasyrouteFacade,
        {
            provide: Material.MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                maxWidth: '80vw',
                minWidth: '500px',
            },
        },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: GestureConfig,
        },
        { provide: ErrorHandler, useClass: SentryErrorHandler },
        // {
        //     provide: MAT_DATE_LOCALE,
        //     // TODO: set LOCALE depending of the country or language.
        //     useValue: 'en-GB',
        // },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
