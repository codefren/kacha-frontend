import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'easyroute-management-clients-settings',
  templateUrl: './management-clients-settings.component.html',
  styleUrls: ['./management-clients-settings.component.scss']
})
export class ManagementClientsSettingsComponent implements OnInit {
  
  select: string = 'time_specification';

  change = {
    time_specification: 'time_specification',
    download_times: 'download_times',
    delays: 'delays',
    storage_data: 'storage_data',
    data_update:'data_update'
  };


  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  changePage(name: string) {
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  retunrsList(){

    this.router.navigateByUrl('management/clients');
    
  }

}
