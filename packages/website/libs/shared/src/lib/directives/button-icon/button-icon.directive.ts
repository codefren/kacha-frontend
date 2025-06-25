import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

/**
 * Button Icon Directive adds an icon to the left of the button's content. It aligns the
 * items so that they centered both vertically and horizontally within the button.
 */
@Directive({
    selector: '[appButtonIcon]',
})
export class ButtonIconDirective implements OnInit {
    /**
     * Input parameter defining the material icon name
     */
    @Input() appButtonIcon: string;

    @Input() appButtonIconText: string;

    /**
     * @ignore
     */
    constructor(private renderer: Renderer2, private el: ElementRef) {}

    /**
     * @ignore
     */
    ngOnInit() {
        const icon = this.renderer.createElement('mat-icon');
        const iconName = this.renderer.createText(this.appButtonIcon);
        this.renderer.addClass(icon, 'material-icons');
        this.renderer.setAttribute(icon, 'role', 'img');
        this.renderer.setAttribute(icon, 'aria-hidden', 'true');
        this.renderer.appendChild(icon, iconName);

        const parent = this.el.nativeElement.children[0];
        const div = this.renderer.createElement('div');
        div.innerHTML = this.appButtonIconText;
        parent.innerHTML = '';
        this.renderer.appendChild(parent, icon);
        this.renderer.appendChild(parent, div);

        this.renderer.addClass(parent, 'app-button-icon-directive-parent');
        this.renderer.addClass(icon, 'app-button-icon-directive-icon');
    }
}
