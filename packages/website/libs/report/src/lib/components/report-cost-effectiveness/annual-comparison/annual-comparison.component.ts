import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BackendService, FilterState } from '@optimroute/backend';
import { ToastService, secondsToAbsoluteTime, secondsToTimeAsTime } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
declare var init_plugins: any;
declare var $: any;
declare var Morris: any;

@Component({
  selector: 'easyroute-annual-comparison',
  templateUrl: './annual-comparison.component.html',
  styleUrls: ['./annual-comparison.component.scss']
})
export class AnnualComparisonComponent implements OnInit, OnDestroy {


  show: boolean =true;

  filterSelect: string = 'cost';

  selected: string = 'cost';

  yearSelected: any = '2024';

  data: any = [];

  differenceData: any;

  morrisLineData: any = [];

  morrisLineDataDefault = [{
    y: '2023-01-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-02-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-03-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-04-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-05-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-06-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-07-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-08-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }, {
    y: '2023-09-01',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  },
  {
    y: '2023-10-1',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  },
  {
    y: '2023-11-1',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  },
  {
    y: '2023-12-1',
    a: 0,
    b: 0,
    c: 0,
    d: 0
  }];

  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY_', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  showIcon ='€';

  years = ['2023', '2024']


  constructor(
    private backend: BackendService,
    private toastService: ToastService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    init_plugins();

    $("#morrisLine").empty();

    this.load();
  }

  getChangeSelect(event: any){

    this.filterSelect = event;

    console.log(this.filterSelect);

    switch (event) {

      case 'cost':

        this.showIcon ='€';
        this.stadistic[2].visible = true;
        break;

        case 'hour':

        this.showIcon ='h';
        this.stadistic[2].visible = false;
        this.stadistic[3].visible = false;

        break;

        case 'km':

        this.showIcon ='km';
        this.stadistic[2].visible = false;
        this.stadistic[3].visible = false;

        break;

      default:

      this.showIcon ='€';
        break;
    }

    this.load();

  }

  stadistic = [
    {
      key: 'a',
      color: '#FF8D24',
      name: 'Ejecutado',
      visible: true
    },
    {
      key: 'b',
      color: '#4160c2',
      name: 'Planificado',
      visible: true
    },
    {
      key: 'c',
      color: '#C4CBDD',
      name: 'Total logístico',
      visible: true
    },
    {
      key: 'd',
      color: '#E70808',
      name: 'Facturación perdida',
      visible: false
    }
  ]

  changeYearData(year: any){
    this.load();
  }


  getToday(nextDay: boolean = false) {
    if (nextDay) {
        return moment(new Date().toISOString())
            .add(1, 'day')
            .format('YYYY-MM-DD');
    }

    return moment(new Date().toISOString()).format('YYYY-MM-DD');
  }


  async load() {

    this.show = false;

    this.backend.post('report_productivity_comparative_annual', {
      year: this.yearSelected,
      dateDeliveryStart: this.getToday(),
      filterSelect: this.filterSelect
    }).pipe(take(1)).subscribe((data)=>{

        if (data) {
          $("#morrisLine").empty();
        }

        let dataShow: any = [];

        this.data = [];

        this.data = data.data;

        this.show = true;

        this.data.forEach(element => {

          dataShow.push({
            y: element.month,
            a: +(element.executed).toFixed(2),
            b: +(element.planned).toFixed(2),
            c: ((element.import ? element.import : 0) - (element.executed ? element.executed : 0) ).toFixed(2),
            d: +(element.noDeliveried ? element.noDeliveried : 0).toFixed(2)
          });

        });

        console.log(dataShow, 'dataShow');

        this.morrisLineData = dataShow;

        if(this.morrisLineData.length === 0 || !this.morrisLineData ){

          this.morrisLineData = this.morrisLineDataDefault

        } else {

          $("#morrisLine").show()

        }

        this.initBar();

        this.detectChanges.detectChanges();

    }, error => {

        this.show = true;

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  initBar(that = this) {

    var months = [ this.translate.instant('GENERAL.JAN'), this.translate.instant('GENERAL.FEB'), this.translate.instant('GENERAL.MAR'), this.translate.instant('GENERAL.APR'),
    this.translate.instant('GENERAL.MAY_'), this.translate.instant('GENERAL.JUN'), this.translate.instant('GENERAL.JUL'),  this.translate.instant('GENERAL.AUG'),
    this.translate.instant('GENERAL.SEP'), this.translate.instant('GENERAL.OCT'), this.translate.instant('GENERAL.NOV'), this.translate.instant('GENERAL.DEC')];
    that.selected = that.filterSelect;
    Morris.Line({
			resize: true,
			element: 'morrisLine',
			data: that.morrisLineData,
			xkey: 'y',
			ykeys: this.stadistic.filter(x=> x.visible === true).map( x=> x.key),
      postUnits: this.showIcon,
      xLabelFormat: function(x) { // <--- x.getMonth() returns valid index
       // console.log(x, 'x');
        var month =  months[x.getMonth()];
        return month;
      },
      dateFormat: function(x) {
        //console.log(x , 'x');
        var month = months[new Date(x).getMonth()];
        return month;
      },
      yLabelFormat: function (y) {
        var parts = y.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        if(that.selected === 'hour'){
          return secondsToAbsoluteTime(y, true);
        } else {
          return parts.join(",");
        }

    },
    xLabels: "month",
    //parseTime: false,
			labels: this.stadistic.filter(x=> x.visible === true).map( x=> x.name),
			hideHover: true,
			lineColors: this.stadistic.filter(x=> x.visible === true).map( x=> x.color),
      //xLabels:'month'
		});

  }

  modifyView(identifier: number){
    this.stadistic[identifier].visible = !this.stadistic[identifier].visible;
    $("#morrisLine").empty();
    this.initBar();
  }


  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }

  returnDiff(timeTravel: any){
    return secondsToAbsoluteTimeAlterne(timeTravel, true);

  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);
  }

  ngOnDestroy(){
    clearInterval( init_plugins())
  }

}
