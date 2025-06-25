import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OptimizationPreferences, OPA } from '../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { takeUntil, take } from 'rxjs/operators';
import { AllowDelayTime } from '../../../../../../backend/src/lib/types/allowDelayTime.type';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-delays',
  templateUrl: './delays.component.html',
  styleUrls: ['./delays.component.scss']
})
export class DelaysComponent implements OnInit, OnDestroy {

  optimizationPreferences$: Observable<OptimizationPreferences>;
  unsubscribe$ = new Subject<void>();

  allowDelayTime: AllowDelayTime [] =[];

  quantityDelayModifySchedule: number;
  delayWhenPassingTime: number;

  quantityAdvancesModifySchedule: number;
  advanceWhenAnticipatingTime: number;

  constructor(
    private facade: PreferencesFacade,
    private translate: TranslateService,
    private backendService: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.optimizationPreferences$ = this.facade.optimizationPreferences$;

    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {
  
      this.quantityDelayModifySchedule = op.quantityDelayModifySchedule;

      this.delayWhenPassingTime = Math.floor(op.delayWhenPassingTime / 60);

      this.quantityAdvancesModifySchedule = op.quantityAdvancesModifySchedule;

      this.advanceWhenAnticipatingTime = Math.floor(op.advanceWhenAnticipatingTime / 60);

     
      if (op.allowDelayTime ) {
          this.LoadAllowDelayTime();
      }

  });

  }

   //cargar listado retraso en cliente

   LoadAllowDelayTime(){

    this.backendService.get('company_preference_delay_time_type').pipe(take(1)).subscribe(({data})=>{


        if (data.length >0) {

            this.allowDelayTime = data;

        }
       if (this.allowDelayTime.length == 0) {
        this.allowDelayTime.push ({
            companyId: 0,
            created: "",
            id: 0,
            isActive: false,
            name: "",
            time: 0,
            updated: "",
           });
       }
       
        this.detectChanges.detectChanges();

      });

}

  toggleOptimizationAction(
    key: OPA,
    value: OptimizationPreferences[OPA],
) {
    this.facade.toggleOptimization(key, value);
}

addOthers(value, data: AllowDelayTime, name:string){
        
  switch (name) {

      case "name":

          data.name = value;

          break;

      case "minutes":

          data.time = Number(value * 60);

          break;

      default:
          break;
  }
  
  if( !data.time) return;



  if(!data.id && data.name &&  data.time ) {

    this.createDelayTimeType(data);

  } else {

      this.updateDelayTimeType(data);

  }

}

createDelayTimeType(data :AllowDelayTime){

  const index = this.allowDelayTime.indexOf(data);


  this.backendService.post('company_preference_delay_time_type', {

      name: data.name,

      time: data.time ,

    }).pipe(take(1)).subscribe((response)=>{


      this.allowDelayTime[index].id = response.data.id;

      this.allowDelayTime[index].name = response.data.name;

      this.allowDelayTime[index].time = response.data.time;

      this.detectChanges.detectChanges();

      this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('GENERAL.REGISTRATION'),

          this.translate.instant('GENERAL.ACCEPT')

      )

    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
}

updateDelayTimeType(data :AllowDelayTime){

  const index = this.allowDelayTime.indexOf(data);

  this.backendService.put('company_preference_delay_time_type/' + data.id, {

      name: data.name,

      time: data.time,

    }).pipe(take(1)).subscribe((response)=>{

     
      this.allowDelayTime[index].id = response.data.id;

      this.allowDelayTime[index].name = response.data.name;

      this.allowDelayTime[index].time = response.data.time;


      this.detectChanges.detectChanges();

      this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

          this.translate.instant('GENERAL.ACCEPT')

      );

      
    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
}

Addanother(){

  this.allowDelayTime.push({
      id:0,
      name:'',
      time:0
  });

  this.detectChanges.detectChanges();
}

showNUmber(number: number){
    
  return Math.floor(number / 60);

}

updateQuantityDelayModifySchedule() {

  this.facade.updateQuantityDelayModifySchedule(this.quantityDelayModifySchedule);

}

updateDelayWhenPassingTime() {

  this.facade.updateDelayWhenPassingTime(this.delayWhenPassingTime * 60,);

}


updateQuantityAdvancesModifySchedule() {

  this.facade.updateQuantityAdvancesModifySchedule(this.quantityAdvancesModifySchedule);

}

updateAdvanceWhenAnticipatingTime() {

  this.facade.updateAdvanceWhenAnticipatingTime(this.advanceWhenAnticipatingTime * 60,);

}


ngOnDestroy() {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}



}
