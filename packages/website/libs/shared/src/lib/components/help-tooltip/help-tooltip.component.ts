import { Component, OnInit, Input } from '@angular/core';
import { TooltipPosition } from '@angular/material';

@Component({
    selector: 'easyroute-help-tooltip',
    templateUrl: './help-tooltip.component.html',
    styleUrls: ['./help-tooltip.component.scss'],
})
export class HelpTooltipComponent implements OnInit {
    @Input()
    tooltipMessage: string;

    @Input()
    tooltipPosition: TooltipPosition = 'after';

    @Input()
    tooltipDelay: number = 0;

    constructor() {}

    ngOnInit() {}
}
