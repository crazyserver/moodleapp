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

import { CoreConstants } from '@/core/constants';
import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/angular';
import { Translate, ToastController, makeSingleton } from '@singletons';
import { fixOverlayAriaHidden } from '@/core/utils/fix-aria-hidden';

/**
 * Handles application toasts.
 */
@Injectable({ providedIn: 'root' })
export class CoreToastsService {

    /**
     * Displays an autodimissable toast modal window.
     *
     * @param text The text of the toast.
     * @param needsTranslate Whether the 'text' needs to be translated.
     * @param duration Duration in ms of the dimissable toast.
     * @param cssClass Class to add to the toast.
     * @returns Toast instance.
     */
    async show(
        text: string,
        needsTranslate?: boolean,
        duration: ToastDuration | number = ToastDuration.SHORT,
        cssClass: string = '',
    ): Promise<HTMLIonToastElement> {
        if (needsTranslate) {
            text = Translate.instant(text);
        }

        return this.showWithOptions({
            message: text,
            duration: duration,
            position: 'bottom',
            cssClass: cssClass,
        });
    }

    /**
     * Show toast with some options.
     *
     * @param options Options.
     * @returns Promise resolved with Toast instance.
     */
    async showWithOptions(options: ShowToastOptions): Promise<HTMLIonToastElement> {
        // Convert some values and set default values.
        const toastOptions: ToastOptions = {
            ...options,
            duration: CoreConstants.CONFIG.toastDurations[options.duration] ?? options.duration ?? 2000,
            position: options.position ?? 'bottom',
        };

        const loader = await ToastController.create(toastOptions);

        await loader.present();

        fixOverlayAriaHidden(loader);

        return loader;
    }

}

export const CoreToasts = makeSingleton(CoreToastsService);

/**
 * Toast duration.
 */
export enum ToastDuration {
    LONG = 'long',
    SHORT = 'short',
    STICKY = 'sticky',
}

/**
 * Options for showToastWithOptions.
 */
export type ShowToastOptions = Omit<ToastOptions, 'duration'> & {
    duration: ToastDuration | number;
};
