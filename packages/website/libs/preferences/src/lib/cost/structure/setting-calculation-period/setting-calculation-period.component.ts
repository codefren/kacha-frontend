import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-setting-calculation-period',
  templateUrl: './setting-calculation-period.component.html',
  styleUrls: ['./setting-calculation-period.component.scss']
})
export class SettingCalculationPeriodComponent implements OnInit {

  calculationPeriod: number = 0 ;

  changedUpdate = false;

  constructor(
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
