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

import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorePageTitle } from '@services/page-title';

/**
 * Directive to use a heading's visible text as the current page title.
 */
@Directive({
    selector: '[core-page-title]',
})
export class CorePageTitleDirective implements AfterViewInit, OnDestroy {

    protected element: HTMLHeadingElement = inject(ElementRef).nativeElement;
    protected route = inject(ActivatedRoute);
    protected mutationObserver?: MutationObserver;
    protected title = '';

    /**
     * @inheritdoc
     */
    ngAfterViewInit(): void {
        this.updateTitle();

        this.mutationObserver = new MutationObserver(() => this.updateTitle());
        this.mutationObserver.observe(this.element, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    }

    /**
     * @inheritdoc
     */
    ngOnDestroy(): void {
        this.mutationObserver?.disconnect();
        CorePageTitle.clearTitle(this.route);
    }

    /**
     * Publish the current heading text as document title.
     */
    protected updateTitle(): void {
        const title = this.element.textContent?.trim() ?? '';

        if (title === this.title) {
            return;
        }

        this.title = title;

        CorePageTitle.setTitle(this.route, title);
    }

}
