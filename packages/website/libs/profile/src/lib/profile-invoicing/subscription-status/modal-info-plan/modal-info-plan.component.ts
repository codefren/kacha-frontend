import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'easyroute-modal-info-plan',
    templateUrl: './modal-info-plan.component.html',
    styleUrls: ['./modal-info-plan.component.scss']
})
export class ModalInfoPlanComponent implements OnInit {

    plan: any;
    constructor() { }

    ngOnInit() {
    }

    benefits(benefits: any): string[] {
        return benefits.split(';');
    }


}
