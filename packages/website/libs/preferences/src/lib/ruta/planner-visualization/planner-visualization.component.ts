import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, IP, InterfacePreferences } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-planner-visualization',
  templateUrl: './planner-visualization.component.html',
  styleUrls: ['./planner-visualization.component.scss']
})
export class PlannerVisualizationComponent implements OnInit {
  

  interferencePreferences$: Observable<InterfacePreferences>;

  unsubscribe$ = new Subject<void>();

  
  constructor(
    private fb: FormBuilder,
    private facade: PreferencesFacade,
    private toastService: ToastService,
    private detectChange: ChangeDetectorRef,
    private _translate: TranslateService,
    private translate: TranslateService,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private statePreferencesService: StatePreferencesService,
    private facadeProfile: ProfileSettingsFacade,
    private loading: LoadingService,
    config: NgbTimepickerConfig,
    private activatedRoute: ActivatedRoute,
    private modal: NgbModal,
    public authLocal: AuthLocalService,
) { }

  ngOnInit() {

    this.interferencePreferences$ = this.facade.interfacePreferences$;

    this.facade.loadDashboardPreferences();

  }

  ToggleInterfaceResumeRoute(key: IP, value: InterfacePreferences[IP]){
    if(value){
        if(this.calcShowResumeSelect()){
            this.facade.toggleInterfacePreference(key, value);
        } else {
            this.facade.toggleInterfacePreference(key, false);
            this.toastService.displayHTTPErrorToast(5000, 'Solo se puede tener máximo 4 activos')
            this.detectChanges.detectChanges();
        }

    } else {
        this.facade.toggleInterfacePreference(key, value);
    }
  }

  calcShowResumeSelect(){
    let valueTrue = 0;
    this.interferencePreferences$.pipe(take(1)).subscribe(data =>{
        let _data = _.cloneDeep(data);

        delete _data.expandZoneOptions;
        delete _data.expandZones;
        delete _data.expandRoutes;
        delete _data.expandRouteOptions;
        delete _data.autoEvaluation;
        delete _data.readyTime;
        delete _data.limitTime;
        delete _data.arrival;
        delete _data.travelTime;
        delete _data.travelDistance;
        delete _data.vehicleWaitTime;
        delete _data.customerWaitTime;
        delete _data.openTime;
        delete _data.demand;
        delete _data.volumetric;
        delete _data.deliverytime;
        delete _data.optionMenu;
        delete _data.population;
        delete _data.skill;
        delete _data.allowDelayTime;
        delete _data.routeSpecification;
        delete _data.serviceCost;
        delete _data.postalCode;
        delete _data.box;


        for (const property in _data) {

            if(data[property] === true){
                valueTrue += 1;
            }
          }
    });

    return valueTrue >= 4 ? false : true;
  }

  toggleInterfacePreference(key: IP, value: InterfacePreferences[IP]) {

    if(value){
        if(this.calcShowSelect()){
            this.facade.toggleInterfacePreference(key, value);
        } else {
            this.facade.toggleInterfacePreference(key, false);
            this.toastService.displayHTTPErrorToast(5000, 'Solo se puede tener máximo 7 activos')
            this.detectChanges.detectChanges();
        }

    } else {
        this.facade.toggleInterfacePreference(key, value);
    }

  }

  calcShowSelect(){
    let valueTrue = 0;
    this.interferencePreferences$.pipe(take(1)).subscribe(data =>{
        let _data = _.cloneDeep(data);

        delete _data.autoEvaluation;
        delete _data.expandRouteOptions;
        delete _data.expandRoutes;
        delete _data.expandZoneOptions;
        delete _data.expandZones;
        delete _data.optionMenu;

        delete _data.ShowCapacity;
        delete _data.ShowDemand;
        delete _data.ShowDriver;
        delete _data.ShowRegistration;
        delete _data.ShowVolumen;


        for (const property in _data) {

            if(data[property] === true){
                valueTrue += 1;
            }
          }
    });

    return valueTrue >= 7 ? false : true;
  }

}
