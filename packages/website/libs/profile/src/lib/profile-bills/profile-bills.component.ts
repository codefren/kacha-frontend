import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'easyroute-profile-bills',
    templateUrl: './profile-bills.component.html',
    styleUrls: ['./profile-bills.component.scss'],
})
export class ProfileBillsComponent implements OnInit {
    //private unsubscribe$ = new Subject<void>();

    constructor(
        public routerActivated: ActivatedRoute,
        public router: Router,
        private modalService: NgbModal,
    ) {  }

    ngOnInit() {
    }
}
