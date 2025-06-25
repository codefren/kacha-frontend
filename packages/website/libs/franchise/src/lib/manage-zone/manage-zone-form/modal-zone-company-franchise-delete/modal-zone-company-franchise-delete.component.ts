import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-zone-company-franchise-delete',
  templateUrl: './modal-zone-company-franchise-delete.component.html',
  styleUrls: ['./modal-zone-company-franchise-delete.component.scss']
})
export class ModalZoneCompanyFranchiseDeleteComponent implements OnInit {

  title: string;
  message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
