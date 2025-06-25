import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-measure-modal-active',
  templateUrl: './measure-modal-active.component.html',
  styleUrls: ['./measure-modal-active.component.scss']
})
export class MeasureModalActiveComponent implements OnInit {

  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
