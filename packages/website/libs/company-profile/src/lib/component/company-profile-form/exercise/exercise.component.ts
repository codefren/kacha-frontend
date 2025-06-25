import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmModalComponent, CustomDatepickerI18n, dateToObject, getDateMoment, Language, MomentDateFormatter, objectToString, ToastService } from '@optimroute/shared';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'easyroute-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class ExerciseComponent implements OnInit {
  
  //hoveredDate: NgbDate | null = null;

  //dateSearchFrom: FormGroup;

	fromDate: NgbDateStruct | null;

  festiveDay: any[] = [];
  
  constructor(private backend: BackendService,
    private modal: NgbModal,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetectRef: ChangeDetectorRef,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
    ) { }


  ngOnInit() {
    this.load();
  }


  load(){
    this.backend.get('company_festive_day').pipe(take(1)).subscribe(({data})=>{
      this.festiveDay = data;
    })
  }

  addHoliday(){
    this.festiveDay.push({
      name: '',
      date: ''
    });
  }

  deleteHoliday(index: number){

    let day = this.festiveDay[index];

    if(day && day.id && day.id > 0){


      const modal = this.modal.open(ConfirmModalComponent, {
        size: 'xs',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
      });

      modal.componentInstance.message = "¿Está seguro de eliminar?";
      modal.componentInstance.cssParrafo = true;

      modal.result.then((resp) => {
        if (resp) {
          this.backend.delete('company_festive_day/' + day.id).pipe(take(1)).subscribe(()=>{
            this.festiveDay.splice(index,1);
            this.changeDetectRef.detectChanges();
          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          })
        }
      });

    } else {
      this.festiveDay.splice(index,1);
    }
  }

  changeName(value: string, festiveDay: any, index: number){
    if(festiveDay && festiveDay.id && festiveDay.id > 0){
      this.backend.put('company_festive_day/' + festiveDay.id, {
        name: value,
        date: festiveDay.date
      }).pipe(take(1)).subscribe(({data})=>{
        this.festiveDay[index] = data;
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT')
        );
        this.changeDetectRef.detectChanges();
      })
    } else {
      this.festiveDay[index].name = value;
      if(this.festiveDay[index].name != '' && this.festiveDay[index].date != ''){
        this.backend.post('company_festive_day',this.festiveDay[index]).pipe(take(1)).subscribe(({data})=>{
          this.festiveDay[index] = data;
          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this.changeDetectRef.detectChanges();
        },error => {
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
      } 
    }
  }
  changeValue(value: any, festiveDay: any, index: number){

    if(festiveDay && festiveDay.id && festiveDay.id > 0){
      this.backend.put('company_festive_day/' + festiveDay.id, {
        name: festiveDay.name,
        date: objectToString(value)
      }).pipe(take(1)).subscribe(({data})=>{
        this.festiveDay[index] = data;
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT')
        );
        this.changeDetectRef.detectChanges();
      })
    } else {
      this.festiveDay[index].date = objectToString(value);
      if(this.festiveDay[index].name != '' && this.festiveDay[index].date != ''){
        this.backend.post('company_festive_day', this.festiveDay[index]).pipe(take(1)).subscribe(({data})=>{
          this.festiveDay[index] = data;
          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this.changeDetectRef.detectChanges();
        },error => {
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
      } 
    }
  }

  dateFormat(value: any){

    return getDateMoment(value);
    
  }

}
