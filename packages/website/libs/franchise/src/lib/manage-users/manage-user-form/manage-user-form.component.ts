import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    FormControl,
    FormArray,
} from '@angular/forms';
import {
    UserMessages,
    UtilData,
    LoadingService,
    ToastService,
    ValidatePhone,
    ValidateCompanyId,
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
} from '@optimroute/shared';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { User, BackendService, Company, Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { takeUntil, take, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { StateCompaniesService } from '@optimroute/state-companies';
//import { UsersService } from '../../users.service';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
//import { UsersConfirmDialogComponent } from '../users-confirm-dialog/users-confirm-dialog.component';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUsersService } from '../manage-users.service';
import { UsersConfirmDialogComponent } from '../manage-user-list/users-confirm-dialog/users-confirm-dialog.component';
declare function init_plugins();

@Component({
    selector: 'easyroute-manage-user-form',
    templateUrl: './manage-user-form.component.html',
    styleUrls: ['./manage-user-form.component.scss']
})
export class ManageUserFormComponent implements OnInit {

    createUserFormGroup: FormGroup;
    companies: Company[];
    profiles: any;
    usuario_messages: any;
    userMe: any;
    user: User;
    me: boolean;
    countrys: any = [];
    countrysWithPhone: any = [];
    countrysWithCode: any = [];
    prefix: any;
    unsubscribe$ = new Subject<void>();
    status: string;
    option: string;
    profile: Profile;
    isTecnical: boolean = false;
    showPreparator: boolean = false;
    titleTranslate: string = 'USERS.ADD_USER';
    loadingSchedule: boolean = false;
    toggleSchedule: boolean = true;
    userType: any

    constructor(
        private fb: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _profileSettingsFacade: ProfileSettingsFacade,
        private backendService: BackendService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private translate: TranslateService,
        private _company: StateCompaniesService,
        private userService: ManageUsersService,
        private usersFacade: StateUsersFacade,
        public authLocal: AuthLocalService,
        private loading: LoadingService,
        private toast: ToastService,
        private companyService: StateCompaniesService,
        private stateUserService: StateUsersService,
        private dialog: NgbModal,
        private router: Router,
        private detectChange: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadingService.showLoading();

        setTimeout(() => {
            init_plugins();
        }, 1000);

        this.setUtilData();

        this._profileSettingsFacade.profile$.pipe(take(1)).subscribe(
            (resp) => {
                this.profile = resp;
                this.userMe = resp;
                this.validateRoute();
            },
            (error) => {
                console.log(error);
            },
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    validateRoute() {
        this._activatedRoute.params.subscribe(({ id, me }) => {
            this.me = me ? true : false;

            if (id === 'new') {
                this.isTecnical = false;
                this.user = new User();
                this.initForm(this.user);
                this.loadingService.hideLoading();
            } else {
                this.titleTranslate = 'USERS.EDIT_USER';
                this.backendService.get(`users/${id}`).subscribe(
                    ({ data }) => {
                        console.log(data.company.id, 'company');
                        this.user = {
                            email: data.email,
                            name: data.name,
                            surname: data.surname,
                            nationalId: data.nationalId,
                            phone: data.phone,
                            companyId: data.company.id,
                            isActive: data.isActive,
                            country: data.profile.country,
                            countryCode: data.company.countryCode,
                            allowedQuantityOrders: data.allowedQuantityOrders,
                            profiles: data.profiles,
                            id: data.id,
                            useSchedule: data.useSchedule,
                            userType:data.userType
                        };

                        if (data.profiles && data.profiles.find((x) => x.id === 6)) {
                            console.log('aqui');
                            this.isTecnical = true;
                        }
                        this.initForm(this.user);
                        this.loadingService.hideLoading();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            }
        });
    }

    setUtilData() {
        this.countrys = UtilData.getCountry();
        this.countrysWithPhone = UtilData.getCountryPhoneCode();
        this.countrysWithCode = UtilData.getCountryWithCode();
    }

    setCompanies() {
        this._company
            .loadCompaniesFranchiseLIst(this.me)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                ({ data }) => (this.companies = data),
                (error) => console.log(error),
            );
    }

    initForm(user: User) {

        this.status =
            +user.isActive === 1
                ? this.translate.instant('GENERAL.IS_ACTIVE')
                : this.translate.instant('GENERAL.IS_INACTIVE');
        this.option =
            +user.isActive === 1
                ? this.translate.instant('USERS.DEACTIVATE_USER')
                : this.translate.instant('USERS.ACTIVATE_USER');
        this.prefix = this.countrysWithPhone.find((x) => x.country === user.country)
            ? '+' + this.countrysWithPhone.find((x) => x.country === user.country).code
            : '+34';

        this.createUserFormGroup = this.fb.group({
            email: [user.email, [Validators.email, Validators.required]],
            name: [
                user.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
            ],
            surname: [
                user.surname,
                [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
            ],
            nationalId: [
                user.nationalId,
                [
                    ValidateCompanyId(user.country ? user.country : 'España'),
                ],
            ],
            phone: [
                user.phone ? user.phone : this.prefix,
                [
                    ValidatePhone(user.country ? user.country : 'España'),
                    Validators.required,
                ],
            ],
            country: [
                user.country ? user.country : this.profile.company.country,
                [Validators.required],
            ],
            idCompany: [
                user.companyId ? user.companyId : '',
                [Validators.required, Validators.min(1)],
            ],
            countryCode: [user.countryCode ? user.countryCode : 'ES'],
            profiles: this.fb.array([]),
            password: ['', this.setPasswordValidators(user.id)],
            password_confirmation: ['', this.checkPasswords.bind(this)],
            isActive: [user.isActive],
            allowedQuantityOrders: [user.allowedQuantityOrders],
            useSchedule: [user.useSchedule ? true : false],
            activeScheduleMonday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 1) ? true : false],
            activeScheduleTuesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 2) ? true : false],
            activeScheduleWednesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 3) ? true : false],
            activeScheduleThursday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 4) ? true : false],
            activeScheduleFriday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 5) ? true : false],
            activeScheduleSaturday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 6) ? true : false],
            activeScheduleSunday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 7) ? true : false],
            userTypeId:[user.userType !=null ? user.userType.id :1 ]
        });

        if (this.me && !this.isAdmin()) {
            this.createUserFormGroup.controls['idCompany'].disable();
        } else {
            this.createUserFormGroup.controls['idCompany'].enable();
        }
        this.userService.loadProfiles().subscribe(({ data }) => {
            this.profiles = data;
            this.addProfiles(user.profiles);
        });

        this.userService.getUser().subscribe(({ data }) => {
            this.userType = data;
            
        });

        this.setCompanies();
        this.usuario_messages = new UserMessages().getUserMessages();

        if(this.user.useSchedule){
            this.loadingSchedule = true;
            this.backendService.get('user_schedule/' + this.user.id).pipe((take(1))).subscribe(datos =>{
                console.log(datos);
                this.user.schedule = {
                    days: datos.data
                }
                this.createUserFormGroup.get('activeScheduleMonday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 1 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleTuesday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 2 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleWednesday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 3 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleThursday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 4 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleFriday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 5 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleSaturday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 6 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleSunday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 7 && x.isActive === true) ? true : false);
                this.loadingSchedule = false;
            })
        }

    }

    setPasswordValidators(id: number) {
        if (id > 0) {
            return [Validators.minLength(8)];
        }

        return [Validators.required, Validators.minLength(8)];
    }

    checkPasswords(group: AbstractControl) {
        let pass = group.root.value.password;
        let confirmPass = group.value;

        return pass === confirmPass ? null : { confirmar: true };
    }

    changeCountry(value: string) {
        this.createUserFormGroup
            .get('countryCode')
            .setValue(this.countrysWithCode.find((x) => x.country === value).key);

        if (value != 'España') {
            this.prefix = this.countrysWithPhone.find((x) => x.country === value)
                ? '+' + this.countrysWithPhone.find((x) => x.country === value).code
                : '';
            this.createUserFormGroup.get('phone').setValue(this.prefix);
            this.createUserFormGroup
                .get('nationalId')
                .setValidators([Validators.maxLength(50)]);
            this.createUserFormGroup.get('nationalId').updateValueAndValidity();
        } else {
            this.prefix = '+34';
            this.createUserFormGroup.get('phone').setValue(this.prefix);
            this.createUserFormGroup
                .get('nationalId')
                .setValidators([ValidateCompanyId('España'), Validators.maxLength(50)]);
            this.createUserFormGroup.get('nationalId').updateValueAndValidity();
        }

        this.createUserFormGroup
            .get('phone')
            .setValidators([
                ValidatePhone(
                    UtilData.COUNTRIES[
                    this.countrysWithCode.find(
                        (x) =>
                            x.country === this.createUserFormGroup.get('country').value,
                    ).key
                    ],
                ),
                Validators.required,
            ]);

        this.createUserFormGroup.get('phone').updateValueAndValidity();
    }

    addProfiles(profiles: any[]) {

        this.profiles.map((o, i) => {
            let control: FormControl;
            if (profiles) {
                control = new FormControl(
                    profiles.find((x) => x.name === o.name) != undefined,
                );

            } else {
                control = new FormControl(false);
            }
            (this.createUserFormGroup.controls.profiles as FormArray).push(control);

        });
    }

    selectPreparator(event: any, name: any) {
        console.log(name, 'nombre')
        if (event && name === 'Preparador') {
            this.showPreparator = true;
        } else if (!event && name === 'Preparador') {
            this.showPreparator = false;
        }

    }

    getPreparator(selectedOrderIds: any) {
        const dato = selectedOrderIds.find(x => x.name === 'Preparador') != undefined;

        let preparatorName = selectedOrderIds.find(x => x.name === 'Preparador');
        preparatorName ? Object.assign({}, name) : false

        if (preparatorName && preparatorName.name != undefined) {
            this.selectPreparator(dato, preparatorName.name);
        }
    }

    createUser(): void {
        if (this.user.id && this.user.id > 0) {
            this.userService.updateUserFranquise(this.user.id, this.obtainNewUser())
                .pipe(take(1))
                .subscribe((data) => {
                    if (data) {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('USERS.USER_UPDATED'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        if (this.me) {
                            this.router.navigateByUrl('management/users');
                        } else {
                            this.router.navigateByUrl('franchise/manage-users');
                        }
                    }
                });
            /* this.usersFacade.updated$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    if (data) {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('USERS.USER_UPDATED'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        if (this.me) {
                            this.router.navigateByUrl('management/users');
                        } else {
                            this.router.navigateByUrl('franchise/manage-users');
                        }
                    }
                }); */
        } else {

            this.userService.addUserFranquise(this.obtainNewUser())
                    .pipe(take(1))
                    .subscribe((data) => {
                        if (data) {
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant(
                                    'USERS.USER_CREATED',
                                ),
                                this.translate.instant(
                                    'GENERAL.ACCEPT',
                                ),
                            );
                            if (this.me) {
                                this.router.navigateByUrl(
                                    'franchise/manage-users',
                                );
                            } else {
                                console.log(this.me, 'asasas');
                                this.router.navigateByUrl(
                                    'franchise/manage-users',
                                );
                            }
                        }
                    });

 
        }
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
            idCompany: this.createUserFormGroup.get('idCompany').value,
            password: this.createUserFormGroup.get('password').value,
            password_confirmation: this.createUserFormGroup.get('password_confirmation')
                .value,
            isActive: this.createUserFormGroup.get('isActive').value,
            country: this.createUserFormGroup.get('country').value,
            countryCode: this.createUserFormGroup.get('countryCode').value,
            allowedQuantityOrders: this.createUserFormGroup.get('allowedQuantityOrders').value,
            userTypeId: this.createUserFormGroup.get('userTypeId').value
        };
        if (user.password == '') {
            delete user.password;
        }
        if (user.password_confirmation == '') {
            delete user.password_confirmation;
        }
        return user;
    }
    /* 
      addUser(user: User) {
          this.usersFacade.addUser(user);
      }
    
      editUser(obj: [number, Partial<User>]) {
          this.usersFacade.editUser(obj[0], obj[1]);
      } */

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
        this.getPreparator(selectedOrderIds);

        return selectedOrderIds;
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }

    inactiveUser(user: User, i?: number) {
        let profiles = this.getProfiles();
        let profileAccept =
            profiles &&
                profiles.length > 1 &&
                profiles.find((x) => x.id === 6) === undefined
                ? true
                : profiles.length > 1 && profiles.find((x) => x.id === 6)
                    ? true
                    : profiles.length === 1 && profiles.find((x) => x.id !== 6)
                        ? true
                        : false;

        let title = 'USERS.DEACTIVATE_USER_QUESTION';
        let info = 'USERS.DEACTIVATE_USER_INFO';
        let buttonAccept = 'GENERAL.DEACTIVATE';

        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0 &&
            profileAccept
        ) {
            this.loading.showLoading();

            console.log('******** Gestion ********');
            this.companyService
                .costPlan()
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        this.loading.hideLoading();
                        const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static',
                        });

                        dialogRef.componentInstance.title = title;
                        dialogRef.componentInstance.user = user;
                        dialogRef.componentInstance.info = info;
                        dialogRef.componentInstance.buttonAccept = buttonAccept;
                        dialogRef.result
                            .then((resp) => {
                                if (resp) {
                                    this.loading.showLoading();
                                    this.stateUserService
                                        .deactivate(user.id)
                                        .pipe(take(1))
                                        .subscribe(
                                            () => {
                                                this.loading.hideLoading();
                                                this.validateRoute();
                                            },
                                            (error) => {
                                                this.loading.hideLoading();
                                                this.toast.displayHTTPErrorToast(
                                                    error.status,
                                                    error.error.error,
                                                );
                                            },
                                        );
                                }
                            })
                            .catch((error) => console.log(error));
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        } else {

            console.log('******** Gestion de usuarios ********');
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loading.showLoading();
                        this.stateUserService
                            .deactivate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loading.hideLoading();
                                    this.validateRoute();
                                },
                                (error) => {
                                    this.loading.hideLoading();
                                    this.toast.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    activeUser(user: User, i?: number) {
        let profiles = this.getProfiles();
        let profileAccept =
            profiles &&
                profiles.length > 1 &&
                profiles.find((x) => x.id === 6) === undefined
                ? true
                : profiles.length > 1 && profiles.find((x) => x.id === 6)
                    ? true
                    : profiles.length === 1 && profiles.find((x) => x.id !== 6)
                        ? true
                        : false;

        let title = 'USERS.ACTIVATE_USER_QUESTION';
        let info = 'USERS.ACTIVATE_USER_INFO';
        let buttonAccept = 'GENERAL.ACTIVATE';

        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0 &&
            profileAccept
        ) {
            this.loading.showLoading();
            this.companyService
                .costPlan()
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        this.loading.hideLoading();
                        const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static',
                        });
                        dialogRef.componentInstance.title = title;
                        dialogRef.componentInstance.info = info;
                        dialogRef.componentInstance.user = user;
                        dialogRef.componentInstance.buttonAccept = buttonAccept;
                        dialogRef.result
                            .then((resp) => {
                                if (resp) {
                                    this.loading.showLoading();
                                    this.stateUserService
                                        .activate(user.id)
                                        .pipe(take(1))
                                        .subscribe(
                                            () => {
                                                this.loading.hideLoading();
                                                this.validateRoute();
                                            },
                                            (error) => {
                                                this.loading.hideLoading();
                                                this.toast.displayHTTPErrorToast(
                                                    error.status,
                                                    error.error.error,
                                                );
                                            },
                                        );
                                }
                            })
                            .catch((error) => console.log(error));
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        } else {
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loading.showLoading();
                        this.stateUserService
                            .activate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loading.hideLoading();
                                    this.validateRoute();
                                },
                                (error) => {
                                    this.loading.hideLoading();
                                    this.toast.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    changeUseSchedule() {
        if (this.user.id > 0 && this.createUserFormGroup.get('useSchedule').value && !this.user.schedule) {
            this.loadingSchedule = true;
            this.backendService.put('user_schedule_day/user/' + this.user.id).pipe(take(1)).subscribe(response => {
                this.user.schedule = {
                    days: response.data
                };
                this.createUserFormGroup.get('activeScheduleMonday').setValue(response.data.find(x => x.intDay === 1 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleTuesday').setValue(response.data.find(x => x.intDay === 2 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleWednesday').setValue(response.data.find(x => x.intDay === 3 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleThursday').setValue(response.data.find(x => x.intDay === 4 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleFriday').setValue(response.data.find(x => x.intDay === 5 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleSaturday').setValue(response.data.find(x => x.intDay === 6 && x.isActive === true) ? true : false);
                this.createUserFormGroup.get('activeScheduleSunday').setValue(response.data.find(x => x.intDay === 7 && x.isActive === true) ? true : false);
                this.loadingSchedule = false;
                this.detectChange.detectChanges();
            });
        }

    }

    validtimeStart(hours) {
        return hours.timeStart > hours.timeEnd || hours.timeStart === -1 ? true : false;
    }

    validtimeEnd(hours) {
        return hours.timeEnd < hours.timeStart || hours.timeEnd === -1 ? true : false;
    }

    showToggleSchedule() {

        this.toggleSchedule = !this.toggleSchedule;
    }

    changeScheduleDay(value, dayNumber) {
        console.log(this.user.schedule);
        let schedule = this.user.schedule.days.find(x => x.intDay == dayNumber);

        if (this.user.id > 0) {
            this.backendService.put('user_schedule_day/' + schedule.id, {
                isActive: value
            }).pipe(take(1)).subscribe((response) => {
                schedule.isActive = value;
                if (!schedule.hours || (schedule.hours && schedule.hours.length === 0)) {
                    this.addScheduleToDay(dayNumber, schedule);
                }
                this.detectChange.detectChanges();
            })
        } else {
            if (schedule) {
                schedule.isActive = value;
            } else {
                this.user.schedule.days.push({
                    intDay: dayNumber,
                    isActive: value,
                    id: 0,
                    hours: [{
                        timeStart: -1,
                        timeEnd: -1,
                        id: 0
                    }]
                })
            }

            this.detectChange.detectChanges();
        }


    }

    deleteHours(intDay, hours) {
        let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
        if (hours.id > 0) {
            this.backendService.delete('user_schedule_hour/' + hours.id).pipe(take(1)).subscribe(response => {
                const index = schedule.hours.indexOf(hours);
                schedule.hours.splice(index, 1);
                this.detectChange.detectChanges();
            });
        } else {
            const index = schedule.hours.indexOf(hours);
            schedule.hours.splice(index, 1);
            this.detectChange.detectChanges();
        }

    }

    sortBy(prop: string) {
        return this.user.schedule.days.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
    }

    getDayName(dayNumber) {
        let name = '';
        switch (dayNumber) {
            case 1: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.MONDAY');
                break
            };
            case 2: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.TUESDAY');
                break
            };
            case 3: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.WEDNESDAY');
                break
            };
            case 4: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.THURSDAY');
                break
            };
            case 5: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.FRIDAY');
                break
            };
            case 6: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.SATURDAY');
                break
            };
            case 7: {
                name = this.translate.instant('SCHEDULE_WORK.DAY.SUNDAY');
                break
            };
        }

        return name;
    }

    secondToTime(value) {
        return secondsToDayTimeAsString(value);
    }

    addScheduleToDay(intDay: number, item: any) {
        let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
        if (this.user.id > 0) {
            this.backendService.post('user_schedule_hour', {
                userScheduleDayId: item.id
            }).pipe(take(1)).subscribe((response) => {
                schedule.hours.push(response.data);
                this.detectChange.detectChanges();
            })
        } else {
            schedule.hours.push({
                timeStart: -1,
                timeEnd: -1
            });
        }

    }

    validIntervalHours(hour, day) {
        let index = day.hours.indexOf(hour);
        let exist = false;
        day.hours.forEach((element, i) => {
            if (index !== i && !exist) {
                exist = (element.timeStart <= hour.timeStart && element.timeEnd >= hour.timeStart) ? true : false;
            }
        });
        return exist;
    }


    changeHour(value, hour: any, day, time: string){
        const index = day.hours.indexOf(hour);
        
        if(hour.id > 0) {

            if(time === 'start'){
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
            if(day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0){
                this.backendService.put('user_schedule_hour/' + hour.id, day.hours[index])
                    .pipe(take(1))
                    .subscribe((response)=>{
                }, error => {
                    this.toast.displayHTTPErrorToast(error.status, error.error.error)
                })
            }
            
        } else {
            if(time === 'start'){
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
        }
    }

}
