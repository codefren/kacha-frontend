import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GeolocationPreferences } from '@optimroute/backend';
import { LoadingService, dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-schedule-configuration',
  templateUrl: './schedule-configuration.component.html',
  styleUrls: ['./schedule-configuration.component.scss']
})
export class ScheduleConfigurationComponent implements OnInit {

    geolocationPreferences$: Observable<GeolocationPreferences>;
    
    unsubscribe$ = new Subject<void>();
    
    form: FormGroup;
    
    constructor(
    
    private facade: PreferencesFacade,
    private detectChanges: ChangeDetectorRef,
    private facadeProfile: ProfileSettingsFacade,
    private loading: LoadingService,
    
    ) { }
    
    ngOnInit() {
    
        this.geolocationPreferences$ = this.facade.geolocationPreferences$;
        
        this.facade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded) => {
            if (loaded) {
                this.load();
                this.detectChanges.detectChanges();
            }
        });
        
        this.facade.loadGeolocationPreferences();
    
    }
    
    load() {
        this.facade.loaded$.pipe(take(2)).subscribe((loaded) => {
            if (loaded) {
                this.geolocationPreferences$.pipe(take(1)).subscribe((g) => {
                    if (g) {
                        this.form = new FormGroup({
                            activeFriday: new FormControl(g.activeFriday),
                            activeMonday: new FormControl(g.activeMonday),
                            activeSaturday: new FormControl(g.activeSaturday),
                            activeSunday: new FormControl(g.activeSunday),
                            activeThursday: new FormControl(g.activeThursday),
                            activeTuesday: new FormControl(g.activeTuesday),
                            activeWednesday: new FormControl(g.activeWednesday),
                            endTimeFriday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeFriday),
                            ),
                            endTimeMonday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeMonday),
                            ),
                            endTimeSaturday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeSaturday),
                            ),
                            endTimeSunday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeSunday),
                            ),
                            endTimeThursday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeThursday),
                            ),
                            endTimeTuesday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeTuesday),
                            ),
                            endTimeWednesday: new FormControl(
                                secondsToDayTimeAsString(g.endTimeWednesday),
                            ),
                            startTimeFriday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeFriday),
                            ),
                            startTimeMonday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeMonday),
                            ),
                            startTimeSaturday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeSaturday),
                            ),
                            startTimeSunday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeSunday),
                            ),
                            startTimeThursday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeThursday),
                            ),
                            startTimeTuesday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeTuesday),
                            ),
                            startTimeWednesday: new FormControl(
                                secondsToDayTimeAsString(g.startTimeWednesday),
                            ),
                        });
        
                        if (g.activeFriday) {
                            this.activeDay(
                                g.activeFriday,
                                'startTimeFriday',
                                'endTimeFriday',
                            );
                        }
        
                        if (g.activeMonday) {
                            this.activeDay(
                                g.activeMonday,
                                'startTimeMonday',
                                'endTimeMonday',
                            );
                        }
        
                        if (g.activeSaturday) {
                            this.activeDay(
                                g.activeSaturday,
                                'startTimeSaturday',
                                'endTimeSaturday',
                            );
                        }
        
                        if (g.activeSunday) {
                            this.activeDay(
                                g.activeSunday,
                                'startTimeSunday',
                                'endTimeSunday',
                            );
                        }
        
                        if (g.activeThursday) {
                            this.activeDay(
                                g.activeThursday,
                                'startTimeThursday',
                                'endTimeThursday',
                            );
                        }
        
                        if (g.activeTuesday) {
                            this.activeDay(
                                g.activeTuesday,
                                'startTimeTuesday',
                                'endTimeTuesday',
                            );
                        }
        
                        if (g.activeWednesday) {
                            this.activeDay(
                                g.activeWednesday,
                                'startTimeWednesday',
                                'endTimeTuesday',
                            );
                        }
                    }

                    console.log(this.form, 'Iniciando')
                });
            }
        });
    }
    
    activeDay(value, startTimeName, endTimeName) {
        if (value) {
            this.form.controls[startTimeName].setValidators([
                Validators.required,
                this.startDate(
                    dayTimeAsStringToSeconds(this.form.controls[endTimeName].value),
                ),
            ]);
            this.form.controls[endTimeName].setValidators([
                Validators.required,
                this.endDate(
                    dayTimeAsStringToSeconds(this.form.controls[startTimeName].value),
                ),
            ]);
        } else {
            this.form.get(startTimeName).setValidators(null);
            this.form.get(endTimeName).setValidators(null);
        }
        this.form.get(startTimeName).updateValueAndValidity();
        this.form.get(endTimeName).updateValueAndValidity();
    }
    
    startDate(number: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (
                control.value !== undefined &&
                isNaN(control.value) &&
                dayTimeAsStringToSeconds(control.value) >= number
            ) {
                return { coxnfirmar: true };
            }
            return null;
        };
    }
    
    endDate(value: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (
                control.value !== undefined &&
                isNaN(control.value) &&
                dayTimeAsStringToSeconds(control.value) <= value
            ) {
                return { coxnfirmar: true };
            }
            return null;
        };
    }

    changeStartValue(activeValue, startTimeName, endTimeName) {
        let value = this.form.controls[activeValue].value;
        if (value) {
            this.form.controls[startTimeName].setValidators([
                Validators.required,
                this.startDate(
                    dayTimeAsStringToSeconds(this.form.controls[endTimeName].value),
                ),
            ]);
            this.form.controls[endTimeName].setValidators([
                Validators.required,
                this.endDate(
                    dayTimeAsStringToSeconds(this.form.controls[startTimeName].value),
                ),
            ]);
            this.form.get(startTimeName).updateValueAndValidity();
            this.form.get(endTimeName).updateValueAndValidity();

            
        }
    }

    submit() {

        this.loading.showLoading();
        this.facade.loaded$.pipe(take(2)).subscribe((loaded) => {
            if (loaded) {
                this.loading.hideLoading();
            }
        });

        console.log(this.form);
        this.facade.updateScheduleGeolocation({
            ...this.form.value,
            endTimeFriday: dayTimeAsStringToSeconds(this.form.value.endTimeFriday),
            endTimeMonday: dayTimeAsStringToSeconds(this.form.value.endTimeMonday),
            endTimeSaturday: dayTimeAsStringToSeconds(this.form.value.endTimeSaturday),
            endTimeSunday: dayTimeAsStringToSeconds(this.form.value.endTimeSunday),
            endTimeThursday: dayTimeAsStringToSeconds(this.form.value.endTimeThursday),
            endTimeTuesday: dayTimeAsStringToSeconds(this.form.value.endTimeTuesday),
            endTimeWednesday: dayTimeAsStringToSeconds(this.form.value.endTimeWednesday),
            startTimeFriday: dayTimeAsStringToSeconds(this.form.value.startTimeFriday),
            startTimeMonday: dayTimeAsStringToSeconds(this.form.value.startTimeMonday),
            startTimeSaturday: dayTimeAsStringToSeconds(this.form.value.startTimeSaturday),
            startTimeSunday: dayTimeAsStringToSeconds(this.form.value.startTimeSunday),
            startTimeThursday: dayTimeAsStringToSeconds(this.form.value.startTimeThursday),
            startTimeTuesday: dayTimeAsStringToSeconds(this.form.value.startTimeTuesday),
            startTimeWednesday: dayTimeAsStringToSeconds(
                this.form.value.startTimeWednesday,
            ),
        });
    }
    
    deleteHours(start, end) {
    
        this.loading.showLoading();

        this.form.get(start).setValue(null)
        this.form.get(end).setValue(null)
        
        this.facade.loaded$.pipe(take(2)).subscribe((loaded) => {
            if (loaded) {
                this.loading.hideLoading();
            }
        });
        this.facade.updateScheduleGeolocation({
            ...this.form.value,
            endTimeFriday: dayTimeAsStringToSeconds(this.form.value.endTimeFriday),
            endTimeMonday: dayTimeAsStringToSeconds(this.form.value.endTimeMonday),
            endTimeSaturday: dayTimeAsStringToSeconds(this.form.value.endTimeSaturday),
            endTimeSunday: dayTimeAsStringToSeconds(this.form.value.endTimeSunday),
            endTimeThursday: dayTimeAsStringToSeconds(this.form.value.endTimeThursday),
            endTimeTuesday: dayTimeAsStringToSeconds(this.form.value.endTimeTuesday),
            endTimeWednesday: dayTimeAsStringToSeconds(this.form.value.endTimeWednesday),
            startTimeFriday: dayTimeAsStringToSeconds(this.form.value.startTimeFriday),
            startTimeMonday: dayTimeAsStringToSeconds(this.form.value.startTimeMonday),
            startTimeSaturday: dayTimeAsStringToSeconds(this.form.value.startTimeSaturday),
            startTimeSunday: dayTimeAsStringToSeconds(this.form.value.startTimeSunday),
            startTimeThursday: dayTimeAsStringToSeconds(this.form.value.startTimeThursday),
            startTimeTuesday: dayTimeAsStringToSeconds(this.form.value.startTimeTuesday),
            startTimeWednesday: dayTimeAsStringToSeconds(
                this.form.value.startTimeWednesday,
            ),
        });
        
    }
    
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
