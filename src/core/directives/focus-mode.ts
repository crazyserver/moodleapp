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

import {
    AfterViewInit,
    Directive,
    ElementRef,
    OnDestroy,
} from '@angular/core';

import { Translate } from '@singletons';
import { CoreIcons } from '@singletons/icons';
import { CoreViewer } from '@features/viewer/services/viewer';
import { CoreDom } from '@singletons/dom';
import { CoreWait } from '@singletons/wait';
import { CoreCancellablePromise } from '@classes/cancellable-promise';
import { CoreModals } from '@services/modals';

/**
 * Directive to add the focus mode to the selected html tag.
 *
 * It will add a button on the header toolbar or in the div with class 'add-core-focus-mode-button'.
 *
 * Example usage:
 * <div core-focus-mode>
 */
@Directive({
    selector: '[core-focus-mode]',
})
export class CoreFocusModeDirective implements AfterViewInit, OnDestroy {

    protected element: HTMLElement;
    protected viewportPromise?: CoreCancellablePromise<void>;
    protected disabledStyles: HTMLStyleElement[] = [];
    protected hiddenElements: HTMLElement[] = [];
    protected enabled = false;
    protected contentEl?: HTMLIonContentElement;
    protected embedded = false;

    constructor(
        element: ElementRef,
    ) {
        this.element = element.nativeElement;
        this.viewportPromise = CoreDom.waitToBeInViewport(this.element);
    }

    /**
     * @inheritdoc
     */
    async ngAfterViewInit(): Promise<void> {
        await this.viewportPromise;
        await CoreWait.nextTick();
        this.addTextViewerButton();
    }

    /**
     * Add text viewer button to enable the focus mode.
     */
    protected async addTextViewerButton(): Promise<void> {
        const page = CoreDom.closest(this.element, '.ion-page');
        this.contentEl = page?.querySelector('ion-content') ?? undefined;

        let toolbar = page?.querySelector('.add-core-focus-mode-button');
        if (!toolbar) {
            // Add it to the toolbar.
            toolbar = page?.querySelector('ion-header ion-toolbar ion-buttons[slot="end"]');
        }

        if (!toolbar || toolbar.querySelector('.core-text-viewer-button')) {
            return;
        }

        const label = Translate.instant('core.openfulltext');
        const button = document.createElement('ion-button');

        button.classList.add('core-text-viewer-button');
        button.setAttribute('aria-label', label);
        button.setAttribute('fill', 'clear');

        const iconName = 'book-open-reader';
        const src = CoreIcons.getIconSrc('font-awesome', 'solid', iconName);
        // Add an ion-icon item to apply the right styles, but the ion-icon component won't be executed.
        button.innerHTML = `<ion-icon name="fas-${iconName}" aria-hidden="true" src="${src}"></ion-icon>`;
        toolbar.appendChild(button);

        button.addEventListener('click', (e: Event) => {
            if (!this.element.innerHTML) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            this.toggleFocusMode();
        });
    }

    /**
     * Enable the focus mode.
     *
     * @param enable Whether to enable or disable the focus mode. If not set, it will toggle the current state.
     */
    protected async toggleFocusMode(enable?: boolean): Promise<void> {
        if (!this.embedded) {
            CoreViewer.viewText('', this.element.innerHTML, {
                focusMode: true,
            });

            return;
        }

        if (enable === this.enabled) {
            return;
        }

        enable = enable ?? !this.enabled;
        this.enabled = enable;
        if (enable) {
            this.contentEl?.classList.add('core-focus-mode-content');

            this.disabledStyles = Array.from(this.element.querySelectorAll('style:not(disabled)'));

            // Disable all styles in element.
            this.disabledStyles.forEach((style) => {
                style.disabled = true;
            });
            // Rename style attributes on DOM elements.
            this.element.querySelectorAll('*').forEach((element) => {
                if (element.hasAttribute('style')) {
                    element.setAttribute('data-original-style', element.getAttribute('style') || '');
                    element.removeAttribute('style');
                }
            });

            // Navigate to parent hidding all other elements.
            let currentChild = this.element;
            let parent = currentChild.parentElement;
            while (parent && parent.tagName.toLowerCase() !== 'ion-content') {
                Array.from(parent.children).forEach((child: HTMLElement) => {
                    if (child !== currentChild && child.tagName.toLowerCase() !== 'swiper-slide') {
                        this.hiddenElements.push(child);
                        child.classList.add('hide-on-focus-mode');
                    }
                });

                currentChild = parent;
                parent = currentChild.parentElement;
            }

            const { CoreTextViewerModalComponent } =
                await import('@features/viewer/components/text-modal/text-modal');

            await CoreModals.openModal({
                component: CoreTextViewerModalComponent,
                initialBreakpoint: 0.25,
                breakpoints: [0, 0.1, 0.25],
                backdropDismiss: false,
                backdropBreakpoint: 0.25,
                componentProps: {
                    content: this.element,
                    include: this.contentEl?.querySelector('core-navigation-bar'),
                },
            });
            this.toggleFocusMode(false);
        } else {
            this.contentEl?.classList.remove('core-focus-mode-content');

            // Enable all styles in element.
            this.disabledStyles.forEach((style) => {
                style.disabled = false;
            });

            // Rename style attributes on DOM elements.
            this.element.querySelectorAll('*').forEach((element) => {
                if (element.hasAttribute('data-original-style')) {
                    element.setAttribute('style', element.getAttribute('data-original-style') || '');
                    element.removeAttribute('data-original-style');
                }
            });

            this.hiddenElements.forEach((element) => {
                element.classList.remove('hide-on-focus-mode');
            });
        }

    }

    /**
     * @inheritdoc
     */
    ngOnDestroy(): void {
        this.toggleFocusMode(false);
        this.viewportPromise?.cancel();
    }

}
