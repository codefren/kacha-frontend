import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material';

@Component({
    selector: 'app-filter-input',
    templateUrl: './filter-input.component.html',
    styleUrls: ['./filter-input.component.scss'],
})
export class FilterInputComponent implements OnInit {
    @Input()
    color: ThemePalette;

    filterValue: string;

    @Input() placeholder = 'Search';

    constructor() {}

    ngOnInit() {}

    themingClasses(color) {
        return {
            primary: color === 'primary',
            accent: color === 'accent',
            warn: color === 'warn',
        };
    }
}
