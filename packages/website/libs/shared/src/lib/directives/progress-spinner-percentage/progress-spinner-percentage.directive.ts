import {
    Directive,
    ElementRef,
    Renderer2,
    Input,
    OnInit,
    OnChanges,
    HostListener,
    SimpleChanges,
    AfterViewInit,
} from '@angular/core';

/**
 * > Directive used within a progress spinner.
 *
 * > This directive is in charge of showing, inside the progress circle,
 *  the actual percentage of the progress spinner.
 */
@Directive({
    selector: '[appProgressSpinnerPercentage]',
})
export class ProgressSpinnerPercentageDirective
    implements OnInit, OnChanges, AfterViewInit {
    /**
     * @ignore
     */
    container: any;

    /**
     * @ignore
     */
    textSpan: any;

    /**
     * Holds the percentage value of the spinner.
     */
    @Input('appProgressSpinnerPercentage')
    percentageValue: number;

    /**
     * @ignore
     */
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    /**
     * @ignore
     */
    ngOnInit() {
        this.container = this.renderer.createElement('div');
        this.textSpan = this.renderer.createElement('span');
        const text = this.renderer.createText(this.percentageValue + '%');

        this.renderer.addClass(this.el.nativeElement, 'progress-spinner-percentage');
        this.renderer.addClass(this.container, 'progress-spinner-percentage-container');

        this.renderer.appendChild(this.textSpan, text);
        this.renderer.appendChild(this.container, this.textSpan);
        this.renderer.appendChild(this.el.nativeElement, this.container);
    }

    /**
     * @ignore
     */
    ngOnChanges(changes: SimpleChanges) {
        if (this.textSpan) {
            this.textSpan.innerHTML = this.percentageValue + '%';

            this.resizeText();
        }
    }

    /**
     * @ignore
     */
    ngAfterViewInit() {
        this.resizeText();
    }

    /**
     * This method is called when the browser window is resized, in order
     * update the percentage text size to match the _possibly_ updated
     * spinner size.
     *
     * This method is also called when the percentage text changes, in order
     * to make the text smaller when the percentage has three digits.
     */
    @HostListener('window:resize')
    resizeText(): void {
        const diameter = this.el.nativeElement.clientHeight;

        function nDigits(v: number): number {
            if (v < 10) {
                return 1;
            }
            return 1 + nDigits(v / 10);
        }

        const textSizeDivider = 4 * (Math.max(2, nDigits(this.percentageValue)) + 1);

        const baseSize = Math.floor(diameter / textSizeDivider);
        let extraSize;
        if (baseSize === 1) extraSize = 3 * (baseSize + 1);
        else extraSize = 4 * baseSize;
        this.textSpan.style.fontSize = (baseSize + extraSize).toString() + 'px';
    }
}
