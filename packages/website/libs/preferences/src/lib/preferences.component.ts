import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PreferencesFacade } from '@optimroute/state-preferences';
import {
    ToastService,
    LoadingService,
} from '@optimroute/shared';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
declare function init_plugins();
declare var $;
import * as _ from 'lodash';

import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { BackendService, Delivery, Profile } from '@optimroute/backend';
import { ActivatedRoute } from '@angular/router';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from '@optimroute/auth-local';

import * as moment from 'moment';


@Component({
    selector: 'easyroute-preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit, OnDestroy {

    select: string = 'planRoutes';

    change = {

        /* Configuracion */
        planRoutes: 'planRoutes',
        plannerDisplay: 'plannerDisplay',
        summaryBoxes: 'summaryBoxes',
        deleveryNote: 'deleveryNote',
        timesShedules: 'timesShedules',
        dashboardRoutes: 'dashboardRoutes',
        routeSpecification: 'routeSpecification',
        dataUsageStorage: 'dataUsageStorage',
        vehicleSpecification: 'vehicleSpecification',
        vehicleTypes: 'vehicleTypes',
        digitalAccessories: 'digitalAccessories',
        materialAccessories: 'materialAccessories',
        mandatoryReviews: 'mandatoryReviews',
        supplements: 'supplements',
        vehicleStatus: 'vehicleStatus',
        predefinedRevisions: 'predefinedRevisions',
        drivingLicenses: 'drivingLicenses',
        otherCards: 'otherCards',
        timeSpecification: 'timeSpecification',
        downloadTimes: 'downloadTimes',
        delays: 'delays',
        dataUsageStorageClient: 'dataUsageStorageClient',
        dataUpdate: 'dataUpdate',
        driverApp: 'driverApp',
        commercialApp: 'commercialApp',
        notification: 'notification',
        report: 'report',
        schedule: 'schedule',
        stopAlerts: 'stopAlerts',
        bill: 'bill',
        productSettings: 'productSettings',
        categories: 'categories',
        subcategories: 'subcategories',
        filters: 'filters',
        formats: 'formats',
        productFranchise: 'productFranchise',
        promotion: 'promotion',
        order: 'order',
        integration:'integration',
        routeIntegration:'routeIntegration',
        deliveryNoteIntegration:'deliveryNoteIntegration',
        /* Modulos */
        appLite: 'appLite',
        costStructure: 'costStructure',
        costRates: 'costRates',
        costAutomation: 'costAutomation',
        chatStorage: 'chatStorage',
        chatSending: 'chatSending',
        dockTypePackage: 'dockTypePackage',
        dockVehicleStatus: 'dockVehicleStatus',
        parcel: 'parcel',
        sheetRouteFirst: 'sheetRouteFirst',
        sheetRouteLast: 'sheetRouteLast',
        sheetRouteConcept: 'sheetRouteConcept',
        multiStore: 'multiStore',

        /* Ayuda */
        helpConcept: 'helpConcept',
        academy: 'academy'

    };

    routeSheet: any;

    urlAcademy :string ='https://academy.polpoo.com/';


    option: string = 'routes';

    unsubscribe$ = new Subject<void>();


    activeGeolocation: boolean = false;
    activeProducts: boolean = false;
    activeMaintenance: boolean = false;
    activeValoration: boolean = false;
    activeAppLite: boolean = false;
    aciveCompanyBill : boolean = false;
    activeMultiStore: boolean = false;
    activeCost: boolean = false;
    activeChat: boolean = false;
    activeSheetRoute: boolean = false;
    activeParcel: boolean = false;
    activeLoadingDock: boolean = false;

    profile: Profile;

    haveMultiStore: boolean = false;

    paramsChange: string = '';

    constructor(
        private facade: PreferencesFacade,
        private toastService: ToastService,
        private backendService: BackendService,
        private detectChanges: ChangeDetectorRef,
        private facadeProfile: ProfileSettingsFacade,
        private loading: LoadingService,
        config: NgbTimepickerConfig,
        private activatedRoute: ActivatedRoute,
        public authLocal: AuthLocalService,


    ) {
        config.spinners = false;
    }

    ngOnInit() {
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        this.profile = data;
                    });
            }
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            this.paramsChange = params['option'];
            if (params['option']) {
                if (
                    this.profile &&
                    this.profile.company &&
                    this.profile.company.companyProfileTypeId === 1
                ) {
                    if (
                        params['option'] === 'orders' ||
                        params['option'] === 'products' ||
                        params['option'] === 'franchise'
                    ) {
                        this.option = 'routes';
                        this.changePage('routeSpecification');
                    } else {
                        this.option = params['option'];
                        this.changePage(params['option']);
                    }
                } else if (this.profile.company.companyProfileTypeId === 2) {
                    if (params['option'] === 'routes') {
                        this.option = 'products';
                        this.changePage('products');
                    } else {
                        this.option = params['option'];
                        this.changePage( params['option']);
                    }
                } else {

                    this.option = params['option'];

                    this.changePage( params['option']);
                }

            }

        });

        // se cambia el timeout por setInterval para reactivar el plugin del tooltip
        setTimeout(init_plugins, 1000);

        this.backendService.get('user/me').subscribe(
            (resp) => {

                if (resp.company.active_modules && resp.company.active_modules.length > 0) {
                    this.haveMultiStoreFunc(resp.company.active_modules);

                    this.activeGeolocation = resp.company.active_modules.find((x: any) => x.id === 1) ? true : false;
                    this.activeMultiStore = resp.company.active_modules.find((x: any) => x.id === 2) ? true : false;
                    this.activeMaintenance = resp.company.active_modules.find((x: any) => x.id === 8) ? true : false;
                    this.activeValoration = resp.company.active_modules.find((x: any) => x.id === 9) ? true : false;
                    this.activeAppLite = resp.company.active_modules.find((x: any) => x.id === 10) ? true : false;
                    this.aciveCompanyBill =resp.company.active_modules.find((x: any) => x.id === 11) ? true : false;
                    this.activeSheetRoute = resp.company.active_modules.find((x: any) => x.id === 12) ? true : false;
                    this.activeParcel = resp.company.active_modules.find((x: any) => x.id === 13) ? true : false;
                    this.activeCost = resp.company.active_modules.find((x: any) => x.id === 14) ? true : false;
                    this.activeLoadingDock = resp.company.active_modules.find((x: any) => x.id === 15) ? true : false;
                    this.activeChat = resp.company.active_modules.find((x: any) => x.id === 16) ? true : false;

                }

                this.activeProducts =
                    resp.company.companyParentId != null && resp.company.companyParentId > 0
                        ? true
                        : false;

                const { notification } = resp.preferences;

                this.detectChanges.detectChanges();

            },
            (error) =>
                this.toastService.displayHTTPErrorToast(error.status, error.error.error),
        );

        /* Para hoja de ruta */
        this.loadSheetRoute();

    }

    changePage(name: string) {

        this.select = this.change[name];

        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.detectChanges.detectChanges();
    }

    showShareInformation(): boolean{
        return this.profile.company.active_modules.find((x: any) => x.id === 2) ? true : false;
    }

    /* Para hoja de rura */
    loadSheetRoute(){

        this.loading.showLoading();

        this.backendService.get('route_sheet_company_preference').pipe(take(1)).subscribe((data)=>{

          this.routeSheet = data.data;

          this.loading.hideLoading();

          this.detectChanges.detectChanges();

        }, error => {

          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    getData(data: any){

        this.routeSheet = data;
    }

    goToLinkAcademyHome(url: string){

        window.open(url, "_blank");

    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }





    haveMultiStoreFunc(modules_active: any[]) {
        this.haveMultiStore = modules_active.find((x) => x.id === 2) ? true : false;
    }

    ModuleCost(){
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {

            return true;

        } else {

            return false;

        }
    }

    hideMultidelegation() {

        if (!this.isAdminGlobal() && this.haveMultiStore &&
            this.profile.company &&
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

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }

    isControlPanel() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 7) !== undefined
            : false;
    }

    isAdminCompany() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 2 || role === 16) !== undefined
            : false;
    }

    isControlPartners() {

        const prefereces = JSON.parse(localStorage.getItem('company'));

        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17 && !prefereces.isPartnerType) !== undefined
            : false;
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

    isChat() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles()
                .find((role) => role === 1 || role === 2 || role === 14 || role === 16 || role === 18) !== undefined
            : false;
    }

    isTraffic() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 16) !== undefined
            : false;
    }

    canUser() {

        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 3 || role === 2 || role === 1 || role === 16) !== undefined
            : false;
    }

    multivalidation() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 4 || role === 1 || role === 3) !== undefined
            : false;
    }

    validatelogistics() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.companyProfileTypeId >= 3 ||
            this.profile.company.companyProfileTypeId === 1
        ) {
            return true;
        } else {
            return false;
        }
    }

    isCommercialDirector() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 9) !== undefined
            : false;
    }

    isCommercialAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
            : false;
    }

    isFranchise() {
        if (
            this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.companyParentId &&
            this.profile.company.companyParentId != null
        ) {
            return true;
        } else {
            false;
        }
    }

    showStoreFranchise() {
        if (this.profile &&
            this.profile.company &&
            this.profile.company.companyParentId != null
        ) {
            return false;
        }
        else {
            return true
        }
    }

}
