import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-check-routes',
  templateUrl: './modal-check-routes.component.html',
  styleUrls: ['./modal-check-routes.component.scss']
})
export class ModalCheckRoutesComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();
  }

  YesVerified(){
    this.activeModal.close(true);
  }

}
