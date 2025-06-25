import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ThemePalette } from '@angular/material';

/**
 * > The editable field receives in the ng-content two basic parts:
 * > * The first one, identified by the attribute 'content', will be the displayed while on
 * idle.
 * > * The second one, identified by the attribute 'form', will be the one displayed in the
 * popover.
 *
 * > When the content is clicked the component opens a popover with the corresponding
 * content. When the popover is closed, the original content will be dislayed again.
 */
@Component({
    selector: 'app-editable-field',
    templateUrl: './editable-field.component.html',
    styleUrls: ['./editable-field.component.scss'],
})
export class EditableFieldComponent implements OnInit {
    /**
     * Input parameter that defines a theme palette for the editable field.
     */
    @Input() color: ThemePalette;

    /**
     * Output parameter that defines an EventEmitter, which will be a function. This
     * function will be emitted when the user accepts the changes done in the popover.
     */
    @Output() confirm = new EventEmitter<any>();

    /**
     * Output parameter that defines an EventEmitter, which will be a function. This
     * function will be emitted when the user cancels the changes done in the popover.
     */
    @Output() cancel = new EventEmitter<any>();

    /**
     * Function that emits the corresponding function (cancel or confirm) depending on
     * whether or not the $event parameter is defined or not.
     * @param $event Only used to determine if the user cancelled or confirmed the changes
     * while on the popover.
     */
    close($event) {
        if ($event) {
            this.confirm.emit($event);
        } else {
            this.cancel.emit($event);
        }
    }

    /**
     * @ignore
     */
    constructor() {}

    /**
     * @ignore
     */
    ngOnInit() {}
}
