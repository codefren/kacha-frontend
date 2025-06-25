import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryPoint, RoutePlanningFacade } from '@optimroute/state-route-planning';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-delivery-point-not-source',
  templateUrl: './modal-delivery-point-not-source.component.html',
  styleUrls: ['./modal-delivery-point-not-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDeliveryPointNotSourceComponent implements OnInit {

  constructor(
    public activateModal: NgbActiveModal, 
    private facade: RoutePlanningFacade,
    private detectChanges: ChangeDetectorRef) { }
  form: FormGroup;
  deliveryPoints: DeliveryPoint[];
  deliverySelected: DeliveryPoint;
  ngOnInit() {
    console.log(this.deliveryPoints)
  }

  cancel(){
    this.activateModal.dismiss();
  }

  initForm(data: DeliveryPoint){
    if(data){
      this.form = new FormGroup({
        id: new FormControl ([data.id]),
        address: new FormControl([data.address]),
        latitude: new FormControl ([data.coordinates.latitude]),
        longitude: new FormControl ([data.coordinates.longitude])
      });
      this.deliverySelected = data;
      try {
        this.detectChanges.detectChanges();
      } catch(e) {

      }
      
    }
  }

  getEstablishmentAddress(event){
    this.form.get('address').setValue(event.formatted_address);
    this.form.get('latitude').setValue(event.geometry.location.lat());
    this.form.get('longitude').setValue(event.geometry.location.lng());
    try {
      this.detectChanges.detectChanges();
    } catch(e) {

    }
  }

  submit(){
    this.facade.updateDeliveryPointTimeWindow(this.deliverySelected.zoneId, this.deliverySelected.id, this.deliverySelected.deliveryWindow, {
      latitude: this.form.value.latitude,
      longitude: this.form.value.longitude
    }, this.deliverySelected.serviceTime, this.form.value.address )
    this.deliveryPoints = this.deliveryPoints.filter(x => x.id !== this.deliverySelected.id);

    if(this.deliveryPoints.length === 0){
      this.cancel();
    }
  }

  delete(point: DeliveryPoint){

    this.facade.getZoneStatus(point.zoneId).pipe(take(1)).subscribe((data)=>{
      this.deliveryPoints = this.deliveryPoints.filter(x => x.id !== point.id);
      this.facade.deleteDeliveryPoint(point.id, point.zoneId, data.evaluated);
      if(this.deliveryPoints.length === 0){
        this.cancel();
      }
    })
    
  }

}
