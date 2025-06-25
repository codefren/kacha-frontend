import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';

@Component({
  selector: 'easyroute-modal-general-filters',
  templateUrl: './modal-general-filters.component.html',
  styleUrls: ['./modal-general-filters.component.scss']
})
export class ModalGeneralFiltersComponent implements OnInit {

  @ViewChild('userAsignedId', { static: false }) userAsignedId: ElementRef<HTMLElement>;

  constructor(
    public activeModal: NgbActiveModal, 
    private stateUsersService: StateUsersService,
    private _toastService: ToastService,
    private preferencesFacade: PreferencesFacade,
    private rendered2: Renderer2,
  ) { }

    loading: string = 'success';
    preparer: any = [];
  
    filter: any = {
      userAsignedId: '',
      dateFrom: '',
      dateTo: '',
    };
  
    model: any;
    model2: any;
  
    dateFrom: string = 'from';
    datedateTo: string = 'To';

    disabledateto: boolean = true;
    nextDay: boolean = false;
    dateNow: any;
    today: string;
    datemin: any;
    dateMax: any;
  
    typeInterval: string = 'todas';
  
    ngOnInit() {
      
      this.disabledateto = false;
      this.model = {
        day: +moment(this.filter.dateFrom).format('D'),
        month: +moment(this.filter.dateFrom).format('M'),
        year: +moment(this.filter.dateFrom).format('YYYY'),
      };
      this.model2 = {
        day: +moment(this.filter.dateTo).format('D'),
        month: +moment(this.filter.dateTo).format('M'),
        year: +moment(this.filter.dateTo).format('YYYY'),
      };
      
      this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((data) => {

        // dia siguiente
        this.nextDay = data.assignedNextDay;
    
        this.dateNow = moment(new Date().toISOString()).format('YYYY-MM-DD');
        this.datemin = moment()
            .startOf('year')
            .format('YYYY-MM-DD hh:mm');
        
        this.initMoment();
        
        this.getPreparer();

      });
      
    }
  
    initMoment() {
      moment()
          .tz('Europe/Madrid')
          .format();
      this.today = this.getToday( this.nextDay );
    }
  
    closeDialog() {
      this.activeModal.close(this.filter);
    }
  
    ChangeFilter(event) {
      let value = event.target.value;
  
      let id = event.target.id;
  
      this.validateData(value, id);
    }
  
    validateData(value: any, id: string) {
      console.log(value, id);
      if (id === 'dateFrom' || id === 'dateTo') {

        this.setFilter('', 'date', false);
      } else {

        this.setFilter(value, id, true);
      }
    }
  
    getToday( nextDay: boolean = false ) {
  
      if ( nextDay ) {
        return  moment(new Date().toISOString()).add( 1, 'day' ).format('YYYY-MM-DD');
      }
        
      return moment( new Date().toISOString() ).format('YYYY-MM-DD');
    }
  
    setFilter(value: any, property: string, sendData?: boolean) {
        this.filter[property] = value;
    }
  
    getPreparer() {
      this.loading = 'loading';
  
      setTimeout(() => {
          this.stateUsersService.getUsersPreparer().subscribe(
              (data: any) => {

                this.loading = 'success';
  
                this.preparer = data.data;
  
              },
              (error) => {
                  this.loading = 'error';
  
                  this._toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              },
          );
      }, 1000);
    }

    getDate(date: any, name: any) {
      if (name == 'from') {
          this.disabledateto = false;
  
          this.dateMax = date;
  
          this.filter.dateFrom = moment(
              `${date.year}-${date.month
                  .toString()
                  .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
          ).format('YYYY-MM-DD');
      } else {
          this.filter.dateTo = moment(
              `${date.year}-${date.month
                  .toString()
                  .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
          ).format('YYYY-MM-DD');
      }
    }
  
    clearSearch() {
      this.rendered2.setProperty( this.userAsignedId.nativeElement, 'value', '' );
  
      this.model = '';
      this.model2 = '';
  
      this.filter = {
        userAsignedId: '',
        dateFrom: '',
        dateTo: '',
      };
  
      this.closeDialog();
  }

}
