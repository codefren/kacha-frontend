import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, DeliveryNoteInterface } from '@optimroute/backend';
import { DeliveryNoteMessages, LoadingService, ToastService, UtilData, ValidateCompanyId, ValidatePhone, dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';

declare var $: any;


@Component({
  selector: 'easyroute-delivery-note-invoice',
  templateUrl: './delivery-note-invoice.component.html',
  styleUrls: ['./delivery-note-invoice.component.scss']
})
export class DeliveryNoteInvoiceComponent implements OnInit {

  companyPreferenceALbaran: any ={
    activateSendDeliveryNotes: '',
    timeSendDeliveryNotes: 0,
    activateSendDeliveryNotesEvery: '',
    timeSendDeliveryNotesEvery:0,
    activateAutomaticDeliveryNotesAssignedRoute:'',
    shareCompanyInformation: '',
    showCode: '',
    showQuantityUnit: '',
    showMiddleUnit: '',
    showDescription: '',
    showGrossWeight: '',
    showTare: '',
    showNet: '',
    showKgsUnit: '',
    showPrice: '',
    showDiscount: '',
    showAmount: '',
    showProvider: '',
  };

  deliveryNotesLines = [];

  show: boolean = true;

  @Input('showSharedInformation') showSharedInformation: boolean = false;

  companyPreferenceAlbaran: DeliveryNoteInterface;


  deliveryNoteForm: FormGroup;

  deliveryNoteMessages: any;

  countrys: any = [];

  countrysWithPhone: any = [];

  countrysWithCode: any = [];

  prefix: any;

  imageError: string = '';

  imgLoad: string ='';

  constructor(
    private backend: BackendService,
    private toast: ToastService,
    private loading: LoadingService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.load();

    this.setUtilData();

    this.getDeliveryAutomatically();
  }

  setUtilData() {
    this.countrys = UtilData.getCountry();
    this.countrysWithPhone = UtilData.getCountryPhoneCode();
    this.countrysWithCode = UtilData.getCountryWithCode();
  }

  getDeliveryAutomatically(){

    this.loading.showLoading();

    this.show= false;

    this.backend.get('company_preference_delivery_note').pipe(take(1)).subscribe(({data})=>{

      this.loading.hideLoading();

      this.companyPreferenceALbaran = data;

      this.show = true;

      this.changeDetectorRef.detectChanges();

      this.getCompanyPreferenceAlbaran();

    }, error => {

      this.loading.hideLoading();

      this.show = true;

      this.toast.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  getCompanyPreferenceAlbaran(){

    this.backend.get('company_preference_albaran').pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceAlbaran = data;

      this.imgLoad = this.companyPreferenceAlbaran.urlLogo;

      this.validaciones(this.companyPreferenceAlbaran);

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.toast.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  validaciones(data: DeliveryNoteInterface) {

    this.prefix = this.countrysWithPhone.find((x) => x.country === data.country)
    ? '+' + this.countrysWithPhone.find((x) => x.country === data.country).code
    : '+34';

    this.deliveryNoteForm = this.fb.group({

        name: [data.name ? data.name:'',[ Validators.minLength(2), Validators.maxLength(100) ] ],

        nif: [data.nif ? data.nif:'', [ ValidateCompanyId('España')]],

        countryCode: [data.countryCode ? data.countryCode : 'ES'],

        country: [data.country ? data.country:'',  [ Validators.minLength(2), Validators.maxLength(50) ]],

        streetAddress: [data.streetAddress, [ Validators.minLength(10), Validators.maxLength(1000) ] ],

        province: [data.province ? data.province :'', [ Validators.minLength(2), Validators.maxLength(50) ] ],

        zipCode: [data.zipCode ? data.zipCode:'', [ Validators.minLength(2), Validators.maxLength(50) ]],

        phone: [data.phone ? data.phone : this.prefix , [ ValidatePhone(data.country ? data.country : 'España')]],

        billingEmail: [data.billingEmail? data.billingEmail:'', [ Validators.email ]],

        base64Logo: [data.urlLogo],
    });

    this.deliveryNoteMessages = new DeliveryNoteMessages().getDeliveryNoteMessages();

  }

  changeCompanyPreferencealabaran(name :string, event: any){

    this.companyPreferenceALbaran[name] = event;

    let data ={

      activateSendDeliveryNotes: this.companyPreferenceALbaran.activateSendDeliveryNotes ? this.companyPreferenceALbaran.activateSendDeliveryNotes: false,

      timeSendDeliveryNotes: this.companyPreferenceALbaran.timeSendDeliveryNotes ? this.companyPreferenceALbaran.timeSendDeliveryNotes: 0,

      activateSendDeliveryNotesEvery: this.companyPreferenceALbaran.activateSendDeliveryNotesEvery ?this.companyPreferenceALbaran.activateSendDeliveryNotesEvery :false,

      timeSendDeliveryNotesEvery: this.companyPreferenceALbaran.timeSendDeliveryNotesEvery ? this.companyPreferenceALbaran.timeSendDeliveryNotesEvery: 0,

      activateAutomaticDeliveryNotesAssignedRoute: this.companyPreferenceALbaran.activateAutomaticDeliveryNotesAssignedRoute ? this.companyPreferenceALbaran.activateAutomaticDeliveryNotesAssignedRoute: false,

      shareCompanyInformation: this.companyPreferenceALbaran.shareCompanyInformation ? this.companyPreferenceALbaran.shareCompanyInformation : false,

      deliveryNoteIntegrationWithoutProducts: this.companyPreferenceALbaran.deliveryNoteIntegrationWithoutProducts ? this.companyPreferenceALbaran.deliveryNoteIntegrationWithoutProducts : false

    }


    this.backend.post('company_preference_delivery_note', data).pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceALbaran = data;

       this.toast.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });

  }

  changeCompanyPreferenceShowData(name :string, event: any){

    if(event){
      if(this.calcShowSelect()){

        this.sentData(name, event);
      } else {

        this.companyPreferenceALbaran[name] = false;

        $('#' + name).prop('checked', false);

        this.toast.displayHTTPErrorToast(5000, 'Solo se puede tener máximo 10 activos')
        this.changeDetectorRef.detectChanges();

      }

    } else {

        this.sentData(name, event);
    }

  }

  sentData(name :string, event: any){

    this.companyPreferenceALbaran[name] = event;

    let data ={

      showCode: this.companyPreferenceALbaran.showCode ? this.companyPreferenceALbaran.showCode :false,

      showQuantityUnit: this.companyPreferenceALbaran.showQuantityUnit ? this.companyPreferenceALbaran.showQuantityUnit :false,

      showMiddleUnit: this.companyPreferenceALbaran.showMiddleUnit ? this.companyPreferenceALbaran.showMiddleUnit :false,

      showDescription: this.companyPreferenceALbaran.showDescription ? this.companyPreferenceALbaran.showDescription :false,

      showGrossWeight: this.companyPreferenceALbaran.showGrossWeight ? this.companyPreferenceALbaran.showGrossWeight :false,

      showTare: this.companyPreferenceALbaran.showTare ? this.companyPreferenceALbaran.showTare :false,

      showNet: this.companyPreferenceALbaran.showNet ? this.companyPreferenceALbaran.showNet :false,

      showKgsUnit: this.companyPreferenceALbaran.showKgsUnit ? this.companyPreferenceALbaran.showKgsUnit :false,

      showPrice: this.companyPreferenceALbaran.showPrice ? this.companyPreferenceALbaran.showPrice :false,

      showDiscount: this.companyPreferenceALbaran.showDiscount ? this.companyPreferenceALbaran.showDiscount :false,

      showAmount: this.companyPreferenceALbaran.showAmount ? this.companyPreferenceALbaran.showAmount :false,

      showProvider: this.companyPreferenceALbaran.showProvider ? this.companyPreferenceALbaran.showProvider :false

    }


    this.backend.post('company_preference_delivery_note', data).pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceALbaran = data;

       this.toast.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.getDeliveryAutomatically();

      this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });

  }

  calcShowSelect(){

    let valueTrue = 0;

    let _data = _.cloneDeep(this.companyPreferenceALbaran);

    delete _data.activateSendDeliveryNotes;
    delete _data.timeSendDeliveryNotes;
    delete _data.activateSendDeliveryNotesEvery;
    delete _data.timeSendDeliveryNotesEvery;
    delete _data.activateAutomaticDeliveryNotesAssignedRoute;
    delete _data.shareCompanyInformation;
    delete _data.deliveryNoteIntegrationWithoutProducts


    console.log(_data)
    for (const property in _data) {

      if(_data[property] === true){
        valueTrue += 1;
      }

    }

    console.log(valueTrue);
    return valueTrue >= 10 ? false : true;
  }

  showTime(number: number){

    return secondsToDayTimeAsString(number);

  }

  addOthers(value, data: any, name:string){

    switch (name) {

        case "timeSendDeliveryNotes":

            data.timeSendDeliveryNotes = dayTimeAsStringToSeconds(
              value,
          );

            break;

        case "timeSendDeliveryNotesEvery":

            data.timeSendDeliveryNotesEvery = Number(value * 60)

            break;

        default:
            break;
    }


    this.updateTime(data);

  }

  updateTime(data: any){

    this.loading.showLoading();

    this.backend.post('company_preference_delivery_note', data).pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceALbaran = data;

      this.loading.hideLoading();

       this.toast.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translate.instant('GENERAL.ACCEPT'),
       );

       this.changeDetectorRef.detectChanges();

     }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });
  }

  showNUmber(number: number){

    return Math.floor(number / 60);

  }

  async load(){
    await this.loading.showLoading();
    this.backend.get('preference_delivery_note_line').pipe(take(1)).subscribe(({data})=>{
      this.loading.hideLoading();
      this.deliveryNotesLines = data;
      this.changeDetectorRef.detectChanges();
    }, error => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  async addLine(){
    let line = {
      color: '#000000',
      description: '',
      order: this.deliveryNotesLines.length + 1,
      highlight: false
    }
    await this.loading.showLoading();
    this.backend.post('preference_delivery_note_line', line).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      this.load();
    }, error =>{
      this.toast.displayHTTPErrorToast(error.status, error.error.error)
    })
  }

  handleChange( field: string, value: string, line: any) {

    if ( field === 'order' ) {


     line.order = value;

    } else if ( field === 'description' ) {

      line.description = value;

    } else if ( field === 'color' ) {

      line.color = value;

    }

    this.updateLine(line);
  }

  updateLine(line: any){
    this.backend.put('preference_delivery_note_line/' + line.id, line).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      this.load();
    }, error =>{
      this.toast.displayHTTPErrorToast(error.status, error.error.error)
    })
  }

  highlightActive(value, line){
    line.highlight = value;
    this.updateLine(line);
  }

  deleteLine( line ) {

    const modal = this.modalService.open( DeliveryModalConfirmationComponent, {
      centered: true,
      backdrop: 'static'
    });
    modal.componentInstance.title = "Eliminar";
    modal.componentInstance.message = "¿Está seguro de eliminar?";


    modal.result.then(async ( result : boolean ) => {

      if ( result ) {

        await this.loading.showLoading();
        this.backend.delete('preference_delivery_note_line/' + line.id).pipe(take(1)).subscribe(()=>{
          this.loading.hideLoading();
          this.load();
        }, error => {
          this.toast.displayHTTPErrorToast(error.status, error.error.error);
          this.loading.hideLoading();
        })
      }


    });
  }

  changeCountry(id: any, value: string) {

    if (value) {
      this.deliveryNoteForm
      .get('countryCode')
      .setValue(this.countrysWithCode.find((x) => x.country === value).key );
    }


    if (value != 'España') {
        this.prefix = this.countrysWithPhone.find((x) => x.country === value)
            ? '+' + this.countrysWithPhone.find((x) => x.country === value).code
            : '';
        this.deliveryNoteForm.get('phone').setValue(this.prefix);
        this.deliveryNoteForm
            .get('nif')
            .setValidators([Validators.maxLength(50)]);
        this.deliveryNoteForm.get('nif').updateValueAndValidity();
    } else {
        this.prefix = '+34';
        this.deliveryNoteForm.get('phone').setValue(this.prefix);
        this.deliveryNoteForm
            .get('nif')
            .setValidators([ValidateCompanyId('España'), Validators.maxLength(50)]);
        this.deliveryNoteForm.get('nif').updateValueAndValidity();
    }

    this.deliveryNoteForm
        .get('phone')
        .setValidators([
            ValidatePhone(
                UtilData.COUNTRIES[
                this.countrysWithCode.find(
                    (x) =>
                        x.country === this.deliveryNoteForm.get('country').value,
                ).key
                ],
            ),
            Validators.required,
        ]);

    this.deliveryNoteForm.get('phone').updateValueAndValidity();

  }


  changeValue(id: any, Value: any){

    let data = {

      [id]: Value

    };

  }

  changeValueContry(id: any, Value: any){

    let data = {

      countryCode: this.deliveryNoteForm.value.countryCode,

      [id]: Value

    };

  }

  updateCompanyPreferenceAlbaran(){

    let dataform = _.cloneDeep(this.deliveryNoteForm.value);

    delete dataform.base64Logo;

    this.backend.post('company_preference_albaran', dataform).pipe(take(1)).subscribe(({data})=>{

      this.companyPreferenceAlbaran = data;

      this.validaciones(this.companyPreferenceAlbaran);

      this.toast.displayWebsiteRelatedToast(

        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.toast.displayHTTPErrorToast(error.status, error.error.error);

    });




  }


  ///update image

  fileChangeEvent($event: any) {

    return this.loadImage64($event);
  }

  loadImage64(e: any) {

    this.imageError = '';

    const allowedTypes = ['image/jpeg', 'image/png'];

    const reader = new FileReader();

    const maxSize = 1000000;


    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    if (file.size > maxSize) {
        this.imageError = 'Tamaño máximo permitido ' + '('+maxSize / 1000 / 1000 + 'Mb' +')';
        return;
    }

    if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Formatos permitidos ( JPG | PNG )';
        return;
    }


    reader.onload = this.validateSizeImg.bind( this );


    reader.readAsDataURL( file );

    $("input[type='file']").val('');

  }


  validateSizeImg( $event) {

    const reader = $event.target.result;

    this._handleUpdateImage(reader);


    return reader;
  }

  _handleUpdateImage(image: any) {


    delete image.urlImage;


        this.loading.showLoading();

        // crea la imagen de la compañia

        this.backend.post(`company_preference_albaran`,{ base64Logo:image }).pipe(take(1)).subscribe(
            ({ data }) => {


                this.imgLoad = image;

                this.toast.displayWebsiteRelatedToast(

                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

                    this.translate.instant('GENERAL.ACCEPT'),

                );

                this.loading.hideLoading();

                this.changeDetectorRef.detectChanges();
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

  _handleDeleteImage() {


    this.loading.showLoading();

       this.backend.put(`company_preference_albaran`, { base64Logo:''}).pipe(take(1))
          .subscribe(
              (resp) => {

                this.imgLoad = '';

                $("input[type='file']").val('');

                  this.toast.displayWebsiteRelatedToast(
                      this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );

                  this.loading.hideLoading();

                  this.changeDetectorRef.detectChanges();
              },
              (error) => {

                this.loading.hideLoading();

                this.toast.displayHTTPErrorToast(error.error);
              },
          );
  }

}
