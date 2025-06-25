import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'easyroute-active-dialog',
    templateUrl: './active-dialog-module.component.html',
    styleUrls: ['./active-dialog-module.component.scss'],
})
export class ActiveDialogModuleComponent implements OnInit {
    now: Date;
    data: any;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {}
}
