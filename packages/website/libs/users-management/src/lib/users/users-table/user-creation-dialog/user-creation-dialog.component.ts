import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { Company, User } from '@optimroute/backend';
import { ToastService, ValidatePhone, UtilData, ValidateCompanyId, UserMessages } from '@optimroute/shared';
import {
    FormGroupDirective,
    FormControl,
    NgForm,
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
    AbstractControl,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { StateCompaniesService } from '@optimroute/state-companies';
import { UsersService } from '../../users.service';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateUsersFacade } from '@optimroute/state-users';
import { takeUntil } from 'rxjs/operators';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

class Matcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        return (
            control.dirty && form.invalid
        );
    }
}

@Component({
    selector: 'easyroute-user-creation-dialog-component',
    templateUrl: './user-creation-dialog.component.html',
    styleUrls: ['./user-creation-dialog.component.scss'],
})

export class UserCreationDialogComponent implements OnInit, OnDestroy {
    createUserFormGroup: FormGroup;
    userMe: any;
    companies: Company[];
    matcher = new ErrorStateMatcher();
    me: boolean;
    countries: string[] = [];
    filteredCountries: Observable<string[]>;
    profiles: any;
    unsubscribe$ = new Subject<void>();
    data: any;
    usuario_messages: any;

    countrys: any = [];
    countrysWithPhone: any = [];
    countrysWithCode: any = [];
    prefix: any;
    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private _company: StateCompaniesService,
        private userService: UsersService,
        private _profileSettingsFacade: ProfileSettingsFacade,
        private usersFacade: StateUsersFacade,
        public authLocal: AuthLocalService,
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.countrys = UtilData.getCountry();
        this.countrysWithPhone = UtilData.getCountryPhoneCode();
        this.countrysWithCode = UtilData.getCountryWithCode();
        let profile = this._profileSettingsFacade.profile$;
        profile
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
            this.userMe = resp;
            this.me = this.data.me;
            // console.log( this.me );
            this.initForm(this.data.user);
        });
    }
    changeCountry(value) {
        this.createUserFormGroup.get('countryCode').setValue(this.countrysWithCode.find(x => x.country === value).key);
        if (value != 'España') {

            this.prefix = this.countrysWithPhone.find(x => x.country === value) ? '+'+this.countrysWithPhone.find(x => x.country === value).code : '';
            this.createUserFormGroup.get('phone').setValue(this.prefix);
            this.createUserFormGroup.get('nationalId').setValidators([Validators.required, Validators.maxLength(50)]);
            this.createUserFormGroup.get('nationalId').updateValueAndValidity();
        } else {
            this.prefix = '+34';
            this.createUserFormGroup.get('phone').setValue(this.prefix);
            this.createUserFormGroup.get('nationalId').setValidators([
                ValidateCompanyId(
                    'España',
                ),
                Validators.required, Validators.maxLength(50)]);
            this.createUserFormGroup.get('nationalId').updateValueAndValidity();            
            
        }
        this.createUserFormGroup.get('phone').setValidators([
            ValidatePhone(
                UtilData.COUNTRIES[
                    this.countrysWithCode.find(x => x.country === this.createUserFormGroup.get('country').value).key
                ]
            ),
            Validators.required
        ]);

        this.createUserFormGroup.get('phone').updateValueAndValidity();
        
    }
    initForm(data: User) {
        this.prefix = this.countrysWithPhone.find(x => x.country === data.country) ? '+'+this.countrysWithPhone.find(x => x.country === data.country).code : '+34';
        this.createUserFormGroup = this.fb.group(
            {
                email: [data.email, [Validators.email, Validators.required]],
                name: [
                    data.name,
                    [
                        Validators.required,
                        Validators.pattern('[A-Za-z ]+'),
                        Validators.minLength(2),
                        Validators.maxLength(50),
                    ],
                ],
                surname: [
                    data.surname,
                    [
                        Validators.required,
                        Validators.pattern('[A-Za-z ]+'),
                        Validators.minLength(2),
                        Validators.maxLength(50),
                    ],
                ],
                nationalId: [ data.nationalId,
                    [
                        ValidateCompanyId(
                            data.country? data.country : 'España',
                        ),
                        Validators.required,
                        Validators.maxLength(50),
                    ]
                ],
                phone: [
                    data.phone?data.phone:this.prefix,
                    [
                        ValidatePhone(
                            data.country? data.country : 'España',
                        ),
                        Validators.required
                    ],
                ],
                country: [
                    data.country ? data.country : this.userMe.company.country,
                    [ Validators.required ]
                ],
               companyId: [
                    this.me ? this.userMe.profile.companyId : data.company.id,
                   [
                       Validators.required,
                       Validators.min(1)
                   ]
                ],
                countryCode: [data.countryCode ? data.countryCode : 'ES'],
                profiles: this.fb.array([]),
                password: ['', [Validators.minLength(8)]],
                password_confirmation: ['', this.checkPasswords.bind(this)],
                isActive: [data.isActive],
            }

        );

        if(this.me && !this.isAdmin()){
            this.createUserFormGroup.controls['companyId'].disable();
        }else{
            this.createUserFormGroup.controls['companyId'].enable();
        }

        this._company.loadCompanies(this.me)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
            this.companies = resp.data;
        });

        this.createUserFormGroup.controls['companyId'].setValidators([Validators.required]);
        this.userService.loadProfiles().subscribe((resp) => {
            this.profiles = resp.data;
            this.addProfiles();
        });

        if (!data.id || data.id == 0) {
            this.createUserFormGroup
                .get('password')
                .setValidators([Validators.required, Validators.minLength(8)]);
            this.createUserFormGroup
                .get('password_confirmation')
                .setValidators([Validators.required, this.checkPasswords.bind(this)],);
        }

        let usuario_messages = new UserMessages();
        this.usuario_messages = usuario_messages.getUserMessages();
        // this.changeCountry(this.createUserFormGroup.get('country').value ? this.createUserFormGroup.get('country').value : 'España');
    }

    createUser(): void {
        if (this.data.id && this.data.id > 0) {
            this.editUser([this.data.id, this.obtainNewUser()]);
            this.usersFacade.updated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.closeDialog([1]);
                }
            });
        } else {
            this.addUser(this.obtainNewUser());
            this.usersFacade.added$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
                if (data) {
                    this.closeDialog([1]);
                }
            });
        }
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }

    getProfiles() {
        const selectedOrderIds = this.createUserFormGroup.value.profiles
            .map((v, i) =>
                v
                    ? {
                          id: this.profiles[i].id,
                          name: this.profiles[i].name,
                      }
                    : null,
            )
            .filter((v) => v !== null);
        return selectedOrderIds;
    }

    obtainNewUser(): User {
        let user: User = {
            email: this.createUserFormGroup.get('email').value,
            name: this.createUserFormGroup.get('name').value,
            nationalId:
                this.createUserFormGroup.get('nationalId').value === ''
                    ? null
                    : this.createUserFormGroup.get('nationalId').value,
            phone: this.createUserFormGroup.get('phone').value,
            surname: this.createUserFormGroup.get('surname').value,
            profiles: this.getProfiles(),
            companyId: this.createUserFormGroup.get('companyId').value,
            password: this.createUserFormGroup.get('password').value,
            password_confirmation: this.createUserFormGroup.get('password_confirmation')
                .value,
            isActive: this.createUserFormGroup.get('isActive').value,
            country: this.createUserFormGroup.get('country').value,
            countryCode: this.createUserFormGroup.get('countryCode').value
        };
        if (user.password == '') {
            delete user.password;
        }
        if (user.password_confirmation == '') {
            delete user.password_confirmation;
        }
        return user;
    }

    addProfiles() {
        this.profiles.map((o, i) => {
            let control: FormControl;
            if (this.data.user.profile) {
                control = new FormControl(
                    this.data.user.profile.find((x) => x.name === o.name) != undefined,
                );
            } else {
                control = new FormControl(false);
            }
            (this.createUserFormGroup.controls.profiles as FormArray).push(control);
        });
    }

    isFormInvalid(): boolean {
        return !this.createUserFormGroup.valid;
    }

    checkPasswords(group: AbstractControl) {
        let pass = group.root.value.password;
        let confirmPass = group.value;

        return pass === confirmPass ? null : { confirmar: true };
    }
    
    addUser(user: User) {
        this.usersFacade.addUser(user);
    }

    editUser(obj: [number, Partial<User>]) {
        this.usersFacade.editUser(obj[0], obj[1]);
    }

    ngOnDestroy(){
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 3 || role === 8 ) !==
                  undefined
            : false;
    }
}
