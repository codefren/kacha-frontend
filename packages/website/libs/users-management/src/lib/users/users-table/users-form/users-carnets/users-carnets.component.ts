import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, User } from '@optimroute/backend';
import { LoadingService, sliceMediaString, ToastService } from '@optimroute/shared';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'easyroute-users-carnets',
  templateUrl: './users-carnets.component.html',
  styleUrls: ['./users-carnets.component.scss']
})
export class UsersCarnetsComponent implements OnInit, OnChanges {

  @Input() idParam: any;

  @Input() me: boolean;

  user: User;

  carnetFormGroup: FormGroup;

  drivingLicens:FormGroup;

  otherLicensesForm: FormGroup;

  drivingLicenses: any [] =[];

  showDrivingLicenses: boolean = true;

  otherLicenses: any;

  showOtherLicense: boolean = true;

  constructor(
    private stateUsersService: StateUsersService,
    private detectChange: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,

  ) { }

  ngOnInit() {

  }

  ngOnChanges() {

   this.validateRoute();


  }

  sliceString(text: string) {
    return sliceMediaString(text, 24, '(min-width: 960px)');
  }

  validateRoute() {


    if (this.idParam !== 'new') {

      this.backendService.get(`get_user_license_all/${this.idParam}`).pipe(take(1)).subscribe(
        ( data ) => {

            this.user = {
              drivingLicenses: data.drivingLicenses,
              otherLicenses: data.otherLicenses
            };

            this.initForm(this.user);



            try{

              this.detectChange.detectChanges();

            } catch(e){

            }

            this.loadingService.hideLoading();
        },
        (error) => {
            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

    }

  }

  initForm(user: User) {

    this.carnetFormGroup = this.fb.group({
        drivingLicenses:  new FormArray([]),
        otherLicenses: new FormArray([]),
    });

    this.getDrivingLicenses();

    this.getOtherLicenses();

    console.log(this.carnetFormGroup, 'fomrulario cargado');
  }

  get drivingLicensAdd(){
    return this.carnetFormGroup.get('drivingLicenses') as FormArray;
  }

  get drivingOtherLicensAdd(){
    return this.carnetFormGroup.get('otherLicenses') as FormArray;
  }



  getOtherLicenses() {
    this.showOtherLicense = false;

    this.stateUsersService.loadOtherLicenseByCompany().pipe(take(1)).subscribe(({ data }) => {
        this.showOtherLicense = true;

        this.otherLicenses = data;

        this.addFilterOtherLicenses();
    });
  }

  addFilterOtherLicenses() {

    this.otherLicenses.map((o, i) => {


      if (this.user.otherLicenses.length > 0) {

        this.otherLicensesForm = new FormGroup({

          companyOtherLicenseId: new FormControl(this.user.otherLicenses.find((x) => x.id === o.id) !=
          undefined),

          expirationDate: new FormControl(this.user.otherLicenses.find((x) => x.id === o.id) ? this.user.otherLicenses.find((x) => x.id === o.id).expirationDate  : '') ,

        });


        this.drivingOtherLicensAdd.push(this.otherLicensesForm);

      } else {
        this.otherLicensesForm = new FormGroup({
          companyOtherLicenseId: new FormControl(false),
          expirationDate: new FormControl(''),

        });


        this.drivingOtherLicensAdd.push(this.otherLicensesForm);
      }



    });

  }

  /* servicio de obtner licencias */

  getDrivingLicenses() {
    this.showDrivingLicenses = false;

    this.stateUsersService.loadLicenseByCompany().pipe(take(1)).subscribe(({ data }) => {

        this.showDrivingLicenses = true;

        this.drivingLicenses = data;

       this.addFilterDrivingLicenses();


    });
  }

  /* llenar el formulario array */

  addFilterDrivingLicenses() {

    this.drivingLicenses.map((o, i) => {


      if (this.user.drivingLicenses.length > 0) {

        this.drivingLicens = new FormGroup({

          companyLicenseId: new FormControl(this.user.drivingLicenses.find((x) => x.id === o.id) !=
          undefined),

          expirationDate: new FormControl(this.user.drivingLicenses.find((x) => x.id === o.id) ? this.user.drivingLicenses.find((x) => x.id === o.id).expirationDate  : '') ,

        });


        this.drivingLicensAdd.push(this.drivingLicens);

      } else {

        this.drivingLicens = new FormGroup({

          companyLicenseId: new FormControl(false),

          expirationDate: new FormControl(''),


        });

        this.drivingLicensAdd.push(this.drivingLicens);
      }

    });
  }

  getChargingConcepts(){

      this.drivingLicenses.forEach((item) => {

        const drivingLicens = new FormGroup({
          companyLicenseId: new FormControl(''),
          expirationDate: new FormControl(''),

        });


        this.drivingLicensAdd.push(drivingLicens);

      })



  }



  submit() {

    console.log(this.carnetFormGroup, 'formulario')

    let data = this.confirmAddition(this.carnetFormGroup);

    this.backendService.put('load_user_license_all/' + this.idParam, data).pipe(take(1)).subscribe((data)=>{
        this.toastService.displayWebsiteRelatedToast(

            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

            this.translate.instant('GENERAL.ACCEPT')

        );
    })

  }

  confirmAddition(form): User {
    let datos: User = {
      drivingLicenses: this.getFilterValueDrivingLicenses(),
      otherLicenses: this.getFilterValueOtherLicenses(),
    };

    return datos;
  }

  getFilterValueDrivingLicenses() {

 
    const selectedFilterIds = this.carnetFormGroup.value.drivingLicenses

        .map((v, i) =>
            v
                ? {
                  companyLicenseId: v.companyLicenseId ? this.drivingLicenses[i].companyLicenseId :null,
                  expirationDate:  v.companyLicenseId ? v.expirationDate : ''
                }
                : null,
        )
        .filter((v) =>v.expirationDate !== '');

        console.log(selectedFilterIds)

       
   return selectedFilterIds;

  }

  getFilterValueOtherLicenses() {
  
    
    const selectedFilterIds = this.carnetFormGroup.value.otherLicenses

    .map((v, i) =>
        v
            ? {
              companyOtherLicenseId: v.companyOtherLicenseId ? this.otherLicenses[i].id : null,
              expirationDate: v.companyOtherLicenseId? v.expirationDate :''
            }
            : null,
    )
    .filter((v) => v.expirationDate !== '');


   
return selectedFilterIds;

  }

  redirect(value: any){

    //this.router.navigate([`/management/users-settings/${this.idParam}/${this.me}/${value}`]);
    this.router.navigateByUrl(`/preferences?option=${value}`);
  }


  changeOtherLicensesCheckbox(value:any, data: any, index: any){


    let dataform = _.cloneDeep(data.value);

    dataform.companyOtherLicenseId = value;

    this.drivingOtherLicensAdd.controls[index].get('companyOtherLicenseId').setValue( dataform.companyOtherLicenseId );

    if(value){
      this.drivingOtherLicensAdd.controls[index].get('expirationDate').setValidators(Validators.required);
      this.drivingOtherLicensAdd.controls[index].get('expirationDate').updateValueAndValidity();
    } else {
      this.drivingOtherLicensAdd.controls[index].get('expirationDate').setValidators(null);
    this.drivingOtherLicensAdd.controls[index].get('expirationDate').updateValueAndValidity();
    }



    this.detectChange.detectChanges();

  }

  changeOtherDate(value:any, data: any, index: any){

    let dataform = _.cloneDeep(data.value);

    dataform.expirationDate = value;

    this.drivingOtherLicensAdd.controls[index].get('expirationDate').setValue( dataform.expirationDate);

    this.detectChange.detectChanges();

  }

  changeCheckbox(value:any, data: any, index: any){


    let dataform = _.cloneDeep(data.value);

    dataform.companyLicenseId =value;

    this.drivingLicensAdd.controls[index].get('companyLicenseId').setValue( dataform.companyLicenseId );

    this.drivingLicensAdd.controls[index].get('expirationDate').setValidators(Validators.required);
    this.drivingLicensAdd.controls[index].get('expirationDate').updateValueAndValidity();

    if(value){

      this.drivingLicensAdd.controls[index].get('expirationDate').setValidators(Validators.required);

      this.drivingLicensAdd.controls[index].get('expirationDate').updateValueAndValidity();

    } else {

      this.drivingLicensAdd.controls[index].get('expirationDate').setValidators(null);

      this.drivingLicensAdd.controls[index].get('expirationDate').updateValueAndValidity();

    }


    this.detectChange.detectChanges();

  }

  changeDate(value:any, data: any, index: any){

    let dataform = _.cloneDeep(data.value);

    dataform.expirationDate = value;

    this.drivingLicensAdd.controls[index].get('expirationDate').setValue( dataform.expirationDate);


    this.detectChange.detectChanges();

  }

  getDiffDays(date:any){

    let dayNow = moment().format('YYYY-MM-DD');

    return moment(date).diff(dayNow, 'days');

  }

}
