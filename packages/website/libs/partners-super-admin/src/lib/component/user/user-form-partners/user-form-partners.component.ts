import { StateUsersService } from './../../../../../../state-users/src/lib/state-users.service';
import { AuthLocalService } from './../../../../../../auth-local/src/lib/auth-local.service';
import { StateUsersFacade } from './../../../../../../state-users/src/lib/+state/state-users.facade';
import { StateCompaniesService } from './../../../../../../state-companies/src/lib/state-companies.service';
import { ToastService } from './../../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from './../../../../../../shared/src/lib/services/loading.service';
import { BackendService } from './../../../../../../backend/src/lib/backend.service';
import { ProfileSettingsFacade } from './../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Profile } from './../../../../../../backend/src/lib/types/profile.type';
import { User } from './../../../../../../backend/src/lib/types/user.type';
import { Company } from './../../../../../../backend/src/lib/types/companies.type';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '@optimroute/env/environment';
declare function init_plugins();
declare var $: any;
import * as moment from 'moment';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'libs/users-management/src/lib/users/users.service';
import { UtilData } from 'libs/shared/src/lib/validators/util-data';
import { UserMessages, ValidateCompanyId, ValidatePhone, dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '@optimroute/shared';
import { UsersConfirmDialogComponent } from '../users-confirm-dialog/users-confirm-dialog.component';
import { UserModalDocumentComponent } from '../user-modal-document/user-modal-document.component';
import { UserModalConfirmDocumentComponent } from '../user-modal-confirm-document/user-modal-confirm-document.component';
@Component({
  selector: 'easyroute-user-form-partners',
  templateUrl: './user-form-partners.component.html',
  styleUrls: ['./user-form-partners.component.scss']
})
export class UserFormPartnersComponent implements OnInit {

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
  toggleSchedule: boolean = true;
  loadingSchedule: boolean = false;
  table: any;
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
    private userService: UsersService,
    private usersFacade: StateUsersFacade,
    public authLocal: AuthLocalService,
    private loading: LoadingService,
    private toast: ToastService,
    private companyService: StateCompaniesService,
    private stateUserService: StateUsersService,
    private dialog: NgbModal,
    private router: Router,
    private detectChange: ChangeDetectorRef
  ) { }

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

showToggleSchedule() {

    this.toggleSchedule = !this.toggleSchedule;
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
            this.backendService.get(`users_partner_show/${id}`).subscribe(
                ({ data }) => {
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
                        userType:data.userType,
                        monthlyObjective: data.monthlyObjective,
                        commissionOrdersPercentage: data.commissionOrdersPercentage,
                        commissionOrdersAppPercentage: data.commissionOrdersAppPercentage
                    };


                    if (data.profiles && data.profiles.find((x) => x.id === 6)) {
                        this.isTecnical = true;
                    }
                    this.initForm(this.user);
                    
                    try{
                        this.detectChange.detectChanges();
        
                        
                        this.cargarDocument();
                    
                    } catch(e){
            
                    }
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
        .loadCompaniesPartners(this.me)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            ({ data }) => (this.companies = data),
            (error) => console.log(error),
        );
}

secondToTime(value) {
    return secondsToDayTimeAsString(value);
}

addScheduleToDay(intDay: number, item: any) {
    let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
    if (this.user.id > 0) {
        this.backendService.post('user_schedule_hour_super_admin', {
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

changeHour(value, hour: any, day, time: string) {
    const index = day.hours.indexOf(hour);

    if (hour.id > 0) {

        if (time === 'start') {
            day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
        } else {
            day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
        }
        if (day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0) {
            this.backendService.put('user_schedule_hour/' + hour.id, day.hours[index])
                .pipe(take(1))
                .subscribe((response) => {
                }, error => {
                    this.toast.displayHTTPErrorToast(error.status, error.error.error)
                })
        }

    } else {
        if (time === 'start') {
            day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
        } else {
            day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
        }
    }
}

changeScheduleDay(value, dayNumber) {
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
            if (schedule.hours && schedule.hours.length == 0) {
                schedule.hours.push({
                    timeStart: -1,
                    timeEnd: -1,
                    id: 0
                })
            }
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
    console.log(prop, 'prod');
    console.log(this.user.schedule.days);
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
                Validators.maxLength(50),
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
        companyId: [
            this.me ? this.userMe.profile.companyId : user.companyId ? user.companyId:'',
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
        //serviceTypeId: [dataCompany.serviceType !== null ? dataCompany.serviceType.id : ''],
        userTypeId:[user.userType !=null ? user.userType.id :'' ],
        monthlyObjective:[ user.monthlyObjective ? user.monthlyObjective: null ,[ Validators.min(0) , Validators.max(99999) ]],
        commissionOrdersPercentage:[ user.commissionOrdersPercentage ? user.commissionOrdersPercentage: null , [ Validators.min(0), Validators.max(99999)]],
        commissionOrdersAppPercentage:[ user.commissionOrdersAppPercentage ? user.commissionOrdersAppPercentage: null, [ Validators.min(0), Validators.max(99999)]]
    });



    if (this.me && !this.isAdmin()) {
        this.createUserFormGroup.controls['companyId'].disable();
    } else {
        this.createUserFormGroup.controls['companyId'].enable();
    }
    this.userService.loadProfiles().subscribe(({ data }) => {
        this.profiles = data;
        this.addProfiles(user.profiles);
    });

    this.userService.getUser().subscribe(({ data }) => {
        this.userType = data;
        
    });


    if (this.user.useSchedule) {
        this.loadingSchedule = true;
        this.backendService.get('user_schedule/' + this.user.id).pipe((take(1))).subscribe(datos => {
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
    } else {
        if (this.user.id === 0 && (!this.user.schedule || !this.user.schedule.days || this.user.schedule.days.length === 0)) {
            this.user.schedule =
            {
                days: [
                    {
                        hours: [],
                        id: 0,
                        intDay: 1,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 2,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 3,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 4,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 5,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 6,
                        isActive: false,
                    },
                    {
                        hours: [],
                        id: 0,
                        intDay: 7,
                        isActive: false,
                    }
                ]
            }
        }
    }

    this.setCompanies();
    this.usuario_messages = new UserMessages().getUserMessages();
    
}

setPasswordValidators(id: number) {
    if (id > 0) {
        return [Validators.minLength(8)];
    }

    return [Validators.required, Validators.minLength(8)];
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
    } else {
        /* llenar el user echuedule con data nummy para que se dubujen los recuadros */
    }

}

validtimeStart(hours) {
    return hours.timeStart > hours.timeEnd || hours.timeStart === -1 ? true : false;
}

validtimeEnd(hours) {
    return hours.timeEnd < hours.timeStart || hours.timeEnd === -1 ? true : false;
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

    this.loadingService.showLoading();

    if (this.user.id && this.user.id > 0) {

        this.backendService.put('users_partner/'+ this.user.id, this.obtainNewUser()).pipe(take(1)).subscribe(
            (data: any) => {

                this.loadingService.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('USERS.USER_UPDATED'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                if (this.me) {
                    this.router.navigateByUrl('partners-super-admin/user');
                } else {
                    this.router.navigateByUrl('partners-super-admin/user');
                }
                
                
            },
            (error) => {
                this.loadingService.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );
       /*  this.editUser([this.user.id, this.obtainNewUser()]);
        this.usersFacade.updated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('USERS.USER_UPDATED'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    if (this.me) {
                        this.router.navigateByUrl('partners-super-admin/user');
                    } else {
                        this.router.navigateByUrl('partners-super-admin/user');
                    }
                }
            }); */
    } else {

        this.backendService.post('users_partner', this.obtainNewUser()).pipe(take(1)).subscribe(
            (data: any) => {

                this.loadingService.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('USERS.USER_CREATED'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                if (this.me) {
                    this.router.navigateByUrl('partners-super-admin/user');
                } else {
                    this.router.navigateByUrl('partners-super-admin/user');
                }
                
                
            },
            (error) => {
                this.loadingService.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );
        /* this.addUser(this.obtainNewUser());
        this.usersFacade.added$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('USERS.USER_CREATED'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    if (this.me) {
                        this.router.navigateByUrl('partners-super-admin/user');
                    } else {
                        this.router.navigateByUrl('partners-super-admin/user');
                    }
                }
            }); */

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
        companyId: this.createUserFormGroup.get('companyId').value,
        password: this.createUserFormGroup.get('password').value,
        password_confirmation: this.createUserFormGroup.get('password_confirmation')
            .value,
        isActive: this.createUserFormGroup.get('isActive').value,
        country: this.createUserFormGroup.get('country').value,
        countryCode: this.createUserFormGroup.get('countryCode').value,
        allowedQuantityOrders: this.createUserFormGroup.get('allowedQuantityOrders').value,
        useSchedule: this.createUserFormGroup.get('useSchedule').value,
        userTypeId: this.createUserFormGroup.get('userTypeId').value,
        monthlyObjective: this.createUserFormGroup.get('monthlyObjective').value,
        commissionOrdersPercentage: this.createUserFormGroup.get('commissionOrdersPercentage').value,
        commissionOrdersAppPercentage: this.createUserFormGroup.get('commissionOrdersAppPercentage').value
    };

    if (this.user.id && this.user.id > 0) {
        user.id = this.user.id ;
    }

    if (this.user.id === 0 && this.user.schedule && this.user.schedule.days
        && this.user.schedule.days.length > 0 && this.createUserFormGroup.value.useSchedule) {

        this.user.schedule.days.forEach(day => {
            let hours = day.hours.filter(x => x.timeStart >= 0 && x.timeEnd >= 0);
            day = {
                ...day,
                hours: hours
            }

        });

        user.schedule = {
            ...this.user.schedule,
            days: this.user.schedule.days.filter(x => x.hours.length > 0)
        }
    }

    if (!this.createUserFormGroup.value.useSchedule) {
        delete this.user.schedule;
    }


    if (user.password == '') {
        delete user.password;
    }
    if (user.password_confirmation == '') {
        delete user.password_confirmation;
    }



    return user;
}

addUser(user: User) {
    this.usersFacade.addUser(user);
}

editUser(obj: [number, Partial<User>]) {
    this.usersFacade.editUser(obj[0], obj[1]);
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

cargarDocument() {
    
let url = environment.apiUrl + 'user_doc_datatables?userId=' + this.user.id;

let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
let table = '#userDocument';

this.table = $(table).DataTable({
    destroy: true,
    serverSide: true,
    processing: true,
    stateSave: true,
    cache: false,
    order: [[ 0, "desc" ]],
    lengthMenu: [5],
    stateSaveParams: function (settings, data) {
        data.search.search = "";
    },
    dom: `
        <"top-button-hide"><'point no-scroll-x table-responsive't>
        <'row reset'
            <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
        >
    `,
    buttons: [
        {
            extend: 'colvis',
            text: this.translate.instant('GENERAL.SHOW/HIDE'),
            columnText: function(dt, idx, title) {
                return idx + 1 + ': ' + title;
            },
        },
    ],
    language: environment.DataTableEspaniol,
    ajax: {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authorization: tok,
        },
        error: (xhr, error, thrown) => {
            let html = '<div class="container" style="padding: 10px;">';
            html +=
                '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
            html +=
                '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
            html += '</div>';

            $('#companies_processing').html(html);
        },
    },
    columns: [
        {
            data: 'id',
            visible: false
        },
        {
            data: 'name',
            title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_NAME'),
            render: (data, type, row) => {
                let name = data;
                if (name.length > 65) {
                    name = name.substr(0, 67) + '...';
                }
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    data +
                    '">' +
                    name +
                    '</span>'
                );
            },
        },
        {
            data: 'date',
            title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPLOAD_DATE'),
            render: (data, type, row) => {
                return moment(data).format('DD/MM/YYYY');
            },
        },
        {
            data: null,
            sortable: false,
            searchable: false,
            title: this.translate.instant('GENERAL.ACTIONS'),
            className: 'dt-body-center',
            render: (data, type, row) => {
                let botones = '';
                
                botones += `<div class="row backgroundColorRow pr-4 pl-4">`;
                
                /*  botones += `
                    <div class="text-center edit col p-0 pt-1">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                    </div>
                `; */
                
                botones += `
                    <div class="text-center download col p-0 pt-1 mr-1 ml-1">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg">
                    </div>
                `;

                botones += `
                    <div class="text-center delete col p-0 pt-1">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/delete-blue.svg">
                    </div>
                `;

                botones += `</div>`;
                return botones;
            },
        },
    ],
});

this.initEvents('#userDocument tbody', this.table);
}

addDocument() {
let document = {
    id: '',
    userId: this.user.id,
    name: '',
    date: '',
    document: ''
};
const dialogRef = this.dialog.open(UserModalDocumentComponent, {
    backdropClass: 'customBackdrop',
    centered: true,
    size: 'md',
    backdrop: 'static',
    windowClass:'modal-document',
});
dialogRef.componentInstance.document = document;
dialogRef.componentInstance.showBtn = true;

dialogRef.componentInstance.title = this.translate.instant(
    'RATES_AND_MODULES.DOCUMENT.ADD_DOCUMENT',
);

dialogRef.result.then((data) => {

    if (data) {
        this.userService
        .addCompanyDoc(data)
        .subscribe(
            (data: any) => {
                
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('RATES_AND_MODULES.DOCUMENT.SUCCESSFUL_REGISTRATION'),
                );
                //this.cargarDocument();
                this.table.ajax.reload();
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );

    }
},
    (error) => {
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
    },
);

}

initEvents(tbody: any, table: any, that = this) {
$(tbody).unbind();
this.edit(tbody, table);
this.download(tbody, table);
this.delete(tbody, table);
}

edit(tbody: any, table: any, that = this) {
$(tbody).on('click', 'div.edit', function() {
    let data = table.row($(this).parents('tr')).data();
    data = {
        ...data,
        date: moment(data.date)
    }
    that.editElement(data);
});
}

editElement(document: any): void {
const dialogRef = this.dialog.open(UserModalDocumentComponent, {
    backdropClass: 'customBackdrop',
    centered: true,
    size: 'md',
    backdrop: 'static',
    windowClass:'modal-document',
});

dialogRef.componentInstance.document = document;
dialogRef.componentInstance.showBtn = true;

dialogRef.componentInstance.title = this.translate.instant(
    'RATES_AND_MODULES.DOCUMENT.EDIT_DOCUMENT',
);

dialogRef.result.then((data) => {
    
    if (data) {
        this.userService
        .editCompanyDoc(data, document.id)
        .subscribe(
            (data: any) => {
                
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPDATE_SUCCESSFUL'),
                );
                // this.cargarDocument();
                this.table.ajax.reload();
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );

    }
},
    (error) => {
        if(error.status){
            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        }
        
    },
);
}

download(tbody: any, table: any, that = this) {
$(tbody).on('click', 'div.download', function() {
    let data = table.row($(this).parents('tr')).data();
    that.downloadElement(data);
});
}

downloadElement(archivo: any): void {

let link= document.createElement('a');
document.body.appendChild(link); //required in FF, optional for Chrome
link.target = '_blank';
let fileName = 'img';
link.download = fileName;
link.href = archivo.urlDocument;
link.click();
}


delete(tbody: any, table: any, that = this) {
$(tbody).on('click', 'div.delete', function() {
    let data = table.row($(this).parents('tr')).data();
    that.deleteElement(data.id);
});
}

deleteElement(documentId: any): void {
const dialogRef = this.dialog.open(UserModalConfirmDocumentComponent, {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    centered: true,
});

dialogRef.componentInstance.message = this.translate.instant(
    'RATES_AND_MODULES.DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT',
);

dialogRef.result.then(
    (data) => {
        if (data) {
            this.userService
                .destroyCompanyDoc(documentId)
                .subscribe(
                    (data: any) => {
                        
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_DELETED_SUCCESSFULLY'),
                        );
                        //this.cargarDocument();
                        this.table.ajax.reload();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
        }
    },
    (error) => {
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
    },
);
}


}
