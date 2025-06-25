import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Subject } from 'rxjs';

@Component({
    selector: 'easyroute-total-billing',
    templateUrl: './total-billing.component.html',
    styleUrls: ['./total-billing.component.scss']
})
export class TotalBillingComponent implements OnInit, OnChanges, OnDestroy {

    @Input() date: string = '';
    @Input() updateNumber: number;

    show: boolean = true;

    data: any;
    showCosts: boolean = false;
    unsubscribe$ = new Subject<void>();

    constructor(
        private backend: BackendService,
        private toastService: ToastService,
        private detectChanges: ChangeDetectorRef,
        private preferencesFacade: PreferencesFacade
    ) { }

    ngOnInit() {
        this.preferencesFacade.loadDashboardPreferences();
        this.preferencesFacade.loaded$.pipe(take(2)).subscribe(async (load) => {
            if (load) {
                this.preferencesFacade.dashboard$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {

                    try {
                        this.showCosts = data.showCosts;
                        this.detectChanges.detectChanges();
                    } catch (error) {

                    }
                });

            }
        });
    }

    ngOnChanges() {
        this.load();
    }
    load() {

        this.show = false;

        this.backend.post('dashboard_route/total_billing', { date: this.date }).pipe(take(1)).subscribe((data) => {

            this.data = data;

            this.show = true;

            this.detectChanges.detectChanges();

        }, error => {


            this.show = true;

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    decimal(number: any) {

        return number.toFixed(2);
    }

    ngOnDestroy() {
        this.unsubscribe$.complete();
        this.unsubscribe$.next();

    }

}
