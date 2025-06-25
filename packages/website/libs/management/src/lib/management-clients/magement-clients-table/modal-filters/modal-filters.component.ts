import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociatedCompany, BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})

export class ModalFiltersComponent implements OnInit {

  @ViewChild('option', { static: false }) option: ElementRef<HTMLElement>;
  showcompanys: boolean = false;
  associatedCompany: AssociatedCompany[] = [];
  userAgent: any[];
  filter: any = {
    showAll: false,
    showActive: true,
    option: 1,
    vinculations: false,
    companyAssociatedId: '',
    agentUserId: ''
  };

  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    console.log(this.filter);
    this.filter;
    this.setCompaniesAsociated();
    this.setUserAgent();
  }

  onChangeShowActive(value: any) {

    switch (value) {
      case "1":
        this.filter.showAll = false;
        this.filter.showActive = true;
        this.filter.option = value;
        break;

      case "2":
        this.filter.showAll = false;
        this.filter.showActive = false;
        this.filter.option = value;
        break;

      default:
        this.filter.showAll = true;
        this.filter.showActive = true;
        this.filter.option = value;
        break;
    }
  }

  closeDialog() {
    this.activeModal.close(this.filter);
  }

  clearSearch() {
    this.filter.showAll = false;
    this.filter.showActive = true;
    this.filter.option = 1;
    this.filter.vinculations = false;
    this.filter.companyAssociatedId = '';
    this.filter.agentUserId = '';

    this.rendered2.setProperty(this.option.nativeElement, 'value', 1);

    this.closeDialog();
  }
  ChangeFilter(event: any) {
  
    let value = event.target.value;


    switch (event.target.id) {
      case "vinculations":
        this.filter.vinculations = event.target.checked
        console.log('vinculations', event.target.id)
        break;

      case "companyAssociatedId": 
        this.filter.companyAssociatedId = event.target.value;
        break;

      case "agentUserId":
        this.filter.agentUserId = event.target.value;
        break;
    }
  }

  setCompaniesAsociated() {
    setTimeout(() => {
        this.backendService
            .get('company_associated_list')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.associatedCompany = data;
                    this.showcompanys = true;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }, 500);
  }
  setUserAgent() {
    setTimeout(() => {
        this.backendService
            .get('users_all_salesman')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.userAgent = data;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error,
                        error.error.error,
                    );
                },
            );
    }, 500);
  }

}
