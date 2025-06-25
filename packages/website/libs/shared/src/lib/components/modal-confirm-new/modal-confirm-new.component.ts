import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm-new',
  templateUrl: './modal-confirm-new.component.html',
  styleUrls: ['./modal-confirm-new.component.scss']
})
export class ModalConfirmNewComponent implements OnInit {

  title: string = '';
  subTitle: string = '';
  message: string = '';
  titleBotton: string = '';


  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }


}
