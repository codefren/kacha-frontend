import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-show-loads',
  templateUrl: './modal-show-loads.component.html',
  styleUrls: ['./modal-show-loads.component.scss']
})
export class ModalShowLoadsComponent implements OnInit {

  data: any;

  totalLoad: any;

  constructor(
    public dialogRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

}

close(value: any) {
  this.dialogRef.close(value);
}
}
