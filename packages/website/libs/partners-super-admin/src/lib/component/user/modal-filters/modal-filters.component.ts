import { UsersService } from './../../../../../../users-management/src/lib/users/users.service';
import { ToastService } from './../../../../../../shared/src/lib/services/toast.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSettingsFacade } from 'libs/state-profile-settings/src/lib/+state/profile-settings.facade';
import { take } from 'rxjs/operators';
@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})
export class ModalFiltersComponent implements OnInit {

  @ViewChild('showActive', { static: false }) showActive: ElementRef<HTMLElement>;
  @ViewChild('profileId', { static: false }) profileId: ElementRef<HTMLElement>;
  

  filter: any = {
    showActive: '',
    profileId: ''
  };
  
  loading: string = 'success';

  profiles: any;

  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2,
    private _profileSettingsFacade: ProfileSettingsFacade,
    private _toastService: ToastService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.filter;
    this.getUserProfile();
    
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



  closeDialog() {
    this.activeModal.close(this.filter);
  }

  clearSearch() {
    this.filter.showActive = true;
    this.filter.profileId = '';
    this.filter.partnerId = '';

    this.rendered2.setProperty( this.showActive.nativeElement, 'value', true );
    this.rendered2.setProperty( this.profileId.nativeElement, 'value', '' );
    

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

      default:
        break;
    }

  }

}
