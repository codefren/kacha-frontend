import { take } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
declare var init_plugins: any;
declare var $: any;
declare var Morris: any;
@Component({
  selector: 'easyroute-app-commission-donus',
  templateUrl: './app-commission-donus.component.html',
  styleUrls: ['./app-commission-donus.component.scss']
})
export class AppCommissionDonusComponent implements OnInit, OnChanges {

  @Input() date: string = '';

  @Input() filterSelect: string = '';

  @Input() commercialId: string = '';

  @Input() dateFrom: string ='';

  @Input () dateTo: string ='';


  data: any [] =[];

  morrisDonutData :any = [];

  show: boolean = true;
  
  totalGeneral:any;
  
  color: any =[];

  constructor(
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {}

  ngOnChanges() {
  
    init_plugins();

    $("#morrisDonut").empty();

    this.load();
   
}

async load() {
    
    this.show = false;
  
  await  this.backend.post('dashboard_sale/cake_commission_app', 
  { 
    date: this.date, 
    filterSelect: this.filterSelect, 
    commercialId:this.commercialId,
    dateFrom: this.dateFrom,
    dateTo: this.dateTo
   }).pipe(take(1)).subscribe((data) => {
  
        
        if (data) {
      
          $("#morrisDonut").empty();
         }


        let dataShow: any = [];

        let colors : any =[];
  
        this.data =[];

        this.data = data.data;


        this.totalGeneral = data.totalGeneral;

        this.show = true;

        this.data.forEach(element => {

          dataShow.push({
            label: element.day,
            value:  element.total,
            
        });

        colors.push(element.color)
  
        });
        
        this.morrisDonutData = dataShow;

        this.color = colors;


        this.initDonuts();
  
        this.detectChanges.detectChanges();
  
    }, error => {
  
  
        this.show = true;
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
}


  initDonuts(that = this) {
    Morris.Donut({
      resize: true,
      element: 'morrisDonut',
      data: that.morrisDonutData,
      decimals: true,
      animate:true,
      colors: that.color,
      formatter: function (x) { 

        return that.decimal(x);
      
      },
     
    });
  }

  decimal(numb) {
  
    /* con esta funcion muestra el valor con formato de espaa */
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
  
  }


}
