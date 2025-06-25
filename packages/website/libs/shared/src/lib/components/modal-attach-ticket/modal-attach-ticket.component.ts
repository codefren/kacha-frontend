import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-attach-ticket',
  templateUrl: './modal-attach-ticket.component.html',
  styleUrls: ['./modal-attach-ticket.component.scss']
})
export class ModalAttachTicketComponent implements OnInit {

  @Input() data: any;
  @Input() title: any;


  constructor( public activeModal: NgbActiveModal ) { }

  ngOnInit() {

  }

  close(){
    this.activeModal.close(false);
  }

}
