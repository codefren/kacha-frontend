import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-table-vehicle-ticket',
  templateUrl: './modal-table-vehicle-ticket.component.html',
  styleUrls: ['./modal-table-vehicle-ticket.component.scss']
})
export class ModalTableVehicleTicketComponent implements OnInit {
  
  @Input() data: any;

  constructor( public activeModal: NgbActiveModal ) { }

  ngOnInit() {

    console.log(this.data)
  }

  close(){
    this.activeModal.close(false);
  }

}
