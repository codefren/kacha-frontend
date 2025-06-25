import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

declare var ApexCharts: any;
declare var $: any;

@Component({
  selector: 'easyroute-km-comparison',
  templateUrl: './km-comparison.component.html',
  styleUrls: ['./km-comparison.component.scss']
})
export class KmComparisonComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityComparativeKm: any;
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

    this.load();

  }

  load(){

    this.show = false;

    this.backend.post('report_productivity_comparative_km', this.filter).pipe(take(1)).subscribe(({data})=>{
      
      this.productivityComparativeKm = data;

      this.planificado = data.find(x=>x.name === 'Planificado').km;
      this.ejecutado = data.find(x=>x.name === 'Ejecutado').km;

      this.formulaParaCuadro(this.planificado, this.ejecutado);

      this.show = true;
      
      

      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format( Math.abs(quantity)) +' km';
  }

  formulaParaCuadro(planificado, ejecutado){

    const a = planificado > ejecutado ? planificado : ejecutado;

    const b = 100;

    const c = planificado > ejecutado ? ejecutado : planificado;

    let d = c > 0 ?(c*b)/a : 0;


    console.log('aquiiii', d);

    this.percentPlanificado = planificado > ejecutado ? 100 : d;

    this.percentEjecutado = ejecutado > planificado ? 100 : d;


    return d;

  }

  roundAmount(amount: number){
    return amount.toFixed(2) +'km';
  }



}
