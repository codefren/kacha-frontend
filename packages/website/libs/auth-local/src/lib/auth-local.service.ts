import { Injectable, Output, EventEmitter } from '@angular/core';
import { BackendService, Login } from '@optimroute/backend';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ToastService, LoadingService } from '@optimroute/shared';
import { StateUsersFacade } from '@optimroute/state-users';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { StateCompaniesFacade } from '@optimroute/state-companies';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { GeolocationFacade } from '@optimroute/state-geolocation';

@Injectable({
    providedIn: 'root',
})
export class AuthLocalService {
    token: string;
    refresh_token: string;
    isLoggingIn$ = new Subject<boolean>();
    roles: string[];
    // Outputs
    @Output() fireClearInterval: EventEmitter<any> = new EventEmitter();
    @Output() fireDataStorage: EventEmitter<any> = new EventEmitter();

    constructor(
        // private _redirectService: RedirectService,
        private Router: Router,
        private _requestAuth: BackendService,
        private easyRouteFacade: StateEasyrouteFacade,
        private _toast: ToastService,
        private _stateUserFacade: StateUsersFacade,
        private _vehiclesFacade: VehiclesFacade,
        private _routePlanningFacade: RoutePlanningFacade,
        private _stateCompaniesFacade: StateCompaniesFacade,
        private _stateDeliveryZonesFacade: StateDeliveryZonesFacade,
        private _preferencesFacade: PreferencesFacade,
        private _profileSettingsFacade: ProfileSettingsFacade,
        private geolocationFacade: GeolocationFacade,
        private _translate: TranslateService,
        private loading: LoadingService,
    ) {
        this.cargarStorage();
    }

    guardarStorage(data) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('showSubscriptionAlert', 'true');
        localStorage.setItem('company', JSON.stringify(data.company));
        localStorage.setItem('roles', JSON.stringify(data.roles));

        this.roles = data.roles;
        // this.usuario = user;
        this.token = data.access_token;
        this.refresh_token = data.refresh_token;
    }
    public getIsLoggingIn$() {
        this.isLogged();
        return this.isLoggingIn$;
    }
    isLogged() {
        var logueado: boolean;
        if (localStorage.getItem('token') && localStorage.getItem('refresh_token')) {
            return true;
        } else {
            logueado = false;
        }
        return logueado;
    }

    cargarStorage() {
        if (localStorage.getItem('token')) {
            this.token = localStorage.getItem('token');
            this.refresh_token = localStorage.getItem('refresh_token');
        } else {
            this.token = '';
            this.refresh_token = '';
        }
    }
    changeCompany(value: number){

        this._requestAuth.post('user/company_switch', {
             companyId: value
        }).pipe(take(1)).subscribe(({data})=>{
            localStorage.setItem('company', JSON.stringify(data.company));
            this.Router.navigateByUrl('/home');
            setTimeout(()=>{
                location.reload();
            }, 1000)
            
        }, error =>{
            this._toast.displayHTTPErrorToast(error.status, error.error.error);
        })

    }

    logout(redirect = true) {
        this.token = '';
        this.refresh_token = '';
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('company');
        localStorage.removeItem('roles');
        localStorage.removeItem('datos');
        this.changeClearInterval();
        this._stateCompaniesFacade.logout();
        this._stateDeliveryZonesFacade.logout();
        this.easyRouteFacade.logout();
        this._preferencesFacade.logout();
        this._profileSettingsFacade.logout();
        this._routePlanningFacade.logout();
        this._stateUserFacade.logout();
        this._vehiclesFacade.logout();
        this.geolocationFacade.logout();

        this.Router.navigateByUrl('/login');
    }

    guardarTokensStorage(data) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        this.token = data.access_token;
        this.refresh_token = data.refresh_token;
    }
    getDataStorage() {
        let data = {
            username: localStorage.getItem('username'),
            image: localStorage.getItem('image'),
            /* person: JSON.parse(localStorage.getItem('person')), */
            company: JSON.parse(localStorage.getItem('company')),
            roles: JSON.parse(localStorage.getItem('roles')),
        };

        return data;
    }
    // Events Emitters

    changeClearInterval() {
        this.fireClearInterval.emit('clear');
    }

    getEmittedClearInterval() {
        return this.fireClearInterval;
    }

    changeDataStorage() {
        this.fireDataStorage.emit('update');
    }

    getEmittedDataStorage() {
        return this.fireDataStorage;
    }
    login(login: Login) {
        this.loading.showLoading();
        this._requestAuth.post_client('oauth/token_admin', login).subscribe(
            (resp) => {
                this.guardarStorage(resp);
                this.easyRouteFacade.authenticate();
                this._profileSettingsFacade.loadAll();
                this._profileSettingsFacade.loaded$.pipe(take(2)).subscribe((loaded) => {
                    if (loaded) {
                        this.loading.hideLoading();
                        this.Router.navigateByUrl('');
                    }
                });
            },
            (error: any) => {
                this.loading.hideLoading();
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }
    public getRoles() {
        return this.getDataStorage().roles;
    }
    loggedFacade() {
        this.easyRouteFacade.authenticate();
    }

    obtenerTokenLocalStorage() {
        return localStorage.getItem('token');
    }
    recoverPassword(data) {
        this.loading.showLoading();
        this._requestAuth.post_client('resetpassword/email_admin', data).subscribe(
            (resp) => {
                this.loading.hideLoading();
                this.Router.navigateByUrl('/login');
                this._toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.THE_REQUEST_WAS_SENT_TO_YOUR_EMAIL'),
                );
            },
            (error: any) => {
                this.loading.hideLoading();
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }
    resetPassword(data, params) {
        console.log(data)
        this.loading.showLoading();
        this._requestAuth.post('resetpassword/reset', data).subscribe(
            (resp) => {
                this.loading.hideLoading();
                
                if (params['client'] === 'client') {
                    this.Router.navigateByUrl('login/miwigo/password-confirmation-app');
                } else if (params['client'] === 'miwigo') {
                    this.Router.navigateByUrl('login/miwigo/password-confirmation-app');
                } else {
                    this.Router.navigateByUrl('login');
                }

                this._toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.YOUR_PASSWORD_HAS_BEEN_RESET'),
                );
            },
            (error: any) => {
                this.loading.hideLoading();
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    clientCredentials() {
        return new Promise((resolve, reject) => {
            let data: any = {
                client_id: 2,
                client_secret: 'YU6IDULYTLVBMNFKUQUPQhTIlJWHXKaHGqlhkGiI',
                grant_type: 'client_credentials',
            };

            this._requestAuth.post_client('oauth/token_client_credentials', data).subscribe(
                (data) => {
                    resolve(data);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    validateTokenAdmin(token: string) {
        /* this._requestAuth.get_client('resetpassword/verify_admin/'+ token).subscribe(
            (resp) => {
                console.log(resp);
                localStorage.setItem('token',resp.access_token)
            },
            (error: any) => {
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        ); */

        return new Promise((resolve, reject) => {
            this._requestAuth.get_client('resetpassword/verify_admin/' + token).subscribe(
                (data) => {
                    // console.log( data );
                    resolve(data);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    validateTokenClient(token: string) {
        this._requestAuth.get_client('resetpassword/verify_client/' + token).subscribe(
            (resp) => {
                console.log(resp);
                localStorage.setItem('token', resp.access_token);
            },
            (error: any) => {
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    validateTokenMiwigo(token: string) {
        this._requestAuth.get_client('resetpassword/verify_miwigo/' + token).subscribe(
            (resp) => {
                console.log(resp);
                localStorage.setItem('token', resp.access_token);
            },
            (error: any) => {
                this._toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    validateTokenUser(token: string) {
        return new Promise((resolve, reject) => {
            this._requestAuth.get('company/verify/' + token).subscribe(
                (data) => {
                    resolve(data);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    validateTokenMiwigoDispollCLient(token: string) {
        return new Promise((resolve, reject) => {
            this._requestAuth.get('miwigo/verify/' + token).subscribe(
                (data) => {
                    resolve(data);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }
}
