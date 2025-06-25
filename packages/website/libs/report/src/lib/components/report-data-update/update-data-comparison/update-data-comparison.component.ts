import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
declare var ApexCharts: any;
declare var $: any;
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-update-data-comparison',
  templateUrl: './update-data-comparison.component.html',
  styleUrls: ['./update-data-comparison.component.scss']
})
export class UpdateDataComparisonComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityComparativeCost: any;
  show: boolean = true;

  options = {
    chart: {
      height: 280,
      type: "radialBar"
    },
    
    series: [],
    colors: ['#E91313', '#3BDCA7'],
    
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "55%"
        },
       
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "13px"
          },
          value: {
            color: "#111",
            fontSize: "30px",
            show: true,
          },
          total: {
            enabled: true,
            show: true,
            color:"#000000",
            label: "Total",
            formatter: function (w) {

              console.log(w);
              let sentd = w.globals.seriesTotals.reduce((a, b) => {

                  console.log(a , b);
                 return a + b

               }, 0);



               console.log(sentd);
               /* valida si es un inter verdadero */
               
               let valid = Number.isInteger(sentd);

               if(valid){

                return sentd + '%';
                

               } else {

                return sentd.toFixed(2) + '%';

               }
             
            }
          }
          
        }
      }
    },
  
    stroke: {
      lineCap: "round",
    },
    labels: []
  };
  

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

    let dataFilter= _.cloneDeep(this.filter);

    delete dataFilter.nameClient;

    delete dataFilter.deliveryPointUpdateStatusId;
    
 
    this.show = false;

    this.backend.post('report_data_update_radial', dataFilter).pipe(take(1)).subscribe((data)=>{
      
      this.productivityComparativeCost = data;


      let percentage: any = [];

      let label: any = [];

      this.show = true;

      this.productivityComparativeCost.data.forEach((element:any) => {
        percentage.push(element.percentage);
        label.push(element.name);
      });

      this.options.series = percentage;
      
      this.options.labels = label;

      console.log( this.options, ' this.options');

      var chart = new ApexCharts(document.querySelector("#chart"), this.options);
      
      chart.render();

      
      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }



}
