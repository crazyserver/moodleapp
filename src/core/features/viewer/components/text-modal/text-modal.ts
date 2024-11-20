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

import { CoreSharedModule } from '@/core/shared.module';
import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';

import { ModalController } from '@singletons';
import { CoreMath } from '@singletons/math';

/**
 * Component to display a text modal.
 */
@Component({
    selector: 'core-text-viewer-modal',
    templateUrl: 'text-modal.html',
    styleUrl: 'text-modal.scss',
    standalone: true,
    imports: [
        CoreSharedModule,
    ],
})
export class CoreTextViewerModalComponent implements AfterViewInit {

    @Input() content?: HTMLElement; // The content to display.
    @Input() include?: HTMLElement;

    private static readonly MAX_ZOOM = 300;
    private static readonly MIN_ZOOM = 80;

    zoom = 100; // Zoom level.

    constructor(
        protected element: ElementRef,
    ) {
    }

    ngAfterViewInit(): void {
        // Get the bottom position of the include element
        const bounding = this.include?.getBoundingClientRect();
        if (bounding) {
            const bottom = bounding.bottom - bounding.top;
            this.element?.nativeElement.style.setProperty('bottom', bottom + 'px');
        }
    }

    /**
     * Close modal.
     */
    closeModal(): void {
        ModalController.dismiss();
    }

    /**
     * Zoom In or Out.
     *
     * @param zoomIn True to zoom in, false to zoom out.
     */
    changeZoom(zoomIn: number): void {
        this.zoom = CoreMath.clamp(zoomIn, CoreTextViewerModalComponent.MIN_ZOOM, CoreTextViewerModalComponent.MAX_ZOOM);
        this.content?.style.setProperty('zoom', this.zoom + '%');
    }

}
