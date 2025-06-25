import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Company, Profile, User } from '@optimroute/backend';
import { dayTimeAsStringToSeconds, LoadingService, secondsToDayTimeAsString, ToastService, UtilData } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UsersService } from '../../../users/users.service';
import { ValidateCompanyId } from '../../../../../../shared/src/lib/validators/company-id.validator';
import { ValidatePhone } from '../../../../../../shared/src/lib/validators/phone.validator';
import { UserMessages } from '../../../../../../shared/src/lib/messages/user/user.message';

declare function init_plugins();
import * as moment from 'moment';
import { UsersConfirmDialogComponent } from '../users-confirm-dialog/users-confirm-dialog.component';
import { ModaIncidentDetailComponent } from '../moda-incident-detail/moda-incident-detail.component';
import { environment } from '@optimroute/env/environment';
import { UserModalDocumentComponent } from '../user-modal-document/user-modal-document.component';
import { UserModalConfirmDocumentComponent } from '../user-modal-confirm-document/user-modal-confirm-document.component';

declare var $: any;



@Component({
  selector: 'easyroute-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  createUserFormGroup: FormGroup;
    companies: Company[];
    profiles: any;
    usuario_messages: any;
    userMe: any;
    user: User;
    me: boolean;
    countrys: any = [];
    countrysWithPhone: any = [];
    countrysWithCode: any = [];
    prefix: any;
    unsubscribe$ = new Subject<void>();
    status: string;
    option: string;
    profile: Profile;
    isTecnical: boolean = false;
    showPreparator : boolean = false;
    titleTranslate: string = 'USERS.USER_DETAIL';
    toggleSchedule: boolean = true;
    loadingSchedule: boolean = false;
    loadingDriver: boolean = false;
    table: any;
    userId: number;
    tableDocument: any
    userType: any
    

  constructor( 
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _profileSettingsFacade: ProfileSettingsFacade,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private _company: StateCompaniesService,
    private userService: UsersService,
    private usersFacade: StateUsersFacade,
    public authLocal: AuthLocalService,
    private toast: ToastService,
    private companyService: StateCompaniesService,
    private stateUserService: StateUsersService,
    private dialog: NgbModal,
    private router: Router,
    private loading: LoadingService,
    private detectChange: ChangeDetectorRef) { }


    ngOnInit() {
      this.loadingService.showLoading();
 
      setTimeout(()=>{
          init_plugins();
      }, 1000);  

      this.setUtilData();

      this._profileSettingsFacade.profile$.pipe(take(1)).subscribe(
          (resp) => {
              this.profile = resp;
              this.userMe = resp;
              this.validateRoute();
          },
          (error) => {
              console.log(error);
          },
      );
    }

      ngOnDestroy() {
          this.unsubscribe$.next();
          this.unsubscribe$.complete();
      }
    
      showToggleSchedule(){
    
          this.toggleSchedule = !this.toggleSchedule;
      }
  
    incidentHistory() {

        this._activatedRoute.params.subscribe((params) => {
            this.userId = params['id'];
        });
         
        let url = environment.apiUrl + 'incident_history_datatables?userId=' + this.userId;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#driverIncidentHistory';
        
        this.table = $('#driverIncidentHistory').DataTable({
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            order: [0, 'desc'],
            lengthMenu: [50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
              },
            dom: `
                <'row'<'col-sm-6 col-12 d-flex flex-column align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-6 col-12 label-search'fr>
                    >
                <"top-button-hide"><'point no-scroll-x table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
            buttons: [
            {
                extend: 'colvis',
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function(dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
          ],
            language: environment.DataTableEspaniol,
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 10px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';
    
                    $('#companies_processing').html(html);
                },
            },
            columns: [
                {
                    data: 'created_at',
                    title: this.translate.instant('NOTIFICATIONS.DETAILS.INCIDENT_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: 'created_at',
                    title: this.translate.instant('NOTIFICATIONS.DETAILS.HOUR'),
                    render: (data, type, row) => {
                        return moment(data).format('HH:mm');
                    },
                },
                {
                    data: 'breakdownTypeDetail.name',
                    title: this.translate.instant('NOTIFICATIONS.DETAILS.WHAT_HAS_HAPPENED?'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true">No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                    data +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'observations',
                    title: this.translate.instant('NOTIFICATIONS.DETAILS.OBSERVATIONS'),
                    render: (data, type, row) => {
                        if (data == null || data == 0 || data == '') {
                            return '<span class="text center" aria-hidden="true">No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                   this.showObservation(data) +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this.translate.instant('NOTIFICATIONS.DETAILS.WATCH'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones +=
                            (`
                                <div class="text-center editar">
                                    <i class="fas fa-eye point" style="color: #24397c;"></i>
                                </div>
                            `);
                            
                        return botones;
                    },
                },
            ],
        });
        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group datatables-input-group-width-user mr-xl-2">
                    <input id="search" type="text" 
                    class="form-control 
                    pull-right input-personalize-datatable" 
                    style="height: 34px !important;"
                    placeholder="Buscar">
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
        `);
        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });
    
        $('.dataTables_filter').removeAttr('class');
        
        this.editar('#driverIncidentHistory tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.openModalDetailIncident(data);
        });
    }

  validateRoute() {
      this._activatedRoute.params.subscribe(({ id, me }) => {
          this.me = me ? true : false;

          if (id === 'new') {
              this.isTecnical = false;
              this.user = new User();
              this.initForm(this.user);
              this.loadingService.hideLoading();
          } else {
            this.loadingDriver= true;
              this.titleTranslate = 'USERS.USER_DETAIL';
              this.backendService.get(`users/${id}`).subscribe(
                  ({ data }) => {
                      this.user = {
                          email: data.email,
                          name: data.name,
                          surname: data.surname,
                          nationalId: data.nationalId,
                          phone: data.phone,
                          companyId: data.company.id,
                          company: data.company,
                          isActive: data.isActive,
                          country: data.profile.country,
                          countryCode: data.company.countryCode,
                          allowedQuantityOrders: data.allowedQuantityOrders,
                          profiles: data.profiles,
                          profile:data.profile,
                          id: data.id,
                          useSchedule: data.useSchedule,
                          vehicleBreakdown:data.vehicleBreakdown,
                          userType:data.userType

                      };

                     

                      if (data.profiles && data.profiles.find((x) => x.id === 6)) {
                          this.isTecnical = true;
                      }
                      this.initForm(this.user);

                      this.loadingDriver= false;

                      /* esta pequeña condición hacer que se muestre el datatable luego del que cargue la petición y el llene el
                      formulario */
                      if (this.user.id > 0) {
                        try{
                          this.detectChange.detectChanges();
                          this.incidentHistory();
                          this.cargarDocument();
                        } catch(e){
                  
                        }
                  
                      }  

                      this.loadingService.hideLoading();
                      this.detectChange.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.status,
                          error.error.error,
                      );
                  },
              );
          }
      });
  }

  setUtilData() {
      this.countrys = UtilData.getCountry();
      this.countrysWithPhone = UtilData.getCountryPhoneCode();
      this.countrysWithCode = UtilData.getCountryWithCode();
  }

  setCompanies() {
      this._company
          .loadCompanies(this.me)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
              ({ data }) => (this.companies = data),
              (error) => console.log(error),
          );
  }

  secondToTime(value){
     return secondsToDayTimeAsString(value);
  }

  addScheduleToDay(intDay: number, item: any){
      let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
      if(this.user.id > 0) {
          this.backendService.post('user_schedule_hour', {
              userScheduleDayId: item.id
          }).pipe(take(1)).subscribe((response)=>{
              schedule.hours.push(response.data);
              this.detectChange.detectChanges();
          })
      } else {
          schedule.hours.push({
              timeStart: -1,
              timeEnd: -1
          });
      }
     
     
  }

  changeHour(value, hour: any, day, time: string){
      const index = day.hours.indexOf(hour);
      
      if(hour.id > 0) {

          if(time === 'start'){
              day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
          } else {
              day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
          }
          if(day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0){
              this.backendService.put('user_schedule_hour/' + hour.id, day.hours[index])
                  .pipe(take(1))
                  .subscribe((response)=>{
              }, error => {
                  this.toast.displayHTTPErrorToast(error.status, error.error.error)
              })
          }
          
      } else {
          if(time === 'start'){
              day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
          } else {
              day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
          }
      }
  }

  changeScheduleDay(value, dayNumber){
      console.log(this.user.schedule);
      let schedule = this.user.schedule.days.find(x => x.intDay == dayNumber);

      if(this.user.id > 0) {
          this.backendService.put('user_schedule_day/' + schedule.id, {
              isActive: value
          }).pipe(take(1)).subscribe((response)=>{
              schedule.isActive = value;
              if(!schedule.hours || (schedule.hours && schedule.hours.length === 0)){
                  this.addScheduleToDay(dayNumber, schedule);
              }
              this.detectChange.detectChanges();
          })
      } else {
          if(schedule){
              schedule.isActive = value;
          }else {
              this.user.schedule.days.push({
                  intDay: dayNumber,
                  isActive: value,
                  id: 0,
                  hours: [{
                      timeStart: -1,
                      timeEnd: -1,
                      id: 0
                  }]
              })
          }
          
          this.detectChange.detectChanges();
      }

      
  }

  deleteHours(intDay, hours){
      let schedule = this.user.schedule.days.find(x => x.intDay == intDay);
      if(hours.id > 0){
          this.backendService.delete('user_schedule_hour/' + hours.id).pipe(take(1)).subscribe(response => {
              const index = schedule.hours.indexOf(hours);
              schedule.hours.splice(index,1);
              this.detectChange.detectChanges();
          });
      }else {
          const index = schedule.hours.indexOf(hours);
          schedule.hours.splice(index,1);
          this.detectChange.detectChanges();
      }
      
  }

  sortBy(prop: string){
      return this.user.schedule.days.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  getDayName(dayNumber){
      let name = '';
      switch (dayNumber) {
          case 1: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.MONDAY'); 
              break
          };
          case 2: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.TUESDAY'); 
              break
          };
          case 3: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.WEDNESDAY'); 
              break
          };
          case 4: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.THURSDAY'); 
              break
          };
          case 5: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.FRIDAY'); 
              break
          };
          case 6: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.SATURDAY'); 
              break
          };
          case 7: {
              name = this.translate.instant('SCHEDULE_WORK.DAY.SUNDAY'); 
              break
          };
      }

      return name;
  }

  initForm(user: User) {
      this.status =
          +user.isActive === 1
              ? this.translate.instant('GENERAL.IS_ACTIVE')
              : this.translate.instant('GENERAL.IS_INACTIVE');
      this.option =
          +user.isActive === 1
              ? this.translate.instant('USERS.DEACTIVATE_USER')
              : this.translate.instant('USERS.ACTIVATE_USER');
      this.prefix = this.countrysWithPhone.find((x) => x.country === user.country)
          ? '+' + this.countrysWithPhone.find((x) => x.country === user.country).code
          : '+34';

      this.createUserFormGroup = this.fb.group({
          email: [user.email, [Validators.email, Validators.required]],
          name: [
              user.name,
              [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
          ],
          surname: [
              user.surname,
              [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
          ],
          nationalId: [
              user.nationalId,
              [
                  ValidateCompanyId(user.country ? user.country : 'España'),
                  Validators.maxLength(50),
              ],
          ],
          phone: [
              user.phone ? user.phone : this.prefix,
              [
                  ValidatePhone(user.country ? user.country : 'España'),
                  Validators.required,
              ],
          ],
          country: [
              user.country ? user.country : this.profile.company.country,
              [Validators.required],
          ],
          companyId: [
              this.me ? this.userMe.profile.companyId : user.companyId,
              [Validators.required, Validators.min(1)],
          ],
          countryCode: [user.countryCode ? user.countryCode : 'ES'],
          profiles: this.fb.array([]),
          password: ['',  this.setPasswordValidators( user.id ) ],
          password_confirmation: ['', this.checkPasswords.bind(this)],
          isActive: [user.isActive],
          allowedQuantityOrders:[ user.allowedQuantityOrders],
          useSchedule: [user.useSchedule ? true : false],
          activeScheduleMonday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 1) ? true : false],
          activeScheduleTuesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 2) ? true : false],
          activeScheduleWednesday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 3) ? true : false],
          activeScheduleThursday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 4) ? true : false],
          activeScheduleFriday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 5) ? true : false],
          activeScheduleSaturday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 6) ? true : false],
          activeScheduleSunday: [user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 7) ? true : false],
          userTypeId:[{value: user.userType !=null ? user.userType.id :1, disabled: true }]
      });

      if (this.me && !this.isAdmin()) {
          this.createUserFormGroup.controls['companyId'].disable();
      } else {
          this.createUserFormGroup.controls['companyId'].enable();
      }
      this.userService.loadProfiles().subscribe(({ data }) => {
          this.profiles = data;
          this.addProfiles(user.profiles);
      });
      this.userService.getUser().subscribe(({ data }) => {
        this.userType = data;
    });


      if(this.user.useSchedule){
          this.loadingSchedule = true;
          this.backendService.get('user_schedule/' + this.user.id).pipe((take(1))).subscribe(datos =>{
              console.log(datos);
              this.user.schedule = {
                  days: datos.data
              }
              this.createUserFormGroup.get('activeScheduleMonday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 1 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleTuesday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 2 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleWednesday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 3 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleThursday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 4 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleFriday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 5 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleSaturday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 6 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleSunday').setValue(user.schedule && user.schedule.days && user.schedule.days.find(x => x.intDay === 7 && x.isActive === true) ? true : false);

              this.createUserFormGroup.get('activeScheduleMonday').disable();
              this.createUserFormGroup.get('activeScheduleTuesday').disable();
              this.createUserFormGroup.get('activeScheduleWednesday').disable();
              this.createUserFormGroup.get('activeScheduleThursday').disable();
              this.createUserFormGroup.get('activeScheduleFriday').disable();
              this.createUserFormGroup.get('activeScheduleSaturday').disable();
              this.createUserFormGroup.get('activeScheduleSunday').disable();
              this.loadingSchedule = false;
          })
      }

      this.setCompanies();
      this.usuario_messages = new UserMessages().getUserMessages();
  }

  setPasswordValidators( id: number ) {
      if ( id > 0 ) {
          return [ Validators.minLength(8) ];
      }

      return [ Validators.required, Validators.minLength(8) ];
  }

  changeUseSchedule(){
      if(this.user.id > 0 && this.createUserFormGroup.get('useSchedule').value && !this.user.schedule){
          this.loadingSchedule = true;
          this.backendService.put('user_schedule_day/user/' + this.user.id).pipe(take(1)).subscribe(response=>{
              this.user.schedule = {
                  days: response.data
              };
              this.createUserFormGroup.get('activeScheduleMonday').setValue( response.data.find(x => x.intDay === 1 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleTuesday').setValue(response.data.find(x => x.intDay === 2 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleWednesday').setValue(response.data.find(x => x.intDay === 3 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleThursday').setValue(response.data.find(x => x.intDay === 4 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleFriday').setValue(response.data.find(x => x.intDay === 5 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleSaturday').setValue(response.data.find(x => x.intDay === 6 && x.isActive === true) ? true : false);
              this.createUserFormGroup.get('activeScheduleSunday').setValue(response.data.find(x => x.intDay === 7 && x.isActive === true) ? true : false);
              this.loadingSchedule = false;
              this.detectChange.detectChanges();
          });
      }
      
  }

  validtimeStart(hours){
      console.log(hours,'hoursstart');
      return hours.timeStart > hours.timeEnd || hours.timeStart === -1 ? true : false;
  }

  validtimeEnd(hours){
      console.log(hours,'end');
      return hours.timeEnd < hours.timeStart || hours.timeEnd === -1 ? true : false;
  }

  checkPasswords(group: AbstractControl) {
      let pass = group.root.value.password;
      let confirmPass = group.value;

      return pass === confirmPass ? null : { confirmar: true };
  }

  changeCountry(value: string) {
      this.createUserFormGroup
          .get('countryCode')
          .setValue(this.countrysWithCode.find((x) => x.country === value).key);

      if (value != 'España') {
          this.prefix = this.countrysWithPhone.find((x) => x.country === value)
              ? '+' + this.countrysWithPhone.find((x) => x.country === value).code
              : '';
          this.createUserFormGroup.get('phone').setValue(this.prefix);
          this.createUserFormGroup
              .get('nationalId')
              .setValidators([Validators.maxLength(50)]);
          this.createUserFormGroup.get('nationalId').updateValueAndValidity();
      } else {
          this.prefix = '+34';
          this.createUserFormGroup.get('phone').setValue(this.prefix);
          this.createUserFormGroup
              .get('nationalId')
              .setValidators([ValidateCompanyId('España'), Validators.maxLength(50)]);
          this.createUserFormGroup.get('nationalId').updateValueAndValidity();
      }

      this.createUserFormGroup
          .get('phone')
          .setValidators([
              ValidatePhone(
                  UtilData.COUNTRIES[
                      this.countrysWithCode.find(
                          (x) =>
                              x.country === this.createUserFormGroup.get('country').value,
                      ).key
                  ],
              ),
              Validators.required,
          ]);

      this.createUserFormGroup.get('phone').updateValueAndValidity();
  }

  addProfiles(profiles: any[]) {
      
      this.profiles.map((o, i) => {
          let control: FormControl;
          if (profiles) {
              control = new FormControl(
                  profiles.find((x) => x.name === o.name) != undefined,
              );
             
          } else {
              control = new FormControl(false);
          }
          (this.createUserFormGroup.controls.profiles as FormArray).push(control);
      
      });
  }

  selectPreparator(event: any, name:any){
      console.log( name, 'nombre')
      if (event &&  name ==='Preparador') {
          this.showPreparator = true;
      } else if (!event && name ==='Preparador') {
          this.showPreparator = false;
      }
     
  }

  getPreparator(selectedOrderIds: any){
      const dato =  selectedOrderIds.find( x => x.name === 'Preparador') !=undefined;  

      let preparatorName = selectedOrderIds.find( x => x.name === 'Preparador');
      preparatorName ? Object.assign({}, name) : false
      
       if (preparatorName && preparatorName.name !=undefined) {
           this.selectPreparator(dato ,preparatorName.name);
       }    
  }

  createUser(): void {

      if (this.user.id && this.user.id > 0) {
          this.editUser([this.user.id, this.obtainNewUser()]);
          this.usersFacade.updated$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  if (data) {
                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant('USERS.USER_UPDATED'),
                          this.translate.instant('GENERAL.ACCEPT'),
                      );
                      if (this.me) {
                          this.router.navigateByUrl('management/users');
                      } else {
                          this.router.navigateByUrl('users-management/users');
                      }
                  }
              });
      } else {
          let profiles = this.getProfiles();
          let profileAccept =
              profiles &&
              profiles.length > 1 &&
              profiles.find((x) => x.id === 6) === undefined
                  ? true
                  : profiles.length > 1 && profiles.find((x) => x.id === 6)
                  ? true
                  : profiles.length === 1 && profiles.find((x) => x.id !== 6)
                  ? true
                  : false;
          
          let buttonAccept = 'GENERAL.TO_ACCEPT';

          if (
              this.profile &&
              this.profile.company &&
              this.profile.company.subscriptions &&
              this.profile.company.subscriptions.length > 0 &&
              (profileAccept || profiles.lenght === 0)
          ) {
              console.log('******** Gestion ********');
              this.loading.showLoading();
              this.companyService
                  .costPlan()
                  .pipe(take(1))
                  .subscribe(
                      (data) => {
                          this.loading.hideLoading();
                          const dialogRef = this.dialog.open(
                              UsersConfirmDialogComponent,
                              {
                                  backdropClass: 'customBackdrop',
                                  centered: true,
                                  backdrop: 'static',
                              },
                          );
                          let title = 'USERS.CONFIRM_ACTIVE';
                          dialogRef.componentInstance.title = title;
                          dialogRef.componentInstance.body1 = 'USERS.BODY_ACTIVATE_1';
                          dialogRef.componentInstance.body2 = 'USERS.BODY_ACTIVATE_2';
                          dialogRef.componentInstance.body3 = data.totalPricePerUser;
                          dialogRef.componentInstance.buttonAccept = buttonAccept;
                          dialogRef.result
                              .then((resp) => {
                                  if (resp) {
                                      this.addUser(this.obtainNewUser());
                                      this.usersFacade.added$
                                          .pipe(takeUntil(this.unsubscribe$))
                                          .subscribe((data) => {
                                              if (data) {
                                                  this.toastService.displayWebsiteRelatedToast(
                                                      this.translate.instant(
                                                          'USERS.USER_CREATED',
                                                      ),
                                                      this.translate.instant(
                                                          'GENERAL.ACCEPT',
                                                      ),
                                                  );
                                                  if (this.me) {
                                                      this.router.navigateByUrl(
                                                          'management/users',
                                                      );
                                                  } else {
                                                      console.log(this.me, 'asasas');
                                                      this.router.navigateByUrl(
                                                          'users-management/users',
                                                      );
                                                  }
                                              }
                                          });
                                  }
                              })
                              .catch((error) => console.log(error));
                      },
                      (error) => {
                          this.loading.hideLoading();
                          this.toast.displayHTTPErrorToast(
                              error.status,
                              error.error.error,
                          );
                      },
                  );
          } else {
              console.log('******** Gestion de usuarios ********');
              this.addUser(this.obtainNewUser());
              this.usersFacade.added$
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe((data) => {
                      if (data) {
                          this.toastService.displayWebsiteRelatedToast(
                              this.translate.instant('USERS.USER_CREATED'),
                              this.translate.instant('GENERAL.ACCEPT'),
                          );
                          if (this.me) {
                              this.router.navigateByUrl('management/users');
                          } else {
                              this.router.navigateByUrl('users-management/users');
                          }
                      }
                  });
          }
      }
  }

  obtainNewUser(): User {

      let user: User = {
          email: this.createUserFormGroup.get('email').value,
          name: this.createUserFormGroup.get('name').value,
          nationalId:
              this.createUserFormGroup.get('nationalId').value === ''
                  ? null
                  : this.createUserFormGroup.get('nationalId').value,
          phone: this.createUserFormGroup.get('phone').value,
          surname: this.createUserFormGroup.get('surname').value,
          profiles: this.getProfiles(),
          companyId: this.createUserFormGroup.get('companyId').value,
          password: this.createUserFormGroup.get('password').value,
          password_confirmation: this.createUserFormGroup.get('password_confirmation')
              .value,
          isActive: this.createUserFormGroup.get('isActive').value,
          country: this.createUserFormGroup.get('country').value,
          countryCode: this.createUserFormGroup.get('countryCode').value,
          allowedQuantityOrders: this.createUserFormGroup.get('allowedQuantityOrders').value,
          useSchedule: this.createUserFormGroup.get('useSchedule').value,
          userTypeId: this.createUserFormGroup.get('userTypeId').value
      };

      if(this.user.id === 0 && this.user.schedule && this.user.schedule.days 
          && this.user.schedule.days.length > 0){

              this.user.schedule.days.forEach(day => {
                  let hours =  day.hours.filter(x => x.timeStart >= 0 && x.timeEnd >= 0);
                  day = {
                      ...day,
                      hours: hours
                  }
                  
              });

              user.schedule = {
                  ...this.user.schedule,
                  days: this.user.schedule.days.filter(x => x.hours.length > 0)
              }
      }

      if (user.password == '') {
          delete user.password;
      }
      if (user.password_confirmation == '') {
          delete user.password_confirmation;
      }



      return user;
  }

  addUser(user: User) {
      this.usersFacade.addUser(user);
  }

  editUser(obj: [number, Partial<User>]) {
      this.usersFacade.editUser(obj[0], obj[1]);
  }

  validIntervalHours(hour, day){
      let index = day.hours.indexOf(hour);
      let exist = false;
      day.hours.forEach((element, i) => {
          if(index !== i && !exist){
              exist = ( element.timeStart <= hour.timeStart && element.timeEnd >= hour.timeStart ) ? true : false;
          }
      });
      return exist;
  }

  getProfiles() {
      const selectedOrderIds = this.createUserFormGroup.value.profiles
          .map((v, i) =>
              v
                  ? {
                        id: this.profiles[i].id,
                        name: this.profiles[i].name,
                    }
                  : null,
          )
          .filter((v) => v !== null);
          this.getPreparator(selectedOrderIds);
          
      return selectedOrderIds;
  }

  isAdmin() {
      return this.authLocal.getRoles()
          ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
          : false;
  }

  inactiveUser(user: User, i?: number) {
      let profiles = this.getProfiles();
      let profileAccept =
          profiles &&
          profiles.length > 1 &&
          profiles.find((x) => x.id === 6) === undefined
              ? true
              : profiles.length > 1 && profiles.find((x) => x.id === 6)
              ? true
              : profiles.length === 1 && profiles.find((x) => x.id !== 6)
              ? true
              : false;

      let title = 'USERS.DEACTIVATE_USER_QUESTION';
      let info = 'USERS.DEACTIVATE_USER_INFO';
      let buttonAccept = 'GENERAL.DEACTIVATE';

      if (
          this.profile &&
          this.profile.company &&
          this.profile.company.subscriptions &&
          this.profile.company.subscriptions.length > 0 &&
          profileAccept
      ) {
          this.loading.showLoading();

          console.log('******** Gestion ********');
          this.companyService
              .costPlan()
              .pipe(take(1))
              .subscribe(
                  (data) => {
                      this.loading.hideLoading();
                      const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                          backdropClass: 'customBackdrop',
                          centered: true,
                          backdrop: 'static',
                      });

                      dialogRef.componentInstance.title = title;
                      dialogRef.componentInstance.user = user;
                      dialogRef.componentInstance.info = info;
                      dialogRef.componentInstance.buttonAccept = buttonAccept;
                      dialogRef.result
                          .then((resp) => {
                              if (resp) {
                                  this.loading.showLoading();
                                  this.stateUserService
                                      .deactivate(user.id)
                                      .pipe(take(1))
                                      .subscribe(
                                          () => {
                                              this.loading.hideLoading();
                                              this.validateRoute();
                                          },
                                          (error) => {
                                              this.loading.hideLoading();
                                              this.toast.displayHTTPErrorToast(
                                                  error.status,
                                                  error.error.error,
                                              );
                                          },
                                      );
                              }
                          })
                          .catch((error) => console.log(error));
                  },
                  (error) => {
                      this.loading.hideLoading();
                      this.toast.displayHTTPErrorToast(error.status, error.error.error);
                  },
              );
      } else {

          console.log('******** Gestion de usuarios ********');
          const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
              backdropClass: 'customBackdrop',
              centered: true,
              backdrop: 'static',
          });
          dialogRef.componentInstance.title = title;
          dialogRef.componentInstance.info = info;
          dialogRef.componentInstance.user = user;
          dialogRef.componentInstance.buttonAccept = buttonAccept;
          dialogRef.result
              .then((resp) => {
                  if (resp) {
                      this.loading.showLoading();
                      this.stateUserService
                          .deactivate(user.id)
                          .pipe(take(1))
                          .subscribe(
                              () => {
                                  this.loading.hideLoading();
                                  this.validateRoute();
                              },
                              (error) => {
                                  this.loading.hideLoading();
                                  this.toast.displayHTTPErrorToast(
                                      error.status,
                                      error.error.error,
                                  );
                              },
                          );
                  }
              })
              .catch((error) => console.log(error));
      }
  }

  activeUser(user: User, i?: number) {
      let profiles = this.getProfiles();
      let profileAccept =
          profiles &&
          profiles.length > 1 &&
          profiles.find((x) => x.id === 6) === undefined
              ? true
              : profiles.length > 1 && profiles.find((x) => x.id === 6)
              ? true
              : profiles.length === 1 && profiles.find((x) => x.id !== 6)
              ? true
              : false;

      let title = 'USERS.ACTIVATE_USER_QUESTION';
      let info = 'USERS.ACTIVATE_USER_INFO';
      let buttonAccept = 'GENERAL.ACTIVATE';

      if (
          this.profile &&
          this.profile.company &&
          this.profile.company.subscriptions &&
          this.profile.company.subscriptions.length > 0 &&
          profileAccept
      ) {
          this.loading.showLoading();
          this.companyService
              .costPlan()
              .pipe(take(1))
              .subscribe(
                  (data) => {
                      this.loading.hideLoading();
                      const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                          backdropClass: 'customBackdrop',
                          centered: true,
                          backdrop: 'static',
                      });
                      dialogRef.componentInstance.title = title;
                      dialogRef.componentInstance.info = info;
                      dialogRef.componentInstance.user = user;
                      dialogRef.componentInstance.buttonAccept = buttonAccept;
                      dialogRef.result
                          .then((resp) => {
                              if (resp) {
                                  this.loading.showLoading();
                                  this.stateUserService
                                      .activate(user.id)
                                      .pipe(take(1))
                                      .subscribe(
                                          () => {
                                              this.loading.hideLoading();
                                              this.validateRoute();
                                          },
                                          (error) => {
                                              this.loading.hideLoading();
                                              this.toast.displayHTTPErrorToast(
                                                  error.status,
                                                  error.error.error,
                                              );
                                          },
                                      );
                              }
                          })
                          .catch((error) => console.log(error));
                  },
                  (error) => {
                      this.loading.hideLoading();
                      this.toast.displayHTTPErrorToast(error.status, error.error.error);
                  },
              );
      } else {
          const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
              backdropClass: 'customBackdrop',
              centered: true,
              backdrop: 'static',
          });
          dialogRef.componentInstance.title = title;
          dialogRef.componentInstance.info = info;
          dialogRef.componentInstance.user = user;
          dialogRef.componentInstance.buttonAccept = buttonAccept;
          dialogRef.result
              .then((resp) => {
                  if (resp) {
                      this.loading.showLoading();
                      this.stateUserService
                          .activate(user.id)
                          .pipe(take(1))
                          .subscribe(
                              () => {
                                  this.loading.hideLoading();
                                  this.validateRoute();
                              },
                              (error) => {
                                  this.loading.hideLoading();
                                  this.toast.displayHTTPErrorToast(
                                      error.status,
                                      error.error.error,
                                  );
                              },
                          );
                  }
              })
              .catch((error) => console.log(error));
      }
    }
  /* formatDate(date: string){
    return moment(date).format('DD/MM/YYYY');
  }

  formaHour(hour: string){
    return moment(hour).format('HH:mm');
  } */

    showlabelDrive(id:any) {
        return this.user.profiles.find(x => x.id ===id) !=undefined ? true: false ;
    }

    showlabelDriveIncident() {
    
       return this.user.profiles.find(x => x.id === 4) !=undefined ? true: false ;
    }
    
    showObservation(observations:string){
        if (observations && observations.length > 50) {
           return observations = observations.substr(0, 49) + '...';
        } else {
            return observations;
        }
    }

  openModalDetailIncident(data: any){
    
      const dialogRef = this.dialog.open(ModaIncidentDetailComponent, {
        backdrop: 'static',
        size: 'lg',
        backdropClass: 'customBackdrop',
        windowClass:'modal-incident',
        centered: true
    });
    dialogRef.componentInstance.info = data;

    dialogRef.result.then((result) => {

        if (result) {
          console.log('true');
        } else {
            console.log('salio del modal');
        }
    }, (reason) => {
        this.toast.displayHTTPErrorToast(reason.status, reason.error.error);
    });

  }

  cargarDocument() {
        
    let url = environment.apiUrl + 'user_doc_datatables?userId=' + this.user.id;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#userManamentDetailDocument';
    
    this.tableDocument = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [[ 0, "desc" ]],
        lengthMenu: [5],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
            <"top-button-hide"><'point no-scroll-x table-responsive't>
            <'row reset'
              <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        buttons: [
            {
                extend: 'colvis',
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function(dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
        ],
        language: environment.DataTableEspaniol,
        ajax: {
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: tok,
            },
            error: (xhr, error, thrown) => {
                let html = '<div class="container" style="padding: 10px;">';
                html +=
                    '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                html +=
                    '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                html += '</div>';

                $('#companies_processing').html(html);
            },
        },
        columns: [
            {
                data: 'id',
                visible: false
            },
            {
                data: 'name',
                title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_NAME'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 65) {
                        name = name.substr(0, 67) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        name +
                        '</span>'
                    );
                },
            },
            {
                data: 'date',
                title: this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPLOAD_DATE'),
                render: (data, type, row) => {
                    return moment(data).format('DD/MM/YYYY');
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this.translate.instant('GENERAL.ACTIONS'),
                className: 'dt-body-center',
                render: (data, type, row) => {
                    let botones = '';
                    
                    botones += `<div class="row backgroundColorRow pr-4 pl-4">`;
                    
                    /* botones += `
                        <div class="text-center edit col p-0 pt-1">
                        <i class="fas fa-eye fa-2x point" style="color: #24397c;"></i>
                        </div>
                    `; */
                    
                    botones += `
                        <div class="text-center download col p-0 pt-1 mr-1 ml-1">
                            <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg">
                        </div>
                    `;


                    botones += `</div>`;
                    return botones;
                },
            },
        ],
    });

    this.initEvents('#userManamentDetailDocument tbody', this.tableDocument);
}


initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.edit(tbody, table);
    this.download(tbody, table);
    this.delete(tbody, table);
}

edit(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.edit', function() {
        let data = table.row($(this).parents('tr')).data();
        data = {
            ...data,
            date: moment(data.date)
        }
        that.editElement(data);
    });
}

editElement(document: any): void {
    const dialogRef = this.dialog.open(UserModalDocumentComponent, {
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
        backdrop: 'static',
        windowClass:'modal-document',
    });

    dialogRef.componentInstance.document = document;
    dialogRef.componentInstance.showBtn = false;

    dialogRef.componentInstance.title = this.translate.instant(
        'RATES_AND_MODULES.DOCUMENT.DOCUMENT_DETAIL',
    );
    
   dialogRef.result.then((data) => {
       
        if (data) {
            this.userService
            .editCompanyDoc(data, document.id)
            .subscribe(
                (data: any) => {
                    
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPDATE_SUCCESSFUL'),
                    );
                   
                    this.table.ajax.reload();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );

        }
    },
        (error) => {
            if(error.status){
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            }
            
        },
    );
}

download(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.download', function() {
        let data = table.row($(this).parents('tr')).data();
        that.downloadElement(data);
    });
}

downloadElement(archivo: any): void {

    let link= document.createElement('a');
    document.body.appendChild(link); //required in FF, optional for Chrome
    link.target = '_blank';
    let fileName = 'img';
    link.download = fileName;
    link.href = archivo.urlDocument;
    link.click();
}


delete(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.delete', function() {
        let data = table.row($(this).parents('tr')).data();
        that.deleteElement(data.id);
    });
}

deleteElement(documentId: any): void {
    const dialogRef = this.dialog.open(UserModalConfirmDocumentComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
    });
    
    dialogRef.componentInstance.message = this.translate.instant(
        'RATES_AND_MODULES.DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT',
    );

    dialogRef.result.then(
        (data) => {
            if (data) {
                this.userService
                    .destroyCompanyDoc(documentId)
                    .subscribe(
                        (data: any) => {
                            
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_DELETED_SUCCESSFULLY'),
                            );
                            this.table.ajax.reload();
                        },
                        (error) => {
                            this.toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
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
