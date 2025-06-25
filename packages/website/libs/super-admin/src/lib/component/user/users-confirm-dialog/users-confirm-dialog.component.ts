import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '@optimroute/backend';


@Component({
    selector: 'easyroute-users-confirm-dialog',
    templateUrl: './users-confirm-dialog.component.html',
    styleUrls: ['./users-confirm-dialog.component.scss'],
})
export class UsersConfirmDialogComponent implements OnInit {
    title: string;
    info: string;
    body1: string;
    body2: string;
    body3: string;
    body4: string;
    user: User;
    buttonAccept: string;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
    }

    closeModal(confirm: boolean) {
        this.activeModal.close(confirm);
    }
}
