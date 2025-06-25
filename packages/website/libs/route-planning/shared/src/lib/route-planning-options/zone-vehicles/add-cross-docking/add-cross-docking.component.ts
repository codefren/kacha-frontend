import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-add-cross-docking',
  templateUrl: './add-cross-docking.component.html',
  styleUrls: ['./add-cross-docking.component.scss']
})
export class AddCrossDockingComponent {

  constructor(
    public dialogRef: NgbActiveModal
  ) { }

  crossdocking: number = 0;

  close(response, value){
    
    this.dialogRef.close([response, value]);
  }

  validateCross(){

    let diable : boolean = false;

    const regex = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?$/;

    const monto: any = this.crossdocking;

    if (regex.test(monto) && parseFloat(monto) <= 9999999.999) {

      diable = false;

    } else {

      diable = true;

    }

    return diable;
  }
}
