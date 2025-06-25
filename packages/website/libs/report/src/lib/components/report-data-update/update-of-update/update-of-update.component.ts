import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
@Component({
  selector: 'easyroute-update-of-update',
  templateUrl: './update-of-update.component.html',
  styleUrls: ['./update-of-update.component.scss']
})
export class UpdateOfUpdateComponent implements OnInit, OnChanges {

  @Input() filter:any;

  reportDataUpdateTypeTotalized: any;

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

    console.log(this.filter, 'this.filter nuevo filtro');

    let dataFilter= _.cloneDeep(this.filter);

    delete dataFilter.nameClient;

    delete dataFilter.deliveryPointUpdateStatusId;
    
    this.show = false;

    this.backend.post('report_data_update_type_totalized', dataFilter).pipe(take(1)).subscribe((data)=>{
    
      this.reportDataUpdateTypeTotalized = data;

      this.show = true;

      this.detectChanges.detectChanges();

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }


}
