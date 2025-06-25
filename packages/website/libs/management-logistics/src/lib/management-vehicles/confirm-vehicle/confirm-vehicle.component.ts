import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'easyroute-confirm-vehicle',
  templateUrl: './confirm-vehicle.component.html',
  styleUrls: ['./confirm-vehicle.component.scss']
})
export class ConfirmVehicleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmVehicleComponent>) { }

  ngOnInit() {
  }
  closeDialog(value: any) {
    this.dialogRef.close(value);
  }
}
