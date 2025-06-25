import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'easyroute-profile-invoicing',
    templateUrl: './profile-invoicing.component.html',
    styleUrls: ['./profile-invoicing.component.scss'],
})
export class ProfileInvoicingComponent implements OnInit {
    //private unsubscribe$ = new Subject<void>();

    constructor(
        public routerActivated: ActivatedRoute,
        public router: Router,
        private modalService: NgbModal,
    ) {  }

    ngOnInit() {
    }
}
