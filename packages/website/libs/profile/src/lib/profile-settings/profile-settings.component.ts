import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormGroupDirective,
    NgForm,
    Validators,
} from '@angular/forms';
import { Profile, Company, CompanyProfile } from '@optimroute/backend';
import {
    UtilData,
    ValidateCompanyId,
    ValidateCountry,
    ValidatePhone,
    ToastService,
    CompanyProfileMessages,
    PasswordMessages,
    ProfileMessages,
} from '@optimroute/shared';
import { Observable, Subject } from 'rxjs';
import { map, startWith, tap, takeUntil, take } from 'rxjs/operators';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ErrorStateMatcher } from '@angular/material';
import { ProfileService } from '../profile.service';
import { StateCompaniesFacade, StateCompaniesService } from '@optimroute/state-companies';
import { Companies } from 'libs/state-companies/src/lib/+state/state-companies.reducer';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * The UserSettings Component contains the basic user profile settings of the app.
 * It delivers information about the session, lets the user change his profile
 * information and even includes a form to change user password.
 * @example
 *  <easyroute-profile-settings></easyroute-profile-settings>
 */

class Matcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

@Component({
    selector: 'easyroute-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
    profile$: Observable<Profile>;
    profileSnapShot: {
        profile: Profile['profile'];
        address: Profile['address'];
        company: Profile['company'];
    };

    private unsubscribe$ = new Subject<void>();

    email: string;

    profileSettingsGroup: FormGroup;

    profileMessages: any;

    companiesForm: FormGroup;

    company$: Observable<Companies>;

    companiesMessages: any;

    countries: string[] = [];

    filteredCountries: Observable<string[]>;

    matcher = new Matcher();

    changePasswordForm: FormGroup;

    passwordMessages: any;

    servicesType: any = [];

    created_by: any;

    created_at: string;
    profile: any;
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    prefix: any;
    countrys: any = [];
    countrysWithPhone: any = [];
    countrysWithCode: any = [];

    date = new Date();

    currencies: any[];

    template: any = this._sanitizer.bypassSecurityTrustHtml(
        this._translate.instant('TEMPLATE.PROFILE_COMPANY_ASOCIATED')
    );


    async refreshDataProfile(profile: {
        profile: Profile['profile'];
        address: Profile['address'];
        company: Profile['company'];
    }) {
        this.profile = profile;
        console.log(this.profile, 'this.profile');
        this.prefix = this.countrysWithPhone.find(x => x.country === profile.profile.country) ? '+' + this.countrysWithPhone.find(x => x.country === profile.profile.country).code : '+34';
        this.profileSettingsGroup = this.fb.group({
            name: [
                profile.profile.name,
                [
                    Validators.required,
                    Validators.pattern('[A-Za-z ]+'),
                    Validators.maxLength(50),
                    Validators.minLength(2),
                ],
            ],
            surname: [
                profile.profile.surname,
                [
                    Validators.required,
                    Validators.pattern('[A-Za-z ]+'),
                    Validators.maxLength(50),
                    Validators.minLength(2),
                ],
            ],
            nationalId: [
                profile.profile.nationalId,
                [
                    //Validators.required,
                    Validators.maxLength(50),
                ],
            ],
            /*  phone: [
                 profile.profile.phone,
                 [   ValidatePhone(
                     profile.profile.country ? profile.profile.country : 'España'
                     ),
                     Validators.required
                 ],
             ], */
            phone: [
                profile.profile.phone ? profile.profile.phone : this.prefix,
            ],
        });

        this.profileSettingsGroup.updateValueAndValidity();

        const validationMessagesProfile = new ProfileMessages();
        this.profileMessages = validationMessagesProfile.getUserMessages();
        this.detectChange.detectChanges();
    }

    async refreshCompany(profile: {
        profile: Profile['profile'];
        address: Profile['address'];
        company: Profile['company'];
    }) {

        // companies Form

        this.companiesForm = this.fb.group({
            id: [profile.company.id, [Validators.required]],
            name: [profile.company.name, [Validators.required]],
            country: [profile.company.country, [Validators.required]],
            countryCode: [profile.company.countryCode],
            province: [profile.company.province, [Validators.required]],
            streetAddress: [
                profile.company.streetAddress,
                [Validators.required, Validators.minLength(10)],
            ],
            zipCode: [profile.company.zipCode, [Validators.required]],
            serviceTypeId: [profile.company.serviceTypeId ? profile.company.serviceTypeId : '', [Validators.required]],
            billingEmail: [
                profile.company.billingEmail,
                [Validators.required, Validators.email],
            ],
            createdAt: { value: this.created_at ? this.created_at : '', disabled: true },
            createdBy: {
                value: this.created_by ? this.created_by.email : '',
                disabled: true,
            },
            logo: [''],
            currencyId: [profile && profile.company && profile.company.currency && profile.company.currency.id ? profile.company.currency.id : 1,
            [Validators.required]],
            nif: [profile.company.nif || ''],
            phone: [
                profile.company.phone ? profile.company.phone : this.prefix,
            ],
        });

        this.companiesForm.updateValueAndValidity();
        const validationMessagesCompany = new CompanyProfileMessages();
        this.companiesMessages = validationMessagesCompany.getCompanyProfileMessages();
        this.detectChange.detectChanges();
        if (!this.canEdit()) {
            this.companiesForm.disable();
        }
        this.changeCountry(profile.company.country);
    }

    filterCountries(value: string) {
        const filterValue = value.toLowerCase();
        return this.countries.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }
    canEdit() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 2 || role === 1) !==
            undefined
            : false;
    }
    cancel() {
        this.refreshCompany(this.profileSnapShot);
        this.refreshDataProfile(this.profileSnapShot);

    }

    update() {
        const newElement: Profile = {
            profile: {
                name: this.profileSettingsGroup.get('name').value,
                surname: this.profileSettingsGroup.get('surname').value,
                nationalId: this.profileSettingsGroup.get('nationalId').value,
                phone: this.profileSettingsGroup.get('phone').value,
            },
        };
        let partialProfile = this.compareProfiles(this.profileSnapShot, newElement);

        if (Object.keys(partialProfile).length !== 0) {
            this.facade.updateProfile(partialProfile as Partial<Profile>);
            this.toastService.displayWebsiteRelatedToast(
                this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                this._translate.instant('GENERAL.ACCEPT')
            );
        }
    }
    updateCompany(changeLogo: boolean = false) {
        const newElement: CompanyProfile = {
            id: this.companiesForm.get('id').value,
            name: this.companiesForm.get('name').value,
            country: this.companiesForm.get('country').value,
            countryCode: this.companiesForm.get('countryCode').value,
            province: this.companiesForm.get('province').value,
            streetAddress: this.companiesForm.get('streetAddress').value,
            zipCode: this.companiesForm.get('zipCode').value,
            serviceTypeId: this.companiesForm.get('serviceTypeId').value,
            billingEmail: this.companiesForm.get('billingEmail').value,
            accountNumber: null,
            logo: this.companiesForm.get('logo').value,
            currencyId: Number(this.companiesForm.get('currencyId').value),
            termsAccepted: this.profile.company.termsAccepted,
            nif: this.companiesForm.get('nif').value,
            phone: this.companiesForm.get('phone').value,
        };

        this.companyFacade.editCompany(newElement.id, newElement);
        this.companyFacade.updated$.pipe(take(1)).subscribe((updated) => {

            this.profileSnapShot.company = newElement;
            if (!changeLogo) {
                this.profileSnapShot.company = newElement;
            }

            this.refreshCompany(this.profileSnapShot);
            this.toastService.displayWebsiteRelatedToast(
                this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                this._translate.instant('GENERAL.ACCEPT')
            );
            this.detectChange.detectChanges();
            setTimeout(() => {
                return this.facade.loadAll();
            }, 4000);
        });

    }

    changeCountry(value: string) {
        this.companiesForm.get('countryCode').setValue(
            this.countrysWithCode.find(x => x.country === value).key
        );
        if (value === 'España') {
            this.companiesForm.controls['nif'].setValidators([
                ValidateCompanyId(
                    value
                        ? value
                        : 'España'
                ),
                Validators.required,
            ]);
            this.companiesForm.get('nif').updateValueAndValidity();

        } else {
            this.companiesForm.get('nif').setValidators([
                Validators.required]);
            this.companiesForm.get('nif').updateValueAndValidity();
        }

        this.detectChange.detectChanges();
    }

    compareProfiles(
        oldProfile: Profile | Profile['profile'] | Profile['address'],
        newProfile: Profile | Profile['profile'] | Profile['address'],
    ): Partial<Profile | Profile['profile'] | Profile['address']> {
        let partialProfile: Partial<Profile | Profile['profile'] | Profile['address']> = {};
        for (let key in oldProfile) {
            if (
                typeof oldProfile['key'] !== 'object' &&
                oldProfile[key] !== newProfile[key]
            )
                partialProfile[key] = newProfile[key];
            else if (typeof oldProfile[key] === 'object') {
                const partialObject = this.compareProfiles(
                    oldProfile[key],
                    newProfile[key],
                );
                if (Object.keys(partialObject).length !== 0)
                    partialProfile[key] = partialObject;
            }
        }
        return partialProfile;
    }

    constructor(
        private fb: FormBuilder,
        private facade: ProfileSettingsFacade,
        private easyrouteFacade: StateEasyrouteFacade,
        private toastService: ToastService,
        private _translate: TranslateService,
        private _profile: ProfileService,
        private companyFacade: StateCompaniesFacade,
        private companiesService: StateCompaniesService,
        public authLocal: AuthLocalService,
        private detectChange: ChangeDetectorRef,
        private _sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.prefix = '+34';
        /*  this.easyrouteFacade.isAuthenticated$
             .pipe(takeUntil(this.unsubscribe$))
             .subscribe((isAuthenticated) => {
                 if (isAuthenticated) {
                     this.facade.loadAll();
                 }
             }); */
        this.companiesService
            .loadServiceType()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                // console.log(data); type service
                this.servicesType = data.data;
            });
        this.profile$ = this.facade.profile$;
        this.profile$.pipe(
            take(1),
            // tap( ( data ) => console.log( data ) )
        ).subscribe((profile) => {
            if (profile) {


                console.log(profile); // obtiene toda la data de perfil  
                this.email = profile.email;
                this.profileSnapShot = {
                    profile: profile.profile,
                    address: profile.address,
                    company: profile.company,
                };
                this.created_at = profile.company.createdAt
                    ? profile.company.createdAt.substring(0, 10)
                    : '';
                this.created_by = profile.company.createdBy
                    ? profile.company.createdBy
                    : {};
                this.countrys = UtilData.getCountry();
                this.countrysWithPhone = UtilData.getCountryPhoneCode();
                this.countrysWithCode = UtilData.getCountryWithCode();
                this.refreshCompany({
                    profile: profile.profile,
                    address: profile.address,
                    company: profile.company,
                });
                this.refreshDataProfile({
                    profile: profile.profile,
                    address: profile.address,
                    company: profile.company,
                });
                this.detectChange.detectChanges();
            }
        });

        this.getCurrency();
    }

    getCurrency() {
        this._profile.getCurrency().pipe(take(1)).subscribe(
            ({ data }) => {
                console.log(data);
                this.currencies = data;
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(error.error, error.error.error);
            }
        )
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    formIsCorrect(): boolean {
        return !(
            this.profileSettingsGroup.get('name').invalid ||
            this.profileSettingsGroup.get('surname').invalid ||
            this.profileSettingsGroup.get('nationalId').invalid ||
            this.profileSettingsGroup.get('phone').invalid
        );
    }

    fileChanceEvent(fileInput: any) {
        this.imageError = null;
        if (fileInput.target.files && fileInput.target.files[0]) {
            // Size Filter Bytes
            const max_size = 1000000;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 300;
            const max_width = 300;


            // no cambia la imagen si concuerda con algunas de las condicionales
            if (fileInput.target.files[0].size > max_size) {
                this.imageError = 'Tamaño máximo permitido ' + max_size / 1000 / 1000 + 'Mb';
                this.removeImage();
                return false;
            }

            if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
                this.imageError = 'Formatos permitidos ( JPG | PNG )';
                this.removeImage();
                return false;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = (rs) => {

                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];

                    if (img_height > max_height || img_width > max_width) {

                        this.imageError =
                            this._translate.instant('GENERAL.RECOMMENDED_SIZE')
                             /* +
                            
                            max_height +
                            'px x ' +
                            max_width +
                            'px' */;

                        this.detectChange.detectChanges();
                        //  this.removeImage();
                        const imgBase64Path = e.target.result;
                        this.cardImageBase64 = imgBase64Path;
                        this.companiesForm.get('logo').setValue(imgBase64Path);
                        this.isImageSaved = true;
                        this.updateCompany(true);
                        this.detectChange.detectChanges();
                        return true;

                    } else {
                        const imgBase64Path = e.target.result;
                        this.cardImageBase64 = imgBase64Path;
                        this.companiesForm.get('logo').setValue(imgBase64Path);
                        this.isImageSaved = true;
                        this.updateCompany(true);
                        this.detectChange.detectChanges();
                    }
                };
            };

            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    removeImage() {
        this.companiesForm.get('logo').setValue('');
        this.cardImageBase64 = null;
        this.isImageSaved = false;
    }

    isAdminAdministrative() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 2) !== undefined
            : false;
    }
}
