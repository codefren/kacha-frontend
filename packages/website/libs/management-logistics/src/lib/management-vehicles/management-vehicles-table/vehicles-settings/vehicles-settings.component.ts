import { BackendService } from '@optimroute/backend';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, LoadingService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-vehicles-settings',
  templateUrl: './vehicles-settings.component.html',
  styleUrls: ['./vehicles-settings.component.scss']
})
export class VehiclesSettingsComponent implements OnInit {

  select: string ='serviceSpecification';

  change = {
    serviceSpecification: 'serviceSpecification',
    vehicletypes: 'vehicletypes',
    digitalAccessories: 'digitalAccessories',
    materialAccessories:'materialAccessories',
    mandatoryReviews:"mandatoryReviews",
    supplements:'supplements',
    vehicleInsurance:'vehicleInsurance',
    typeVehicleInsurance:'typeVehicleInsurance'
};

vehicleSetting: any;

redirect: any;

id: any;

client: any;

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getUrl();

  }

  getUrl(){
    this._activatedRoute.params.subscribe((params) => {

      this.id = params['id'];


      this.redirect = params['redirect'];

      this.client = params['client']

      
      if (this.id  &&  this.redirect){

       switch (this.redirect) {

        case 'digitalAccessories':

          this.select ='digitalAccessories';

          break;

          case 'materialAccessories':

            this.select ='materialAccessories';

          break;

          case 'mandatoryReviews':

            this.select ='mandatoryReviews';

          break;

          case 'supplements':
          
            this.select ='supplements';
          
          break;
       
        default:
          this.select ='serviceSpecification';
          break;
       }
      }
      
    
      
  });
  }


  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  retunrsList(){

    if (this.id && this.redirect && !this.client){

      this.router.navigate([`management-logistics/vehicles/${this.id}/`]);
     
    } else if (this.id && this.redirect && this.client){
      this.router.navigate([`management/clients/${this.id}/`]);
    }else {
      this.router.navigateByUrl('management-logistics/vehicles');
    }
    
   
    
  }
  saveSettings(){
    console.log('guardar a');
  }

  getData(data: any){
    
    this.vehicleSetting = data;
  }

}
