import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService, Profile } from '@optimroute/backend';
import { LoadingService } from '@optimroute/shared';
import { environment } from '@optimroute/env/environment'

@Component({
    selector: 'easyroute-confirm-default-card',
    templateUrl: './confirm-default-card.component.html',
    styleUrls: ['./confirm-default-card.component.scss'],
})
export class ConfirmDefaultCardComponent implements OnInit {
    default: boolean;

    delete: boolean;

    last4: string;

    titleTranslate: string;
    profile: Profile;
    price: number;
    planName: string;

    urlTerms = environment.URL_TERMS_CONDITIONS;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }
}
