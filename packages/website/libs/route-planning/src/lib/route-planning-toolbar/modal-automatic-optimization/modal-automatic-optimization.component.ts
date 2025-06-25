import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { take } from 'rxjs/operators';
declare var init_plugins;
declare var $;
@Component({
  selector: 'easyroute-modal-automatic-optimization',
  templateUrl: './modal-automatic-optimization.component.html',
  styleUrls: ['./modal-automatic-optimization.component.scss']
})
export class ModalAutomaticOptimizationComponent implements OnInit {

  zones: any = [];
  vehicles: any = [];
  vehiclesZone: any = [];
  zonesSelected = [];
  vehiclesSelected = [];
  vehicleType = 1;
  settings: {
    useSkills: boolean,
    ignoreCapacityLimit: boolean,
    /* useAllVehicles: boolean */
  } = {
    ignoreCapacityLimit: false,
    /* useAllVehicles: true, */
    useSkills: false
  }
  constructor(public activeModal: NgbActiveModal,
    private facade: RoutePlanningFacade,
    private vehicleFacade: VehiclesFacade,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.load();
  }


  load(){
    
    init_plugins();
    
  }

  close(){
    this.activeModal.close();
  }

  changeVehicleType(value){
    this.vehicleType = value;
    this.load();
    this.changeDetectorRef.detectChanges();
  }

  haveVehicles(){
    this.vehiclesSelected = $('#vehicles').multiselect().val();

    return this.vehiclesSelected && this.vehiclesSelected.length > 0 ? true : false;
  }


  haveZone(){
    this.zonesSelected = $('#zones').multiselect().val();

    return this.zonesSelected && this.zonesSelected.length > 0 ? true : false;
  }

  submit(){

    if(!this.haveVehicles() || !this.haveZone()){
      return;
    }
    let vehicleArray = [];
    this.vehiclesSelected.forEach(element => {

      if(this.vehicleType === 1){
        vehicleArray.push(this.vehiclesZone.find(x => +x.id === +element));
      }

      if(this.vehicleType === 2){
        vehicleArray.push(this.vehicles.find(x => +x.id === +element));
      }
      
    });


    this.activeModal.close({
      vehicles: vehicleArray,
      zones: this.zonesSelected,
      settings: this.settings
    });
  }
  changeZones(element: any){
    this.zonesSelected = element.multiselect().val();
    
  }
}
