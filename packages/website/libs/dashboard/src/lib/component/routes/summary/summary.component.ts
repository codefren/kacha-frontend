import { take } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';

@Component({
  selector: 'easyroute-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnChanges{

  dataDuringDelivery: any;

  show: boolean = true;

  @Input() date:string = '';
  @Input() updateNumber: number;
  
  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
    ) { }

  ngOnInit() {}
  
  /* para detectar cualquier cambios desde el padre */
  ngOnChanges() {

    this.load();
}
  load(){
    
    this.show= false;

    this.backend.post('dashboard_route/data_during_delivery', {date: this.date}).pipe(take(1)).subscribe((data)=>{

    
      this.dataDuringDelivery = data.dataDuringDelivery;

      this.show= true;

      this.detectChanges.detectChanges();

    }, error => {
      

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  setMyStyle() {

    let styles;
    if(this.dataDuringDelivery){
      let porcentajeTotal = this.dataDuringDelivery.completedDeliveries;
      styles = {
        'background': 'linear-gradient(90deg, rgba(221,227,249,1) ' + porcentajeTotal + '%, rgba(255,255,255,1) '+ porcentajeTotal +'%, rgba(255,255,255,1) ' + (100 - porcentajeTotal) + '%)'
      };

    } else {
      styles = {
        'background': 'linear-gradient(to right,#dde3f9 0%, #fff 100%)'
      };
    }
    
    return styles;
}

}
