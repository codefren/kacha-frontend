import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StateRoutePlanningService } from '../../../../../../state-route-planning/src/lib/state-route-planning.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-routes',
  templateUrl: './modal-routes.component.html',
  styleUrls: ['./modal-routes.component.scss']
})
export class ModalRoutesComponent implements OnInit {

  routeIdDestine: number;
  data: any;

  constructor(
    private detectChanges: ChangeDetectorRef,
    private stateRoutePlanningService: StateRoutePlanningService,
    public activateModal: NgbActiveModal 
  ) { }

  ngOnInit() {
    this.routeIdDestine = this.data.routeId.id;
  }
  closeDialog() {
    this.activateModal.close();
  }
  change(){

    this.stateRoutePlanningService.movePointToRoute({
      deliveryPoints: this.data.deliveryPoints,
      routeId: this.routeIdDestine
    }).subscribe((data)=>{
      this.activateModal.close(true);
    }, error=>{
      console.log(error);
    })
    
  }

}
