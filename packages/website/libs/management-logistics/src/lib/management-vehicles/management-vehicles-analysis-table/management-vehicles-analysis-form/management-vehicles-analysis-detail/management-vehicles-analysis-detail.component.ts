import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'easyroute-management-vehicles-analysis-detail',
  templateUrl: './management-vehicles-analysis-detail.component.html',
  styleUrls: ['./management-vehicles-analysis-detail.component.scss']
})
export class ManagementVehiclesAnalysisDetailComponent implements OnInit {

  showCode: boolean = true;

  change = {
    service: 'service',
    driver: 'driver',
    repostaje: 'repostaje',
    repair: 'repair'
  };

  default ='service';

  totalAnalysisDetail: any;

  @Input() idVehicle: any;

  @Output('filters')
  filters =  new EventEmitter<any>();

  scroll: number = 0;


  constructor(
    private backendService: BackendService,
    private toastService: ToastService,
    private detectChange: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTotalVehicleRefulig();
  }

  changePage(name: string){

    this.default = this.change[name];
  }


  getTotalVehicleRefulig(){

    this.showCode = false;

    this.backendService.get('vehicle_analysis_detail_totalized/' + this.idVehicle).pipe(take(1)).subscribe(

      ( data ) => {

          this.totalAnalysisDetail = data;

          this.showCode = true;

          this.detectChange.detectChanges();

      },
      (error) => {

          this.showCode = true;

          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity) +'km';
  }

  getValidateDateFilter(filter: any){

    this.filters.emit(filter);

  }

  moveToLeft(){

    this.scroll = this.scroll - 350 <= 0 ? 0 : this.scroll - 350;

    console.log(this.scroll, 'tamañano');

    $( "#scroller" ).scrollLeft( this.scroll );
  }

  moveToRight(){

    var scroll = $("#scroller" ).get(0).scrollWidth;


    if (this.scroll <= 800) {

        this.scroll = this.scroll + 300 >= scroll ? scroll : this.scroll + 300;

    } else {
        return

    }


    $( "#scroller" ).scrollLeft( this.scroll );




  }

}
