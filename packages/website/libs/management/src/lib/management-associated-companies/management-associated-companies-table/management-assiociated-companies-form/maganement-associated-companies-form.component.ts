import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociatedCompany, BackendService } from '@optimroute/backend';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilData, ValidatePhone, ValidateCompanyId, CompanyAffiliatedMessages } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'easyroute-maganement-associated-companies-form',
  templateUrl: './maganement-associated-companies-form.component.html',
  styleUrls: ['./maganement-associated-companies-form.component.scss']
})
export class ManagementAssociatedCompaniesFormComponent implements OnInit {

  @Input() data: { companyAssociated: AssociatedCompany };
  @ViewChild('urlLogo', { read: true, static: false }) urlLogo: ElementRef;
  company: AssociatedCompany;
  formCompanyAssociated: FormGroup;
  countrys: string[] = [];
  countries: string[] = [];
  serviceTypes: any[] = [];
  showSelect:boolean = false;
  companiesMessages: any = new CompanyAffiliatedMessages().getCompanyMessages();
  //toastService: any;
  cardImageBase64: string;
  imageError: string;
  isImageSaved: boolean;
  countrysWithCode: any = [];
  countrysWithPhone: any = [];
  prefix: any = '';
  date = new Date();
  constructor(
   // private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private companiesService: StateCompaniesService,
    private backendService: BackendService,
    private detectChange: ChangeDetectorRef,
    private router:Router,
    private translate: TranslateService,
    private loading: LoadingService,
    private sanitizer: DomSanitizer,
  ) {
    
   }

  ngOnInit() {
    this.validateRoute();
    this.countrys = UtilData.getCountry();
    this.countrysWithPhone = UtilData.getCountryPhoneCode();
    this.countrysWithCode = UtilData.getCountryWithCode();
    this.setServiceTypes();
    
   // this.initForm();
  }

  validateRoute() {
    this._activatedRoute.params.subscribe( ({ id }) => {  
      if ( id === 'new' ) {
        this.company = new AssociatedCompany();
        this.initForm();
      
      } else {
        this.loading.showLoading();
        this.backendService.get(`company_associated/${ id }`).pipe(take(1)).subscribe(
          ({ data }) => {
           this.company = data;
           
            this.initForm();
            this.loading.hideLoading();
          },
          ( error ) => {
            this.loading.hideLoading();
            this.toastService.displayHTTPErrorToast( error.status, error.error.error );
          }
        );
      }
    });
  }

  setServiceTypes() {
    this.companiesService.loadServiceType().subscribe( ({ data }) => {    
      data.forEach( ( element ) => this.serviceTypes.push( element ) );
      this.showSelect = true;
    });
  }

  setCountries() {
    for ( const key in UtilData.COUNTRIES ) {
      this.countries.push( UtilData.COUNTRIES[ key ] );
    }
  }

  initForm() {
    this.prefix = this.countrysWithPhone.find(x => x.country === this.company.countryCode ) ? '+'+this.countrysWithPhone.find(x => x.country === this.company.countryCode ).code : '+34';
    this.formCompanyAssociated = this.fb.group({
      code: [this.company.code ],
      id: [ this.company.id || null ],
      billingEmail: [ this.company.billingEmail || null, [ Validators.required, Validators.email ] ],
      name: [ this.company.name || null, [ Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      countryCode: [this.company.countryCode || null, [Validators.required]],
      country: [ this.company.country || null, [ Validators.required ] ],
      streetAddress: [ this.company.streetAddress || null, [ Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      city: [ this.company.city || null, [ Validators.required , Validators.minLength(2), Validators.maxLength(50)]],
      province: [ this.company.province || null, [ Validators.required ] ],
      zipCode: [ this.company.zipCode || null, [ Validators.required ] ],
      serviceTypeId: [this.company.serviceTypeId || null],
      phone: [
        this.company.phone ? this.company.phone : this.prefix,
        [
            ValidatePhone(
                this.company.country 
                ?  this.company.country
                : 'España'
            ),
            Validators.required,
        ],
      ],
      nif: [
        this.company.nif,
        [
            ValidateCompanyId(
                this.company.countryCode 
                        ?  this.company.countryCode 
                        : 'España'
            ),
            Validators.required,
        ],
      ],
      logo: [ null ]
    });
    this.setCountries();
  }

  createCompany() {

    if(this.formCompanyAssociated.value.serviceTypeId == ''){
      this.formCompanyAssociated.value.serviceTypeId = null;
    }
    if ( this.formCompanyAssociated.valid ) {
      
      if ( !this.company.id || this.company.id === null ) { 
        this.addCompany( this.formCompanyAssociated.value );
      
      } else {
        this.editCompany([ this.company.id, this.formCompanyAssociated.value ]); 

      }

    } else {
      this.toastService.displayWebsiteRelatedToast('The company is not valid');
    }
  }

  addCompany(company: any) {
   
    // Change for the state if is ready
    // this.companiesFacade.addCompany(company);
    this.loading.showLoading();
    this.backendService.post('company_associated', company ).subscribe(
      ( response ) => {
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.REGISTRATION'),
          this.translate.instant('GENERAL.ACCEPT')  
        );
        this.loading.hideLoading();
        this.router.navigate(['management/associated-companies']);
        $("input[type='file']").val('');
        this.cardImageBase64 =null;
        this.detectChange.detectChanges();
      },
      ( error ) => {
        this.loading.hideLoading();
        this.toastService.displayHTTPErrorToast( error.error.code, error.error );
      });
  }

  editCompany(obj: [number, any]) {
    
    // change when the state is ready
    // this.companiesFacade.editCompany(obj[0], obj[1]);
    this.loading.showLoading();
    this.backendService.put( `company_associated/${ obj[1].id }`, obj[1]).subscribe(
      ( response ) => {
        if (response) {
          this.company=response.data;
          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this.loading.hideLoading();
          this.router.navigate(['management/associated-companies']);
          $("input[type='file']").val('');
          this.cardImageBase64 =null;
          this.detectChange.detectChanges();
        }
      },
      ( error ) =>{
        this.loading.hideLoading();
        this.toastService.displayHTTPErrorToast( error.error.code, error.error );
      }
    );
  }

  changeCountry( value: string ) {
    this.formCompanyAssociated.get('countryCode').setValue(this.countrysWithCode.find(x => x.country === value).key);
    if ( value !== 'España' ) {
      this.prefix = this.countrysWithPhone.find(x => x.country === value) ? '+'+this.countrysWithPhone.find(x => x.country === value).code : '';
      this.formCompanyAssociated.get('phone').setValue(this.prefix);
      this.formCompanyAssociated.get('nif').setValidators([Validators.required, Validators.maxLength(50)]);
      this.formCompanyAssociated.get('nif').updateValueAndValidity();

    } else {
      this.prefix = '+34';
      this.formCompanyAssociated.get('phone').setValue(this.prefix);
      this.formCompanyAssociated.get('nif').setValidators([
        ValidateCompanyId(
            'España',
        ),
        Validators.required, Validators.maxLength(50)]);
      this.formCompanyAssociated.get('nif').updateValueAndValidity();

    }

    this.formCompanyAssociated.get('phone').setValidators([
      ValidatePhone(
        UtilData.COUNTRIES[
          this.countrysWithCode.find( ( x ) => x.country === this.formCompanyAssociated.get('country').value ).key
        ]
      ),
      Validators.required
    ]); 

    this.formCompanyAssociated.get('phone').updateValueAndValidity();
  } 

  filterCountries(value: string) {
    
    const filterValue = value.toLowerCase();
    
    return this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue),
    );
  }

  selectServiceType(value: number) {
    let val: any = this.serviceTypes.find((x: any) => (x.id === value));
    return val ? val.id : null;
  }

  fileChangeEvent( fileInput: any ) {
  
    this.imageError = null;

    this.cardImageBase64 = null;

    if ( fileInput.target.files && fileInput.target.files[0] ) {

      const max_size = 2000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 300;
      const max_width = 300;

      if ( fileInput.target.files[0].size > max_size ) {
        console.log('imagen muy grande');
        this.imageError = 'Tamaño máximo permitido ' + max_size / 1000 / 1000 + 'Mb';
        return false;
      }

      if (!_.includes( allowed_types, fileInput.target.files[0].type )) { 
        this.imageError = 'Formatos permitidos ( JPG | PNG )';
        this.removeImage();
        return false;
      }

      const reader = new FileReader();
      reader.onload = ( e: any ) => {

        const image = new Image();
        image.src = e.target.result;

        image.onload = (rs) => {
          
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height || img_width > max_width) {
              this.imageError =
              this.translate.instant('GENERAL.RECOMMENDED_SIZE')
                  /* +
                  max_height +
                  'px x ' +
                  max_width +
                  'px' */;

             /*  this.removeImage();
              this.detectChange.detectChanges();
              return false; */
               const imgBase64Path = e.target.result;

              this.cardImageBase64 = imgBase64Path;

              this.formCompanyAssociated.get('logo').setValue( imgBase64Path );

              this.isImageSaved = true;

              // this.updateCompany(true);
              this.detectChange.detectChanges();
          
            } else {

              const imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              this.formCompanyAssociated.get('logo').setValue( imgBase64Path );
              this.isImageSaved = true;
              // this.updateCompany(true);
              this.detectChange.detectChanges();
          }
        };

      };

      reader.readAsDataURL(fileInput.target.files[0]);

     
    }
  }

  removeImage() {
    this.formCompanyAssociated.get('logo').setValue('');
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  convertToSafeUrl( base64: string ) {
    return this.sanitizer.bypassSecurityTrustResourceUrl( base64 );
  }

}
