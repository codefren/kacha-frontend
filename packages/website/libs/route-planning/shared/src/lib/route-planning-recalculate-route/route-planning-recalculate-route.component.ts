import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

/**
 * Class responsible to show warnings when validation does not pass and you still have focus on input.
 */
class MyErrorStateMatcher implements ErrorStateMatcher {
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
    selector: 'easyroute-route-planning-recalculate-route',
    templateUrl: './route-planning-recalculate-route.component.html',
    styleUrls: ['./route-planning-recalculate-route.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningRecalculateRouteComponent implements OnInit {
    /**
     * Holds the maximum number of delivery points of the zone
     */
    @Input()
    maxDeliveryPoints: number = 1;

    /**
     * Holds the id of the routing Output that has to be recalculated
     */
    @Input()
    routingOutputId: number;

    /**
     * Holds the id of the zone that has to be recalculated
     */
    @Input()
    zoneId: number;

    /**
     * Holds the actual delivery point from where the route will be recalculated
     */
    index: number = 1;

    /**
     * Form control used to validate input
     */
    deliveryPointsFormControl: FormControl;

    /**
     * Custom Error State Matcher, used so that warnings appear when typing and not when focus is lost from input
     */
    matcher = new MyErrorStateMatcher();

    /**
     * @ignore
     */
    constructor() //public dialog: MatDialog
    {}

    /**
     * initializes FormControl
     */
    ngOnInit() {
        this.deliveryPointsFormControl = new FormControl(this.index, [
            Validators.min(1),
            Validators.max(this.maxDeliveryPoints),
            Validators.required,
        ]);
    }

    /**
     * Recalculates the route
     */
    recalculateRoute() {
        // let dialogRef = this.dialog.open(EditDeliveryPointComponent, {
        //     data: {
        //         routingOuputId: 0,
        //         zoneId: 0,
        //     },
        // });
        // dialogRef.afterClosed().subscribe(() => {
        //     console.log('The dialog has been closed');
        // });
    }

    /**
     * Updates index with the new value got by input
     * @param newValue
     */
    onChange(newValue: number) {
        this.index = newValue;
    }

    isDisabled() {
        this.deliveryPointsFormControl.hasError('max') ||
            this.deliveryPointsFormControl.hasError('min') ||
            this.deliveryPointsFormControl.hasError('required');
    }
}
