import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { ThemePalette } from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * > Represents a side menu tab
 */
export interface SideMenuTabsInterface {
    /**
     * Material design icon's name.
     */
    icon: string;
    /**
     * Whenever a tab is clicked, the route will change to match the
     * value of this attribute.
     */
    route: string;
}

/**
 * > Side menu is the same as Angular Material Tabs but with tabs arranged vertically
 *  and with the content shown either to the right if the menu is placed to the left
 *  or to the right otherwise.
 */
@Component({
    selector: 'easyroute-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit, OnDestroy {
    @Input()
    rootPath: string;
    /**
     * Holds the menu tabs.
     */
    @Input()
    menuItems: SideMenuTabsInterface[];

    /**
     * Determines whether tabs change url or not
     */
    @Input()
    skipLocation = false;
    /**
     * Indicates the current active tab.
     */
    activeIndex: number;

    /**
     * Represents whether the side menu is placed to the left or to the right.
     *
     * If set to true, the side menu will be displayed to the left. Otherwise, to the right.
     */
    @Input()
    leftSide = true;

    /**
     *  Determines the side menu's background color.
     *
     *  If no value is provided, side menu's color will be set
     *  to the theme's background color.

     */
    @Input()
    color: ThemePalette;

    actualPath: string;

    private unsubscribe$ = new Subject<void>();

    /**
     * @ignore
     */
    constructor(private readonly router: Router, private elRef: ElementRef) {
        this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (this.actualPath !== event.url && this.actualPath !== undefined) {
                    this.setActiveIndex(event.url);
                }
                this.actualPath = event.url;
            }
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.setActiveIndex(this.actualPath);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Checks whether the current tab is active or not.
     * @param {boolean} itemIndex
     * @returns true if the current tab is active and false if it is not.
     */
    isActiveItem(itemIndex: number): boolean {
        return this.activeIndex === itemIndex;
    }

    /**
     * Sets the order of the ng-content and tabs
     */
    sideMenuOrder() {
        return this.leftSide ? 0 : 1;
    }

    setActiveIndex(path: string) {
        if (path === '/' && path !== this.rootPath) {
            this.actualPath = path + this.rootPath;
            path = this.actualPath;
        }
        for (let i = 0; i < this.menuItems.length; ++i) {
            if (this.menuItems[i].route === './') {
                if ('/' + this.rootPath === path) this.activeIndex = i;
            } else if ('/' + this.rootPath + '/' + this.menuItems[i].route === path)
                this.activeIndex = i;
        }
        this.elRef.nativeElement.getElementsByClassName('vertical-ink-bar')[0].style.top =
            this.activeIndex * 48 + 'px';
    }
}
