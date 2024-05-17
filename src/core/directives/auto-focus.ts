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

import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

import { CoreDomUtils } from '@services/utils/dom';
import { CoreUtils } from '@services/utils/utils';
import { CoreDom } from '@singletons/dom';

/**
 * Directive to auto focus an element when a view is loaded.
 * If the element is a form, it will focus the first input element.
 *
 * The value of the input will decide if show keyboard when focusing the element (only on Android).
 * In case value is false, the directive is disabled.
 *
 * <ion-input [core-auto-focus]="false" />
 * <form />
 * <form [core-auto-focus]="false"></form>
 */
@Directive({
    selector: '[core-auto-focus], form',
})
export class CoreAutoFocusDirective implements AfterViewInit {

    @Input('core-auto-focus') autoFocus: boolean | string = true;

    protected element: HTMLIonInputElement | HTMLIonTextareaElement | HTMLIonSearchbarElement | HTMLElement;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
    }

    /**
     * @inheritdoc
     */
    async ngAfterViewInit(): Promise<void> {
        if (CoreUtils.isFalseOrZero(this.autoFocus)) {
            return;
        }

        await CoreDom.waitToBeInDOM(this.element);

        // Wait in case there is an animation to enter the page, otherwise the interaction
        // between the keyboard appearing and the animation causes a visual glitch.
        await CoreUtils.wait(540);

        // Do not focus if there's a previously focused element.
        if (document.activeElement && document.activeElement !== document.body) {
            return;
        }

        // If it's a form, get the first input element.
        const focusElement = this.element.tagName === 'FORM' ?
            this.element.querySelector<HTMLElement>('ion-input, ion-select, ion-textarea, ion-radio, ion-button\
                ion-checkbox, ion-toggle, core-rich-text-editor, textarea, input, select, button')
            : this.element;

        if (focusElement) {
            CoreDomUtils.focusElement(focusElement);
        }

    }

}
