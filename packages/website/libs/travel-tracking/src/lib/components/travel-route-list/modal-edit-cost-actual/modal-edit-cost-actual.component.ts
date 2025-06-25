import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { take } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';

@Component({
  selector: 'easyroute-modal-edit-cost-actual',
  templateUrl: './modal-edit-cost-actual.component.html',
  styleUrls: ['./modal-edit-cost-actual.component.scss']
})
export class ModalEditCostActualComponent implements OnInit {

  data: any;

  totalLoad: any;

  totalCostAutonomous: any;

  costActualForm: FormGroup;

  idRoute:any;

  constructor(
    public dialogRef: NgbActiveModal,
    private fb: FormBuilder,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initForm(this.totalCostAutonomous);
  }

  initForm(data: any) {
    
    this.costActualForm = this.fb.group({
        realCost: [
          data ? '' : data,
            [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
        ],
       
    });
  
    this.changeDetectorRef.detectChanges();
  
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

  }

  sendUpdateCostActual(){
    
    let sendData ={

      routeId : this.idRoute,

      realCost :this.costActualForm.value.realCost
     
    }

     this.loadingService.showLoading();
  
     this.backendService.put('route_planning/route/update_real_cost',sendData).pipe( take(1) )

    .subscribe(
  
      ({ data }) => {

        this.dialogRef.close(true);

        this.loadingService.hideLoading();
  
        this.toastService.displayWebsiteRelatedToast('Coste real actualizado satisfactoriamente');
  
       
      } ,
      ( error ) => {
  
        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )
  }


  

  close(value: any) {
    this.dialogRef.close(value);
  }

}
