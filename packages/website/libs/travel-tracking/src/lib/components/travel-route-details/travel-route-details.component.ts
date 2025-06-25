import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { secondsToAbsoluteTime, ToastService, ToDayTimePipe } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';

import * as moment from 'moment-timezone';

@Component({
  selector: 'easyroute-travel-route-details',
  templateUrl: './travel-route-details.component.html',
  styleUrls: ['./travel-route-details.component.scss']
})
export class TravelRouteDetailsComponent implements OnInit {
  
  idParam: any;
  imgLoad: string ='';
  select: string ='service_information';

  change = {
    service_information:'service_information',
    delivery_note: 'delivery_note',
    bills:'bills'
  };

  routeId: number;
  redirect: any;

  data: any;

  countAlbaran: number = 0;

  arrivalDayTime: any;
  serviceTimeClient: any;
  delayTimeOnDelivery: any;


  constructor(
    private router: Router,
    private detectChange: ChangeDetectorRef,
    public authLocal: AuthLocalService,
    private _toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private stateRoutePlanningService: StateRoutePlanningService,
    private dayTime: ToDayTimePipe,

  ) { }

  ngOnInit() {

    this.load(); 

  }

  load() {
    this._activatedRoute.params.subscribe((params) => {
        
        this.redirect = params['redirect']

        if (params['id'] !== 'new') {
            
            this.stateRoutePlanningService
                .getDeliveryPointDetailAssignedDetaild(params['id'])
                .subscribe(
                    (resp: any) => {
                        this.data = resp[0];

                        this.routeId = this.data.routeId;

                        this.arrivalDayTime = this.dayTime.transform(this.data.arrivalDayTime, false, false);

                        this.delayTimeOnDelivery = secondsToAbsoluteTime(this.data.delayTimeOnDelivery, true);

                        this.serviceTimeClient = this.dayTime.transform(this.data.serviceTimeClient, false, true);

                        if (this.data && !this.data.isMultiDeliveryNote && this.data.deliveryNoteCode) {
                          this.countAlbaran = 1
                        } else {
                          
                          this.countAlbaran = this.data &&  this.data.multiDeliveryNotes &&  this.data.multiDeliveryNotes.length ?  this.data.multiDeliveryNotes.length : 0;
                        }

                    },
                    (error) => {
                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
        } 
      
    });
  }

  returnsList(){

    if ( this.redirect ) {
      this.router.navigate([`management/clients/analysis/${ this.data.deliveryPointId }`]);

    } else {

      this.router.navigate(['travel-tracking/'+this.routeId]);
        
    }
    
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChange.detectChanges();
  }

  dateFormat(date:any){
    if (date) {
        return moment(date).format('HH:mm');
        
    } else {
         return '--:--'
    }
  }

  showSecons(date:any){
    if (date) {
        return secondsToAbsoluteTime(date, true);
    } else {
        return '- -min'
    }
  }

}
