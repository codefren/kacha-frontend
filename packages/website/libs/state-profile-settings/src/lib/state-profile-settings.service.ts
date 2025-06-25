import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Profile, BackendService } from '@optimroute/backend';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class StateProfileSettingsService {
    getProfileSettings() {
        return this.backendService.get('/user/me').pipe(
            map(user => ({
                email: user.email,
                profile: {
                    ...user.profile,
                    id: user.id
                },
                profiles:user.profiles,
                address: user.address,
                subscription: user.subscription,
                company: user.company,
                showTipsModal: user.showTipsModal,
                helpGuideId: user.helpGuideId,
                noveltyLast: user.noveltyLast,
                id: user.id
                
            })),
        );
    }

    updateAcceptTerms(value: boolean) {
        return this.backendService.patch('/user/me', {
            termsAccepted: value ,
        });
    }

    saveProfileSettings(payload: Partial<Profile>) {
        return this.backendService.patch('/user/me', payload);
    }

    noShowModal(show: boolean) {
        return this.backendService.post('dont_show_tips_modal', {});
    }

    noNoveltyLastModal(show: boolean) {
        return this.backendService.post('dont_novelty_last_modal', {});
    }

    changePlanAction(companyProfileTypeId: number) {
        return this.backendService.post('stripe_change_profile_company', {
            companyProfileTypeId
        });
    }


    changePrice(price: string) {
        return this.backendService.post('stripe_change_price', {
            price
        });
    }

    updateHelpGuideId(id: number){
        return this.backendService.put('user_help_guide/' + id).pipe(map( data => 
            ({
                id: data.data.id,
                step: data.data.step,
                count: data.data.count,
                title: data.data.title,
                description: data.data.description,
                beforeUrl: data.data.beforeUrl,
                nextUrl: data.data.nextUrl,
                currentUrl: data.data.currentUrl,
                nextStep: data.data.nextStep,
                beforeStep: data.data.beforeStep
            })
        ));
    }

    loadHelpGuideStep(id: number){
        return this.backendService.get('help_guide/' + id).pipe(map( data => 
            ({
                id: data.data.id,
                step: data.data.step,
                count: data.data.count,
                title: data.data.title,
                description: data.data.description,
                beforeUrl: data.data.beforeUrl,
                nextUrl: data.data.nextUrl,
                currentUrl: data.data.currentUrl,
                beforeStep: data.data.beforeStep,
                nextStep: data.data.nextStep
            })
        ));
    }
    constructor(private backendService: BackendService) {}
}
