import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { ToastService, LoadingService, ToDayTimePipe, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
declare var $;

interface SchedulePreferences {
  id?: null | number, 
  companyId?: null | number,
  name: string,
  scheduleStart: number,
  scheduleEnd: number,
  isActive: boolean
}

@Component({
  selector: 'easyroute-schedules-preferences',
  templateUrl: './schedules-preferences.component.html',
  styleUrls: ['./schedules-preferences.component.scss']
})
export class SchedulesPreferencesComponent implements OnInit {

  deliverySchedules: Array<SchedulePreferences> = [];
  
  constructor(
    private service: StatePreferencesService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private dayTime: ToDayTimePipe,
    private translate: TranslateService,
    private _modalService: NgbModal,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.loadingService.showLoading();
    this.service.getPreferenceSchedule().pipe( take(1) )
      .subscribe(
        ({ data }) => {
          this.loadingService.hideLoading(); 
          this.deliverySchedules = data; 
        } ,
        ( error ) => {
          this.loadingService.hideLoading();
          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  addSchedule() {

    const schedule: SchedulePreferences = {
      name: 'Horario',
      scheduleStart: dayTimeAsStringToSeconds('07:00'),
      scheduleEnd: dayTimeAsStringToSeconds('22:00'),
      isActive: true
    };

    this.loadingService.showLoading();
    this.service.createPreferenceSchedule( schedule )
      .pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.loadingService.hideLoading();
          this.deliverySchedules.push( data );
    
        },
        ( error ) => {
          this.loadingService.hideLoading();
          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  handleChange( field: string, value: string, schedule: SchedulePreferences ) {
    
    if ( field === 'scheduleEnd' ) {

      // se evita actualizar si los valor de entrada con el campo del objeto son iguales
      if ( dayTimeAsStringToSeconds( value ) === schedule.scheduleEnd ) {
        return;
      }
      
      // se actualiza el campo y luego se valida
      schedule[ field ] = dayTimeAsStringToSeconds( value );

      if ( !this.validateTimeEnd( schedule ) ) {
        return;
      }
    
    } else if ( field === 'scheduleStart' ) {
      
      if ( dayTimeAsStringToSeconds( value ) === schedule.scheduleStart ) {
        return;
      }
      
      // se actualiza el campo y luego se valida
      schedule[ field ] = dayTimeAsStringToSeconds( value );
      
      if ( !this.validateTimeStart( schedule ) ) {
        return;
      }
    
    } else {  // name

      if ( !this.validateKeyUpName( value ) ) {
        return;
      }

      schedule[ field ] = value;
    }

    this.updateSchedulePreferences( schedule );
  }

  updateSchedulePreferences( schedule: SchedulePreferences ) {
    
    this.loadingService.showLoading();
    this.service.updatePreferenceSchedule( schedule.id, schedule )
      .pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.loadingService.hideLoading();
          
          this.deliverySchedules = this.deliverySchedules.map(( item: SchedulePreferences ) => {
            
            if ( data.id === item.id ) {
              return data;
            }
            
            return item;
          });

          this._changeDetectorRef.detectChanges();

          this.toastService.displayWebsiteRelatedToast( 
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'), 
            this.translate.instant('GENERAL.ACCEPT') 
          );
        },
        ( error ) => {
          this.loadingService.hideLoading();
          this.toastService.displayHTTPErrorToast( error.status, error.error );
        }
      )
  }

  validateKeyUpName( value: string ): boolean {

    // caracteres unicode: \u00f1  es la letra ñ,  \u00d1 Ñ mayuscula
      const rexp = /^[A-Za-z\u00f1\u00d1\s]{1,255}$/;
    
      return rexp.test( value ); 

   
  }

  validateTimeStart( schedule: SchedulePreferences ): boolean {
    return schedule.scheduleStart < schedule.scheduleEnd;
  }

  validateTimeEnd( schedule: SchedulePreferences ): boolean {
    return schedule.scheduleEnd > schedule.scheduleStart;
  }

  activeDeliverySchedule( value: boolean, schedule: SchedulePreferences ) {
    
    const modal = this._modalService.open( DeliveryModalConfirmationComponent, { 
      centered: true,
      backdrop: 'static'
    });

    if ( schedule.isActive ) {
      modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
      modal.componentInstance.message = this.translate.instant('GENERAL.INACTIVE?');

    } else {
      modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
      modal.componentInstance.message = this.translate.instant('GENERAL.ACTIVE?');
    
    }

    modal.result.then(( result : boolean ) => {
      
      if ( result ) {

        if ( schedule.isActive) {
            
            schedule = {
              ...schedule,
              isActive: value
            };

            this.updateSchedulePreferences( schedule );

        } else {
            
            schedule = {
              ... schedule ,
              isActive: value
            };

            this.updateSchedulePreferences( schedule );
        }

      } else {
        $( '#isActiveSchedule' + schedule.id ).prop( 'checked', schedule.isActive );
      
      }
    });
  }

  deliveryScheduleId(index, item){
    return item.id;
  }

  confirmDeleteSchedule(data: any, i:any){
    const modal = this._modalService.open( DeliveryModalConfirmationComponent, { 
      centered: true,
      backdrop: 'static'
    });

    
      modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');

      modal.componentInstance.message = this.translate.instant('GENERAL.ARE_YOU_TO_DELETE_SELECTED_SCHEDULES');

    

    modal.result.then(( result : boolean ) => {
      
      if ( result ) {


       this.deleteServiceShedule(data, i);

      } else {
       
      
      }
    });
  }

  deleteServiceShedule(data: any, i:any){


    let index = this.deliverySchedules.indexOf(data);


    this.service.deletePreferenceSchedule( data.id )

      .pipe( take(1) )

      .subscribe(

        ({ data }) => {
          
          this.loadingService.hideLoading();
          
          if (index !== -1) {
            
            this.deliverySchedules.splice(index, 1);
        }

          this._changeDetectorRef.detectChanges();

          this.toastService.displayWebsiteRelatedToast( 
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'), 
            this.translate.instant('GENERAL.ACCEPT') 
          );
        },
        ( error ) => {
          this.loadingService.hideLoading();
          this.toastService.displayHTTPErrorToast( error.status, error.error );
        }
      )

  }
  
}
