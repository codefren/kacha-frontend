import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { NavigationExtras, Router } from '@angular/router';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Subject } from 'rxjs';
declare var init_plugins: any;
@Component({
    selector: 'easyroute-delivery-made',
    templateUrl: './delivery-made.component.html',
    styleUrls: ['./delivery-made.component.scss']
})
export class DeliveryMadeComponent implements OnInit, OnChanges, OnDestroy {
    deliveryMade: any;
    show: boolean = true;
    showCosts: boolean = false;
    unsubscribe$ = new Subject<void>();
    @Input() date: string = '';
    @Input() updateNumber: number;
    sortAtoZ: string = null;
    leastToMost: string = 'desc';

    constructor(
        private _router: Router,
        private backend: BackendService,
        private toastService: ToastService,
        private detectChanges: ChangeDetectorRef,
        private preferencesFacade: PreferencesFacade
    ) { }

    ngOnInit() {

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
        })

        setTimeout(function () {
            init_plugins();
        }, 1);
    }

    ngOnChanges() {

        setTimeout(function () {
            init_plugins();
        }, 1);
        this.load();
    }

    load() {

        this.show = false;

        this.backend.post('dashboard_route/delivery_made', { date: this.date, sortAtoZ: this.sortAtoZ, leastToMost: this.leastToMost }).pipe(take(1)).subscribe((data) => {

            this.deliveryMade = data;

            this.show = true;

            this.detectChanges.detectChanges();

        }, error => {


            this.show = true;

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }
    operRouter(data: any) {

        console.log(data, 'travel-tracking');

        console.log(data.statusRouteId, 'statusRouteId')

        const navigationExtras: NavigationExtras = {

            state: {

                id: data.id,
                redirectDas: true

            }

        };


        switch (data.statusRouteId) {

            case 3:

                this._router.navigate([`/travel-tracking/${data.id}`], navigationExtras);

                break;

            case 2:

                this._router.navigate([`/travel-tracking/${data.id}`], navigationExtras);

                break;

            default:
                break;
        }

        // this._router.navigate([`/control-panel/assigned`]);

    }
    decimal(number: any) {

        return number.toFixed(2).replace('.', ',');
    }

    showName(data: any) {

        if (data) {
            setTimeout(function () {
                init_plugins();
            }, 1);
            return data.name + ' ' + data.surname;
        } else {
            return 'No disponible';
        }

    }

    getAll(event: any) {
        console.log(event, 'evento')
        switch (event) {

            case "sortAtoZAsc":


                this.sortAtoZ = null;
                this.leastToMost = 'desc';

                //this.detectChanges.detectChanges();
                break;

            case "sortAtoZDesc":

                this.sortAtoZ = null;
                this.leastToMost = 'asc';
                //this.detectChanges.detectChanges();
                break;

            case "leastToMostAsc":


                this.sortAtoZ = 'asc';
                this.leastToMost = null;
                //this.detectChanges.detectChanges();

                break;

            case "leastToMostDesc":


                this.sortAtoZ = 'desc';
                this.leastToMost = null;
                //this.detectChanges.detectChanges();

                break;


            default:
                break;
        }

        this.load();

    }

    ngOnDestroy() {
        this.unsubscribe$.complete();
        this.unsubscribe$.next();
    }


}
