import { Component, OnInit, Input } from '@angular/core';
import { TooltipPosition } from '@angular/material';

@Component({
    selector: 'easyroute-expand-image',
    templateUrl: './expand-image.component.html',
    styleUrls: ['./expand-image.component.scss'],
})
export class ExpandImageComponent implements OnInit {
   

    url: string;
    constructor() {}

    ngOnInit() {
        console.log(this.url);
    }
}
