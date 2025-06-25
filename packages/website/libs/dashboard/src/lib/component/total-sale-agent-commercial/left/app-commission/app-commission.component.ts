import { take } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';

@Component({
  selector: 'easyroute-app-commission',
  templateUrl: './app-commission.component.html',
  styleUrls: ['./app-commission.component.scss']
})
export class AppCommissionComponent implements OnInit, OnChanges {

  @Input() date: string = '';

  @Input() filterSelect: string = '';

  @Input() commercialId: string = '';

  @Input() dateFrom: string ='';

  @Input () dateTo: string ='';


  show: boolean = true;

  appCommission: any;

  constructor(
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    
    this.load();
  }

  load() {
  
    this.show = false;
  
    this.backend.post('dashboard_sale/boxes_commission_app', 
    { 
      date: this.date, 
      filterSelect: this.filterSelect, 
      commercialId: this.commercialId,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
      }).pipe(take(1)).subscribe((data) => {
  
        this.appCommission = data;
      
        this.show = true;
  
        this.detectChanges.detectChanges();
  
    }, error => {
  
  
        this.show = true;
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }
  

  decimal(numb) {
  
    /* con esta funcion muestra el valor con formato de espaa */
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
  
  }

}
