import { Component, OnInit, Optional, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';

/**
 * Component used by the editable field as the popover content. It receives its content
 * from the editable field component in the ng-content. It also adds two buttons to cancel
 * or confirm the changes.
 */
@Component({
    selector: 'app-editable-field-popover',
    templateUrl: './editable-field-popover.component.html',
    styleUrls: ['./editable-field-popover.component.scss'],
})
export class EditableFieldPopoverComponent implements OnInit {
    /**
     * Function executed when the 'confirm' icon button is clicked. It closes the popover.
     * @param $event Only used to differentiate if the user accepted or cancelled
     */
    save($event) {
        if (this.popover) {
            this.popover.close($event);
        }
    }

    /**
     * Function executed when the 'delete' icon button is clicked. It closses the popover.
     * @param $event Only used to differentiate if the user accepted or cancelled
     */
    cancel($event) {
        if (this.popover) {
            this.popover.close();
        }
    }

    /**
     * @ignore
     */
    constructor(@Optional() @Host() public popover: SatPopover) {}

    /**
     * @ignore
     */
    ngOnInit() {}
}
