import { secondsToDayTimeAsString } from '@optimroute/shared';
import { Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NoveltyMessages } from '../../../../../../shared/src/lib/messages/novelty/novelty.message';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Company } from '../../../../../../backend/src/lib/types/companies.type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddIncidentComponent } from './modal-add-incident/modal-add-incident.component';
import { IncidentMessages } from '../../../../../../shared/src/lib/messages/incident/incident.message';
import { ValidatePhone } from '../../../../../../shared/src/lib/validators/phone.validator';
import { environment } from '../../../../../../../apps/easyroute/src/environments/environment';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
declare var $: any;
declare function init_plugins();
import * as moment from 'moment';
import { IncidentModalViewComponent } from './incident-modal-view/incident-modal-view.component';
import { Incident } from '../../../../../../backend/src/lib/types/incident.type';
import { take, map, takeUntil } from 'rxjs/operators';
import { secondsToAbsoluteTime } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { StateCompaniesFacade } from '../../../../../../state-companies/src/lib/+state/state-companies.facade';
import { Subject, Observable } from 'rxjs';
import { StateCompaniesService } from '../../../../../../state-companies/src/lib/state-companies.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'easyroute-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss']
})
export class IncidentFormComponent implements OnInit {

@Input('company') company :Company;
@Output('companies')
companies: EventEmitter<any> = new EventEmitter();
//propagar = new EventEmitter<string>();

  incidentForm: FormGroup;
  novelty: any;
  incidentMessages: any;
  table: any;
  unsubscribe$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private dialog: NgbModal,
    public authLocal: AuthLocalService,
    private _toastService: ToastService,
    private translate: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private detectChange: ChangeDetectorRef,
    private companiesFacade: StateCompaniesFacade,
    private companiesService: StateCompaniesService,
    private stateEasyrouteService: StateEasyrouteService,
    private platformLocation: PlatformLocation,
    private router: Router
  ) { }

  ngOnInit() {
    this.platformLocation.onPopState(() => this.dialog.dismissAll());
    this.load();
  }
  load() {
      if (this.company.id && this.company.id > 0) {
        this.validaciones( this.company);
          
          try{
            this.detectChange.detectChanges();
            this.incidentHistory();
           
          } catch(e){
    
          }
    
       
      }
}

  validaciones(inciden: Company) {

    this.incidentForm = this.fb.group({
        erpName: [inciden.erpName, [ Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        erpEmail: [inciden.erpEmail, [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(100)]],
        erpResponsable: [inciden.erpResponsable, [ Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        phoneErp:[inciden.phoneErp,
        [ValidatePhone(
          '' ? '' : 'España'
        ),
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
        ],]
    });
    
    let incidentMessages = new IncidentMessages();
  
    this.incidentMessages = incidentMessages.getIncidentMessages();
    setTimeout(()=>{
      init_plugins();
  }, 1000); 
  }


  addIncident(){
    const modal = this.dialog.open(ModalAddIncidentComponent, {
        size: 'xl',
        backdrop: 'static',
        backdropClass: 'customBackdrop',
       // windowClass: 'modal-Ticket',
        centered: true,
    });
  
    modal.componentInstance.companyId = this.company.id;

     modal.result.then(
        (data) => {
            if (data) {
               this.incidentHistory();
            }
        },
        (reason) => {},
    ); 
}

  
  viewIncident(IncientView:Incident) {
    const modal = this.dialog.open(IncidentModalViewComponent, {
        size: 'xl',
        backdrop: 'static',
        backdropClass: 'customBackdrop',
       // windowClass: 'modal-Ticket',
        centered: true,
    });
 
    modal.componentInstance.IncientView = IncientView;

     modal.result.then(
        (data) => {
            if (data) {
               this.incidentHistory();
            }
        },
        (reason) => {},
    ); 

  
 
  }

  getIncientView(incientId: number){
    this.stateEasyrouteService
    .getIncident(incientId)
    .pipe(
        take(1),
        map(({ data }) => {
            return {
                ...data,
                images: data.images.map((image) => ({
                    id: image.id,
                    image: image.urlImage,
                    urlImage:image.urlImage,
                    companyIncidentId: image.companyIncidentId
                })),
                
            };
        }),
    )
    .subscribe(
        (data: any) => {
            
       this.viewIncident(data);  
        
        },
        (error) => {
          
            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        });
  }
  

  incidentHistory() {


    let url = environment.apiUrl + 'company_incident_datatables?companyId=' + this.company.id;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#incidentHistory';
    
    this.table = $('#incidentHistory').DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
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
                data: 'id',
                visible: false
            },
          {
            data: 'code',
            title: this.translate.instant('INCIDENTS.CODE'),
            
            },
            {
                data: 'date',
                title: this.translate.instant('INCIDENTS.DATE'),
                render: (data, type, row) => {
                    return moment(data).format('DD/MM/YYYY');
                },
            },
            {
                data: 'time',
                title: this.translate.instant('INCIDENTS.HOUR'),
                render: (data, type, row) => {
                   // return  moment(data).format('HH:mm');
                    return secondsToDayTimeAsString(data);
                },
            },
            {
              data: 'title',
              title: this.translate.instant('INCIDENTS.TITLE'),
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
              data: 'duration',
              title: this.translate.instant('INCIDENTS.DURATION'),
              render: (data, type, row) => {

                if (data) {
                    return  secondsToAbsoluteTime(data);
                } else {
                    return (
                        '<span class="text center" aria-hidden="true">No disponible</span>'
                      );
                }
                 
              },
          },
            {
                data: 'solved',
                title: this.translate.instant('INCIDENTS.SOLVED?'),
                render: (data, type, row) => {
                    if (data) {
                        return '<span class="text center" aria-hidden="true">Si</span>';
                    } else {
                        return (
                          '<span class="text center" aria-hidden="true">No</span>'
                        );
                    }
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this.translate.instant('INCIDENTS.SEE_DETAILS'),
                render: (data, type, row) => {
                    let botones = '';
                    botones +=
                        (`
                            <div class="text-center editar">
                                <i class="fas fa-eye fa-2x point" style="color: #24397c;"></i>
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
    
    this.editar('#incidentHistory tbody', this.table);
}

editar(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    $(tbody).on('click', 'div.editar', function() {
        let data = table.row($(this).parents('tr')).data();
        that.getIncientView(data.id);
    });
}

showObservation(observations:string){
  if (observations && observations.length > 50) {
     return observations = observations.substr(0, 49) + '...';
  } else {
      return observations;
  }
}

updateErpIncident(obj: [number, Partial<Company>]){

    if (this.isFormInvalid()) {

        this.companiesFacade.editCompany(obj[0], obj[1]);

        this.companiesFacade.updated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this._toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                   
                    this.companiesService.getCompany(this.company.id).subscribe(
                        (resp: any) => {
                           
                            this.company = resp.data;

                            this.companies.emit( this.company );

                            this.router.navigate(['/super-admin/company']);
                     
                        },
                        (error: any) => {
                          
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
                    
                }
            });
    }

    
}
  
isFormInvalid(): boolean {
    return this.incidentForm.valid;
    
}


}
