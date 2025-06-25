import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { secondsToAbsoluteTimeAlterne, secondsToAbsoluteTimeAlterne2Element } from 'libs/shared/src/lib/util-functions/time-format';
import { environment } from '@optimroute/env/environment';

@Component({
  selector: 'easyroute-summary-cost-effectiveness',
  templateUrl: './summary-cost-effectiveness.component.html',
  styleUrls: ['./summary-cost-effectiveness.component.scss']
})
export class SummaryCostEffectivenessComponent implements OnInit, OnChanges {


  @Input() filter:any;

  money_symbol = environment.MONEY_SYMBOL;
  productivityTotalized: any;
  show: boolean = true;
  

  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    this.load();
  }

  roundAmount(amount: number){
    return amount.toFixed(2) + environment.MONEY_SYMBOL;
  }

  load(){
    
    this.show= false;

    this.backend.post('report_productivity_totalized', this.filter).pipe(take(1)).subscribe((data)=>{
    
      this.productivityTotalized = data;

      this.show = true;

      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }

  dateFormat(data: any) {
    return secondsToAbsoluteTimeAlterne(data, true);
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

}

dateFormatDetails(data: any) {
  return secondsToAbsoluteTimeAlterne2Element(data > 0 ? data : -1*data, true);
}

}
