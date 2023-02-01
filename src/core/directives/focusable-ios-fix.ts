// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Directive, ElementRef, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreApp } from '@services/app';
import { CoreDom } from '@singletons/dom';

/**
 * Directive to fix iOS keyboard focus control over ionic components with shadowDom.
 */
@Directive({
    selector: 'ion-select,ion-toggle,[click]',
})
export class CoreFocusableIosFixDirective implements OnInit, OnChanges {

    protected element?: HTMLElement;

    @Input() disabled = false;
    @Input() button?: boolean | string;

    constructor(
        element: ElementRef,
    ) {
        if (CoreApp.isIOS() && element.nativeElement.shadowRoot) {
            this.element = element.nativeElement;
        }
    }

    /**
     * @inheritdoc
     */
    ngOnInit(): void {
        if (!this.element) {
            return;
        }

        CoreDom.initializeClickableElementA11y(this.element);
    }

    /**
     * @inheritdoc
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (!this.element) {
            return;
        }

        let disable: boolean | undefined;

        // If button is set to false in elements like ion-card or ion-item it should disable the behaviour.
        if (changes.button) {
            disable = this.button !== true && this.button !== '';

            this.element.classList.toggle('clickable', !disable);
            if (this.button && !this.element.getAttribute('role')) {
                this.element.setAttribute('role', 'button');
            }

            if (this.button && this.element.getAttribute('role') === 'button') {
                this.element.setAttribute('role', '');
            }
        }

        // If element is disabled, do not make it selectable.
        if (changes.disabled) {
            disable = disable || this.disabled;
        }

        if (disable !== undefined) {
            this.toggleTabIndex(!disable);
        }
    }

    /**
     * Toggles the tabindex attribute on the element.
     *
     * @param enable If enable (0) or disable (-1) the tab indexing.
     */
    protected toggleTabIndex(enable: boolean): void {
        if (!this.element) {
            return;
        }

        if (!enable && (this.element.getAttribute('tabindex') === '0' || this.element.getAttribute('tabindex') === null)) {
            this.element.setAttribute('tabindex', '-1');
        }

        if (enable && (this.element.getAttribute('tabindex') === '-1' || this.element.getAttribute('tabindex') === null)) {
            this.element.setAttribute('tabindex', '0');
        }
    }

}
