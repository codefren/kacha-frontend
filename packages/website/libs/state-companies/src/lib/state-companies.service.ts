import { Injectable } from '@angular/core';
import { Company, BackendService } from '@optimroute/backend';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class StateCompaniesService {
    loadCompanies(me: boolean) {
        if (me) {
            return this.backendService.get('company?me=true');
        } else {
            return this.backendService.get('company');
        }
    }

    loadCompaniesPartners(me: boolean){
        if (me) {
            return this.backendService.get('company_partner_list?me=true');
        } else {
            return this.backendService.get('company_partner_list');
        }
    }

    loadCompaniesStore() {
        return this.backendService.get('company_franchise_list');
    }

    loadCompaniesFranchiseLIst(me: boolean) {
        if (me) {
            return this.backendService.get('company_franchise_list?me=true');
        } else {
            return this.backendService.get('company_franchise_list');
        }
    }

    getCompanyPartner(id: number) {
        return this.backendService.get('company_partner_show/' + id);
    }

    addCompanyPartner(c: Company) {
        return this.backendService.post('company_partner', c);
    }

    updateCompanyPartner(id: number, company: Partial<Company>) {
        return this.backendService.put('company_partner/' + id, company);
    }

    //partners

    getCompany(id: number) {
        return this.backendService.get('company/' + id);
    }

    addCompany(c: Company) {
        return this.backendService.post('company', c);
    }

    updateCompany(id: number, company: Partial<Company>) {
        return this.backendService.put('company/' + id, company);
    }

    getResumen(filter: any) {
        return this.backendService.post('company_start_totalized?showActive=' + filter.showActive);
    }

    updateDemoCompany(id: number, demo: any) {
        return this.backendService.put('company/demo/' + id, demo);
    }

    updateActiveCompany(id: number, active: any) {
        return this.backendService.put('company/active/' + id, active);
    }

    addCompanyModule(companyModule: any) {
        return this.backendService.post('company_module', companyModule);
    }

    updateActiveCompanyModule(id: number, active: any) {
        return this.backendService.put('company_module/active/' + id, active);
    }

    deleteCompany(id: number) {
        return this.backendService.delete('company/' + id);
    }
    loadServiceType() {
        return this.backendService.get('service_type');
    }
    getCompanyInvoice(range) {
        return this.backendService.post('stripe_invoice_list', range);
    }
    getPdfCompanyInvoice(id: number) {
        return this.backendService.getPDF('stripe_invoice_download/' + id);
    }
    getCompanyInvoicePaginate(date_from: string, date_to: string, page: number) {
        return this.backendService.get(
            'company_invoice_list?' +
            'date_from=' +
            date_from +
            '&' +
            'date_to=' +
            date_to +
            '&' +
            'page=' +
            page,
        );
    }

    getPlan() {
        return this.backendService.get('plan');
    }

    getPlanOrder() {
        return this.backendService.get('plan_order');
    }
    getRateByPlanId(planId: number) {
        return this.backendService.get('plan/' + planId + '/rate');
    }
    updateChangeplan(data: any) {
        return this.backendService.post('company_plan_change', data);
    }

    intentSetup() {
        return this.backendService.get('stripe_setup_credit_card');
    }
    loadCards() {
        return this.backendService.get('stripe_card_list');
    }

    changeCardDefault(idCard: string) {
        return this.backendService.put('stripe_mark_credit_card/' + idCard);
    }

    deleteCard(idCard: string) {
        return this.backendService.delete('stripe_delete_credit_card/' + idCard);
    }
    agreeSubscribe() {
        return this.backendService.post('stripe_create_subscription', {});
    }

    cancelSubscribe() {
        return this.backendService.post('stripe_cancel_subscription', {});
    }

    susbcriptionStatus() {
        return this.backendService.get('subscription_status');
    }
    createCard(card: any) {
        return this.backendService.post('stripe_add_credit_card', card);
    }

    costPlan() {
        return this.backendService.get('stripe_subscription_data');
    }

    ordersResume(orderDate) {
        return this.backendService.get('orders_resume_seller?orderDate=' + orderDate);
    }

    createRouteForOrder(data) {
        return this.backendService.post('integration_orders', data);
    }

    readModules() {
        return this.backendService.get('product_modules_list');
    }

    subscribeModule(moduleId, payment_method) {
        return this.backendService.post('stripe_pay_module', { moduleId, payment_method });
    }

    getCompanySubscriptionTotalized() {
        return this.backendService.get('company_subscription_totalized');
    }

    loadModules(companyId) {
        return this.backendService.get('module?company_id=' + companyId);
    }
    
    loadPack() {
        return this.backendService.get('company_profile_type');
    }

    destroyCompanyDoc(documentId: number){
        return this.backendService.delete('company_doc/'+ documentId);
    }

    addCompanyDoc(companyDoc: FormData) {
        return this.backendService.postFile('company_doc', companyDoc);
    }

    editCompanyDoc(companyDoc: FormData, documentId) {
        return this.backendService.postFile('company_doc/' + documentId, companyDoc);
    }

    constructor(private backendService: BackendService) { }
}
