import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take } from 'rxjs/operators';
//import { UsersService } from '../../users.service';
import { ManageUsersService } from '../manage-users/manage-users.service';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})

export class ModalFiltersComponent implements OnInit {

  @ViewChild('showActive', { static: false }) showActive: ElementRef<HTMLElement>;
  @ViewChild('profileId', { static: false }) profileId: ElementRef<HTMLElement>;
  @ViewChild('idCompany', { static: false }) idCompany: ElementRef<HTMLElement>;

  filter: any = {
    showActive: '',
    profileId: '',
    idCompany:''
  };
  
  loading: string = 'success';
  profiles: any;
  stores: any;

  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2,
    private _profileSettingsFacade: ProfileSettingsFacade,
    private _toastService: ToastService,
    private userService: ManageUsersService,
    private _company: StateCompaniesService
  ) { }

  ngOnInit() {
    this.filter;
    this.getUserProfile();
    this.setCompanies();
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

  setCompanies() {

    setTimeout(() => {

      this._company.loadCompaniesStore().subscribe(
        ( resp ) => {
          this.loading = 'success';
          this.stores = resp.data;
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
    this.filter.showActive = true;
    this.filter.profileId = '';
    this.filter.idCompany = '';

    this.rendered2.setProperty( this.showActive.nativeElement, 'value', true );
    this.rendered2.setProperty( this.profileId.nativeElement, 'value', '' );
    this.rendered2.setProperty( this.idCompany.nativeElement, 'value', '' );

    this.closeDialog();
  }

  ChangeFilter(event: any) {
    
    let value = event.target.value; // el valor
    let id = event.target.id; // nombre de la etiqueta

    switch ( id ) {
      case "showActive":
        this.filter.showActive = value;

        break;
          
      case "profileId": 
        this.filter.profileId = value;

        break;

             
      case "idCompany": 
      this.filter.idCompany = value;

      break;
      
      default:
        break;
    }

  }

}
