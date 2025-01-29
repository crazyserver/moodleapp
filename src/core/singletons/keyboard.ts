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

import { effect, Signal, signal } from '@angular/core';
import { CorePlatform } from '@services/platform';
import { Keyboard } from '@singletons';
import { CoreEvents } from '@singletons/events';

/**
 * Singleton with helper functions for keybard management.
 */
export class CoreKeyboard {

    protected static isKeyboardShown = signal(false);
    protected static keyboardOpening = signal(false);
    protected static keyboardClosing = signal(false);
    protected static keyboardHeight = signal(0);

    // Avoid creating singleton instances.
    private constructor() {
        effect(() => {
            document.body.classList.toggle('keyboard-is-open', CoreKeyboard.isKeyboardShown());
        });
    }

    /**
     * Closes the keyboard.
     */
    static close(): void {
        if (CorePlatform.isMobile()) {
            Keyboard.hide();
        }
    }

    /**
     * Open the keyboard.
     */
    static open(): void {
        // Open keyboard is not supported in desktop and in iOS.
        if (CorePlatform.isAndroid()) {
            Keyboard.show();
        }
    }

    static getKeyboardShownSignal(): Signal<boolean> {
        return CoreKeyboard.isKeyboardShown.asReadonly();
    }

    static getKeyboardHeightSignal(): Signal<number> {
        return CoreKeyboard.keyboardHeight.asReadonly();
    }

    /**
     * Notify that Keyboard has been shown.
     *
     * @param keyboardHeight Keyboard height.
     */
    static onKeyboardShow(keyboardHeight: number): void {
        // Error on iOS calculating size.
        // More info: https://github.com/ionic-team/ionic-plugin-keyboard/issues/276
        CoreKeyboard.setKeyboardShown(true, keyboardHeight);
    }

    /**
     * Notify that Keyboard has been hidden.
     */
    static onKeyboardHide(): void {
        CoreKeyboard.setKeyboardShown(false, 0);
    }

    /**
     * Notify that Keyboard is about to be shown.
     *
     * @param keyboardHeight Keyboard height.
     */
    static onKeyboardWillShow(keyboardHeight?: number): void {
        CoreKeyboard.keyboardOpening.set(true);
        CoreKeyboard.keyboardClosing.set(false);

        if (keyboardHeight !== undefined) {
            this.keyboardHeight.set(keyboardHeight);
        }
    }

    /**
     * Notify that Keyboard is about to be hidden.
     */
    static onKeyboardWillHide(): void {
        CoreKeyboard.keyboardOpening.set(false);
        CoreKeyboard.keyboardClosing.set(true);

        this.keyboardHeight.set(0);
    }

    /**
     * Set keyboard shown or hidden.
     *
     * @param shown Whether the keyboard is shown or hidden.
     * @param keyboardHeight Keyboard height.
     */
    protected static setKeyboardShown(shown: boolean, keyboardHeight: number): void {
        CoreKeyboard.isKeyboardShown.set(shown);
        CoreKeyboard.keyboardOpening.set(false);
        CoreKeyboard.keyboardClosing.set(false);
        this.keyboardHeight.set(keyboardHeight);

        // eslint-disable-next-line deprecation/deprecation
        CoreEvents.trigger(CoreEvents.KEYBOARD_CHANGE, keyboardHeight);
    }

    /**
     * Check if the keyboard is closing.
     *
     * @returns Whether keyboard is closing (animating).
     */
    static isKeyboardClosing(): boolean {
        return CoreKeyboard.keyboardClosing();
    }

    /**
     * Check if the keyboard is being opened.
     *
     * @returns Whether keyboard is opening (animating).
     */
    static isKeyboardOpening(): boolean {
        return CoreKeyboard.keyboardOpening();
    }

    /**
     * Check if the keyboard is visible.
     *
     * @returns Whether keyboard is visible.
     */
    static isKeyboardVisible(): boolean {
        return CoreKeyboard.isKeyboardShown();
    }

}
