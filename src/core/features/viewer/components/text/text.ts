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

import { ContextLevel } from '@/core/constants';
import { CoreSharedModule } from '@/core/shared.module';
import { toBoolean } from '@/core/transforms/boolean';
import { Component, Input, OnInit } from '@angular/core';
import { CoreFileEntry } from '@services/file-helper';

import { CoreText } from '@singletons/text';
import { ModalController } from '@singletons';
import { CoreDom } from '@singletons/dom';
import { CoreMath } from '@singletons/math';

/**
 * Modal component to render a certain text.
 */
@Component({
    selector: 'page-core-viewer-text',
    templateUrl: 'text.html',
    styleUrl: 'text.scss',
    standalone: true,
    imports: [
        CoreSharedModule,
    ],
})
export class CoreViewerTextComponent implements OnInit {

    @Input() title?: string; // Modal title.
    @Input() content?: string; // Modal content.
    @Input() component?: string; // Component to use in format-text.
    @Input() componentId?: string | number; // Component ID to use in format-text.
    @Input() files?: CoreFileEntry[]; // List of files.
    @Input({ transform: toBoolean }) filter?: boolean; // Whether to filter the text.
    @Input() contextLevel?: ContextLevel; // The context level.
    @Input() instanceId?: number; // The instance ID related to the context.
    @Input() courseId?: number; // Course ID the text belongs to. It can be used to improve performance with filters.
    @Input({ transform: toBoolean }) displayCopyButton = false; // Whether to display a button to copy the contents.
    @Input() focusMode = false; // Whether to display zoom controls.

    private static readonly MAX_ZOOM = 300;
    private static readonly MIN_ZOOM = 80;

    zoom = 100; // Zoom level.

    ngOnInit(): void {
        if (this.focusMode) {
            this.content = CoreDom.removeAllStyles(this.content || '');
        }
    }

    /**
     * Close modal.
     */
    closeModal(): void {
        ModalController.dismiss();
    }

    /**
     * Copy the text to clipboard.
     */
    copyText(): void {
        CoreText.copyToClipboard(this.content || '');
    }

    /**
     * Zoom In or Out.
     *
     * @param zoomIn True to zoom in, false to zoom out.
     */
    changeZoom(zoomIn: number): void {
        this.zoom = CoreMath.clamp(zoomIn, CoreViewerTextComponent.MIN_ZOOM, CoreViewerTextComponent.MAX_ZOOM);
    }

}
