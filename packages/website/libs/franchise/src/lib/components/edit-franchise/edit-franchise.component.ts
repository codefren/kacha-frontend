import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Franchise } from '../../../../../backend/src/lib/types/franchise.type';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService, ToastService, ProductModalImgInfoComponent } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidateCompanyId } from '../../../../../shared/src/lib/validators/company-id.validator';
import { ValidatePhone } from '../../../../../shared/src/lib/validators/phone.validator';
import { secondsToDayTimeAsString, dayTimeAsStringToSeconds } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { FranchiseMessages } from '../../../../../shared/src/lib/messages/franchise-from/franchise.message';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { ConfirmCreateFranchiseComponent } from './../create-franchise/confirm-create-franchise/confirm-create-franchise.component';
import { DeliverySchedule, Profile } from '@optimroute/backend';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
declare var $;
import * as _ from 'lodash';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';

@Component({
    selector: 'easyroute-edit-franchise',
    templateUrl: './edit-franchise.component.html',
    styleUrls: ['./edit-franchise.component.scss']
})
export class EditFranchiseComponent implements OnInit {

    franchiseForm: FormGroup;

    franchiseData: any;

    franchise: Franchise = new Franchise();
    data: any;

    deliverySchedule: DeliverySchedule[] = [];

    deliveryTable: any = [];

    updateImage: boolean = false;

    franchiseImages: {
        id: number,
        urlimage: string,
        image?: string
    }[] = [];

    imageSelected: number;

    franchiseMessages: any;

    imageError: string = '';

    state: 'local' | 'server';

    @Output() changePage: EventEmitter<boolean> = new EventEmitter();

    profile: Profile;


    constructor(
        private Router: Router,
        private _activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private loading: LoadingService,
        private toastService: ToastService,
        private translate: TranslateService,
        private stateEasyrouteService: StateEasyrouteService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _backendService: BackendService,
        private _modalService: NgbModal,
        private facadeProfile: ProfileSettingsFacade,
        public authLocal: AuthLocalService
    ) { }

    ngOnInit() {

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
                    this.profile = data;
                });
            }
        });

        this.load();
    }

    load() {
        this._activatedRoute.params.subscribe(params => {

            if (params['id'] !== 'new') {

                this.loading.showLoading();

                this.stateEasyrouteService.getFranchise(params['id']).subscribe(
                    (data: any) => {

                        this.loading.hideLoading();

                        // this.updateImage = true;
                        this.state = 'server';

                        this.franchise = data.data;

                        this.franchiseImages = this.franchise.images.map((image) => ({
                            ...image,
                            image: image.urlimage
                        }));

                        this.franchise.images = this.franchiseImages;
                        this.franchiseData = this.franchise;
                        //obtener horarios en editar multitiendas
                        this.getDeliverySchedule(params['id']);

                        return this.franchiseEdit(this.franchiseData);
                    },
                    (error) => {

                        this.loading.hideLoading();

                        return this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );

            } else {

                // this.updateImage = false;

                this.state = 'local';

                return this.franchiseEdit(this.franchise);
            }

        });

    }

    getDeliverySchedule(companyId: number) {
        this._backendService.get(`franchise_list/${companyId}`).subscribe(
            ({ data }) => {
                this.deliverySchedule = data;
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }

    franchiseEdit(franchise: Franchise) {

        // this.franchise = this.franchiseData;

        let starttotalSeconds = +franchise.scheduleStart ? franchise.scheduleStart : 0;

        starttotalSeconds %= 3600;

        let startminutes = Math.floor(starttotalSeconds / 60);

        let startseconds = starttotalSeconds % 60;

        let endtotalSeconds = +franchise.scheduleEnd ? franchise.scheduleEnd : 0;

        let endhours = Math.floor(endtotalSeconds / 3600);

        endtotalSeconds %= 3600;

        let endminutes = Math.floor(endtotalSeconds / 60);

        let endseconds = endtotalSeconds % 60;

        this.franchiseForm = this.fb.group({

            name: [franchise.name, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            nif: [franchise.nif, [
                ValidateCompanyId(
                    'España'
                ),
                Validators.required,
            ]],
            streetAddress: [franchise.streetAddress,
            [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
            phone: [
                franchise.phone,
                [ValidatePhone(
                    '' ? '' : 'España'
                ),
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
                ],
            ],
            email: [franchise.billingEmail, [Validators.required, Validators.email]],
            password: [this.franchise.password || '', this.setPasswordValidation(franchise)],
            responsableName: [franchise.responsableName,
            [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            scheduleStart:
                [franchise.scheduleStart ? secondsToDayTimeAsString(franchise.scheduleStart)
                    : secondsToDayTimeAsString(0)],
            scheduleEnd:
                [franchise.scheduleEnd ? secondsToDayTimeAsString(franchise.scheduleEnd)
                    : secondsToDayTimeAsString(86399)],
            activeInApp: [franchise.activeInApp],
            receiveProductsFromCompanyParent: [franchise.receiveProductsFromCompanyParent],
            productReceptionTimeFromCompanyParent:
                [franchise.productReceptionTimeFromCompanyParent ? secondsToDayTimeAsString(franchise.productReceptionTimeFromCompanyParent)
                    : secondsToDayTimeAsString(0)],
            productReceptionEachTimeFromCompanyParent:
                [franchise.productReceptionEachTimeFromCompanyParent ? secondsToDayTimeAsString(franchise.productReceptionEachTimeFromCompanyParent)
                    : secondsToDayTimeAsString(0)],
            images: [''],
            password_confirmation: ['', [this.validatePasswords.bind(this.franchiseForm)]],
            deliverySchedule: [''],
            multipleOrderBox: [franchise.companyPreferencePreparation ? franchise.companyPreferencePreparation.multipleOrderBox : false]
        });

        if (!franchise.receiveProductsFromCompanyParent) {
            this.franchiseForm.get('productReceptionTimeFromCompanyParent').disable();
        }

        if (!franchise.receiveProductsFromCompanyParent) {
            this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').disable();
        }

        this.franchiseForm.controls['scheduleStart'].setValidators([
            this.ValidatorWindowsStart.bind(this.franchiseForm)
        ]);

        this.franchiseForm.controls['scheduleEnd'].setValidators([
            this.ValidatorWindowsEnd.bind(this.franchiseForm)
        ]);

        const validationMessagesfranchiste = new FranchiseMessages();

        this.franchiseMessages = validationMessagesfranchiste.getFranchiseMessages();
    }

    setPasswordValidation(franchise: Franchise) {  // validacion de campo contraseña

        if (franchise.id) {
            return [Validators.minLength(8)];
        }

        return [Validators.required, Validators.minLength(8)];
    }

    validatePasswords(group: AbstractControl) {

        let pass = group.root.value.password;
        let confirmPass = group.value;

        return pass === confirmPass ? null : { confirmar: true };
    }

    ValidatorWindowsStart(control: FormControl): { [s: string]: boolean } {

        let formulario: any = this;

        if (control.value === formulario.controls['scheduleEnd'].value) {

            return {
                confirmar: true
            };

        } else if (control.value > formulario.controls['scheduleEnd'].value) {

            return {
                sutrast: true
            };
        }
        return null;
    }

    viewChange() {
        if (this.franchiseForm.value.receiveProductsFromCompanyParent === false) {
            this.franchiseForm.get('productReceptionTimeFromCompanyParent').disable();
            this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').disable();
        } else {
            this.franchiseForm.get('productReceptionTimeFromCompanyParent').enable();
            this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').enable();
        }

    }
    ValidatorWindowsEnd(control: FormControl): { [s: string]: boolean } {
        let formulario: any = this;

        if (control.value < formulario.controls['scheduleStart'].value) {

            return {

                sutrast: true

            };
        } else if (control.value === formulario.controls['scheduleStart'].value) {

            return {

                confirmar: true

            };
        }
        return null;

    }

    changetime(event: any, name: string) {

        if (event.target.value === '') {
            switch (name) {
                case "scheduleStart":
                    this.franchiseForm.get('scheduleStart').setValue(secondsToDayTimeAsString(0));
                    this.franchiseForm.get('scheduleStart').updateValueAndValidity();
                    break;
                case "scheduleEnd":
                    this.franchiseForm.get('scheduleEnd').setValue(secondsToDayTimeAsString(86399));
                    this.franchiseForm.get('scheduleEnd').updateValueAndValidity();
                    break;
                default:
                    break;
            }
        } else {
            this.franchiseForm.get('scheduleStart').updateValueAndValidity();
            this.franchiseForm.get('scheduleEnd').updateValueAndValidity();
        }

    }
    fileChangeEvent($event: any, position: any) {

        this.imageSelected = position;

        return this.loadImage64($event);
    }

    loadImage64(e: any) {

        this.imageError = '';

        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 1000000;  // bytes
        const reader = new FileReader();

        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        // console.log( file.type );
        // console.log( file.size );
        if (!file) {
            return;
        }

        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }

        reader.onload = this.validateSizeImg.bind(this);
        reader.readAsDataURL(file);
    }

    validateSizeImg($event: any) {

        const reader = $event.target.result;

        return this._handleReaderLoaded(reader);

        /*
          // validacion de dimensiones retirar la linea completa return superior y 
          // el comentario si desea validar las mismas
        
          const image = new Image();
          const maxHeight = 500;
          const maxWidth = 500;
    
          image.src = reader;
    
          image.onload = ( rs ) => {
            const imgWidth = rs.currentTarget['width'];
            const imgHeight = rs.currentTarget['height'];
    
            if ( imgHeight > maxHeight || imgWidth > maxWidth ) {
              this.imageError = `Dimensiones máximas permitidas ${ maxHeight }px x ${ maxWidth }px`;
              return this._changeDetectorRef.detectChanges();
            } 
          
            return this._handleReaderLoaded( reader );
          } 
        */
    }

    _handleReaderLoaded(reader: string) {

        let data = {  // new image
            id: this.imageSelected,
            image: reader,
            urlimage: reader,
        };

        if (this.franchise.id > 0 || this.franchise.id !== null) {

            if (this.franchise.images.length > 0) {

                let found = this.franchise.images.find((image) => image.id === this.imageSelected);

                data = {
                    ...data,
                    id: this.imageSelected,
                }

                // si halla la imagen la actualiza y mapea
                if (found) {

                    // this.loading.showLoading();

                    this.stateEasyrouteService.updateCompanyImage(data, found.id)
                        .pipe(take(1))
                        .subscribe(
                            (resp) => {
                                this.franchise.images = this.franchise.images.map((image) => {
                                    if (image.id === found.id) {
                                        return data;
                                    }

                                    return image;
                                });

                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                    this.translate.instant('GENERAL.ACCEPT')
                                );
                                this.loading.hideLoading();
                            },
                            (error) => {
                                this.loading.hideLoading();
                                this.toastService.displayHTTPErrorToast(error.error);
                            }
                        )

                } else {

                    // si no la halla la crea y concatena al arreglo actual
                    const payload = {
                        id: this.franchise.id,
                        idCompany: this.franchise.id,
                        image: reader,
                        urlimage: reader
                    }

                    // this.loading.showLoading();

                    this.stateEasyrouteService.createCompanyImage(payload)
                        .pipe(take(1))
                        .subscribe((dataImage: any) => {

                            data = {
                                id: dataImage.data.id,
                                urlimage: dataImage.data.urlImage,
                                image: dataImage.data.urlImage
                            };

                            this.franchiseImages = this.franchiseImages.concat([data]);
                            this.franchise.images = this.franchiseImages;

                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                this.translate.instant('GENERAL.ACCEPT')
                            );

                            this.loading.hideLoading();
                        },
                            (error) => {

                                this.toastService.displayHTTPErrorToast(error.error);
                                this.loading.hideLoading();
                            });

                }

            } else {

                // si el usuario edita la compañia pero no tiene imagen

                const payload = {
                    id: this.franchise.id,
                    idCompany: this.franchise.id,
                    image: reader,
                    urlimage: reader
                }

                // this.loading.showLoading();

                this.stateEasyrouteService.createCompanyImage(payload)
                    .pipe(take(1))
                    .subscribe((dataImage: any) => {
                        data = {
                            id: dataImage.data.id,
                            urlimage: dataImage.data.urlImage,
                            image: dataImage.data.urlImage
                        };

                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT')
                        );

                        this.franchiseImages = this.franchiseImages.concat([data]);
                        this.franchise.images = this.franchiseImages;

                        this.loading.hideLoading();

                    },
                        (error) => {

                            this.toastService.displayHTTPErrorToast(error.error);
                            this.loading.hideLoading();
                        });

            }

        } else {

            // franquicia nueva sin imagenes almacenadas

            if (this.franchiseImages.length > 0) {

                let found = this.franchiseImages.find((image) => image.id === this.imageSelected)

                if (found) {

                    // mapea si la imagen existe dentro del arreglo
                    this.franchise.images = this.franchiseImages.map((image) => {
                        if (image.id === found.id) {
                            return data;
                        }

                        return image;
                    });

                } else {

                    // añade el elemento si no existe la imagen en el arreglo
                    // obtiene la posicion

                    data = {
                        ...data,
                        id: this.franchiseImages.length + 1
                    };

                    this.franchiseImages = this.franchiseImages.concat([data]);
                    this.franchise.images = this.franchiseImages;
                }

            } else {

                // si no hay imagenes
                data = {
                    ...data,
                    id: 1
                }

                this.franchiseImages = this.franchiseImages.concat([data]);
                this.franchise.images = this.franchiseImages

            }

            this._changeDetectorRef.detectChanges();
        }
    }


    submit() {

        this.loading.showLoading();

        this.franchiseForm.get('images').setValue(this.franchise.images);

        const formValues = this.franchiseForm.value;

        formValues.scheduleStart = dayTimeAsStringToSeconds(
            this.franchiseForm.get('scheduleStart').value,
        );
        /* this.franchiseForm.get('scheduleStart').setValue(dayTimeAsStringToSeconds(
          this.franchiseForm.get('scheduleStart').value,
        )); */


        formValues.scheduleEnd = dayTimeAsStringToSeconds(
            this.franchiseForm.get('scheduleEnd').value,
        );
        formValues.productReceptionTimeFromCompanyParent = dayTimeAsStringToSeconds(
            this.franchiseForm.get('productReceptionTimeFromCompanyParent').value,
        );

        formValues.productReceptionEachTimeFromCompanyParent = dayTimeAsStringToSeconds(
            this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').value,
        );


        formValues.companyPreferencePreparation = {
            multipleOrderBox: formValues.multipleOrderBox
        };

        if (this.franchise.id) {

            formValues.productReceptionTimeFromCompanyParent = dayTimeAsStringToSeconds(
                this.franchiseForm.get('productReceptionTimeFromCompanyParent').value,
            );
            /* this.franchiseForm.get('productReceptionTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
              this.franchiseForm.value.productReceptionTimeFromCompanyParent,
            )); */
            formValues.productReceptionEachTimeFromCompanyParent = dayTimeAsStringToSeconds(
                this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').value,
            );
            /* this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
              this.franchiseForm.value.productReceptionEachTimeFromCompanyParent,
            )); */


            this.stateEasyrouteService.updateFranchise(this.franchiseData.id, formValues)
                .pipe(take(1))
                .subscribe((data: any) => {

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT')
                    );
                    this.loading.hideLoading();

                    return this.Router.navigate(['franchise']);

                }, (error) => {

                    return this.toastService.displayHTTPErrorToast(error.status, error.error.error)

                });

        } else {

            formValues.deliverySchedule = this.deliverySchedule;

            this.confirmCreateFranchise((form) => {

                this.loading.showLoading();

                this.stateEasyrouteService.createFranchise(formValues)
                    .pipe(take(1))
                    .subscribe(
                        (resp) => {

                            this.loading.hideLoading();

                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('GENERAL.REGISTRATION'),
                                this.translate.instant('GENERAL.ACCEPT')
                            )

                            this.Router.navigate(['franchise']);
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                        }
                    );
            });

        }
    }

    confirmCreateFranchise(callback: (valueForm: any) => void) {

        /* this.getFranchiseModule()
          .pipe(take(1))
          .subscribe((data) => {
            // open modal confirm
            this.loading.hideLoading();
    
            const modal = this._modalService.open(ConfirmCreateFranchiseComponent, {
              backdrop: 'static',
              backdropClass: 'customBackdrop',
              centered: true,
            });
    
            modal.componentInstance.data = data;
    
            modal.result
              .then(
                (resp: boolean) => {
    
                  if (resp) {
    
                    
                  }
    
                  return this.loading.hideLoading();
                },
                (reason) => this.loading.hideLoading()
              )
          },
            (error) => {
    
              this.loading.hideLoading();
              this.toastService.displayHTTPErrorToast(error.status, error.error.error)
            }); */
        this.franchiseForm.get('productReceptionTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
            this.franchiseForm.get('productReceptionTimeFromCompanyParent').value,
        ));

        this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
            this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').value,
        ));
        return callback(this.franchiseForm.value);
    }

    /* getFranchiseModule() {
  
      return this._backendService.get('module/2')
        .pipe(
          take(1),
          map(({ data }) => ({
            price: data.price,
            iva: data.iva,
            individualFranchisePrice: data.individualFranchisePrice,
            individualFranchisePriceIva: data.individualFranchisePriceIva,
            name: data.name
          })),
        )
    } */

    updateImageLocal(images: any[]) {

        this.franchiseImages = images.map((image) => {
            delete image.urlImage;
            return image
        });

        this.franchise.images = this.franchiseImages;
    }

    updateImageServer({ data, id }) {

        delete data.urlImage;

        this.loading.showLoading();

        if (id) {  // edit

            this.stateEasyrouteService.updateCompanyImage(data, id)
                .pipe(take(1))
                .subscribe(
                    (resp) => {
                        this.franchiseImages = this.franchise.images.map((image) => {
                            if (image.id === id) {
                                return data;
                            }

                            return image;
                        });

                        this.franchise.images = this.franchiseImages;

                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT')
                        );
                        this.loading.hideLoading();
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toastService.displayHTTPErrorToast(error.error);
                    }
                )

        } else {  // new

            this.stateEasyrouteService.createCompanyImage({ ...data, idCompany: this.franchise.id })
                .pipe(take(1))
                .subscribe((dataImage: any) => {

                    data = {
                        id: dataImage.data.id,
                        urlimage: dataImage.data.urlImage,
                        image: dataImage.data.urlImage
                    };

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT')
                    );

                    this.franchiseImages = this.franchiseImages.concat([data]);
                    this.franchise.images = this.franchiseImages;

                    this.loading.hideLoading();

                },
                    (error) => {

                        this.toastService.displayHTTPErrorToast(error.error);
                        this.loading.hideLoading();
                    });
        }
    }

    _handleUpdateImage(image: any) {

        delete image.urlImage;

        if (this.franchise.id) {  // crea la imagen de la compañia

            this.loading.showLoading();

            this.stateEasyrouteService.createCompanyImage({ ...image, idCompany: this.franchise.id })
                .pipe(take(1))
                .subscribe((dataImage: any) => {

                    image = {
                        id: dataImage.data.id,
                        urlimage: dataImage.data.urlImage,
                        image: dataImage.data.urlImage
                    };

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT')
                    );

                    this.franchiseImages = this.franchiseImages.concat([image]);
                    this.franchise.images = this.franchiseImages;

                    this.loading.hideLoading();

                },
                    (error) => {

                        this.toastService.displayHTTPErrorToast(error.error);
                        this.loading.hideLoading();
                    });

        } else {   // cuando es nuevo se le asigna un id temporal a la imagen para poder filtrarlo

            image.id = Date.now();

            console.log(image);

            this.franchiseImages = this.franchiseImages.concat([image]);
            this.franchise.images = this.franchiseImages;
        }
    }

    _handleDeleteImage(franchiseImageId: number, franchiseImage?: string) {

        if (this.franchise.id) {

            this.stateEasyrouteService.deleteCompanyImage(franchiseImageId)
                .pipe(take(1))
                .subscribe(
                    (resp) => {

                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT')
                        );

                        this.ngOnInit();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.error);
                    }
                )

        } else {

            this.franchiseImages = this.franchiseImages.filter((image) => image.id !== franchiseImageId);
            this.franchise.images = this.franchiseImages;
        }
    }



    addDeliveryTime() {

        let data = {

            name: 'Horario',

            scheduleStart: 25200,

            scheduleEnd: 79200,

            isActive: true

        }


        if (this.franchise.id > 0) {

            this.createDeliveryschedule();

        } else {

            this.franchise.deliverySchedule.push(data);

            this.deliveryTable.push(data);

            this.deliverySchedule = this.deliveryTable;

            this._changeDetectorRef.detectChanges();

        }

    }

    validateInput(value: any) {

        if (value != '' || value.length > 0) {
            return true;
        } else {
            return false;
        }

    }

    //cuando es crear multitienda editar tabla
    changeDeliveryShedule(event: any, deliverySchedule: DeliverySchedule, name: string) {

        switch (name) {

            case "name":

                if (this.validateInput(event)) {
                    deliverySchedule.name = event;
                }

                break;

            case "scheduleStart":


                deliverySchedule.
                    scheduleStart = dayTimeAsStringToSeconds(event);


                break;

            case "scheduleEnd":


                deliverySchedule.
                    scheduleEnd = dayTimeAsStringToSeconds(event);

                break;


            case "isActive":

                deliverySchedule.isActive = event

                break;

            default:

                break;
        }

    }
    //cuando es editar multitienda editar 1 a 1
    changeDeliverySheduleUpdate(event: any, deliverySchedule: DeliverySchedule, name: string) {

        switch (name) {

            case "name":

                deliverySchedule.name = event

                if (this.validateInput(deliverySchedule.name)) {
                    this.updateDeliverySchedule(deliverySchedule);
                }

                break;

            case "scheduleStart":
                deliverySchedule.scheduleStart = dayTimeAsStringToSeconds(event);
                if (!this.validtimeStart(deliverySchedule)) {
                    this.updateDeliverySchedule(deliverySchedule);
                }

                break;

            case "scheduleEnd":

                deliverySchedule.
                    scheduleEnd = dayTimeAsStringToSeconds(event);
                if (!this.validtimeEnd(deliverySchedule)) {
                    this.updateDeliverySchedule(deliverySchedule);
                }


                break;

            default:
                break;
        }

    }
    activeDeliverySchedule(event: any, deliveryRates: any) {

        const modal = this._modalService.open(DeliveryModalConfirmationComponent, {

            centered: true,
            backdrop: 'static'
        });
        if (deliveryRates.isActive) {



            modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
            modal.componentInstance.message = this.translate.instant('GENERAL.INACTIVE?');

        } else {
            modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
            modal.componentInstance.message = this.translate.instant('GENERAL.ACTIVE?');
        }


        modal.result.then((result) => {
            if (result) {
                if (deliveryRates.isActive) {
                    deliveryRates = {
                        ...deliveryRates,
                        isActive: event
                    }
                    this.updateDeliverySchedule(deliveryRates);
                } else {
                    deliveryRates = {
                        ...deliveryRates,
                        isActive: event
                    }
                    this.updateDeliverySchedule(deliveryRates);
                }

            } else {
                $('#isActiveitem' + deliveryRates.id).prop('checked', deliveryRates.isActive);
            }
        })



    }

    createDeliveryschedule() {

        let create = {

            company_id: this.franchise.id,

            name: 'Horario',

            scheduleStart: 25200,

            scheduleEnd: 79200,

            isActive: true
        }

        this.loading.showLoading();

        this.stateEasyrouteService.createServiceDeliveryschedule(create)
            .pipe(take(1))
            .subscribe(
                ({ data }) => {

                    this.deliverySchedule.push(data);
                    this._changeDetectorRef.detectChanges();
                    this.loading.hideLoading();

                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                    this.loading.hideLoading();
                }
            );

    }
    updateDeliverySchedule(deliverySchedule: DeliverySchedule) {

        let send = {
            company_id: this.franchise.id,
            id: deliverySchedule.id,
            isActive: deliverySchedule.isActive,
            name: deliverySchedule.name,
            scheduleStart: deliverySchedule.scheduleStart,
            scheduleEnd: deliverySchedule.scheduleEnd,

        }
        this.loading.showLoading();

        this.stateEasyrouteService.updateDeliveryschedule(deliverySchedule.id, send)
            .pipe(take(1)).subscribe(
                ({ data }) => {

                    let index = _.cloneDeep(this.deliverySchedule.findIndex(x => x.id == data.id));

                    let deliveriesShe = _.cloneDeep(this.deliverySchedule);

                    deliveriesShe[index] = {
                        ...data
                    }
                    this.deliverySchedule = [];

                    this.deliverySchedule = deliveriesShe;

                    this._changeDetectorRef.detectChanges();

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT')
                    );

                    this.loading.hideLoading();

                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                    this.loading.hideLoading();
                },
            );

    }

    deliveryScheduleId(index, item) {
        return item.id;
    }


    validtimeStart(hours: any) {

        if (hours.scheduleStart > hours.scheduleEnd) {

            return true;

        } else if (hours.scheduleStart === hours.scheduleEnd) {

            return true;

        } else {

            return false;
        }

    }

    validtimeEnd(hours: any) {


        if (hours.scheduleEnd < hours.scheduleStart) {

            return true;

        } else if (hours.scheduleEnd === hours.scheduleStart) {

            return true;

        } else {

            return false;
        }
    }

    validIntervalHours() {

        let exist = false;
        this.deliverySchedule.forEach((element, i) => {

            if (element.scheduleStart > element.scheduleEnd) {
                exist = true;
            } else if (element.scheduleStart === element.scheduleEnd) {
                exist = true;
            } else if (element.scheduleEnd < element.scheduleStart) {
                exist = true;
            } else if (element.scheduleEnd === element.scheduleStart) {
                exist = true;
            } else {
                exist = false;
            }
        });
        return exist;
    }
    secondToTime(value) {
        return secondsToDayTimeAsString(value);
    }

    showModalImgInfo() {

        const modal = this._modalService.open(ProductModalImgInfoComponent, {
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.type = 'promotion';
    }

    confirmDeleteSchedule(data: any, i:any){

        console.log(data)

        console.log(this.deliverySchedule, 'this.deliverySchedule')

        if (this.franchise && this.franchise.id > 0) {
            const modal = this._modalService.open( DeliveryModalConfirmationComponent, { 
                centered: true,
                backdrop: 'static'
              });
          
              
                modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
          
                modal.componentInstance.message = this.translate.instant('GENERAL.ARE_YOU_TO_DELETE_SELECTED_SCHEDULES');
          
              
          
              modal.result.then(( result : boolean ) => {
                
                if ( result ) {
          
          
                 this.deleteServiceShedule(data, i);
          
                } else {

                }
              }); 
        } else {

            
                 
            let index = this.deliverySchedule.indexOf(data);


            if (index !== -1) {
        
                this.deliverySchedule.splice(index, 1);
            }
        }

        
      }

    deleteServiceShedule(data: any, i:any){


        let index = this.deliverySchedule.indexOf(data);
    
    
        this.stateEasyrouteService.deletePreferenceSchedule( data.id )
    
          .pipe( take(1) )
    
          .subscribe(
    
            ({ data }) => {
              
              this.loading.hideLoading();
              
              if (index !== -1) {
                
                this.deliverySchedule.splice(index, 1);
            }
    
              this._changeDetectorRef.detectChanges();
    
              this.toastService.displayWebsiteRelatedToast( 
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'), 
                this.translate.instant('GENERAL.ACCEPT') 
              );
            },
            ( error ) => {

              this.loading.hideLoading();

              this.toastService.displayHTTPErrorToast( error.status, error.error );
            }
          )
    
      }



      hideMultidelegation() {

        if (!this.isAdminGlobal() && this.profile.company &&
            this.profile.company.hideMultidelegation) {
    
            return false;

        } 

        return true;
        
    }

    isAdminGlobal() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }


}
