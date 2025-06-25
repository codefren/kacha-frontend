import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Company, ModuleInterface } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { CompanyMessages, LoadingService, ToastService } from '@optimroute/shared';
import { StateCompaniesFacade, StateCompaniesService } from '@optimroute/state-companies';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ActiveDialogModuleComponent } from './active-dialog-module/active-dialog-module.component';
import * as moment from 'moment';
import { RateModalConfirmComponent } from './rate-modal-confirm/rate-modal-confirm.component';
import { RateModalDocumentComponent } from './rate-modal-document/rate-modal-document.component';
declare var $: any;

@Component({
  selector: 'easyroute-rate-form',
  templateUrl: './rate-form.component.html',
  styleUrls: ['./rate-form.component.scss']
})
export class RateFormComponent implements OnInit {

    @Input('company') company: Company;
    @Output('companies')
    companies: EventEmitter<any> = new EventEmitter();
    
    rateForm: FormGroup;
    rate: any;
    rateMessages: any;

    loadingPack: string = 'success';
    loadingRate: boolean = false;
    packList: any[] = [];

    rates: any[] = [];

    modules: ModuleInterface[];

    unsubscribe$ = new Subject<void>();

    moneySymbol = environment.MONEY_SYMBOL;

    table: any;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private stateCompaniesService: StateCompaniesService,
        private loadingService: LoadingService,
        private dialog: NgbModal,
        private translate: TranslateService,
        private router: Router,
        private companiesFacade: StateCompaniesFacade,
        private detectChange: ChangeDetectorRef,
        public authLocal: AuthLocalService,
        private backend: BackendService
    ) { }
    
    ngOnInit() {
        console.log('aqui company', this.company);
        this.loadRate();
        this.load();
    
    }
    load() {

        console.log('this.modules')
        if (this.company.id && this.company.id > 0) {

            this.validateData(this.company);

            try{
                this.detectChange.detectChanges();

                this.stateCompaniesService.loadModules(this.company.id).subscribe(
                    (resp: any) => {
                        this.modules = resp.data;

                        console.log(this.modules)
                    },
                    (error: any) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
                
                this.cargarDocument();
            
            } catch(e){
    
            }
           
        } else {
            this.company.rateId = 0;
            this.company.maxUser = 0;
            this.company.suplementarySetup = 0;
            this.company.suplementaryMonthly = 0;
            this.validateData(this.company);
        }

    }

    changeTotalPrice(value: number){
        let setup = +this.rateForm.get('setupPrice').value;
        this.rateForm.get('setupPriceIva').setValue((setup + (+value)) * 1.21 );
    }

    changeRate(value: any) {
        console.log(value);
        if(+value > 0){
            let rate = this.rates.find(x => x.id === +value);
            console.log('rate', rate);
            this.rateForm.get('maxUser').setValue(rate.maxUser);
            this.rateForm.get('maxVehicle').setValue(rate.maxVehicle);
            this.rateForm.get('setupPrice').setValue(+rate.setup);
            this.rateForm.get('setupPriceIva').setValue(+rate.setup * 1.21);
            this.rateForm.get('stripeMonthlyPrice').setValue(+rate.amount);
            this.rateForm.get('stripeMonthlyPriceIva').setValue(+rate.amount* 1.21);

        } else {
            this.rateForm.get('maxUser').setValue(0);
            this.rateForm.get('maxVehicle').setValue(0);
            this.rateForm.get('setupPriceIva').setValue(0);
            this.rateForm.get('setupPrice').setValue(0);
            this.rateForm.get('stripeMonthlyPrice').setValue(0);
            this.rateForm.get('stripeMonthlyPriceIva').setValue(0);
        }
        
        
    }

    changeMontlyTotalPrice(value: number){
        console.log('aquii', value);
        let setup = +this.rateForm.get('stripeMonthlyPrice').value;
        this.rateForm.get('stripeMonthlyPriceIva').setValue((setup + (+value) ) * 1.21 );
    }


    loadRate(){
        this.loadingRate = false;
        this.backend.get('rate').pipe(take(1)).subscribe(({data})=>{
            this.rates = data;
            this.loadingRate = true;
        })
    }
    
    validateData(dataCompany: Company) {
   
        this.rateForm = this.fb.group({
            companyProfileTypeId: [dataCompany.companyProfileTypeId, [Validators.required]],
            stripeMonthlyPrice: [dataCompany.stripeMonthlyPrice, 
                [ 
                    Validators.minLength(0), 
                    Validators.maxLength(999999)
                ]],
            suplementarySetup: [dataCompany.suplementarySetup, [Validators.min(0), Validators.max(9999)]],
            suplementaryMonthly: [dataCompany.suplementaryMonthly, [Validators.min(0), Validators.max(9999)]],
            setupPrice: [dataCompany.setupPrice],
            maxUser: [dataCompany.maxUser],
            maxVehicle: [dataCompany.maxVehicle],
            rateId: [dataCompany.rateId, [Validators.required]],
            setupPriceIva: [ dataCompany.setupPriceIva ],
            stripeMonthlyPriceIva: [dataCompany.stripeMonthlyPriceIva, [Validators.required]],
            hideMultidelegation: [dataCompany.hideMultidelegation]
        });

        
        let rateMessages = new CompanyMessages();
      
        this.rateMessages = rateMessages.getCompanyMessages();
    
        this.getPack();
      
    }

    addAditionalUser(){
        let user = this.rateForm.get('maxUser').value
        this.rateForm.get('maxUser').setValue((+user) + 1);
        let value = this.rateForm.get('stripeMonthlyPrice').value;
        this.rateForm.get('stripeMonthlyPrice').setValue(+value + 25);
        this.changeMontlyTotalPrice(0);

    }

    getPack() {
        this.loadingPack = 'loading';
    
        setTimeout(() => {
            this.stateCompaniesService.loadPack().subscribe(
                (data: any) => {
                  this.loadingPack = 'success';
                  this.packList = data.data;
                },
                (error) => {
                    this.loadingPack = 'error';
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }, 1000);
    }
    
    OnChangeActiveModule(index: number, module: ModuleInterface) {
        const dialogRef = this.dialog.open(ActiveDialogModuleComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
    
        (dialogRef.componentInstance.data = {
            isActive: !module.company_module[0].isActive,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {

                    this.stateCompaniesService
                        .updateActiveCompanyModule(module.company_module[0].id, {
                            isActive: !module.company_module[0].isActive,
                        })
                        .subscribe(
                            (resp) => {
                                this.modules[index].company_module[0] = resp.data;
                                    
                                console.log(resp.data);
                                if (resp.data.moduleId == 2) {
                                    let data = {
                                        ...this.company,
                                        multiStore: resp.data.isActive
                                    };
                                  
                                    this.companies.emit(data);
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
            });
    }
    
    OnCreateCompanyModule(index: number, module: ModuleInterface) {
        const dialogRef = this.dialog.open(ActiveDialogModuleComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
    
        (dialogRef.componentInstance.data = {
            isActive: true,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.stateCompaniesService
                        .addCompanyModule({
                            companyId: this.company.id,
                            moduleId: module.id,
                        })
                        .subscribe(
                            (resp) => {
                                console.log('en el crear desde 0');
                                this.modules[index].company_module.push(resp.data);
                                if (resp.data.moduleId == 2) {
                                    let data = {
                                        ...this.company,
                                        multiStore: resp.data.isActive
                                    };
                                  
                                    this.companies.emit(data);
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
            });
    }
    
    createData(): void {
        if (!this.company.id || this.company.id === null) {

            this.company.companyProfileTypeId = this.rateForm.value.companyProfileTypeId;
            this.company.stripeMonthlyPrice = this.rateForm.value.stripeMonthlyPrice;
            this.company.stripeMonthlyPriceIva = this.rateForm.value.stripeMonthlyPriceIva;

            this.company.rateId = this.rateForm.value.rateId;


            this.company.suplementarySetup = this.rateForm.value.suplementarySetup;
            this.company.suplementaryMonthly = this.rateForm.value.suplementaryMonthly;
            this.company.setupPrice = this.rateForm.value.setupPrice;
            this.company.setupPriceIva = this.rateForm.value.setupPriceIva;
            this.company.maxUser = this.rateForm.value.maxUser;
            this.company.maxVehicle = this.rateForm.value.maxVehicle;
            
            if (this.company.startDemoDate && this.company.endDemoDate ) {
                this.company.startDemoDate =  moment(this.company.startDemoDate).format('YYYY-MM-DD');
                this.company.endDemoDate = moment(this.company.endDemoDate).format('YYYY-MM-DD'); 
            }

            this.company.hideMultidelegation = this.rateForm.value.hideMultidelegation;

            this.addCompany(this.company);
        } else {
            this.editCompany([this.company.id, this.rateForm.value]);
            this.companiesFacade.updated$.subscribe(
                (data) => {
                    if (data) {
                        this.loadingService.hideLoading();
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                    }
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                },
            );
        }
    }
    
    /* isFormInvalid(): boolean {
        return !this.rateForm.valid;
    } */
    
    changeStripeMonthly( event: number ){
    
        let stripeMonthlyPriceIva = 0;
    
        stripeMonthlyPriceIva = (event * 21 / 100);
        stripeMonthlyPriceIva += + event;
    
        console.log(stripeMonthlyPriceIva.toFixed(2), 'stripeMonthlyPriceIva.toFixed');

        this.rateForm.get['stripeMonthlyPriceIva'] = stripeMonthlyPriceIva.toFixed(2);
    
        this.rateForm.controls['stripeMonthlyPriceIva'].setValue(stripeMonthlyPriceIva.toFixed(2));
    
        this.detectChange.detectChanges();
    
    }

     dosDecimales(n) {
        let t=n.toString();
        let regex=/(\d*.\d{0,2})/;
        return t.match(regex)[0];
      
    }
     trunc (x, posiciones = 0) {
        let s = x.toString()
        let l = s.length
        let decimalLength = s.indexOf('.') + 1
        let numStr = s.substr(0, decimalLength + posiciones)
        return Number(numStr)
    }
    
    addCompany(company: Company) {

        this.loadingService.showLoading();
    
        this.stateCompaniesService.addCompany(company).subscribe(
            (data: any) => {
                this.loadingService.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('GENERAL.REGISTRATION'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );
    
                this.router.navigate(['/super-admin/company']);
            },
            (error) => {
                this.loadingService.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );
    }
      
    editCompany(obj: [number, Partial<Company>]) {
        this.companiesFacade.editCompany(obj[0], obj[1]);
        this.companiesFacade.updated$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((data) => {
              if (data) {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('COMPANIES.COMPANY_UPDATED'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );
                
                this.router.navigate(['/super-admin/company']);
              }
          });
    }

    cargarDocument() {
        
        let url = environment.apiUrl + 'company_doc_datatables?companyId=' + this.company.id;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#document';
        
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            order: [0, 'desc'],
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
                        
                        botones += `
                            <div class="text-center edit col p-0 pt-1">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                            </div>
                        `;
                        
                        botones += `
                            <div class="text-center download col p-0 pt-1 mr-1 ml-1">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg">
                            </div>
                        `;

                        botones += `
                            <div class="text-center delete col p-0 pt-1">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/delete-blue.svg">
                            </div>
                        `;

                        botones += `</div>`;
                        return botones;
                    },
                },
            ],
        });
    
        this.initEvents('#document tbody', this.table);
    }

    addDocument() {
        let document = {
            id: '',
            companyId: this.company.id,
            name: '',
            date: '',
            document: ''
        };
        const dialogRef = this.dialog.open(RateModalDocumentComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            size: 'md',
            backdrop: 'static',
            windowClass:'modal-document',
        });
        dialogRef.componentInstance.document = document;

        dialogRef.componentInstance.title = this.translate.instant(
            'RATES_AND_MODULES.DOCUMENT.ADD_DOCUMENT',
        );
        
        dialogRef.result.then((data) => {

            if (data) {
                this.stateCompaniesService
                .addCompanyDoc(data)
                .subscribe(
                    (data: any) => {
                        
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('RATES_AND_MODULES.DOCUMENT.SUCCESSFUL_REGISTRATION'),
                        );
                        //this.cargarDocument();
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
        const dialogRef = this.dialog.open(RateModalDocumentComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            size: 'md',
            backdrop: 'static',
            windowClass:'modal-document',
        });

        dialogRef.componentInstance.document = document;

        dialogRef.componentInstance.title = this.translate.instant(
            'RATES_AND_MODULES.DOCUMENT.EDIT_DOCUMENT',
        );
        
       dialogRef.result.then((data) => {
           
            if (data) {
                this.stateCompaniesService
                .editCompanyDoc(data, document.id)
                .subscribe(
                    (data: any) => {
                        
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('RATES_AND_MODULES.DOCUMENT.UPDATE_SUCCESSFUL'),
                        );
                       // this.cargarDocument();
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
        const dialogRef = this.dialog.open(RateModalConfirmComponent, {
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
                    this.stateCompaniesService
                        .destroyCompanyDoc(documentId)
                        .subscribe(
                            (data: any) => {
                                
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant('RATES_AND_MODULES.DOCUMENT.DOCUMENT_DELETED_SUCCESSFULLY'),
                                );
                                //this.cargarDocument();
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

    isFormInvalid(): boolean {
        if (!this.company.id || this.company.id === null) {
            this.company.companyProfileTypeId = this.rateForm.value.companyProfileTypeId;
            this.company.stripeMonthlyPrice = this.rateForm.value.stripeMonthlyPrice;
            this.company.stripeMonthlyPriceIva = this.rateForm.value.stripeMonthlyPriceIva;
            this.company.vehicles = this.rateForm.value.vehicles;
           /// console.log(this.rateForm.value,'this.rateForm.value');
            let data = this.company;
            this.companies.emit(data);
        }
        
        return !this.rateForm.valid;
    }

    showInfoImport(data: any, module:any){
       
        let split: any;

        let test: any;

        if (data) {

            split = data;

            if (module.id === 10) {
                console.log(data.split('De', 'hola') , 'if lite');
           
                /* return split.replace(/(\.\s*)$/, '\n'); */
                return split;
            }

            else {
                return split;
            }

           
        } else {
            return '-'
        }

    }

    changeHideMultidelegation(event:any){
        
        let data = {
            ...this.company,
            hideMultidelegation: event.target.checked
          
        };
      
        this.companies.emit(data);

    }

}
