import { Component, OnInit } from '@angular/core';
import { AppMenuTab } from '@optimroute/shared';

@Component({
  selector: 'easyroute-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  menuItems: AppMenuTab[];
  constructor() { }

  ngOnInit() {
    this.menuItems = [
      {
          name: 'CONTROL_PANEL.ASSIGNED_ROUTES',
          route: 'assigned',
          show: true
      },
      {
        name: 'CONTROL_PANEL.ROUTE_HISTORY',
        route: 'history',
        show: true
    }
      
    ];
  }

}
