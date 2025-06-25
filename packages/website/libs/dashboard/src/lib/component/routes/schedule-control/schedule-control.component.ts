import { take } from 'rxjs/operators';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import * as moment from 'moment-timezone';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { Router } from '@angular/router';
@Component({
  selector: 'easyroute-schedule-control',
  templateUrl: './schedule-control.component.html',
  styleUrls: ['./schedule-control.component.scss']
})
export class ScheduleControlComponent implements OnInit ,OnChanges {

  @Input() date:string = '';
  @Input() updateNumber: number;

  finalized: boolean = null

  img: string;

  show: boolean = true;

  timeControl: any;

  filter: boolean = false;

  
  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private detectChanges: ChangeDetectorRef
    ) {
    this.img = 'url(assets/icons/optimmanage/font.svg)';
   }

  ngOnInit() {
  }

  ngOnChanges() {
    this.load();
    this.initMoment();
  }
  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
  }

  load(){
    
    this.show= false;

    this.backend.post('dashboard_route/time_control', {date: this.date, finalized: this.finalized}).pipe(take(1)).subscribe((data)=>{

      this.timeControl = data.timeControl;

      this.show= true;
      
      this.detectChanges.detectChanges();

    }, error => {
      

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }
  getAll(event: any){
    
    switch (event) {

      case "true":

        this.finalized = true;

          break;

      case "false":

        this.finalized = false;

          break;

        case "null":

          this.finalized = null;

        break;

      default:
          break;
  }
    
    this.load();

  }
  FormatDate(date: any){
    
    if (date) {
      return moment( date ).format('HH:mm') ;
    } else {
      return '---'
    }
  }
  total(total:any){
    return secondsToAbsoluteTimeAlterne(total, true);
  }

}
