import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})

export class ModalFiltersComponent implements OnInit {
  
  @ViewChild('option', { static: false }) option: ElementRef<HTMLElement>;
  
  filter: any = {
    showAll: true,
    showActive: true,
    option: 3,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private rendered2: Renderer2
  ) { }

  ngOnInit() { }

  onChangeShowActive( value: any ) {

    switch ( value ) {
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
        this.filter.option = value;
        break;
    }
  }

  closeDialog() {
    this.activeModal.close(this.filter);
  }

  clearSearch() {
    this.filter.showAll = true;
    this.filter.showActive = true;
    this.filter.option = 3;

    this.rendered2.setProperty( this.option.nativeElement, 'value', 3 );

    this.closeDialog();
  }

}
