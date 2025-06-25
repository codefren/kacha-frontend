import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DeliveryPointsManagement } from '@optimroute/backend';

@Component({
    selector: 'easyroute-management-delivery-points',
    templateUrl: './management-delivery-points.component.html',
    styleUrls: ['./management-delivery-points.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementDeliveryPointsComponent implements OnInit {
    // columns = [
    //     {
    //         name: 'Identifier',
    //         type: 'string',
    //         attributeName: 'identifier',
    //         validators: [
    //             Validators.required,
    //             Validators.minLength(1),
    //             Validators.maxLength(30),
    //         ],
    //     },
    //     {
    //         name: 'Name',
    //         type: 'string',
    //         attributeName: 'name',
    //         validators: [
    //             Validators.required,
    //             Validators.minLength(2),
    //             Validators.maxLength(150),
    //         ],
    //     },
    //     {
    //         name: 'Address',
    //         type: 'string',
    //         attributeName: 'address',
    //         validators: [
    //             Validators.required,
    //             Validators.minLength(5),
    //             Validators.maxLength(200),
    //         ],
    //     },
    //     {
    //         name: 'Service time',
    //         type: 'number',
    //         attributeName: 'serviceTime',
    //         validators: [Validators.required, Validators.min(0), Validators.max(86399)],
    //     },
    //     {
    //         name: 'Demand',
    //         type: 'number',
    //         attributeName: 'demand',
    //         validators: [Validators.required, Validators.min(0)],
    //     },
    //     {
    //         name: 'Priority',
    //         type: 'number',
    //         attributeName: 'priority',
    //         validators: [
    //             Validators.required,
    //             Validators.min(1),
    //             Validators.max(3),
    //             Validators.maxLength(1),
    //         ],
    //     },
    //     {
    //         name: 'Comments',
    //         type: 'string',
    //         attributeName: 'comments',
    //         validators: [
    //             Validators.required,
    //             Validators.minLength(2),
    //             Validators.maxLength(150),
    //         ],
    //     },
    // ];

    // deliveryPoints$: Observable<DeliveryPointsManagement>;

    //constructor(private facade: ManagementFacade) {}
    constructor() {}

    ngOnInit() {
        //this.deliveryPoints$ = this.facade.deliveryPoints$;
    }

    addDeliveryPoint(deliveryPoint: DeliveryPointsManagement) {}
}
