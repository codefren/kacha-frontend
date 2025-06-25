import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, User } from '@optimroute/backend';
import { dayTimeAsStringToSeconds, LoadingService, secondsToDayTimeAsString, ToastService, UserMessages } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UsersService } from '../../../users.service';

@Component({
  selector: 'easyroute-users-hours',
  templateUrl: './users-hours.component.html',
  styleUrls: ['./users-hours.component.scss']
})
export class UsersHoursComponent implements OnInit {
  
    @Input() idParam: any;
    @Input() isActiveUser: boolean;
    @Input() userTypeSelect: any;
    
    createUserFormGroup: FormGroup;
    
    usuario_messages: any;
    
    user: User;
    profiles: any;
    
    toggleSchedule: boolean = true;
    loadingSchedule: boolean = false;
    showPreparator: boolean = false;
    
    unsubscribe$ = new Subject<void>();
    
    constructor(
        private fb: FormBuilder,
        private backendService: BackendService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private translate: TranslateService,
        public authLocal: AuthLocalService,
        private detectChange: ChangeDetectorRef,
        private usersFacade: StateUsersFacade,
        private userService: UsersService,
    ) { }

    ngOnInit() {
    }

    ngOnChanges() {

        this.loadingService.showLoading();
    
        this.validateRoute();

    }

    validateRoute() {
        if (this.idParam !== 'new') {
    
            this.backendService.get(`users/${this.idParam}`).subscribe(
                ({ data }) => {
                    this.user = {
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        surname: data.surname,
                        isActive: data.isActive,
                        profiles: data.profiles,
                        userType: data.userType,

                        useSchedule: data.useSchedule,
                    };
    
                    this.initForm(this.user);
    
                    try{
                        
                        this.detectChange.detectChanges();
                    
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
    
    }

    initForm(user: User) {
        this.createUserFormGroup = this.fb.group({
            id: [user.id],
            profiles: this.fb.array([]),
            
            useSchedule: [user.useSchedule ? true : false],
            activeScheduleMonday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 1) ? true : false],
            activeScheduleTuesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 2) ? true : false],
            activeScheduleWednesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 3) ? true : false],
            activeScheduleThursday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 4) ? true : false],
            activeScheduleFriday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 5) ? true : false],
            activeScheduleSaturday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 6) ? true : false],
            activeScheduleSunday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 7) ? true : false],
        });

        this.userService.loadProfiles().subscribe(({ data }) => {
            this.profiles = data;
            this.addProfiles(user.profiles);
        }); 
    
        if (this.user.useSchedule) {
            this.loadingSchedule = true;
            this.backendService.get('user_schedule/' + this.user.id).pipe((take(1))).subscribe(datos => {

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
                this.detectChange.detectChanges();
            })
        } else {
            /* if (this.user.id === 0 && (!this.user.schedule || !this.user.schedule.days || this.user.schedule.days.length === 0)) {
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
            } */
        }
    
        this.usuario_messages = new UserMessages().getUserMessages();
    
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

    changeUseSchedule() {
        
        if (this.user.id > 0 && this.createUserFormGroup.get('useSchedule').value && !this.user.schedule) {
            this.loadingSchedule = true;
            this.backendService.put('user_schedule_day/user/' + this.user.id).pipe(take(1)).subscribe(response => {
                console.log(response, 'response');
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

    secondToTime(value) {
        return secondsToDayTimeAsString(value);
    }
    
    addScheduleToDay(intDay: number, item: any) {
        let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
        /* if (this.user.id > 0) {
            this.backendService.post('user_schedule_hour', {
                userScheduleDayId: item.id
            }).pipe(take(1)).subscribe((response) => {
                schedule.hours.push(response.data);
                
                this.detectChange.detectChanges();
            })
        } else { */
            schedule.hours.push({
                timeStart: -1,
                timeEnd: -1
            });
        /* } */
    
    }

    changeHour(value, hour: any, day, time: string) {
        const index = day.hours.indexOf(hour);
        
        if (this.user.id > 0) {
            if (time === 'start') {
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
    
            if (hour.id > 0) {
                if (day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0) {
                    this.backendService
                        .put('user_schedule_hour/' + hour.id, day.hours[index])
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant(
                                        'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                                    ),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
                                this.detectChange.detectChanges();
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            } else {

                let schedule = this.user.schedule.days.find(
                    (x) => x.intDay == day.intDay,
                );
    
                if (
                    day.hours[index].timeStart >= 0 &&
                    day.hours[index].timeEnd >= 0 &&
                    day.hours[index].timeStart != -1 &&
                    day.hours[index].timeEnd != -1
                ) {

                    this.backendService
                        .post('user_schedule_hour', {
                            userScheduleDayId: schedule.id,
                            timeStart: schedule.hours[index].timeStart,
                            timeEnd: schedule.hours[index].timeEnd,
                        })
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                day.hours[index] = response.data;

                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant('GENERAL.REGISTRATION'),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
    
                                this.detectChange.detectChanges();
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
        }

        /* if (hour.id > 0) {

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
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error)
                    })
            }
    
        } else {
            if (time === 'start') {
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
        } */
    }
    
    changeScheduleDay(value, dayNumber) {
        let schedule = this.user.schedule.days.find(x => x.intDay == dayNumber);
    
        if (value) {
            if (this.user.id > 0) {
                this.backendService.put('user_schedule_day/' + schedule.id, {
                    isActive: value
                }).pipe(take(1)).subscribe((response) => {
                    schedule.isActive = value;
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    /* if (!schedule.hours || (schedule.hours && schedule.hours.length === 0)) {
                        this.addScheduleToDay(dayNumber, schedule);
                    } */
                    this.detectChange.detectChanges();
                })
            } else {
                if (schedule) {
                    schedule.isActive = value;
                    if (schedule.hours && schedule.hours.length == 0) {
                        /* schedule.hours.push({
                            timeStart: -1,
                            timeEnd: -1,
                            id: 0
                        }) */
                        schedule.hours = [];
                    }
                } else {
    
                    this.user.schedule.days.push({
                        intDay: dayNumber,
                        isActive: value,
                        id: 0,
                       /*  hours: [{
                            timeStart: -1,
                            timeEnd: -1,
                            id: 0
                        }] */
                        hours: [],
                    })
                }
        
                this.detectChange.detectChanges();
            }
        } else {
            if (this.user.id > 0) {
                this.backendService
                    .put('user_schedule_day/' + schedule.id, {
                        isActive: value
                    })
                    .pipe(take(1))
                    .subscribe((response) => {
                        schedule.isActive = value;
                        let data = schedule.hours.find(
                            (x) => x.timeEnd === -1 && x.timeEnd === -1,
                        );
                        const index = schedule.hours.indexOf(data);
                        if (data) {
                            schedule.hours.splice(index);
                        }
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.detectChange.detectChanges();
                    });
            } else {
                schedule.isActive = value;
                schedule.hours = [];
                this.detectChange.detectChanges();
            }
        }
    
    }

    deleteHours(intDay, hours) {
        let schedule = this.user.schedule.days.find((x) => x.intDay == intDay);
        if (hours.id > 0) {
            this.backendService
                .delete('user_schedule_hour/' + hours.id)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        const index = schedule.hours.indexOf(hours);
                        schedule.hours.splice(index, 1);
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
        } else {
            const index = schedule.hours.indexOf(hours);
            schedule.hours.splice(index, 1);
            this.detectChange.detectChanges();
        }
    }
    
    /* sortBy(prop: string) {
        console.log(prop, 'prod');
        console.log(this.user.schedule.days);
        return this.user.schedule.days.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
    } */


    sortBy(prop: number) {
        return this.user.schedule.days.filter((x) => x.intDay == prop);
    }
    
    /* getDayName(dayNumber) {
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
    } */

    /* showToggleSchedule() {
    
        this.toggleSchedule = !this.toggleSchedule;
    
    } */
    
    validtimeStart(hours) {
        return hours.timeStart > hours.timeEnd || hours.timeStart === -1 || hours.timeStart == hours.timeEnd ? true : false;
    }
    
    validtimeEnd(hours) {
        return hours.timeEnd < hours.timeStart || hours.timeEnd === -1  || hours.timeEnd == hours.timeStart ? true : false;
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

    createUser(): void {
    
        if (this.user.id && this.user.id > 0) {
 
            this.editUser([this.user.id, this.obtainNewUser()]);
            
            this.usersFacade.updated$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    if (data) {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('USERS.USER_UPDATED'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                    }
                });
        }
    
    }

    obtainNewUser(): User {
    
        let user: User = {
            email: this.user.email,
            isActive: this.isActiveUser,
            surname: this.user.surname,
            name: this.user.name,
            profiles: this.getProfiles(),
            userTypeId: this.userTypeSelect,
            
            useSchedule: this.createUserFormGroup.get('useSchedule').value,
        };
        
        if (!this.createUserFormGroup.value.useSchedule) {
            delete this.user.schedule;
        }
        
        return user;
    
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

    getPreparator(selectedOrderIds: any) {
        const dato = selectedOrderIds.find(x => x.name === 'Preparador') != undefined;
        
        let preparatorName = selectedOrderIds.find(x => x.name === 'Preparador');
        preparatorName ? Object.assign({}, name) : false
        
        if (preparatorName && preparatorName.name != undefined) {
            this.selectPreparator(dato, preparatorName.name);
        }
    }
    
    selectPreparator(event: any, name: any) {
        
        if (event && name === 'Preparador') {
            this.showPreparator = true;
        } else if (!event && name === 'Preparador') {
            this.showPreparator = false;
        }
    
    }
    
    editUser(obj: [number, Partial<User>]) {
        this.usersFacade.editUser(obj[0], obj[1]);
    }

    validateAbsolute() {
        return this.disabledBtnDaySchedule();
    }

     disabledBtnDaySchedule() {
        let disabled = false;

        if (this.user.schedule && this.user.schedule.days) {
            this.user.schedule.days.forEach((element, i) => {
                element.hours.forEach((result) => {
                    if (result.timeStart != -1 && result.timeEnd != -1) {
                        if (result.timeStart > result.timeEnd) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeStart === result.timeEnd) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeEnd < result.timeStart) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeEnd === -1 && result.timeEnd === -1) {
                            disabled = true;
                            return disabled;
                        }
                    } else {
                        disabled = true;
                        return disabled;
                    }
                });
            });
        }

        return disabled;
    }

}
