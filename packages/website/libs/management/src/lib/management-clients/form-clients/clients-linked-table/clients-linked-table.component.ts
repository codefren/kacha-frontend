import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { ToastService, LoadingService } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationClientsLinkedComponent } from './modal-confirmation-clients-linked/modal-confirmation-clients-linked.component';
import { TranslateService } from '@ngx-translate/core';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ModalChangePasswordComponent } from './modal-change-password/modal-change-password.component';



@Component({
  selector: 'easyroute-clients-linked-table',
  templateUrl: './clients-linked-table.component.html',
  styleUrls: ['./clients-linked-table.component.scss']
})

export class ClientsLinkedTableComponent implements OnInit {

  @Input() deliveryPointId: string;
  clientsLinked: any[];
  loading: boolean = true;

  constructor(
    private backendService: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef,
    private dialog: NgbModal,
    private translate : TranslateService,
    private stateEasyrouteService: StateEasyrouteService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.load();
  }
  
  load(){
    setTimeout( () => {
      
      this.backendService.post('users_linked_list', { deliveryPointId: this.deliveryPointId })
      .pipe( take(1) )
      .subscribe(
        ( resp ) => {
          this.clientsLinked = resp;
          this.loading = false;
          this.detectChanges.detectChanges();
        },
        ( error ) => { 
          this.toastService.displayHTTPErrorToast( error.status, error.error.error ) 
          this.loading = false;
          this.detectChanges.detectChanges();
        }
      );

    }, 1000 )
  }

  deleteElement(id: number): void {
    const dialogRef = this.dialog.open(ModalConfirmationClientsLinkedComponent, {
        backdropClass: 'modal-backdrop-ticket',
        centered: true,
        windowClass:'modal-cost',
        backdrop: 'static',
        size:'md'
    });
    dialogRef.result.then(([add, object]) => {
        if (add) {
          
          this.deleteLinkClient(id);
          
          this.loading = true;
          this.load();
        };
    });
  }

  deleteLinkClient( clientId: number ){

    this.loadingService.showLoading();
    
    this.stateEasyrouteService.deleteLinked(clientId).pipe( take(1) ).subscribe( (data: any) => {

      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UNLINKED_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );

    }, (error)=>{
        this.loadingService.hideLoading();
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  } 

  changePassword(id: number){

    const dialogRef = this.dialog.open(ModalChangePasswordComponent, {
     /*  centered: true,
      backdrop: 'static', */
      backdropClass: 'modal-backdrop-ticket',
        centered: true,
        windowClass:'modal-cost',
        backdrop: 'static',
        size:'md'
    });
    dialogRef.result.then((data) => {
  
      console.log(data, 'users_linked_list')
      
        if (data) {
          
          this.updatePasswordUser(id, data);
          
          this.loading = true;
  
          this.load();
        };
    });

  }

  updatePasswordUser(userId: number , data: any){
    
    this.loadingService.showLoading();
    
    this.stateEasyrouteService.updatePasswordUser(userId, data).pipe( take(1) ).subscribe( (data: any) => {

      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );

    }, (error)=>{
        this.loadingService.hideLoading();
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

}
