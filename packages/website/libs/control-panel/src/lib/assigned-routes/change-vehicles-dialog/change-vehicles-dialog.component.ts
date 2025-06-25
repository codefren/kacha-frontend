import { Component, OnInit, Input, Inject } from '@angular/core';
import { StateVehiclesService } from '@optimroute/state-vehicles';
import { Vehicle } from '../../../../../backend/src/lib/types/vehicles.type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-change-vehicles-dialog',
  templateUrl: './change-vehicles-dialog.component.html',
  styleUrls: ['./change-vehicles-dialog.component.scss']
})
export class ChangeVehiclesDialogComponent implements OnInit {

  availableVehicles: Vehicle[] = []
  selectedAvailableVehicles: Boolean[] = [];
  idVehicleSelected:number;
  nameVehicleSelected: string;
  data: any;

  constructor(
              private service: StateVehiclesService,
              private routingPlanning: StateRoutePlanningService,
              public activateModal: NgbActiveModal     
            ) { }

  ngOnInit() {
    this.getvehicles();
  }
  getvehicles(){

    this.service.loadVehicles().subscribe((data)=>{
    
      this.availableVehicles = data.data;
  
    });
  }
  
  selectedVehicle(id:number, name:string){
    this.idVehicleSelected = id;
    this.nameVehicleSelected= name;
  }
  
  addSelection() {
   
    this.routingPlanning.changeVehicles(this.data.RouteId, this.idVehicleSelected , this.nameVehicleSelected).subscribe((data)=>{
      this.activateModal.close(data);
    });
  
  }
  
  cancelSelection() {
    this.activateModal.close();
  }
  
}
