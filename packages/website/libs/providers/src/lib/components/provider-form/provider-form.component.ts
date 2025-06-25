import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService, Profile, ProviderInterface } from '@optimroute/backend';
import { LoadingService, ProvidersMessages, ToastService, ValidatePhone } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddCostVehicleComponent } from './modal-add-cost-vehicle/modal-add-cost-vehicle.component';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Subject } from 'rxjs';
declare var $: any;


@Component({
  selector: 'easyroute-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss']
})
export class ProviderFormComponent implements OnInit {

  providerForm: FormGroup;
  providers: ProviderInterface;

  createdAt: string;

  loading: string = 'success';
  providerType: any[];
  assigned: any[];

  listProviderTypeConcept: any[];

  provider_messages: any;

  conceptList: any = [];

  disabledOptionConcept: any = true;

  profile: Profile;
  unsubscribe$ = new Subject<void>();

  constructor (
    private router: Router,
    private fb: FormBuilder,
    private backendService: BackendService,
    private toastService: ToastService,
    private loadingServe: LoadingService,
    private activatedRoute: ActivatedRoute,
    private detectChange: ChangeDetectorRef,
    private translate: TranslateService,
    private _modalService: NgbModal,
    private stateEasyrouteService: StateEasyrouteService,
    public facadeProfile: ProfileSettingsFacade,

  ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }
    });

    this.load();

  }

  redirectProviders(){
    this.router.navigate(['/providers']);
  }

  load(){
    this.activatedRoute.params.subscribe( params => {

      if ( params['provider_id'] !== 'new' ) {

        this.loadingServe.showLoading();

        this.stateEasyrouteService.getProviders(params['provider_id']).subscribe(
            (data: any) => {
                this.providers = data.data;
                console.log(this.providers, 'this.providers')
                this.createdAt = moment(this.providers.created_at).format('DD/MM/YYYY')
                //this.concepts = this.providers.providerTypeConcept; // Lo que se manda a guarda

                this.validaciones(this.providers);

                this.getProviderType();
                this.getAssigned();

                this.loadingServe.hideLoading();
            },
            (error) => {
                this.loadingServe.hideLoading();

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
      }  else {
        this.providers = new ProviderInterface();
        this.validaciones(this.providers);
        this.getProviderType();
        this.getAssigned();
      }

    });
  }

  validaciones(providers: ProviderInterface) {
    this.providerForm = this.fb.group({
      name: [
        providers.name,
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)],
      ],
      providerTypeId: [
        providers.providerTypeId,
        [Validators.required]
      ],
      providerAssigmentTypeId: [
        providers.providerAssigmentTypeId,
        [Validators.required]
      ],
      contactPerson: [
        providers.contactPerson,
        [Validators.maxLength(255)],
      ],
      email: [providers.email, [Validators.email, Validators.minLength(1), Validators.maxLength(255)]],
      phoneNumber: [
        providers.phoneNumber,
          [ValidatePhone(
            '' ? '' : 'España'
          ),
          Validators.minLength(2),
          Validators.maxLength(30)
          ],
      ],
      concepts: new FormArray([]),
      providerTypeConcept: [providers.providerTypeConcept],
      createdByUserData: [providers.createdByUserData],
      isActive:[providers.isActive, [Validators.required]],

    });

    console.log(providers)
    let provider_messages = new ProvidersMessages();
    this.provider_messages = provider_messages.getProvidersMessages();

    console.log(this.disabledCompany(), 'funcion para bloquear campos');
    if (this.disabledCompany()) {
      this.providerForm.get('name').disable();
      this.providerForm.get('isActive').disable();
      this.providerForm.get('providerTypeId').disable();
      this.providerForm.get('providerAssigmentTypeId').disable();
      
    }
    this.getChargingConcepts();

  }

  disabledCompany(){

    let disabled = false;

    disabled = this.providers.providerTypeId === 8 && this.providers.name === 'Empresa';

    return disabled
   
  }

  get concepts (){

    return this.providerForm.get('concepts') as FormArray;

  }

  getProviderType() {

    this.loading = 'loading';

    this.stateEasyrouteService.getProviderType().subscribe(
        (data: any) => {

            this.providerType = data.data;

            console.log(this.providerType);

            if(this.providerType && this.providers.id > 0) {
              this.conceptList = this.providerType.find((x) => x.id === this.providers.providerTypeId).providerTypeGenericConcepts;
            }

            this.loading = 'success';

        },
        (error) => {

            this.loading = 'error';

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
    );

  }

  getAssigned() {

      this.loading = 'loading';

      this.stateEasyrouteService.getAssigned().subscribe(
          (data: any) => {

              this.assigned = data.data;
              this.loading = 'success';

          },
          (error) => {

              this.loading = 'error';

              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
      );
  }

  getChargingConcepts(){

    this.providers.providerTypeConcept.forEach((item) => {

      const concept = new FormGroup({
        id: new FormControl(item.id),
        name: new FormControl(item.name),
        price: new FormControl(item.price),
        providerTypeGenericConceptId: new FormControl(item.providerTypeGenericConceptId),
      });

      if (this.disabledCompany()) {
        concept.get('name').disable();
        concept.get('price').disable();
      }

    

      this.concepts.push(concept);
    })

  }

  changeProviderType(event: any) {

    // cargando el listado del select
    this.conceptList = this.providerType.find((x) => x.id === parseInt(event.target.value)).providerTypeGenericConcepts;

    this.detectChange.detectChanges();

  }

  addConcept() {

    const concept = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      price: new FormControl(0),
      providerTypeGenericConceptId: new FormControl(''),
    });

    this.concepts.push(concept);

  }

  deleteComponent(data: any, index: number){

    if(data.value.id > 0) {

      if (this.providers.id > 0) {
        this.backendService
        .delete('provider_type_concept/' + data.value.id)
        .pipe(take(1))
        .subscribe(
            (response) => {

                this.concepts.controls.splice(index, 1);

                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                this.detectChange.detectChanges();
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.error.code,
                    error.error,
                );
            },
        );
      }

    } else {

      this.concepts.controls.splice(index, 1);

      this.detectChange.detectChanges();

    }

  }

  changeSelect(value:any, data: any, index: any) {

    //pasando nombre que es requerido
    data.value.name = this.conceptList.find((x: any) => x.id === parseInt(value)).name;

    if(this.providers.id > 0) {

      if(data.value.id > 0){

        this.editProvideTypeConcept(data.value, index);

      } else {

        this.addProvideTypeConcept(data.value, index);

      }

    }
  }

  changeName(value:any, data: any, index: any){

    //Se setea el valor a null porque es un input
    data.value.providerTypeGenericConceptId = null;

    if(this.providers.id > 0) {

      if(data.value.id > 0){

        this.editProvideTypeConcept(data.value, index);

      } else {

        this.addProvideTypeConcept(data.value, index);

      }

    }

  }

  changeImporte(value:any, data: any, index: any){

    if(this.providers.id > 0) {

      if(data.value.id > 0){

        this.editProvideTypeConcept(data.value, index);

      } else {

        this.addProvideTypeConcept(data.value, index);

      }

    }

  }

  addProvideTypeConcept(data: any, index: any) {

    let dataform = _.cloneDeep(data);
    dataform.providerId = Number(this.providers.id);

    this.backendService.post('provider_type_concept', dataform).pipe(take(1)).subscribe((response) => {

      this.concepts.controls[index].get('id').setValue( response.data.id);
      this.concepts.controls[index].get('name').setValue( response.data.name);
      this.concepts.controls[index].get('providerTypeGenericConceptId').setValue( response.data.providerTypeGenericConceptId);

      this.detectChange.detectChanges();

    })
  }

  editProvideTypeConcept(data: any, index: any){
    this.backendService
    .put('provider_type_concept/' + data.id, data)
    .pipe(take(1))
    .subscribe(
        (response) => {

          this.concepts.controls[index].get('id').setValue( response.data.id);
          this.concepts.controls[index].get('name').setValue( response.data.name);
          this.concepts.controls[index].get('providerTypeGenericConceptId').setValue( response.data.providerTypeGenericConceptId);

          this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this.translate.instant('GENERAL.ACCEPT'),
          );

          this.detectChange.detectChanges();
        },
        (error) => {
            this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            this.detectChange.detectChanges();
        },
    );
  }

  save(): void {

    let dataform = _.cloneDeep(this.providerForm.value);

    if (this.providers.id && this.providers.id > 0) {

      this.stateEasyrouteService.editProvider(this.providers.id, dataform).subscribe(
          (data: any) => {
              this.toastService.displayWebsiteRelatedToast(
                  this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                  this.translate.instant('GENERAL.ACCEPT'),
              );

              this.router.navigate(['/providers']);
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );

    } else {

        this.stateEasyrouteService.addProvider(dataform).subscribe(
            ({data}) => {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('GENERAL.REGISTRATION'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                this.router.navigate(['/providers/' + data.id]);
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

  existConcept(providerTypeGenericConceptId: number){

    return this.concepts.value.find(x => Number(x.providerTypeGenericConceptId) === providerTypeGenericConceptId) ? true : false;
  }
/* 
  OpenModalAddCost(){
    console.log('object')
  } */
  OpenModalAddCost(data: any) {
  
   
    let dataform = _.cloneDeep(this.providerForm.value);

    console.log(dataform, 'dataform');

    console.log('object')
    const modal = this._modalService.open(ModalAddCostVehicleComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-add-cost-vehicle',
      size:'xl'
    });

    modal.componentInstance.providerTypeId = dataform.providerTypeId;

    modal.componentInstance.providerId = this.providers.id;

    modal.componentInstance.providerTypeConceptId = data.id
  
    modal.result.then(
      (data) => {
        if (data) {
        
        }      
      },
      (reason) => {
        
      },
    ); 
  }

  ModuleCost(){

    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
        return true;
    } else {
        return false;
    }
  }

}
