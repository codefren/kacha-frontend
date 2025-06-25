import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-type-routes',
  templateUrl: './type-routes.component.html',
  styleUrls: ['./type-routes.component.scss']
})
export class TypeRoutesComponent implements OnInit, OnChanges {

  @Input() filter:any;

  productivityRouteType: any;
  show: boolean = true;

  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
  ) { }


  ngOnInit() {
    
  }

  ngOnChanges(){

    this.load();

  }

  load(){
    
    this.show= false;

    this.backend.post('report_productivity_route_type', this.filter).pipe(take(1)).subscribe((data)=>{
      
      this.productivityRouteType = data;

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

}
