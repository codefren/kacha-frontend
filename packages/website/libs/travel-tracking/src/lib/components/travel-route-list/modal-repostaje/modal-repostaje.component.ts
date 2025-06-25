import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'easyroute-modal-repostaje',
  templateUrl: './modal-repostaje.component.html',
  styleUrls: ['./modal-repostaje.component.scss']
})
export class ModalRepostajeComponent implements OnInit {
  
  data: any;
  vehicleId: any;
  dateDeliveryStart:any;
  next = false;
  prev = false;
  from: any;
  until: any;
  show: boolean = true;
  current: number;
  
  constructor(
    private toast: ToastService,
    public dialogRef: NgbActiveModal,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getRefueling();
  }

  getRefueling(page ?: any) {

    this.show = false;

    this.backendService.post('refueling_list_route', {
        vehicleId : this.vehicleId,
        dateDeliveryStart:this.dateDeliveryStart,
        page: page
    }).pipe(take(1)).subscribe((data ) => {

        this.data = data.data[0];

        this.from = data.meta.from;

        this.until = data.meta.total;

        this.prev = data.meta.current_page > 1 ? true : false;

        this.next = data.meta.current_page < data.meta.last_page ? true : false;

        this.current = data.meta.current_page;
      
        this.show = true;

        this.detectChanges.detectChanges();

    }, (error) => {

     this.show = true;
      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );

    });

  }

  close(value: any) {
    this.dialogRef.close(value);
  }

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);

}


  getDate(date: any){
    return moment(date).format('DD/MM/YYYY');

  }

  prevPage() {
   
      this.getRefueling(this.current - 1);
   
  }
  nextPage() {
    
      this.getRefueling(this.current + 1);
    
  }

  formatEuroKm(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);
  }

  formatEuroLtr(quantity) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity) ;
  }
  
}
