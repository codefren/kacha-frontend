import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Point } from '../../../../../backend/src/lib/types/point.type';
import { ModalDeliveryPointsComponent } from './modal-delivery-points/modal-delivery-points.component';
import { ModalConfirmationDeleteLinkedComponent } from './modal-confirmation-delete-linked/modal-confirmation-delete-linked.component';
import { ModalConfirmationUpdateLinkedComponent } from './modal-confirmation-update-linked/modal-confirmation-update-linked.component';
import { User } from '@optimroute/backend';
import { ModalConfirmationCreateDeliveryPointComponent } from './modal-confirmation-create-delivery-point/modal-confirmation-create-delivery-point.component';
import { LoadingService, ToastService } from '@optimroute/shared';

@Component({
  selector: 'easyroute-miwigo-clients-unlinked-form',
  templateUrl: './miwigo-clients-unlinked-form.component.html',
  styleUrls: ['./miwigo-clients-unlinked-form.component.scss']
})
export class MiwigoClientsUnlinkedFormComponent implements OnInit {

  points:Point;
  user: User;
  codeCLient:any=[];
  deliveryPointId:any;
  deliveryPointLink: any=[];


  constructor(
              private _modalService: NgbModal,
              private fb: FormBuilder,
              private Router: Router,
              private toast: ToastService,
              private _translate : TranslateService,
              private _toastService: ToastService,
              private changeDetectorRef:ChangeDetectorRef,
              private _activatedRoute: ActivatedRoute,
              private stateEasyrouteService:StateEasyrouteService,
              private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.showLoading();
    this.load();
  }

  load(){
    this._activatedRoute.params.subscribe( params => {
      if ( params['miwigo-unlinked'] !== 'new' ) {
        this.stateEasyrouteService.getUser( params['miwigo-unlinked'] ).subscribe( (resp: any) => {
          this.user = resp.data;
          this.getDeliveryPointLinkList(resp.data.deliveryPointNationalId);
         
        },(error)=>{
          this.loadingService.hideLoading();
          this.toast.displayHTTPErrorToast(error.status, error.error.error);
        }); 
      }

    });
  }

  getDeliveryPointLinkList(nif:any){

    this.stateEasyrouteService.deliveryPointLinkList(nif).subscribe( (data: any) => {
      this.deliveryPointLink = data;
      this.loadingService.hideLoading();

    }, (error) => {
        this.loadingService.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  OnChangeCheckActive( clientId: number, element: any ,type: string) {

    this.deliveryPointId = 0;
    this.codeCLient = [];
    
    const modal = this._modalService.open(ModalDeliveryPointsComponent, {
      backdrop:'static',
      size:'lg',
      backdropClass:'customBackdrop',  
      centered: true
    });
  
    modal.result.then((result) => {

      if (result) {
        console.log(result);
        if (type == 'linked') {

          this.deliveryPointId = result.id;

          this.codeCLient.push(result);

          this.changeDetectorRef.detectChanges();
        } 
        
      }
    }, (reason) => {
  
        this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
  
    });
  
  }

  confirmationUpdateLinked(userId: number, element: any ,type: string){

    const modal = this._modalService.open(ModalConfirmationUpdateLinkedComponent, {
      backdrop:'static',
      size:'lg',
      backdropClass:'customBackdrop',  
      centered: true

    });

    let data = {
      deliveryPointId: this.deliveryPointId
    }
    modal.result.then((result) => {
      console.log(result);
      if (result) {

        if (type == 'update') {

          this.updateLicked(userId, data); 
  
          this.changeDetectorRef.detectChanges();
        } 
      }
    }, (reason) => {
  
      this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
  
    });
  }

  updateLicked(userId: number, data:any){

    console.log(userId, data);

    this.loadingService.showLoading();

    this.stateEasyrouteService.updateLinked(userId, data).subscribe( (data: any) => {
      this.loadingService.hideLoading();
      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this._translate.instant('GENERAL.ACCEPT')
      );
      this.Router.navigate(['miwigo-unlinked']);
        
    }, (error)=> {
        this.loadingService.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  confimationDeleteLinked(clientId: number, element: any ,type: string){
  
    const modal = this._modalService.open(ModalConfirmationDeleteLinkedComponent, {
      backdrop:'static',
      size:'lg',
      backdropClass:'customBackdrop',  
      centered: true

    });
  
    modal.result.then((result) => {
  
      if (result) {
        this.deleteClient(clientId); 
      } 
    }, (reason) => {
        this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
    });
  }

  deleteClient( clientId: number ){
    
    this.loadingService.showLoading();
    this.stateEasyrouteService.deleteLinked(clientId).subscribe( (data: any) => {
      this.loadingService.hideLoading();
      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this._translate.instant('GENERAL.ACCEPT')
      );
      this.Router.navigate(['miwigo-unlinked']);
  
      }, (error)=>{
        this.loadingService.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  openModalCreateDeliveryPoint(clientId: number){

    const modal = this._modalService.open(ModalConfirmationCreateDeliveryPointComponent, {
      backdrop:'static',
      size:'lg',
      backdropClass:'customBackdrop',  
      centered: true

    });
  
    modal.result.then((result) => {
  
      if (result) {

         this.createDeliveryPonintLinked(clientId); 
    
      } 
    }, (reason) => {
  
        this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
  
    });

  }

  createDeliveryPonintLinked(clientId: number){

    this.loadingService.showLoading();

    this.deliveryPointId = 0;

    this.codeCLient = [];

    this.stateEasyrouteService.createDeliveryPonintLinked(clientId).subscribe( (data: any) => {

      this.codeCLient.push(data);
      this.deliveryPointId = data.id;
     
      this.loadingService.hideLoading();
      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.REGISTRATION'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      }, (error)=>{
        this.loadingService.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error)
      });
  }

}
