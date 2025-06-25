import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

/**
 * > Directive used within a element.
 *
 * > This directive is in charge of changing the background color of its host element.
 */
@Directive({
    selector: '[appColorFilter]',
})
export class ColorFilterDirective implements OnInit {
    /**
     * Holds the color of the element
     */
    @Input('appColorFilter')
    color: string;

    /**
     * @ignore
     */
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    /**
     * @ignore
     */
    ngOnInit(): void {
        this.renderer.setStyle(this.el.nativeElement, 'background-color', this.color);
    }
}
