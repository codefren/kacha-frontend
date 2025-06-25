import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { StateCompaniesService } from '../../../../../state-companies/src/lib/state-companies.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})
export class ModalFiltersComponent implements OnInit {

  @ViewChild('profileId', { static: false }) profileId: ElementRef<HTMLElement>;
  @ViewChild('zoneId', { static: false }) zoneId: ElementRef<HTMLElement>;

/*   filter: any = {
    showActive: '',
    profileId: '',
    idCompany:''
  }; */

  filter: any = {
    profileId: '',
    idCompany: '',
    statusOrderId: '',
    zoneId: '',
    dateFrom: '',
    dateTo: '',
  };
  
  
  loading: string = 'success';
  profiles: any =[];
  zones: any;

  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2,
    private _profileSettingsFacade: ProfileSettingsFacade,
    private _toastService: ToastService,
    private userService: ManageUsersService,
    private _company: StateCompaniesService,
    private stateEasyrouteService: StateEasyrouteService

  ) { }

  ngOnInit() {
    this.filter;
    this.getUserProfile();
    this.setZone();
  }

  getUserProfile() {
    this.loading = 'loading';

    setTimeout(() => {

      this.userService.loadProfiles().subscribe(
        ( resp ) => {
          this.loading = 'success';
          this.profiles = resp.data;
        },
        (error) => {
          this.loading = 'error';

          this._toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 1000);
  }

  setZone() {
    this.loading = 'loading';
    
    setTimeout(() => {
      this.stateEasyrouteService.getZone().subscribe(
        ( resp ) => {
          this.loading = 'success';
          this.zones = resp.data;
        },
        (error) => {
          this.loading = 'error';

          this._toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 1000);
   
  }


  closeDialog() {
    this.activeModal.close(this.filter);
  }

  clearSearch() {
    this.filter.profileId = '';
    this.filter.zoneId = '';

    this.rendered2.setProperty( this.profileId.nativeElement, 'value', '' );
    this.rendered2.setProperty( this.zoneId.nativeElement, 'value', '' );

    this.closeDialog();
  }

  ChangeFilter(event: any) {
    
    let value = event.target.value; // el valor
    let id = event.target.id; // nombre de la etiqueta

    switch ( id ) {
          
      case "profileId": 
        this.filter.profileId = value;

        this.closeDialog();
        break;
             
      case "zoneId": 
      this.filter.zoneId = value;
      
      this.closeDialog();
      break;
      
      default:

        this.closeDialog();
        break;
    }

  }


}
