import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle } from '@optimroute/backend';

@Component({
  selector: 'easyroute-service-type-vehicle',
  templateUrl: './service-type-vehicle.component.html',
  styleUrls: ['./service-type-vehicle.component.scss']
})
export class ServiceTypeVehicleComponent implements OnInit {

  vehicle: Vehicle;
  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.vehicle);
  }

  close(){
    this.dialogRef.close();
  }

}

