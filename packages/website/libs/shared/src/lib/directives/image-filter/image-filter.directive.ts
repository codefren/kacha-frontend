import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

/**
 * > Directive used within an image.
 *
 * > This directive is in charge of changing the color of an image.
 *  Image must have a transparent background and only one color in order to work properly
 */
@Directive({
    selector: '[appImageFilter]',
})
export class ImageFilterDirective implements OnInit {
    /**
     * Holds the color of the element
     */
    @Input('appImageFilter')
    color: string;

    /**
     * @ignore
     */
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    /**
     * @ignore
     */
    ngOnInit(): void {
        this.renderer.setStyle(
            this.el.nativeElement,
            '-webkit-filter',
            `opacity(0.8) drop-shadow(0 0 0 ${this.color})`,
        );
        this.renderer.setStyle(
            this.el.nativeElement,
            'filter',
            `opacity(0.8) drop-shadow(0 0 0 ${this.color})`,
        );
    }
}
