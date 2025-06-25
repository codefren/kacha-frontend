import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'easyroute-route-cost-summary',
  templateUrl: './route-cost-summary.component.html',
  styleUrls: ['./route-cost-summary.component.scss']
})
export class RouteCostSummaryComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityRouteCostSummary: any[];
  show: boolean = true;
  moneySymbol = environment.MONEY_SYMBOL;

  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef,
    private loading: LoadingService
  ) { }


  ngOnInit() {
    
  }

  ngOnChanges(){

    this.load();

  }

  load(){
    
    this.show= false;
    this.loading.showLoading();
    this.backend.post('report_productivity_route_cost_summary', this.filter).pipe(take(1)).subscribe((data)=>{
      
      this.productivityRouteCostSummary = data;

      console.log(this.productivityRouteCostSummary, 'this.productivityRouteCostSummary');

      this.show = true;
      this.detectChanges.detectChanges();

      setTimeout(()=>{
        let table = '#summary';
    
      new $(table).DataTable({
        language: environment.DataTableEspaniol,
        dom: `
          <'row'
              <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                  <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
              >
              <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                  <'row'
                      <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'B>
                  >
              >
          >
          <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
          >
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                  <'row reset align-items-center'
                      <'col-sm-6 col-md-6 col-xl-6 col-6'l>
                      <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                  >
              >
          >
        `,
        aoColumnDefs: [
          { "bSortable": false, "aTargets": [ 0, 1, 2, 3,4,5,6,7 ] }, 
          { "bSearchable": false, "aTargets": [ 0, 1, 2, 3,4,5,6,7 ] }
        ]
      });
      }, 100)

      
      this.loading.hideLoading();
      

    }, error => {

      this.show= true;
      this.loading.hideLoading();
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format( Math.abs(numb));

  }

  km(numb: any) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Math.abs(numb)) + ' km';
  }

  returnDiff(timeTravel: any){
    return secondsToAbsoluteTimeAlterne(timeTravel, true);
 
   }

   roundAmount(amount: number){
    return  Math.abs(amount).toFixed(2) + this.moneySymbol;
  }
}