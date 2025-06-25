import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { dateToObject, getToday, Language, MomentDateFormatter, CustomDatepickerI18n, objectToString } from '../../../../../shared/src/lib/util-functions/date-format';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-total-sale-agent-commercial',
  templateUrl: './total-sale-agent-commercial.component.html',
  styleUrls: ['./total-sale-agent-commercial.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class TotalSaleAgentCommercialComponent implements OnInit {

  
  filterSelect: string = 'week';

  from: string = getToday();
  
  date: string = null;

  dateSearchFrom: FormControl = new FormControl();
  dateSearchTo: FormControl = new FormControl(dateToObject(getToday()));

  constructor(private detectChanges: ChangeDetectorRef) { }

  ngOnInit() {
  }
  getDay(){
    return moment().format('DD/MM/YYYY');
  }

  getAll(event: any) {
    
    switch (event) {

        case "week":


           
            this.filterSelect = 'week';

            this.date = null;

            this.dateSearchFrom.setValue(dateToObject(this.date));

            //this.detectChanges.detectChanges();
            break;

        case "month":

            
            this.filterSelect = 'month';

            this.date = null;

            this.dateSearchFrom.setValue(dateToObject(this.date));

            //this.detectChanges.detectChanges();
            break;

        case "day":

            this.filterSelect = 'day';

            this.date = null;

            this.dateSearchFrom.setValue(dateToObject(this.date));
            
            //this.detectChanges.detectChanges();

            break;


            case "":

              this.filterSelect = '';
             
              this.date = null;

              this.dateSearchFrom.setValue(dateToObject(this.date));
             
              break;

      
        default:
            break;
    }

    //this.load();

}

changeDate(name: string, dataEvent: NgbDate) {

  if (name == 'date') {

    this.from = objectToString(dataEvent);

    this.date = this.from;

    this.filterSelect = null;

    this.detectChanges.detectChanges();
  }

}
lessDate() {
  this.date = moment(this.date).subtract(1,'d').format('YYYY-MM-DD');
  this.dateSearchFrom.setValue(dateToObject(this.date));
  this.detectChanges.detectChanges();
}
addDate() {
  this.date = moment(this.date).add(1,'d').format('YYYY-MM-DD');
  this.dateSearchFrom.setValue(dateToObject(this.date));
  this.detectChanges.detectChanges();
}

}
