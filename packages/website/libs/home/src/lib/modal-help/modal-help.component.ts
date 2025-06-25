import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'easyroute-modal-help',
  templateUrl: './modal-help.component.html',
  styleUrls: ['./modal-help.component.scss']
})
export class ModalHelpComponent implements OnInit {
  noShowMore: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
              ) { }

  ngOnInit() {
  }

  closeModal(skip: boolean){
    this.activeModal.close(skip);
  }

}
