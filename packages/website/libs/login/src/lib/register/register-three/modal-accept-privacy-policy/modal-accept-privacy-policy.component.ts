import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-accept-privacy-policy',
  templateUrl: './modal-accept-privacy-policy.component.html',
  styleUrls: ['./modal-accept-privacy-policy.component.scss']
})
export class ModalAcceptPrivacyPolicyComponent implements OnInit {

  img: string;

  constructor(public activeModal: NgbActiveModal) { 
    this.img = 'url(assets/images/background/fondo-login.png)';
  }

  ngOnInit() {
  }

  cancelTerms() {
    this.activeModal.close();
  }

}
