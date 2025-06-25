import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-cost-settings',
  templateUrl: './cost-settings.component.html',
  styleUrls: ['./cost-settings.component.scss']
})
export class CostSettingsComponent implements OnInit {

  select: string ='structure';

  change = {
    structure: 'structure',
    staff: 'staff',
    rates: 'rates',
    automation:'automation'
};

id: any;

me: boolean = false;

redirect: any;


  constructor(
    private router: Router,
   
    private detectChanges: ChangeDetectorRef,

    private _activatedRoute: ActivatedRoute,
    
  ) { }

  ngOnInit() {
    this.getUrl();
  }

  getUrl(){
    this._activatedRoute.params.subscribe((params) => {

      this.id = params['id'];

      this.redirect = params['redirect'];

      this.me = params['me'];

      if (this.id && this.redirect &&  this.me){

        if (this.redirect ==='rates') {

          this.select ='rates';
  
        } else {
  
          this.select ='structure';
  
        }
      }
      
  });
  }


  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  retunrsList(){

    if (this.id && this.redirect && this.me){

      this.router.navigate([`management/users/${this.id}/me/${true}/`]);
     
    } else {

      this.router.navigateByUrl('cost');
      
    }
    
   
    
  }
 


}
