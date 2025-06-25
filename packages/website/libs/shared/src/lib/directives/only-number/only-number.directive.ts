import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
    constructor(private el: ElementRef) {}

    @Input() OnlyNumber: boolean;

    @HostListener('keydown', ['$event'])
    onKeyDown(event) {
        const e = <KeyboardEvent>event;
        if (this.OnlyNumber) {
            // Ensure that it is a number and stop the keypress
            if (
                (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
                (e.keyCode < 96 || e.keyCode > 105)
            ) {
                e.preventDefault();
            }
        }
    }
}
// onlyNumber.directive.ts
