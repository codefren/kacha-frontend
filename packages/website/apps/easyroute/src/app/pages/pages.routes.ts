import { RouterModule, Routes } from '@angular/router';
import { AgentCommercialGuard } from '../../../../../libs/auth-local/src/lib/guards/agent-commercial.guard';
import {
    VerificaTokenGuard,
    DemoGuard,
    PlanningRouteGuard,
    AdminGuard,
    LogisticGuard,
    CommercialGuard,
    AdministrativeGuard,
    SacGuard,
    PartnersGuard,
    PartnersAdminGuard,
    ChatGuard
} from '@optimroute/auth-local';

const pagesRoutes: Routes = [
    {
        path: 'management',
        loadChildren: '@optimroute/management#ManagementModule',
        canActivate: [DemoGuard],
    },
    {
        path: 'management-logistics',
        loadChildren: '@optimroute/management-logistics#ManagementLogisticsModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'control-panel',
        loadChildren: '@optimroute/control-panel#ControlPanelModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'preferences',
        loadChildren: '@optimroute/preferences#PreferencesModule',
        canActivate: [DemoGuard],
    },
    {
        path: 'route-planning',
        loadChildren: '@optimroute/route-planning#RoutePlanningModule',
        canActivate: [DemoGuard, PlanningRouteGuard, LogisticGuard],
    },
    {
        path: 'integration',
        loadChildren: '@easyroute/integration#IntegrationModule',
        canActivate: [AdminGuard, DemoGuard, LogisticGuard],
    },
    /* {
        path: 'help',
        loadChildren: '@optimroute/help#HelpModule',
    }, */
    {
        path: 'category',
        loadChildren: '@easyroute/category#CategoryModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'category-general',
        loadChildren: '@easyroute/category-general#CategoryGeneralModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'products',
        loadChildren: '@easyroute/products#ProductsModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'orders',
        loadChildren: '@easyroute/orders#OrdersModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'my-orders',
        loadChildren: '@easyroute/my-orders#MyOrdersModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'profile',
        loadChildren: '@optimroute/profile#ProfileModule',
        canActivate: []
    },
    /* {
        path: 'users-management',
        loadChildren: '@optimroute/users-management#UsersManagementModule',
        canActivate: [AdminGuard, DemoGuard],
    }, */
   
    {
        path: 'measure',
        loadChildren: '@easyroute/measure#MeasureModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard]
    },
    {
        path: 'measure-general',
        loadChildren: '@easyroute/measure-general#MeasureGeneralModule',
        canActivate: [AdminGuard, DemoGuard]
    },
    {
        path: 'miwigo-unlinked',
        loadChildren: '@easyroute/miwigo-clients-unlinked#MiwigoClientsUnlinkedModule',
        canActivate: [AdminGuard, DemoGuard],
    },

    {
        path: 'franchise',
        loadChildren: '@easyroute/franchise#FranchiseModule',
        canActivate: [AdministrativeGuard, DemoGuard],
    },
    {
        path: 'sub-category',
        loadChildren: '@easyroute/sub-category#SubCategoryModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'category-filter',
        loadChildren: '@easyroute/category-filter#CategoryFilterModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'modules',
        loadChildren: '@easyroute/module#ModuleModule',
        canActivate: [AdministrativeGuard, DemoGuard],
    },
    {
        path: 'notifications',
        loadChildren: '@easyroute/notifications#NotificationsModule',
        canActivate: [AdminGuard, DemoGuard],
    },
    {
        path: 'super-admin',
        loadChildren: '@easyroute/super-admin#SuperAdminModule',
        canActivate: [AdminGuard, DemoGuard],
    },
    {
        path: 'partners-super-admin',
        loadChildren: '@easyroute/partners-super-admin#PartnersSuperAdminModule',
        canActivate: [PartnersAdminGuard],
    },
    {
        path: 'vehicle-maintenance',
        loadChildren: '@easyroute/vehicle-maintenance#VehicleMaintenanceModule',
        canActivate: [DemoGuard ],
    },
    {
        path: 'dashboard',
        loadChildren: '@easyroute/dashboard#DashboardModule'
    },
    /* {
        path: 'order-historical',
        loadChildren: '@easyroute/order-historical#OrderHistoricalModule',
        canActivate: [AdministrativeGuard ,DemoGuard],
    }, */
    {
        path: 'bills',
        loadChildren: '@easyroute/bills#BillsModule',
        canActivate: [AdminGuard, DemoGuard, CommercialGuard],
    },
    {
        path: 'providers',
        loadChildren: '@easyroute/providers#ProvidersModule',
        canActivate: []
    },
    {
        path: 'home',
        loadChildren: '@optimroute/home#HomeModule',
        canActivate: [SacGuard, PartnersGuard], /* PartnersGuard */
    },
    {
        path: 'sheet-route',
        loadChildren: '@easyroute/sheet-route#SheetRouteModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'parcel',
        loadChildren: '@easyroute/parcel#ParcelModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'cost',
        loadChildren: '@easyroute/cost#CostModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'report',
        loadChildren: '@easyroute/report#ReportModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'loading-dock',
        loadChildren: '@easyroute/loading-dock#LoadingDockModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'company-profile',
        loadChildren: '@easyroute/company-profile#CompanyProfileModule',
        canActivate: [SacGuard, AgentCommercialGuard],
    },
    {
        path: 'travel-tracking',
        loadChildren: '@easyroute/travel-tracking#TravelTrackingModule',
        canActivate: [DemoGuard, LogisticGuard],
    },
    {
        path: 'chat',
        loadChildren: '@easyroute/chat#ChatModule',
        canActivate: [ChatGuard],
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
