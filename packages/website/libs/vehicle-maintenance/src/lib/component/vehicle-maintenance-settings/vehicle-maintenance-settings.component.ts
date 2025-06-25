import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'easyroute-vehicle-maintenance-settings',
  templateUrl: './vehicle-maintenance-settings.component.html',
  styleUrls: ['./vehicle-maintenance-settings.component.scss']
})
export class VehicleMaintenanceSettingsComponent implements OnInit {

  select: string ='vehicleStatus';

  change = {
    
    vehicleStatus: 'vehicleStatus',
    predefinedRevisions: 'predefinedRevisions'
   
};

vehicleSetting: any;

redirect: any;

id: any;

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

    if (this.id && this.redirect){

      this.router.navigate([`management-logistics/vehicles/${this.id}/`]);
     
    } else {
      this.router.navigateByUrl('vehicle-maintenance');
    }
    
   
    
  }
  saveSettings(){
    console.log('guardar a');
  }

  getData(data: any){
    
    this.vehicleSetting = data;
  }

}
