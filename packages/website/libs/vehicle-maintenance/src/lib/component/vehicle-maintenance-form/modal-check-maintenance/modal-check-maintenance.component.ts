import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-check-maintenance',
  templateUrl: './modal-check-maintenance.component.html',
  styleUrls: ['./modal-check-maintenance.component.scss']
})
export class ModalCheckMaintenanceComponent implements OnInit {

  title: string = '';
  subTitle: string = '';
  message: string = '';
  titleBotton: string = '';


  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }

}
