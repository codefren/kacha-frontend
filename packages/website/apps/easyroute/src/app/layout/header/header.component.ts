import { ModalMyProfileComponent } from './../../../../../../libs/shared/src/lib/components/modal-my-profile/modal-my-profile.component';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
    AfterViewChecked,
    ViewRef,
    AfterViewInit
} from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { InterfacePreferences } from '../../../../../../libs/backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../libs/state-preferences/src/lib/+state/preferences.facade';
import { BackendService, HelpGuide, Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';

import * as moment from 'moment';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEndHelpComponent } from './modal-end-help/modal-end-help.component';
import { WebSocketService } from '@easyroute/notifications'
import { LoadingService } from '@optimroute/shared';
import { environment } from '@optimroute/env/environment';
import { ModalChangeCompanyComponent } from '../../../../../../libs/shared/src/lib/components/modal-change-company/modal-change-company.component';
import { TranslateService } from '@ngx-translate/core';
declare var init_plugins: any;
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '(window:resize)': 'onResize($event)',
    },
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('dropDownUser', { read: true, static: false }) dropDownUser: ElementRef;
    @ViewChild('userBox', { static: false }) userBox: ElementRef<HTMLElement>;

    isLoggingIn$: Subject<boolean>;
    unsubscribe$ = new Subject<void>();

    breakWidths = [];
    color: boolean = true; // true es blanco sino negro
    detectorDeviceIpad: boolean = false;
    detectorDeviceWidth: boolean = false;
    dropdownMenuItems = [];
    logo: string = '';//'assets/images/optimroute-logo.png';
    menuItems = [];
    menuItemsBack = [];
    menuItemsHidden = [];
    preferenceInterfaz: InterfacePreferences;
    profile: Profile;
    showDropdown: boolean = false;
    showDropDownPrio = false;
    showSubscriptionAlert: boolean = false;
    showHelpGuide: boolean = false;
    helpGuideStep: HelpGuide;
    openModalEnd: boolean = false;
    unReadCount: number = 0;
    notificationsLast: any =[];
    companies: any = [];
    companiesFilter: any = [];
    companyId;
    readonly urlPrivacyTerms: string = "https://polpoo.com/politicas-privacidad/";
    names: any = [];
    showNotificactios: boolean = false;
    showChats: boolean = false;
    roles:any[];
    urlAcademy :string ='https://academy.polpoo.com/';
    chats: any[];
    opens: any = 0;

    constructor(
        private router: Router,
        public authLocal: AuthLocalService,
        public detectChange: ChangeDetectorRef,
        public facade: PreferencesFacade,
        public facadeProfile: ProfileSettingsFacade,
        private Profilefacade: ProfileSettingsFacade,
        private modalService: NgbModal,
        private ws: WebSocketService,
        private backend: BackendService,
        private loading: LoadingService,
        private translate:TranslateService
    ) {
        this.showSubscriptionAlert =
            localStorage.getItem('showSubscriptionAlert') == 'true' ? true : false;
    }

    hideUserbox() {
        if (window.screen.width <= 375 && window.screen.height <= 667) {
            $('#prueba').hasClass('collapse')
                ? $('.header-right').css('display', 'none')
                : $('.header-right').css('display', 'block');
        }
    }

    ngOnInit() {
       
        this.companyId = undefined;

        this.ws.connect();

        this.backend.get('quantity_pending_notifications').pipe(take(1)).subscribe((data) => {

            this.unReadCount = data;

        })

        this.backend.get('company_notification_list').pipe(take(1)).subscribe((data) => {

            this.showNotificactios = false;

            this.notificationsLast = data.data;

            this.showNotificactios = true;

        })


        if(this.haveChat()){
            this.showChats = false;
            this.backend.get('chat?isChatNotification=true&limit=3').pipe(take(1)).subscribe( (resp)=>{
                
                this.chats = resp.data;

                this.opens = resp.opens;

                this.showChats = true;

                
            });
        }

        this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {

            if (data && data.companyId) {

                this.unReadCount = data.unReadCount;

                this.notificationsLast = [];

                this.showNotificactios = false;

                this.notificationsLast = data.unReadList;

                this.showNotificactios = true;

                try{

                    this.detectChange.detectChanges();

                }catch(e){

                }
            }
        })

        this.ws.chats.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {

            
            if (data && data.companyId && data.chats) {

              this.opens = data.opens;
              this.chats = data.chats;

                try{

                    this.detectChange.detectChanges();

                }catch(e){

                }
            
            }
        })
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
                this.color = true;
            }
        });

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {

                        this.names =[];

                        this.profile = data;

                        if (this.names.length === 0) {

                            this.names.push (data.profile.name + ' ' + data.profile.surname);
                        }

                        this.companyId = this.profile.company.id;

                        if (
                            this.defeatedDemo() ||
                            this.isActive() ||
                            this.inTrial() ||
                            this.isAdmin() ||
                            this.isFranchise()
                        ) {
                            this.load();
                        } else {
                            this.load();
                            this.router.navigateByUrl('profile/invoicing');
                        }
                    });
            }
        });

        this.Profilefacade.guide$.pipe(takeUntil(this.unsubscribe$)).subscribe(guide => {
            if (guide.helpGuideId >= 1 && guide.showTipsModal && guide.helpGuide) {
                this.showHelpGuide = true;
                this.helpGuideStep = guide.helpGuide;
                this.loading.hideLoading();
                this.router.navigate([guide.helpGuide.currentUrl]);
            }

            if (guide.helpGuideId >= 1 && guide.showTipsModal && guide.helpGuide === undefined) {
                this.Profilefacade.loadHelpGuideStep(guide.helpGuideId);
            }

            if (guide && !guide.showTipsModal) {
                this.showHelpGuide = false;
            }
        })

        // Identificando si la url tiene polpoo
        let hostname = window.location.hostname;
        let include = hostname.includes('polpoo.com');

        if (!include) {

            this.bookForUrlCompanyPartner(hostname);

        } else {

            this.logo = 'assets/images/pages/header/Logo_polpoo.png';

        }

    }

    bookForUrlCompanyPartner(value: any) {
        
        this.logo = '';

        this.backend.post_client('company_parents_data_url',
        {
            urlPartnerType: value
        })
        .pipe(take(1))
        .subscribe(( data ) => {

            if (data && data.activeLogoNomenclature && data.urlLogoTypePartner != null) {
                
                this.logo = data.urlLogoTypePartner;
                
            } else {

                this.logo = 'assets/images/pages/header/Logo_polpoo.png';

            }

            this.detectChange.detectChanges();

        })

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

    changeCompany(value) {
        this.authLocal.changeCompany(value);
    }

    skip() {
        this.Profilefacade.changeShowTipsModal(false);
    }
    before() {
        this.Profilefacade.updateHelpGuideId(this.helpGuideStep.beforeStep);
    }
    next() {
        this.Profilefacade.updateHelpGuideId(this.helpGuideStep.nextStep);
    }

    end() {
        this.Profilefacade.endHelpGuideStep();
        this.Profilefacade.guide$.pipe(take(2)).subscribe((guide) => {
            if (guide && guide.endHelpGuide && !guide.showTipsModal) {
                this.openModalEndHelp();
                this.router.navigate(['home']);
            }
        })
    }


    logOut() {
        this.authLocal.logout();
    }

    detectorDevice() {

        let x = navigator.userAgent;

        if (/iPad/i.test(x)) {
            this.detectorDeviceIpad = true;

        } else {
            this.detectorDeviceIpad = false;
        }

        if (window.innerWidth <= 991) {

            this.detectorDeviceWidth = true;

        } else {
        
            this.detectorDeviceWidth = false;

        }

        setTimeout(function () {
            init_plugins();
        }, 1);

        this.checkCalculcation();
    }

    listernBody(that = this) {
        $('body').on('click', function (e) {
            if (!$('.userbox a').is(e.target)
                && $('.userbox a').has(e.target).length === 0
            ) {
                that.color = true;
                try {
                    that.detectChange.detectChanges();
                } catch (e) {

                }

            }
        });
    }

    load() {

        this.listernBody();

        if (this.isAdminGlobal() || this.isTraffic() || this.showChangeCompanyToAdminCompany() || (this.validateSAC() || this.Partners() && (this.franchisesActive() || !this.showStoreFranchise()))) {

            this.backend.get('user/company_switch_list').pipe(take(1)).subscribe(({ data }) => {

                this.companies = data;

                this.companiesFilter = data;
           
                if (!this.detectChange['destroyed']) {
                    this.detectChange.detectChanges();
                    this.checkCalculcation();
                }
            })
        }

        // this.detectorDevice();

        this.menuItems = [
            {
                name: 'MENU.ROUTE_PLANNING',
                iconName: 'directions',
                showDropdown: false,
                route: '/route-planning',
                show:this.canUser() &&
                    (this.authLocal.isLogged() &&
                        (this.isControlPanel() ||
                            this.isAdmin() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            this.isCommercialDirector()) &&
                        (this.isActive() ||
                            this.defeatedDemo() ||
                            this.inTrial() ||
                            this.isAdmin() ||
                            this.isFranchise())
                        ) &&
                    this.validatelogistics() || this.multivalidation() || this.isTraffic() ||   this.isControlPartners()
            }, 
            {
                name: 'MENU.ROUTE',
                iconName: '',
                showDropdown: true,
                route: '/#',
                show: this.validateSAC() || (this.isControlPanel() ||
                this.isAdmin() ||
                this.isTraffic() ||
                this.isAdminCompany() ||
                this.isControlPartners() ||
                this.isCommercialDirector() ||
                this.isCommercialAgent() ),
                subMenu: [
                  
                    {
                        name: 'CONTROL_PANEL.TRAVEL_TRACKING',
                        route: '/travel-tracking',
                        show:this.validateSAC() || (this.isControlPanel() ||
                            this.isAdmin() ||
                            this.isTraffic() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            this.isCommercialDirector() ||
                            this.isCommercialAgent() ),
                    },
                  
                    {
                        name: 'CONTROL_PANEL.DEVOLUTION',
                        route: '/control-panel/devolution',
                        show: (this.isControlPanel() ||
                            this.isAdmin() ||
                            this.isTraffic() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            this.isCommercialDirector() ),
                    },
                    {
                        name: 'DELIVERY_ZONES.NAME',
                        route: '/management-logistics/delivery-zones',
                        show: (this.isControlPanel() ||
                            this.isAdmin() ||
                            this.isTraffic() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            this.isCommercialDirector() ),
                    },
                    {
                        name: 'DELIVERY_PLANNER.NAME',
                        route: '/integration',
                        show: (this.isControlPanel() ||
                            this.isAdmin() ||
                            this.isTraffic() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            this.isCommercialDirector()),
                    },
                    {
                        name: 'HOME.SHEET_ROUTE',
                        route: '/sheet-route',
                        show: this.ModuleSheetRoute(),
                    },
                    {
                        name: 'HOME.PARCEL',
                        route: '/parcel',
                        //AGREGAR VALIDACION PARA MOSTRAR EN EL MENU VALIDAR ESTO
                        show: this.ModuleParcel(),
                    },
                    {
                        name: 'HOME.LOADING_DOCK',
                        route: '/loading-dock',
                        show: this.ModuleLoadingDock(),
                    }
                ]
            },
            {
                name: 'MENU.MANAGEMENT',
                iconName: '',
                showDropdown: true,
                route: '/#',
                show: this.authLocal.isLogged() &&
                    this.validateSAC() ||
                    (this.isAdmin() ||
                        this.isAdminCompany() ||
                        this.isControlPartners() || this.Partners() ||
                        this.isTraffic() ||
                        this.isCommercialAgent() ||
                        this.isCommercialDirector()) &&
                    (this.isActive() ||
                        this.defeatedDemo() ||
                        this.inTrial() ||
                        this.isAdmin() ||
                        this.isFranchise()),
              
                subMenu: [
                    {
                        name: 'USERS.NAME',
                        route: '/management/users',
                        show: this.canUser() || this.validateSAC() ||  this.isTraffic() || this.isControlPartners() || this.Partners(),
                    },
                    {
                        name: 'PROVIDERS.NAME',
                        route: '/providers',
                        show:this.validateSAC() ||
                            this.canUser() ||
                            this.isCommercialDirector() ||
                            this.isCommercialAgent() || this.isControlPartners(),
                    },
                    {
                        name: 'GENERAL.CLIENTS',
                        route: '/management/clients',
                        show:this.validateSAC() ||
                            this.canUser() ||
                            this.isTraffic() ||
                            this.isCommercialDirector() ||
                            this.isCommercialAgent() || this.isControlPartners(),
                    },
                    {
                        name: 'VEHICLES.NAME',
                        route: '/management-logistics/vehicles',
                        show: this.canUser() && (this.isAdmin() ||
                            this.isTraffic() ||
                            this.isAdminCompany() ||
                            this.isControlPartners() ||
                            !this.isCommercialAgent() ||
                            this.isControlPanel() ||
                            this.isCommercialDirector()) &&
                            this.validatelogistics()
                    },
                   /*  {
                        name: 'COMPANIES.PENDING_VINCULATION',
                        route: '/miwigo-unlinked',
                        show: this.canUser() || this.isCommercialDirector() ,
                    }, */
                    {
                        name: 'MENU.PRODUCTS',
                        route: '/products',
                        show: (this.isCommercialDirector() ||
                        this.canUser() ||
                        this.isAdmin() ||
                        this.isTraffic() ||
                        this.isCommercialAgent() ||
                        this.isAdminCompany() || this.isControlPartners()) &&
                        this.validateCommercial() &&
                        (this.isActive() || this.inTrial() || this.isAdminGlobal() || this.defeatedDemo() ||
                            this.isFranchise()) && 
                        this.hideMultidelegation(),
                    },
                    {
                        name: 'MENU.ORDERS',
                        route: '/orders/orders-list',
                        show: (this.isCommercialDirector() ||
                        this.canUser() ||
                        this.isTraffic() ||
                        this.isAdmin() ||
                        this.isAdminCompany() ||
                        this.isControlPartners() ||
                        this.isCommercialAgent()) &&
                        this.validateCommercial() &&
                        (this.isActive() || this.inTrial() || this.isAdminGlobal() || this.defeatedDemo() ||
                            this.isFranchise())
                        && this.hideMultidelegation(),
                    }

                ]
            },
            {
                name: 'FRANCHISE.NAME',
                // iconName: 'directions',
                showDropdown: false,
                route: '/#',
                show: this.franchisesActive() && (this.isAdmin() ||  this.isTraffic() ||
                    this.isAdminCompany() || this.isControlPartners() && (this.isActive() || this.inTrial() || this.isAdminGlobal() || this.defeatedDemo()) && this.showStoreFranchise()),
                subMenu: [
                    {
                        name: 'FRANCHISE.MANAGE_ZONE',
                        route: '/franchise/zone',
                        show:
                            this.franchisesActive() && (this.isAdmin() ||
                                //this.defeatedDemo() ||
                                this.isAdminCompany() ||  this.isControlPartners() ||  this.isTraffic())
                                && this.hideMultidelegation(),
                    },
                    {
                        name: 'FRANCHISE.MANAGE_STORES',
                        route: '/franchise/store',
                        show:
                            this.franchisesActive() && (this.isAdmin() ||
                                //this.defeatedDemo() ||
                                this.isAdminCompany() || this.isControlPartners() ||  this.isTraffic()),
                    },
                    {
                        name: 'FRANCHISE.MANAGE_USERS',
                        route: '/franchise/manage-users',
                        show:
                            this.franchisesActive() && (this.isAdmin() ||
                                //this.defeatedDemo() ||
                                this.isAdminCompany() || this.isControlPartners() ||  this.isTraffic()),
                    },
                    {
                        name: 'FRANCHISE.ORDERS_SUMARY',
                        route: '/franchise/summary-orders',
                        show: this.franchisesActive() && (this.isAdmin() ||
                            //this.defeatedDemo() ||
                            this.isAdminCompany() || this.isControlPartners() ||  this.isTraffic())
                            && this.hideMultidelegation(),
                    },
                   /*  {
                        name: 'FRANCHISE.PREPARATION_SUMMARY',
                        route: '/franchise/summary-preparation',
                        show: this.franchisesActive() && (this.isAdmin() ||
                            //this.defeatedDemo() ||
                            this.isAdminCompany())
                    }, */
                   /*  {
                        name: 'FRANCHISE.DELIVERY_SUMMARY',
                        route: '/franchise/summary-deliveries',
                        show: this.franchisesActive() && (this.isAdmin() ||
                            //this.defeatedDemo() ||
                            this.isAdminCompany()),
                    }, */


                ]
            },
            {
                name: 'MENU.SUPER_ADMIN',
                iconName: 'fas fa-user',
                showDropdown: false,
                route: this.returUrlSuperAdmin() ,
                show:
                    this.authLocal.isLogged() &&
                    (this.isAdmin() || this.isSalesman()) &&
                    (this.isActive() ||
                        this.defeatedDemo() ||
                        this.inTrial() ||
                        this.isAdmin() ) || this.isControlPartners() || this.Partners() ,
            },
            {
                name: 'MENU.COST',
                showDropdown: false,
                route: '/cost',
                show: this.ModuleCost() && this.showNotTraffic()
            },
            {
                name: 'MENU.REPORT',
                showDropdown: false,
                route: '/report',
                show:  (this.isControlPartners() || !this.Partners()) && !this.onlyChat()
            },

           

        ];

        this.dropdownMenuItems = [
            {
                name: 'PROFILE.NAME',
                iconName: 'fas fa-user',
                route: '/profile/settings',
                show: true,
            },
            {
                name: 'INVOICING.SUSCRIPTION',
                iconName: 'far fa-credit-card',
                route: '/profile/invoicing',
                show: this.isAdminAdministrative(),
            },
            {
                name: 'PREFERENCES.NAME',
                iconName: 'fas fa-cog',
                route: '/preferences',
                show:
                    this.authLocal.isLogged() &&
                    (this.isControlPanel() || this.isAdmin() || this.isAdminCompany() ||  this.isTraffic()) &&
                    (this.isActive() ||
                        this.defeatedDemo() ||
                        this.inTrial() ||
                        this.isFranchise() ||
                        (this.isAdmin() && !this.isControlPanel())),
            },
            {
                name: 'HELP.NAME',
                iconName: 'fas fa-question',
                route: '/help',
                show:
                    this.authLocal.isLogged() &&
                    (this.isActive() ||
                        this.defeatedDemo() ||
                        this.inTrial() ||
                        this.isAdmin()),
            },
        ];

        this.menuItemsBack = this.menuItems;


        if (this.detectChange !== null &&
            this.detectChange !== undefined &&
            !(this.detectChange as ViewRef).destroyed) {
            this.detectChange.detectChanges();

        }
        setTimeout(() => {
            init_plugins();
        }, 1);

        
    }

    setProfileIconColor(): boolean {
        return this.router.url.includes('profile');
    }

    franchisesActive() {
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 2)) {
            return true;
        } else {
            return false;
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

    lastMessage(item) {
        const last = item.messages.length;
        return item.messages[last - 1];
    }

    getUserTo(item) {
        if(item && item.status === 'request'){
            return 'En espera por aceptación'
        } else {
            let user = item.users.find(x => x.me == false)
            return user.name + ' ' + user.surname;
        }
        
    }
    

    showChangeCompanyToAdminCompany() {
       
        return this.isAdmin() || this.isAdminCompany() || this.Partners();
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

    isActive() {
        if (
            this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0
        ) {
            let value =
                this.profile.company.subscriptions[0].stripe_status == 'active' ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }



    isAdminAdministrative() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 2) !==
            undefined
            : false;
    }

    filterCompany(filter){
        if (filter && filter.trim() !== '' && filter.length > 2) {
            this.companiesFilter = this.companies.filter((item) => {

              return (item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1  );
            });
          } else {
            this.companiesFilter = this.companies;
          }
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
            ? this.authLocal.getRoles().find((role) => role === 2) !== undefined
            : false;
    }

    isAdminGlobal() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }

    isChat() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles()
                .find((role) => role === 1 || role === 2 || role === 14 || role === 16 || role === 18) !== undefined
            : false;
    }

    ChatModule() {

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 16)) {

            return true;

        } else {

            return false;
        }
    }

    haveChat() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles()
                .find((role) => role === 1 || role === 2 || role === 14 || role === 18) !== undefined
            : false;
    }

    multivalidation() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 4 || role === 1 || role ===3) !== undefined
            : false;
    }

    Partners() {
        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 17 ) !== undefined
        : false;
    }

    isTraffic() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 16) !== undefined
            : false;
    }

    ngOnDestroy() {
        this.companies = [];
        this.companiesFilter = [];
        this.ws.desconnect();
        this.unsubscribe$.complete();
        this.unsubscribe$.next();
    }

    canUser() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 3 || role === 2 || role === 1 || role === 16) !== undefined
            : false;
    }

    isCommercialAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 10) !== undefined
            : false;
    }

    isCommercialDirector() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 9) !== undefined
            : false;
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 3 || role === 8) !==
            undefined
            : false;
    }

    validateCommercial() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.companyProfileTypeId >= 3 ||
            this.profile.company.companyProfileTypeId === 2
        ) {
            return true;
        } else {
            return false;
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

    validateSAC() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 14) !== undefined
            : false;
    }


    onlyChat(){
        return this.authLocal.getRoles()
            ?  this.authLocal.getRoles().length === 1 && this.authLocal.getRoles().find((role) => role === 18) !== undefined
            : false;
    }


    changeColor() {
        this.color = $('#userbox').hasClass('show');
        console.log(this.color);
        this.detectChange.detectChanges();
    }

    reverseColor() {
        if ($('#userbox').children('.dropdown-menu').hasClass('show')) {
            return this.color = true;
        }
    }

    _handleMouseLeave() {

        // si esta abierto el menu ejecuta el evento click para cerrarlo
        if ($('#userbox').children('.dropdown-menu').hasClass('show')) {
            return this.userBox.nativeElement.click();
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

    openDropdown(value: any) {
        this.showDropdown = value;
    }

    ngAfterViewInit() {

        var prioNav = document.getElementById('mainNav');
        var totalSpace = 0;

        for (var i = 0; i < prioNav.children.length; i++) {

            totalSpace += prioNav.children[i].clientWidth;
            this.breakWidths.push(totalSpace);
        }
    }

    onResize(event) {
        this.detectorDevice();
    }

    checkCalculcation() {

        this.menuItems = this.menuItemsBack;
        this.menuItemsHidden = [];
        this.showDropDownPrio = false;

        // en caso de dispositivos moviles no se calcula las opciones y el menu original se conserva
        if (window.matchMedia('(max-width: 960px)').matches) {
            return;
        }

        if (
            (this.detectorDeviceIpad && this.detectorDeviceWidth) ||
            (!this.detectorDeviceIpad && this.detectorDeviceWidth)
        ) {
            return;
        }

        var availableSpace = document.getElementById('header').offsetWidth;

        var totalNeededSpace =
            document.getElementById('logo').offsetWidth +
            document.getElementById('header-right').offsetWidth +
            this.breakWidths[this.breakWidths.length - 1] +
            210;

        // se añade 75px para compensar la diferencia en el lado derecho
        var totalSpace = document.getElementById('header').offsetWidth -
            (document.getElementById('logo').offsetWidth + document.getElementById('header-right').offsetWidth + 75)

        // log de estado del navbar ayuda al desarrollador
        /* console.log({
            widthLogo: document.getElementById('logo').offsetWidth,
            widthHeaderRight: document.getElementById('header-right').offsetWidth,
            totalNeededSpace,
            availableSpace,
            breakWidths: this.breakWidths,
            totalSpace,
            mainNav: document.getElementById('mainNav').offsetWidth,
            header: document.getElementById('header').offsetWidth,
            menuItems: this.menuItems
        }); */


        if (totalNeededSpace > availableSpace) {

            this.setMenuOptions(totalSpace);

        } else {

            console.log('ipad vertical a horizontal');

            // se cambia el valor del array debido a que la resolucion de ipad vertical a horizontal es: [0,0,0,0]
            // se vuelve a llamar view Init para obtener nuevamente los valores del dom en breakWidth antes de volver
            // a calcular

            this.breakWidths = [];
            this.ngAfterViewInit();

            this.setMenuOptions(totalSpace);
        }
    }

    closeSubscriptionAlert(redirect: boolean = false) {
        this.showSubscriptionAlert = false;

        localStorage.setItem('showSubscriptionAlert', String(this.showSubscriptionAlert));

        if (redirect) {
            this.router.navigate(['profile/invoicing']);
        }
    }

    openModalEndHelp() {
        const modal = this.modalService.open(ModalEndHelpComponent, {

            backdrop: 'static',

            backdropClass: 'customBackdrop',

            centered: true,

            size: ''

        });

        modal.result.then((data) => {
            this.openModalEnd = false
            /* if (data) {
              this.facade.changeShowTipsModal(data);
            } else {
                this.facade.updateHelpGuideId(this.guide.helpGuideId === null? 1 : this.guide.helpGuideId +1 );
            } */
        }, (error) => {
        });
    }

    setMenuOptions(totalSpace: number) {

        // se filtra el array solamente los elementos activos que se encuentran en la vista
        this.menuItems = this.menuItems.filter((menu) => menu.show);

        // recorre el array de la anchura y verfica si el elemento tiene mas anchura que la diferencia, lo añade al menu oculto
        this.breakWidths.forEach((widthElement: number, index: number) => {

            if (widthElement > totalSpace) {

                this.menuItemsHidden.push(this.menuItems[index]);
            }

        });

        if (this.menuItemsHidden.length > 0) {

            // Devuelve la subseccion del array restando el longitud menu principal con la del menu oculto
            this.menuItems = this.menuItems.slice(0, (this.menuItems.length - this.menuItemsHidden.length));

            let showMenus: number = this.menuItemsHidden.reduce((accum, menu) => {

                if (menu.show) {
                    return accum += 1;
                }

                return accum;
            }, 0);

            // activa la opcion oculta dependiendo si al menos un menu activo dentro de los elementos ocultos
            this.showDropDownPrio = showMenus > 0;
        }

        //console.log({ menuOculto: this.menuItemsHidden, menuPrincipal: this.menuItems, show: this.showDropDownPrio });

        this.detectChange.detectChanges();
    }

    vehicleMaintenanceActive() {
        console.log('entro aqui en vehicleMaintenanceActive')
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 8)) {
            return true;
        } else {
            return false;
        }
    }
    billsModuleActive(){

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 11)) {
            return true;
        } else {
            return false;
        }
    }

    ModuleSheetRoute(){

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 12)) {
            return true;
        } else {
            return false;
        }
    }

    redirectNotifications(){
        this.router.navigateByUrl('notifications');
    }

    redirectChat(){
        this.router.navigateByUrl('chat');
    }



    getInitials(nameString , i){

      const fullName = nameString.split(' ');

      const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);

      return initials.toUpperCase();

    }


    openModalChangeCompany(){
        const modal = this.modalService.open(ModalChangeCompanyComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-change-company',
            size:'md'
        });

        modal.componentInstance.companiesFilter = this.companiesFilter;
        modal.componentInstance.companies = this.companies;
        modal.componentInstance.profile = this.profile;

        modal.result.then(
            (result) => {
                if (result) {

                } else {

                }
            },
            (reason) => {

            },
        );
    }

    date(date: any){
        moment.locale('es');

        return moment(date).fromNow().replace( this.translate.instant('GENERAL.IN'), this.translate.instant('GENERAL.DOES'));
    }

    showNotTraffic(){
        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role != 16 && role != 18) !==
        undefined
        : false;
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


    ModuleParcel(){

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 13)) {
            return true;
        } else {
            return false;
        }
    }

    ModuleLoadingDock(){

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 15)) {
            return true;
        } else {
            return false;
        }
    }

    isControlPartners() {
        
        const prefereces = JSON.parse(localStorage.getItem('company'));

        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17 && !prefereces.isPartnerType) !== undefined
            : false;
    }

    openModalMyProfile() {
        
        const modal = this.modalService.open(ModalMyProfileComponent, {

            backdropClass: 'modal-backdrop-ticket',

            windowClass:'modal-my-profile',
  
            size:'md',

            backdrop: 'static'

        });

        modal.result.then((data) => {
            this.openModalEnd = false
           
        }, (error) => {
        });
    }

    goToLinkAcademy(url: string){

        window.open(url, "_blank");

    }

    showCompanyPanertsSelecter(data:any){

        /* console.log(data ,'any');

        console.log(this.companies, 'this.companies'); */

        let companyName: any;

        let companySelecter = this.companies.find(x => x.id == data.profile.companyId)

       /*  console.log(companySelecter, 'companySelecter'); */

        if (companySelecter) {
            return companyName = companySelecter.name;
        } else {
            return companyName ='';
        }

    }

    /*   isPartnersCompany(){
        const prefereces = JSON.parse(localStorage.getItem('company'));

        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 17 && !prefereces.isPartnerType) !== undefined
        : false;

    } */

    returUrlSuperAdmin(){

        let url : any ='';
    
        if (this.isControlPartners()) {
            
            url = '/partners-super-admin';

        } else if( this.Partners()){
            
            url = '/partners-super-admin';

        } else {
            
            url =   '/super-admin'
        }

        return url;
    }

    openSettings(){
        this.router.navigateByUrl('/preferences?option=planRoutes');
    }
    
    

}
