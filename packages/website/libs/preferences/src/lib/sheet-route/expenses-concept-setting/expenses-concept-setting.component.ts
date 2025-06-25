import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { take } from 'rxjs/operators';
import { ModalExpenseTypeComponent } from './modal-expense-type/modal-expense-type.component';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

declare var $;


@Component({
  selector: 'easyroute-expenses-concept-setting',
  templateUrl: './expenses-concept-setting.component.html',
  styleUrls: ['./expenses-concept-setting.component.scss']
})
export class ExpensesConceptSettingComponent implements OnInit {

  @Input() routeSheet: any;
  @Output('routeSheets')
  routeSheets: EventEmitter<any> = new EventEmitter();

  tableConcept: any;

  conceptList: any [] =[];

  providersType: any;

  constructor(
    private router: Router,
    private _modalService: NgbModal,
    private toastService: ToastService,
    private backendService: BackendService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private loading:LoadingService,
    
  ) { }

  ngOnInit() {
    this.load();
  }
  ngOnChanges() {
    
  
  }

  load(){

    this.loading.showLoading();

    this.backendService.get('route_sheet_concept_preference').pipe(take(1)).subscribe((data)=>{

    this.conceptList = data.data;

    this.loading.hideLoading();

    this.detectChanges.detectChanges();

    }, error => {
      
      this.loading.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }


  goProviders(){
    
    this.router.navigateByUrl('providers');
    
  }


  modalAddExpenses(){

    if (!this._modalService.hasOpenModals()) {

      const modal = this._modalService.open( ModalExpenseTypeComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
  
        windowClass:'modal-view-Roadmap',
    
        size:'md',
  
        backdrop: 'static'
    
      });
      
     modal.componentInstance.actions ='new';
  
       modal.result.then(
          (data) => {
            if (data) {
              this.load();
            }
          
          },
          (reason) => {
            
            
          },
      ); 
    }
    
 
  }


  modalEditExpenses(data: any){
    
    const modal = this._modalService.open( ModalExpenseTypeComponent, {
    
      backdropClass: 'modal-backdrop-ticket',

      windowClass:'modal-view-Roadmap',
  
      size:'md',

      backdrop: 'static'
  
    });
    
    modal.componentInstance.data = data;

    modal.componentInstance.actions ='edit';

     modal.result.then(
        (data) => {
            
        },
        (reason) => {},
    ); 
  }

  deleteConcept(data:any){

    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {

      centered: true,
      backdrop: 'static'
    });

    modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
  
    modal.componentInstance.message = this.translate.instant('GENERAL.SURE_YOU_WANT_TO_DELTE_THE_EXPENSE');

    modal.result.then((result) => {
  
      if (result) {
          if (data.isActive) {
             
              this.deleteConceptService(data);
          } else {
             
              this.deleteConceptService(data);
          }
  
      } else {
        
        }
    });
  
    
  }

  deleteConceptService(send:any){

    this.backendService.delete('route_sheet_concept_preference/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.load();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
    );

      this.detectChanges.detectChanges();

      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  activateToogle(event: any, data:any){
    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
        centered: true,
        backdrop: 'static'
    });
    if (data.isActive) {

        modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this.translate.instant('GENERAL.INACTIVE?');
  
    } else {
        modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this.translate.instant('GENERAL.ACTIVE?');
    }
  
    modal.result.then((result) => {
      if (result) {
          if (data.isActive) {
              data = {
                  ...data,
                  isActive: event
              }
              this.updateIsActive(data);
          } else {
              data = {
                  ...data,
                  isActive: event
              }
              this.updateIsActive(data);
          }

      } else {
        $('#isActiveitem' + data.id).prop('checked', data.isActive);
      }
    })

  }

  updateIsActive(send:any){
    
    this.backendService.put('route_sheet_concept_preference/'+ send.id+ '/activate',{isActive:send.isActive}).pipe(take(1)).subscribe((data)=>{

      this.load();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
    );

      this.detectChanges.detectChanges();

      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      
      });
  }
}
