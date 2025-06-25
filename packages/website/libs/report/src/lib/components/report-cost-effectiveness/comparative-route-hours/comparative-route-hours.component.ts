import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { secondsToAbsoluteTimeAlterne, secondsToAbsoluteTimeAlterne2Element } from 'libs/shared/src/lib/util-functions/time-format';
import { take } from 'rxjs/operators';

declare var ApexCharts: any;
declare var $: any;

@Component({
  selector: 'easyroute-comparative-route-hours',
  templateUrl: './comparative-route-hours.component.html',
  styleUrls: ['./comparative-route-hours.component.scss']
})
export class ComparativeRouteHoursComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityComparativeRouteHour: any;
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

  roundAmount(amount: number){
    return amount.toFixed(2) + environment.MONEY_SYMBOL;
  }

  ngOnChanges(){
    this.load();
  }

  load(){

    this.show = false;

    this.backend.post('report_productivity_comparative_hour', this.filter).pipe(take(1)).subscribe(({data})=>{
      
      this.productivityComparativeRouteHour = data;

      this.planificado = data.find(x=>x.name === 'Planificado').timeRoute;
      this.ejecutado = data.find(x=>x.name === 'Ejecutado').timeRoute;

      this.formulaParaCuadro(this.planificado, this.ejecutado);


      this.show = true;

      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
   
  }

  dateFormat(data: any) {
    return secondsToAbsoluteTimeAlterne(data > 0 ? data : -1*data, false);
  }

  dateFormatDetails(data: any) {
    return secondsToAbsoluteTimeAlterne(data > 0 ? data : -1*data, true);
  }
  dateFormatDetails2(data: any) {
    return secondsToAbsoluteTimeAlterne2Element(data > 0 ? data : -1*data, true);
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
