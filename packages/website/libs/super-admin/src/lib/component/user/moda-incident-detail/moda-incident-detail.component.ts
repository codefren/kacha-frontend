import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'easyroute-moda-incident-detail',
  templateUrl: './moda-incident-detail.component.html',
  styleUrls: ['./moda-incident-detail.component.scss']
})
export class ModaIncidentDetailComponent implements OnInit {


  info: any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.info, 'informacion para dibujarse ');
  }
  closeModal(confirm: boolean) {
    this.activeModal.close(confirm);
}

formatDate(date: string){
  return moment(date).format('DD/MM/YYYY');
}

formaHour(hour: string){
  return moment(hour).format('HH:mm');
}

}
