import { take } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
declare var init_plugins: any;
declare var $: any;
declare var Morris: any;
@Component({
  selector: 'easyroute-summary-invoice',
  templateUrl: './summary-invoice.component.html',
  styleUrls: ['./summary-invoice.component.scss']
})
export class SummaryInvoiceComponent implements OnInit, OnChanges,OnDestroy {

  @Input() date: string = '';

  @Input() filterSelect: string = '';

  @Input() commercialId: string = '';

  @Input() dateFrom: string ='';

  @Input () dateTo: string ='';


  data: any [] =[];

  morrisStackedData :any = [];

   morrisStackedDatae : any = [{
    y: 'Lunes',
    a: 10,
    b: 30
}, {
    y: 'Martes',
    a: 100,
    b: 25
}, {
    y: 'Miercoles',
    a: 60,
    b: 25
}, {
    y: 'jueves',
    a: 75,
    b: 35
}, {
    y: 'Viernes',
    a: 90,
    b: 20
}, {
    y: 'Sabado',
    a: 75,
    b: 15
}, {
    y: 'Domingo',
    a: 50,
    b: 10
}];

color: any =[];

show: boolean =true;


totalAxiesY: any;

  constructor(
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    init_plugins();
  }

  ngOnChanges() {
    
   /*  setTimeout(function () {
      init_plugins();
    }, 1); */
    init_plugins();

    $("#morrisStacked").empty();

    this.load()
    
  }

  async load() {
    
      this.show = false;
    
    await  this.backend.post('dashboard_sale/block_order', 
    { 
      date: this.date, 
      filterSelect: this.filterSelect, 
      commercialId: this.commercialId,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
     }).pipe(take(1)).subscribe((data) => {
    
          
          if (data) {
            
            $("#morrisStacked").empty();
           }
          
          
  
          let dataShow: any = [];
  
          this.data =[];
  
          this.data = data.data;

          this.totalAxiesY = data.totalOrder;

  
          this.show = true;
  
          this.data.forEach(element => {
    
            dataShow.push({
              y: element.day,
              a:element.totalApp,
              b: element.totalCore

          });
  
    
          });
          
          this.morrisStackedData = dataShow;

          
  
          if(this.morrisStackedData.length ===0 || !this.morrisStackedData ){
            console.log('if ')
           // $("#morrisStacked").parent().attr("class","hide");
            $("#morrisStacked").hide();

            this.morrisStackedData =[{ y:"", a:0, b:0 }];

          } else {

            $("#morrisStacked").show()

          }
          
          this.initBar();
         
    
          this.detectChanges.detectChanges();
    
      }, error => {
    
    
          this.show = true;
    
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  initBar(that = this) {
    
    Morris.Bar({
			resize: true,
			element: 'morrisStacked',
			data: that.morrisStackedData,
			xkey: 'y',
			ykeys: ['a', 'b'],
			labels: ['Total App', 'Total Core'],
			barColors: ['#4160c2', '#FF8D24'],
			fillOpacity: 0.7,
			smooth: false,
			stacked: true,
			hideHover: true,
      animate:true,
      xLabelAngle: 360,
      //axes:'x' ,
      horizontal: true,
      behaveLikeLine: true,
     // ymax: that.totalAxiesY,
		});
  
  }
  ngOnDestroy(){
    clearInterval( init_plugins())
  }

}
