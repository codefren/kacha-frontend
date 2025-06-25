import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
//import { CompanyPreferencesInterface } from 'libs/backend/src/lib/types/sending-report-company-preferences.type';
import { SendingReportInterface } from 'libs/backend/src/lib/types/sending-reports.type';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { map, take } from 'rxjs/operators';
import { reportCompanyPreference } from '../../../../backend/src/lib/types/sending-report-company-preferences.type';
import { dayTimeAsStringToSeconds } from 'libs/shared/src/lib/util-functions/day-time-to-seconds';
declare var $: any;

declare function init_plugins();
@Component({
  selector: 'easyroute-reports-settings',
  templateUrl: './reports-settings.component.html',
  styleUrls: ['./reports-settings.component.scss']
})
export class ReportsSettingsComponent implements OnInit {

  integrationSendList =[];

  changeValue: any = '';

  days = [];

  changeValueCostEffectiveness: any = '';

  changeValueCosts: any = '';

  changeValueUpdate: any = '';

  expanded = false;

  blockList: any [] =[];

  showBlock: boolean = false;

  reportCompanyAll: SendingReportInterface[];

  daySelecter: any[]=[];

  loadingReportSettings: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService,
    private service: StatePreferencesService,
    private backendService: BackendService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    for (let index = 1; index < 31; index++) {
      this.days.push(index);
     }

     this.getReportCompanyAll();

    this.getIntegrationSendEmail();


    setTimeout(
      function(){
        init_plugins()
      }, 1000);



  }

  getReportCompanyAll(){

    this.loadingReportSettings = true;

    this.backendService.get('report_company_all').pipe(take(1)).subscribe(
      (resp) => {

        this.reportCompanyAll = resp.data
        .map((v, i) => {
          return { 
            id:v.id,
            reportCompanyId:v.reportCompanyId,
            isActive:v.isActive,
            name:v.name,
            description : v.description,
            reportCompanyPreference : this.returnReportCompanyPreference(v.reportCompanyPreference)


          }

        }
        );

          this.getBlockGeneral();

          this.loadingReportSettings = false;

          this.changeDetectorRef.detectChanges();
          
      },
      (error) => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);

        this.loadingReportSettings = false;
      }



    );
  }

  returnReportCompanyPreference(data: any){

    let mapData: any [] = [];

    if (data.length > 0) {

      data.forEach((map: any) => {

        mapData.push({

          id: map.id,

          companyId: map.companyId,

          reportCompanyId: map.reportCompanyId,

          reportBlokId: map.reportBlokId,

          hourTime: map.hourTime,

          scheduleShipping: map.scheduleShipping,

          scheduledDay: map.scheduleShipping ==='week' ? this.transformtStringToArray(map.scheduledDay) : map.scheduledDay,

          isActive: map.isActive,

          report_company_preference_email:map.report_company_preference_email

    });

      });

    } else {

      mapData = [{

        id: 0,

        companyId: 0,

        reportCompanyId: 0,

        reportBlokId: '',

        hourTime: '',

        scheduleShipping: '',

        scheduledDay: '',

        isActive: false,

        report_company_preference_email:[]
      }];
    }

    return mapData;
  }

  transformtStringToArray(item:any){

    let split =  item.replace(/[\. , ,]+/g, " ");

    let array2 = split.split(' ');

    return array2;
  }

  getBlockGeneral(){

    this.backendService.get('report_block').pipe(take(1)).subscribe(
      (resp) => {

          this.blockList = resp.data;

          init_plugins();


         this.changeDetectorRef.detectChanges();

      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

  }

  getIntegrationSendEmail(){

    this.backendService.get('company_preference_integration').pipe(take(1)).subscribe(
      (resp) => {

          this.integrationSendList = resp.data;

         this.changeDetectorRef.detectChanges();

      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

  }


  validateEmil(enteredEmail:any){

    let mail_format = /\S+@\S+\.\S+/;

    if (enteredEmail && enteredEmail.value === '') {
      return null;
    }

    return mail_format.test(enteredEmail);

  }

  async createIntegrationSendEmail(value: any, item: any, internal: any){

    if(value && value != '' && value.length > 0){

      let sendMail = {

        reportEmail:value,

        reportCompanyId: item.reportCompanyId,

        reportCompanyPreferenceId: internal.id

      };


    await  this.loadingService.showLoading();

      this.backendService.post('report_company_preference_email', sendMail).pipe( take(1) )

      .subscribe(
        ({ data }) => {

          internal.report_company_preference_email.push(data);

          this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('Correo electrónico agregado satisfactoriamente'),
            this.translate.instant('GENERAL.ACCEPT'),
        );

        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
    }

  }

  async  deleteIntegrationSendEmail(index: number, data: any, internal: any){

    await this.loadingService.showLoading();

    this.backendService.delete('report_company_preference_email/'+ data.id).pipe( take(1) )
    .subscribe(

      ({ data }) => {


        internal.report_company_preference_email.splice(index, 1)

        this.changeDetectorRef.detectChanges();

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast('Correo eliminado satisfactoriamente');


      } ,
      ( error ) => {

        this.loadingService.hideLoading();

        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )

  }

  changeScheduleShipping(event: any, data: any){

    if (event ==='week') {

      data.scheduledDay = [];

    } else {

      data.scheduledDay = '';

    }

  }

  changeDaySelecter(event: any, data: any, numberDay: any ,index: any, r: any, day: any){


    if (event) {

      switch (numberDay) {

          case '1':

            data.scheduledDay.push(numberDay);

            break;

            case '2':

             data.scheduledDay.push(numberDay);

              break;

              case '3':

              data.scheduledDay.push(numberDay);

              break;

              case '4':

                data.scheduledDay.push(numberDay);

              break;

              case '5':

               data.scheduledDay.push(numberDay);

              break;

              case '6':
               data.scheduledDay.push(numberDay);

                break;

              case '7':

                data.scheduledDay.push(numberDay);

                break;

        default:
          break;
      }
    } else {

      data.scheduledDay = data.scheduledDay.filter((x: any) => x != numberDay);

      this.changeDetectorRef.detectChanges();

    }

    if (data.id > 0) {

      this.updateWeek(data, index, r, day, numberDay);

    }

  }

  updateWeek( item:any, index:any, r: any, day: any, numberDay: any){

      let SendWeek ={

        scheduledDay: this.checkArray(item.scheduledDay),

        scheduleShipping: item.scheduleShipping

      }

      this.loadingService.showLoading();

      this.backendService.put('report_company_preference/' + item.id , SendWeek).pipe( take(1) )

      .subscribe(

        ({ data }) => {

          item = data;

          let split =  item.scheduledDay.replace(/[\. , ,]+/g, " ");

          let array2 = split.split(' ');

          this.daySelecter = array2;

          this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT'),
        );

        } ,
        ( error ) => {

          $('#'+ day + index + r ).prop('checked', true);

          item.scheduledDay.push(numberDay);

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )

  }
  updateMonth(event: any, item:any){

  if (item.id > 0) {
    let SendMont ={
      scheduledDay: item.scheduledDay,
      scheduleShipping: item.scheduleShipping

    }

    this.backendService.put('report_company_preference/' + item.id , SendMont).pipe( take(1) )

    .subscribe(
      ({ data }) => {

        item = data;

        this.changeDetectorRef.detectChanges();

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT'),
      );

      } ,
      ( error ) => {

        this.loadingService.hideLoading();

        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )
  }

  }

  showCheckWeek(item: any, selectWeek: any){

    let selectedWeek: any;

    if (item && item.length > 0) {
      selectedWeek = item.find((x :any) => Number(x) === selectWeek) ? true: false;


      return selectedWeek;
    } else {
      return false;
    }


  }

  showCheckBlock(item: any, selectBlock: any, r:any){


    let selected: any = false;

    if (item) {
      let split =  item.replace(/[\. , ,]+/g, " ");

      let array2 = split.split(' ');

      selected = array2.find((x :any) => Number(x) === selectBlock.id) ? true: false;

    }




    return selected;
  }

  changeScheduleRent(event: any){

    this.changeValueCostEffectiveness = event;

    this.changeDetectorRef.detectChanges();

  }

  changeScheduleCost(event: any){

    this.changeValueCosts = event;

    this.changeDetectorRef.detectChanges();

  }

  changeScheduleUpdate(event: any){

    this.changeValueUpdate = event;

    this.changeDetectorRef.detectChanges();

  }

  async changeEmailBox(value:any, datas: any, item:any){


      if(value && value != '' && value.length > 0 && datas.hourTime && datas.scheduleShipping && datas.scheduledDay){

        const indexSelect = item.reportCompanyPreference.indexOf(datas);

        let send = {

          reportId:item.id,

          reportCompanyId: item.reportCompanyId,

          reportBlokId:  this.checkArray($('#blocks'+indexSelect).multiselect().val()),

          hourTime: datas.hourTime,

          scheduleShipping: datas.scheduleShipping,

          scheduledDay: datas.scheduleShipping ==='week' ? this.checkArray(datas.scheduledDay) : datas.scheduledDay,

          reportEmail:value

        }

        if (item.id != 1 ) {

          delete send.reportBlokId;

        }

        await this.loadingService.showLoading();

        this.backendService.post('report_company_preference', send).pipe( take(1) )
        .subscribe(
          ({ data }) => {

            item.reportCompanyPreference[indexSelect].id = data.id;

            item.reportCompanyPreference[indexSelect].companyId = data.companyId;

            item.reportCompanyPreference[indexSelect].reportCompanyId = data.reportCompanyId;

            item.reportCompanyPreference[indexSelect].report_company_preference_email = data.report_company_preference_email;

            this.changeDetectorRef.detectChanges();

            this.loadingService.hideLoading();

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('GENERAL.REGISTRATION'),
              this.translate.instant('GENERAL.ACCEPT'),
          );

          } ,
          ( error ) => {

            this.loadingService.hideLoading();

            this.toastService.displayHTTPErrorToast( error.status, error.error.error );
          }
        )
      }

  }

  checkArray(data: any){
  
    let clearArray: any ='';

    if (data) {

      data.forEach((element: any, index: any) => {

        if (index === 0) {

          clearArray = clearArray.concat(element);

        } else {

          clearArray = clearArray.concat(',',element);

        }

      });

    }

    return clearArray;


  }

   showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded = false;
    }
  }

  deleteChangeBlock(event:any, r: any){

       event.stopPropagation();

       $('#blocks' + r).off('change');
  }

  add(event:any, r: any, internal: any, item: any){

   if (internal.id > 0) {

    let that = this;

    $('#blocks' + r).change(function(e: any) {

        that.updateSelect(event, internal, r, item);

    });

   } else {

    event.stopPropagation();

     return

   }



  }

  updateSelect(event: any ,internal: any, index: any, item: any){


    let sendBlock ={

      reportId: item.id,

      reportBlokId:  this.checkArray($('#blocks'+index).multiselect().val()),

    }

    this.backendService.put('report_company_preference/' + internal.id , sendBlock).pipe( take(1) )

    .subscribe(
      ({ data }) => {

        this.changeDetectorRef.detectChanges();

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT'),
      );

      } ,
      ( error ) => {

        this.loadingService.hideLoading();

        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )

  }

  activatePreferencesInfoGeneral(event:any, id:any, item:any){


    let data ={

      reportId: id,

      isActive:event
    }

    this.backendService.post('report_company', data).pipe(take(1)).subscribe(
      (resp) => {

          item.isActive = resp.data.isActive;

          item.reportCompanyId = resp.data.id;

          this.toastService.displayWebsiteRelatedToast(

            this.translate.instant(

                'PREFERENCES.NOTIFICATIONS.UPDATE_NOTIFICATIONS',

            ),

            this.translate.instant('GENERAL.ACCEPT'),
        );

        this.changeDetectorRef.detectChanges();

        setTimeout(
          function(){
            init_plugins()
          }, 1);
    
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

  }


  updateChange(event:any, item:any, dataF: any){

    item.hourTime = dayTimeAsStringToSeconds(event);

    if (item.id > 0) {

      let data = {
        hourTime: item.hourTime
      }

      this.backendService.put('report_company_preference/' + item.id , data).pipe( take(1) )

      .subscribe(
        ({ data }) => {

          item = data;

          this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT'),
        );

        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
    }

  }

  addOtherReportRoute(reportFather: any){

    let add : any;

     add ={

      id: 0,

      companyId: 0,

      reportCompanyId: 0,

      reportBlokId: '',

      hourTime: '',

      scheduleShipping: '',

      scheduledDay: '',

      isActive: false,

      report_company_preference_email:[]
    };

    reportFather.reportCompanyPreference.push(add);

    const index = reportFather.reportCompanyPreference.indexOf(add);

    init_plugins();

    /* $(document).ready(function() {

      $('#blocks'+ index).change(function(e: any) {
      });

  }); */

    this.changeDetectorRef.detectChanges();

  }

  deleteOtherReport(reportSon: any, index: any, father:any){

    if(reportSon.id > 0){

      this.loadingService.showLoading();

      this.backendService.delete('report_company_preference/'+ reportSon.id).pipe( take(1) )
        .subscribe(

        ({ data }) => {

          father.splice(index, 1);

          this.changeDetectorRef.detectChanges();

          this.loadingService.hideLoading();

          this.toastService.displayWebsiteRelatedToast('Personalización eliminado satisfactoriamente');


        },
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      );

    } else{

      father.splice(index, 1);

      this.changeDetectorRef.detectChanges();
    }
  }


}

