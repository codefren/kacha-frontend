import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'easyroute-modal-max-users',
    templateUrl: './modal-max-users.component.html',
    styleUrls: ['./modal-max-users.component.scss']
})
export class ModalMaxUsersComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    close(value) {
        this.activeModal.close(value);
    }

}
