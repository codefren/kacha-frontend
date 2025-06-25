import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-force-finished',
  templateUrl: './modal-force-finished.component.html',
  styleUrls: ['./modal-force-finished.component.scss']
})
export class ModalForceFinishedComponent implements OnInit {

  title: string = '';
  subTitle: string = '';
  message: string = '';
  titleBotton: string = '';


  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }

}
