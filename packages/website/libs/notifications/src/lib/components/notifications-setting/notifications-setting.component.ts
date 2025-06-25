import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'easyroute-notifications-setting',
  templateUrl: './notifications-setting.component.html',
  styleUrls: ['./notifications-setting.component.scss']
})
export class NotificationsSettingComponent implements OnInit {

  select: string = 'notices';

  change = {

    notices: 'notices',
    
  };

  constructor(
    private router: Router,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  retunrsList(){
    
    this.router.navigateByUrl('notifications');
    
  }

}
