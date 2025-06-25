import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthLocalService } from '@optimroute/auth-local';
import { InterfacePreferences, Profile, BackendService } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { PreferencesFacade } from '../../../../../../libs/state-preferences/src/lib/+state/preferences.facade';
import { ToastService } from '@optimroute/shared';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLogOutComponent } from 'libs/shared/src/lib/components/modal-log-out/modal-log-out.component';

@Component({
    selector: 'profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileMenuComponent implements OnInit {

    activeGeolocation: boolean = false;
    activeProducts: boolean = false;
    activeMaintenance: boolean = false ;
    activeValoration: boolean = false;
    aciveCompanyBill: boolean = false;
    activeMultiStore: boolean = false;
    activeCost: boolean = false;
    menuItems = [];
    preferenceInterfaz: InterfacePreferences;
    profile: Profile;
    queryParams: string = 'routes';
    activeAppLite: boolean = false;
    unsubscribe$ = new Subject<void>();

    constructor(
        public activatedRoute: ActivatedRoute,
        public authLocal: AuthLocalService,
        private backendService: BackendService,
        public facade: PreferencesFacade,
        public facadeProfile: ProfileSettingsFacade,
        public router: Router,
        private toastService: ToastService,
        private _modalService: NgbModal,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.initLoad();
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facade.loadAllPreferences();

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        this.profile = data;
                        if (
                            this.defeatedDemo() ||
                            this.isActive() ||
                            this.inTrial() ||
                            this.isAdmin() ||
                            this.isAfiliateFranchise()
                        ) {
                            this.facade.loaded$
                                .pipe(takeUntil(this.unsubscribe$))
                                .subscribe((loaded) => {
                                    if (loaded) {
                                        this.facade.interfacePreferences$
                                            .pipe(take(1))
                                            .subscribe((data) => {
                                                this.preferenceInterfaz = data;
                                            });
                                        this.loadMenu();
                                    }
                                });
                        } else {
                            this.profile = data;

                            this.facade.loaded$
                                .pipe(takeUntil(this.unsubscribe$))
                                .subscribe((loaded) => {
                                    if (loaded) {
                                        this.facade.interfacePreferences$
                                            .pipe(take(1))
                                            .subscribe((data) => {
                                                this.preferenceInterfaz = data;
                                            });
                                        this.loadMenu();
                                    }
                                });

                            this.router.navigateByUrl('profile/invoicing');
                        }
                    });
            }
        });
    }

    activeClass(item) {
        if (item.subMenu.length == 0) {
            return (item.route == this.router.url) ? item.classes + ' active-weight' : item.classes;
        }

        let find = item.subMenu.find(x => this.router.url.includes(x.route));

        return (find) ? item.classes + ' active-weight' : item.classes;
    }

    defeatedDemo() {
        if (
            this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.subscriptions.length === 0
        ) {
            let value = moment(this.profile.company.endDemoDate).diff(moment()) > 0;
            return value;
        } else {
            false;
        }
    }

    async initLoad() {
        await this.backendService.get('user/me').subscribe(
            (resp) => {
                console.log(resp.company.active_modules, 'resp.company.active_modules')
                if (resp.company.active_modules && resp.company.active_modules.length > 0) {
                    this.activeGeolocation = resp.company.active_modules.find((x: any) => x.id === 1) ? true : false;
                    this.activeMaintenance = resp.company.active_modules.find((x: any) => x.id === 8) ? true : false;
                    this.activeValoration = resp.company.active_modules.find((x: any) => x.id === 9) ? true : false;
                    this.activeAppLite = resp.company.active_modules.find((x: any) => x.id === 10) ? true : false;
                    this.aciveCompanyBill =resp.company.active_modules.find((x: any) => x.id === 11) ? true : false;
                    this.activeMultiStore = resp.company.active_modules.find((x: any) => x.id === 2) ? true : false;
                    this.activeCost = resp.company.active_modules.find((x: any) => x.id === 14) ? true : false;
                }

                this.activeProducts = resp.company.companyParentId != null && resp.company.companyParentId > 0 ? true : false;

                this.loadMenu();
                this.activatedRoute.queryParams.subscribe(params => {
                    if (params['option']) {
                        let menuPreferences = this.menuItems.find(x => x.route == '/preferences');

                        menuPreferences.subMenu.find(x => x.params == params['option']);

                        if (!menuPreferences) {
                            this.router.navigate(['/preferences'], { queryParams: { option: this.queryParams } });
                        }
                    } else {
                        if (this.router.url.includes('/preferences')) {
                            this.router.navigate(['/preferences'], { queryParams: { option: this.queryParams } });
                        }
                    }
                });
            },
            (error) => this.toastService.displayHTTPErrorToast(error.status, error.error.error)
        );

        this.loadMenu();
    }

    inTrial() {
        if (
            this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0
        ) {
            let value =
                this.profile.company.subscriptions[0].stripe_status == 'trialing' ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }

    isFranchise() {
        if (this.profile &&
            this.profile.email !== ''
            && this.profile.company
            && this.profile.company.active_modules
            && this.profile.company.active_modules.find(x => x.id === 2) !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    isAfiliateFranchise() {
        if (this.profile &&
            this.profile.email !== ''
            && this.profile.company
            && this.profile.company.companyParentId
            && this.profile.company.companyParentId != null) {
            return true;
        } else {
            return false;
        }
    }

    isActive() {
        if (
            this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0
        ) {
            let value =
                this.profile.company.subscriptions[0].stripe_status == 'trialing' || this.profile.company.subscriptions[0].stripe_status == 'active' ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }

    isAdminAdministrative() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 16) !==
            undefined
            : false;
    }

    isAdminCompany() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 2 || role === 16) !== undefined
            : false;
    }

    isControlPanel() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 7) !== undefined
            : false;
    }

    isSubmenuActive(item) {
        if (item.subMenu.length == 0) {
            return false;
        }

        let find = item.subMenu.find(x => x.route == this.router.url);

        if (item.params) {
            find = item.subMenu.find(x => this.router.url.includes(x.params));
        }

        return (find) ? true : false;
    }

    loadMenu() {
        this.menuItems = [
           /*  {
                classes: 'a-black',
                name: 'PROFILE.NAME',
                params: null,
                route: '/profile/settings',
                show: true,
                subMenu: []
            }, */
            {
                classes: 'a-black',
                name: 'INVOICING.SUSCRIPTION',
                params: null,
                route: '/profile/invoicing',
                show: this.isAdminAdministrative() || this.isControlPartners() && !this.isAfiliateFranchise(),
                subMenu: [
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'INVOICING.YOUR_SUSCRIPTION',
                        params: null,
                        route: '/profile/invoicing',
                        show: this.isAdminAdministrative() || this.isControlPartners()
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'INVOICING.PAY_PLATFORM',
                        params: null,
                        route: '/profile/stripe_connect',
                        show: this.isFranchise()
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'INVOICING.MY_INVOICES.NAME',
                        params: null,
                        route: '/profile/bills',
                        show: this.isAdminAdministrative() || this.isControlPartners()
                    }
                ]
            },
            /* {
                classes: 'a-black',
                name: 'PREFERENCES.NAME',
                params: this.profile.company.companyProfileTypeId !== 2 ? 'routes' : 'products',
                route: '/preferences',
                show: this.authLocal.isLogged() &&
                (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                    (this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())),
                subMenu: [
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.ROUTES',
                        params: 'routes',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() ||
                                (this.isAdmin() && !this.isControlPanel())
                            ) && (this.profile.company.companyProfileTypeId > 2 || this.profile.company.companyProfileTypeId === 1)
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.PRODUCTS',
                        params: 'products',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (
                                this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())
                            ) && this.profile.company.companyProfileTypeId >= 2 
                            && this.hideMultidelegation(),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.PROMOTIONS',
                        params: 'promotions',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (
                                this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())
                            ) && this.profile.company.companyProfileTypeId >= 2
                            && this.hideMultidelegation(),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.PRODUCTS_FRANCHISE',
                        params: 'franchise',
                        route: '/preferences',
                        show: this.activeProducts && this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (
                                this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())
                            ) && this.profile.company.companyProfileTypeId >= 2,
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.ORDERS',
                        params: 'orders',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (
                                this.isActive() || this.defeatedDemo() || this.inTrial()|| this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())
                            ) && this.profile.company.companyProfileTypeId >= 2
                            && this.hideMultidelegation(),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.APP',
                        params: 'app',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && !this.isControlPanel())),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.NOTIFICACIONES',
                        params: 'notifications',
                        route: '/preferences',
                        show: this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || this.isAfiliateFranchise() || (this.isAdmin() && 
                            !this.isControlPanel())),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'PREFERENCES.OPTIONS.GEOLOCATION',
                        params: 'geolocation',
                        route: '/preferences',
                        show: this.activeGeolocation && this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || (this.isAdmin() && !this.isControlPanel())),
                    },
                  
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'DELIVERY_VALORATION.NAME',
                        params: 'valoration',
                        route: '/preferences',
                        show: this.activeValoration && this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || (this.isAdmin() && !this.isControlPanel())),
                    },
                    {
                        activeClasses: 'active-weight a-primary',
                        classes: 'a-black',
                        name: 'APP_LITE.NAME',
                        params: 'lite',
                        route: '/preferences',
                        show: this.activeAppLite && this.authLocal.isLogged() &&
                            (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() || this.isControlPartners()) &&
                            (this.isActive() || this.defeatedDemo() || this.inTrial() || (this.isAdmin() && !this.isControlPanel())),
                    }

                ]
            }, */
            /* {
                classes: 'a-black help',
                name: 'HELP.NAME',
                params: null,
                route: '/help',
                show:
                    this.authLocal.isLogged() &&
                    (this.isActive() ||
                        this.defeatedDemo() ||
                        this.inTrial() ||
                        this.isAdmin()),
                subMenu: []
            }, */
            /* {
                classes: 'a-black',
                name: 'USERS.PASSWORD',
                params: null,
                route: '/profile/password',
                show: true,
                subMenu: []
            }, */
        ];
    }



    openModalCloseLogOut() {

        const modal = this._modalService.open(ModalLogOutComponent, {
            backdrop: 'static',
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true

        });

        modal.result.then((result) => {

            if (result) {
                this.logOut();
            }
        }, (reason) => {
            this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
        });
    }

    haveAppLite(){
        
    }

    logOut() {
        this.authLocal.logout();
    }

    isControlPartners() {
        
        const prefereces = JSON.parse(localStorage.getItem('company'));

        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17 && !prefereces.isPartnerType) !== undefined
            : false;
    }
    
    
      Partners() {
       

        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 17 ) !== undefined
        : false;
    }



    hideMultidelegation() {

        if (!this.isAdminGlobal() && this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.active_modules && 
            this.profile.company.active_modules.find(x => x.id === 2) &&
            this.profile.company.hideMultidelegation) {
    
            return false;

        } 

        return true;
        
    }

    isAdminGlobal() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }

}
