import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'easyroute-management-zone',
    templateUrl: './management-zone.component.html',
    styleUrls: ['./management-zone.component.scss'],
})
export class ManagementZoneComponent implements OnInit {
    constructor(private _translate: TranslateService) {}

    ngOnInit() {}
}
