import { UsersService } from './../../../../../../../users-management/src/lib/users/users.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-filters-companies',
  templateUrl: './modal-filters-companies.component.html',
  styleUrls: ['./modal-filters-companies.component.scss']
})
export class ModalFiltersCompaniesComponent implements OnInit {

  @ViewChild('showActive', { static: false }) showActive: ElementRef<HTMLElement>;
  @ViewChild('showSubscribeds', { static: false }) showSubscribeds: ElementRef<HTMLElement>;
  @ViewChild('showInDemo', { static: false }) showInDemo: ElementRef<HTMLElement>;
  @ViewChild('option', { static: false }) option: ElementRef<HTMLElement>;

  filter: any = {
    showActive: '',
    showSubscribeds: '',
    showInDemo: '',
    option: 'showAll'
  };

  
  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2,
    private _toastService: ToastService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.filter;
    
  }




  closeDialog() {

    this.activeModal.close(this.filter);
  }

  clearSearch() {

    this.filter.showActive = undefined;
    this.filter.showSubscribeds = undefined;
    this.filter.showInDemo = undefined;
    this.filter.option = 'showAll';
    this.rendered2.setProperty(this.option.nativeElement, 'value', 'showAll');
  
    this.closeDialog();
  }

  ChangeFilter(value: any) {

    console.log(value, 'value');
      
    switch ( value ) {

      case "showActive":

        this.filter.showActive = true;

        this.filter.showSubscribeds = undefined;

        this.filter.showInDemo = undefined;

        this.filter.option = value;

        this.closeDialog();

        break;
          
      case "showSubscribeds":

        this.filter.showSubscribeds = true;

        this.filter.showActive = undefined;

        this.filter.showInDemo = undefined;

        this.filter.option = value;

        this.closeDialog();
        break;
      
      case "showInDemo":

        this.filter.showInDemo = true;

        this.filter.showActive = undefined;

        this.filter.showSubscribeds = undefined;

        this.filter.option = value;
        
        this.closeDialog();
        break;
      
      case "showNoSubscriptioNoDemo":

        this.filter.showActive = undefined;

        this.filter.showSubscribeds = false;

        this.filter.showInDemo = false;

        this.filter.option = value;

        this.closeDialog();
        break;

        
      
      default:
        this.clearSearch()
        
        break;
    }
  
  }



}
