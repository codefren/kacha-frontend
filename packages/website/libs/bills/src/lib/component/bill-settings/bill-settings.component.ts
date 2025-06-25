import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-bill-settings',
  templateUrl: './bill-settings.component.html',
  styleUrls: ['./bill-settings.component.scss']
})
export class BillSettingsComponent implements OnInit {

  select: string ='controlOfInvoices';

  change = {
      controlOfInvoices:'controlOfInvoices',
      notices:'notices'
  };

  routeSheet: any;

  constructor(
    private router: Router,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
 
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  retunrsList(){
    
    this.router.navigateByUrl('bills');
    
  }
  


}
