import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

declare var ApexCharts: any;
declare var $: any;


@Component({
  selector: 'easyroute-cost-comparison',
  templateUrl: './cost-comparison.component.html',
  styleUrls: ['./cost-comparison.component.scss']
})
export class CostComparisonComponent implements OnInit, OnChanges {

  @Input() filter:any;

  symbol = environment.MONEY_SYMBOL;
  productivityComparativeCost: any;
  show: boolean = true;
  planificado = 0;
  ejecutado = 0;
  percentPlanificado = 0;
  percentEjecutado = 0;

  
 
  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
   
  }

  ngOnChanges(){

    $("#chart").empty();

    this.load();

  }

  load(){
 
    this.show = false;

    this.backend.post('report_productivity_comparative_cost', this.filter).pipe(take(1)).subscribe(({data})=>{
      
      this.productivityComparativeCost = data;

      this.planificado = data.find(x=>x.name === 'Planificado').totalCost;
      this.ejecutado = data.find(x=>x.name === 'Ejecutado').totalCost;

      this.formulaParaCuadro(this.planificado, this.ejecutado);

      this.show = true;
      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  roundAmount(amount: number){
    return amount.toFixed(2) + environment.MONEY_SYMBOL;
  }

  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format( Math.abs(quantity));

}


  formulaParaCuadro(planificado, ejecutado){

    const a = planificado > ejecutado ? planificado : ejecutado;

    const b = 100;

    const c = planificado > ejecutado ? ejecutado : planificado;

    let d = c > 0 ?(c*b)/a : 0;


    this.percentPlanificado = planificado > ejecutado ? 100 : d;

    this.percentEjecutado = ejecutado > planificado ? 100 : d;

    console.log(a,b,c,d);

    return d;



  }

}
