import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-modules',
  templateUrl: './modal-modules.component.html',
  styleUrls: ['./modal-modules.component.scss']
})
export class ModalModulesComponent implements OnInit {

  @Input() modules: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {}

}
