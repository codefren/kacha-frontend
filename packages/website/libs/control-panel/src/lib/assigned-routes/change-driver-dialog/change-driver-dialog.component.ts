import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../../backend/src/lib/types/vehicles.type';
import { StateVehiclesService } from '../../../../../state-vehicles/src/lib/state-vehicles.service';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateUsersFacade } from '../../../../../state-users/src/lib/+state/state-users.facade';
import { Observable } from 'rxjs';
import { User } from '../../../../../backend/src/lib/types/user.type';

@Component({
  selector: 'easyroute-change-driver-dialog',
  templateUrl: './change-driver-dialog.component.html',
  styleUrls: ['./change-driver-dialog.component.scss']
})
export class ChangeDriverDialogComponent implements OnInit {

  idUserSelected:number;
  nameUserSelected: string;
  data: any;
  users: Observable<User[]>;

  constructor(
    private service: StateVehiclesService,
    private routingPlanning: StateRoutePlanningService,
    public activateModal: NgbActiveModal,
    private usersFacade: StateUsersFacade
  ) { }

  ngOnInit() {
    this.getUsers();
  }


  getUsers() {
    this.usersFacade.loadAllDriver();

    this.users = this.usersFacade.allUsersDrivers$;

   /*  this.users.subscribe((data) => {
    }); */
}
  
  selectedUser(id:number, name:string){
    this.idUserSelected = id;
    this.nameUserSelected= name;
  }
  
  addSelection() {
   
    this.routingPlanning.changeDrivers(this.data.RouteId, this.idUserSelected).subscribe((data)=>{
      this.activateModal.close(data);
    });
  
  }
  
  cancelSelection() {
    this.activateModal.close();
  }
  

}
