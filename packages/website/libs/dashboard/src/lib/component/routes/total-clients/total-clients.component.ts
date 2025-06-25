import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { take } from 'rxjs/operators';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
declare var init_plugins: any;
declare var $: any;
declare var Morris: any;

@Component({
  selector: 'easyroute-total-clients',
  templateUrl: './total-clients.component.html',
  styleUrls: ['./total-clients.component.scss']
})
export class TotalClientsComponent implements OnInit, OnChanges {

  @Input() date:string = '';
  @Input() updateNumber: number;

  ChartDonutOptions: any = {
    xkey: 'x',
    ykeys: ['y', 'z', 'a'],
    labels: ['Y', 'Z', 'A'],
    colors: ['#e9ecef', '#42c8f2', '#a056ff', '#eb4141'],
    resize: true,
  };

  show: boolean = true;
  
  data: any [] =[];

  totalClient: number = 0;

  morrisDonutData :any = [];

  color: any =[];

  parcent : string ='%'

  /* morrisDonutData = [{
    label: "Porto Template",
    value: 32
  }, {
    label: "Tucson Template",
    value: 18
  }, {
    label: "Porto Admin",
    value: 20
  }]; */

  chartDonutData = [
    { label: "total clientes", value: 180 },
    { label: "Gava", value: 12 },
    { label: "Sant boi", value: 30 },
    { label: "Barcelona", value: 20 }
  ];
  flotPieData = [{
    label: "Series 1",
    data: [
        [1, 60]
    ],
    color: '#0088cc'
}, {
    label: "Series 2",
    data: [
        [1, 10]
    ],
    color: '#2baab1'
}, {
    label: "Series 9",
    data: [
        [1, 15]
    ],
    color: '#734ba9'
}, {
    label: "Series 4",
    data: [
        [1, 15]
    ],
    color: '#E36159'
}];
  /* chartDonutData: any = [
      {
          x: '2011 Q1',
          y: 66,
          z: 54,
          a: 38
      }, {
          x: '2011 Q2',
          y: 98,
          z: 75,
          a: 45
      }, {
          x: '2011 Q3',
          y: 73,
          z: 52,
          a: 44
      }, {
          x: '2011 Q4',
          y: 82,
          z: 64,
          a: 43
      }
  ]; */
  constructor(
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    /* init_plugins();
    this.initDonuts(); */
  }

  ngOnChanges() {
    
    init_plugins();
    $("#morrisDonut").empty();
    this.load();
   
  }
  async load(){
    
    this.show= false;

  await  this.backend.post('dashboard_route/total_client', {date: this.date}).pipe(take(1)).subscribe((data)=>{

    if (data) {
      
      $("#morrisDonut").empty();
     }

      let route: any = [];

      let colors : any =[];

      this.data =[];
      this.data = data.route;

      

      this.show= true;

      this.totalClient = data.totalClient;

      this.data.forEach(element => {

        route.push({
          label: element.name,
          value:  element.totalClienteRoute,
          measure: element.dataMeasure
      });
      colors.push(element.color)

      });

      this.morrisDonutData = route;

      this.color = colors;

      
     

     this.initDonuts();
     
      this.detectChanges.detectChanges();

    }, error => {
      

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }


  initDonuts(that = this) {
    Morris.Donut({
      resize: true,
      element: 'morrisDonut',
      data: that.morrisDonutData,
      colors: that.color,
     
    });
    
    /*  formatter: function (value) { return (value) + '%'; } PARA DECORAR CON % */
  }

}
