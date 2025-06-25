import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
import { secondsToAbsoluteTimeAlterne } from '../../../../../../shared/src/lib/util-functions/time-format';
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-summary-data-update',
  templateUrl: './summary-data-update.component.html',
  styleUrls: ['./summary-data-update.component.scss']
})
export class SummaryDataUpdateComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityTotalized: any;

  show: boolean = true;
  
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

  load(){

    let dataFilter= _.cloneDeep(this.filter);

    delete dataFilter.nameClient;

    delete dataFilter.deliveryPointUpdateStatusId;
    
    this.show = false;

    this.backend.post('report_data_update_totalized', dataFilter).pipe(take(1)).subscribe((data)=>{
    
      this.productivityTotalized = data;

      this.show = true;

      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  decimal(numb: any) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }

  dateFormat(data: any) {
    return secondsToAbsoluteTimeAlterne(data, true);
  }

}
