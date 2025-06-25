import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-calculation-period',
  templateUrl: './calculation-period.component.html',
  styleUrls: ['./calculation-period.component.scss']
})
export class CalculationPeriodComponent implements OnInit {

  calculationPeriod: number = 0 ;

  changedUpdate = false;

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this.loadingService.showLoading();

    this.backendService.get('company_preference_cost').pipe(take(1)).subscribe((data)=>{
      
      this.calculationPeriod = data.data.calculationPeriod;      

      this.loadingService.hideLoading();

      this.detectChanges.detectChanges();
      

    }, error => {
      

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  createConcept(){

    if (this.changedUpdate) {

      this.changedUpdate= false;
   
      this.backendService.post( 'company_preference_cost', { calculationPeriod:this.calculationPeriod }).pipe(take(1))

      .subscribe((data)=>{

        this.calculationPeriod = data.data.calculationPeriod;   
  
        this.toastService.displayWebsiteRelatedToast('Concepto creado');
  
        this.load();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
    }

   

  }




}
