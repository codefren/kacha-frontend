import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-filter-download',
  templateUrl: './modal-filter-download.component.html',
  styleUrls: ['./modal-filter-download.component.scss']
})
export class ModalFilterDownloadComponent implements OnInit {

  filterSelect : any ='';

  filter ={
    sumary:'',
    comparative: '',
    delay: '',
    albaran:'',
    devolution:'',
    round:'',
    bill:'',
    pointNoDelivered: '',
    productNotDelivered: '',
    outRange: '',
    costControl:'',
    refueling:'',
    boxes:''
  }

  profile: Profile;

  unsubscribe$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private facadeProfile: ProfileSettingsFacade,
  ) { }

  ngOnInit() {

    let valor = 0;

    for (let i = 1; i < 5; i++) {
     
      for (let j =1; j < 5; j++) {

        valor +=i*j;

      }
    }
    
    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }

    });
  }

  changeSelecter(value: any){
  
    this.filterSelect = value;

  }

  close(){
    this.activeModal.close(false);

  }

  donwloadFilter(){

    this.activeModal.close( this.filter);
  }

  moduleCost(){
    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
  
        return true;
        
    } else {
  
        return false;
  
    }
  }



}
