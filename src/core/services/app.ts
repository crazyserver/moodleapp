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

import { Injectable } from '@angular/core';

import { makeSingleton } from '@singletons';
import { CoreRedirectPayload } from './navigator';
import { CorePlatform } from '@services/platform';
import { CoreKeyboard } from '@singletons/keyboard';
import { CoreNetwork } from './network';
import { CoreAppDB, CoreAppSchema } from './app-db';
import { SQLiteDB } from '@classes/sqlitedb';
import { CoreSSO } from '@singletons/sso';
import { CoreStoreConfig, CoreApp as NewCoreApp } from '@singletons/app';
import { CoreRedirectData, CoreRedirects } from '@singletons/redirects';

/**
 * Factory to provide some global functionalities.
 *
 * @deprecated since 5.0. Check the functions deprecation message.
 */
@Injectable({ providedIn: 'root' })
export class CoreAppProvider {

    /**
     * Returns whether the user agent is controlled by automation. I.e. Behat testing.
     *
     * @returns True if the user agent is controlled by automation, false otherwise.
     * @deprecated since 4.4. Use CorePlatform.isAutomated() instead.
     */
    static isAutomated(): boolean {
        return CorePlatform.isAutomated();
    }

    /**
     * Returns the forced timezone to use. Timezone is forced for automated tests.
     *
     * @returns Timezone. Undefined to use the user's timezone.
     * @deprecated since 5.0. Use CoreTime.getForcedTimezone() instead.
     */
    static getForcedTimezone(): string | undefined {
        // Use the same timezone forced for LMS in tests.
        return CorePlatform.isAutomated() ? 'Australia/Perth' : undefined;
    }

    /**
     * Check if the browser supports mediaDevices.getUserMedia.
     *
     * @returns Whether the function is supported.
     * @deprecated since 5.0. Use CoreMedia.canGetUserMedia() instead.
     */
    canGetUserMedia(): boolean {
        return !!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * Check if the browser supports MediaRecorder.
     *
     * @returns Whether the function is supported.
     * @deprecated since 5.0. Use CoreMedia.canRecordMedia() instead.
     */
    canRecordMedia(): boolean {
        return !!window.MediaRecorder;
    }

    /**
     * Closes the keyboard.
     *
     * @deprecated sinde 4.5.0. Use CoreKeyboard.closeKeyboard instead.
     */
    closeKeyboard(): void {
        CoreKeyboard.close();
    }

    /**
     * Get app store URL.
     *
     * @param storesConfig Config params to send the user to the right place.
     * @returns Store URL.
     *
     * @deprecated since 5.0. Use CoreApp.getAppStoreUrl in singletons folder instead.
     */
    getAppStoreUrl(storesConfig: CoreStoreConfig): string | undefined {
        return NewCoreApp.getAppStoreUrl(storesConfig);
    }

    /**
     * Check if the keyboard is closing.
     *
     * @returns Whether keyboard is closing (animating).
     * @deprecated since 4.5.0. Use CoreKeyboard.isKeyboardClosing instead.
     */
    isKeyboardClosing(): boolean {
        return CoreKeyboard.isKeyboardClosing();
    }

    /**
     * Check if the keyboard is being opened.
     *
     * @returns Whether keyboard is opening (animating).
     * @deprecated since 4.5.0. Use CoreKeyboard.isKeyboardOpening instead.
     */
    isKeyboardOpening(): boolean {
        return CoreKeyboard.isKeyboardOpening();
    }

    /**
     * Check if the keyboard is visible.
     *
     * @returns Whether keyboard is visible.
     * @deprecated since 4.5.0. Use CoreKeyboard.isKeyboardVisible instead.
     */
    isKeyboardVisible(): boolean {
        return CoreKeyboard.isKeyboardVisible();
    }

    /**
     * Checks if the current window is wider than a mobile.
     *
     * @returns Whether the app the current window is wider than a mobile.
     *
     * @deprecated since 5.0. Use CorePlatform.isWide() instead.
     */
    isWide(): boolean {
        return CorePlatform.isWide();
    }

    /**
     * Returns whether we are online.
     *
     * @returns Whether the app is online.
     * @deprecated since 4.1. Use CoreNetwork instead.
     * Keeping this a bit more to avoid plugins breaking.
     */
    isOnline(): boolean {
        return CoreNetwork.isOnline();
    }

    /**
     * Open the keyboard.
     *
     * @deprecated since 4.5.0. Use CoreKeyboard.openKeyboard instead.
     */
    openKeyboard(): void {
        CoreKeyboard.open();
    }

    /**
     * Notify that Keyboard has been shown.
     *
     * @param keyboardHeight Keyboard height.
     * @deprecated since 4.5.0. Use CoreKeyboard.onKeyboardShow instead.
     */
    onKeyboardShow(keyboardHeight: number): void {
        CoreKeyboard.onKeyboardShow(keyboardHeight);
    }

    /**
     * Notify that Keyboard has been hidden.
     *
     * @deprecated since 4.5.0. Use CoreKeyboard.onKeyboardHide instead.
     */
    onKeyboardHide(): void {
        CoreKeyboard.onKeyboardHide();
    }

    /**
     * Notify that Keyboard is about to be shown.
     *
     * @deprecated since 4.5.0. Use CoreKeyboard.onKeyboardWillShow instead.
     */
    onKeyboardWillShow(): void {
        CoreKeyboard.onKeyboardWillShow();
    }

    /**
     * Notify that Keyboard is about to be hidden.
     *
     * @deprecated since 4.5.0. Use CoreKeyboard.onKeyboardWillHide instead.
     */
    onKeyboardWillHide(): void {
        CoreKeyboard.onKeyboardWillHide();
    }

    /**
     * Start an SSO authentication process.
     * Please notice that this function should be called when the app receives the new token from the browser,
     * NOT when the browser is opened.
     *
     * @deprecated since 5.0. Use CoreSSO.startSSOAuthentication instead.
     */
    startSSOAuthentication(): void {
        CoreSSO.startSSOAuthentication();
    }

    /**
     * Finish an SSO authentication process.
     *
     * @deprecated since 5.0. Use CoreSSO.finishSSOAuthentication instead.
     */
    finishSSOAuthentication(): void {
        CoreSSO.finishSSOAuthentication();
    }

    /**
     * Check if there's an ongoing SSO authentication process.
     *
     * @returns Whether there's a SSO authentication ongoing.
     * @deprecated since 5.0. Use CoreSSO.isSSOAuthenticationOngoing instead.
     */
    isSSOAuthenticationOngoing(): boolean {
        return CoreSSO.isSSOAuthenticationOngoing();
    }

    /**
     * Returns a promise that will be resolved once SSO authentication finishes.
     *
     * @returns Promise resolved once SSO authentication finishes.
     * @deprecated since 5.0. Use CoreSSO.waitForSSOAuthentication instead.
     */
    async waitForSSOAuthentication(): Promise<void> {
        return CoreSSO.waitForSSOAuthentication();
    }

    /**
     * Wait until the application is resumed.
     *
     * @param timeout Maximum time to wait, use null to wait forever.
     *
     * @deprecated since 5.0. Use CoreApp.waitForResume from singletons folder instead.
     */
    async waitForResume(timeout: number | null = null): Promise<void> {
        await NewCoreApp.waitForResume(timeout);
    }

    /**
     * Read redirect data from local storage and clear it if it existed.
     *
     * @deprecated since 5.0. Use CoreRedirects.consumeStorageRedirect instead.
     */
    consumeStorageRedirect(): void {
        CoreRedirects.consumeStorageRedirect();
    }

    /**
     * Retrieve and forget redirect data.
     *
     * @returns Redirect data if any.
     * @deprecated since 5.0. Use CoreRedirects.consumeMemoryRedirect instead.
     */
    consumeMemoryRedirect(): CoreRedirectData | null {
        return CoreRedirects.consumeMemoryRedirect();
    }

    /**
     * Close the app.
     *
     * @deprecated since 5.0. Use CoreApp.closeApp from singletons folder instead.
     */
    closeApp(): void {
        NewCoreApp.closeApp();
    }

    /**
     * Forget redirect data.
     *
     * @deprecated since 5.0. Use CoreRedirects.forgetRedirect instead.
     */
    forgetRedirect(): void {
        CoreRedirects.forgetRedirect();
    }

    /**
     * Retrieve redirect data.
     *
     * @returns Redirect data if any.
     * @deprecated since 5.0. Use CoreRedirects.getRedirect instead.
     */
    getRedirect(): CoreRedirectData | null {
        return CoreRedirects.getRedirect();
    }

    /**
     * Store redirect params.
     *
     * @param siteId Site ID.
     * @param redirectData Redirect data.
     *
     * @deprecated since 5.0. Use CoreRedirects.storeRedirect instead.
     */
    storeRedirect(siteId: string, redirectData: CoreRedirectPayload = {}): void {
        CoreRedirects.storeRedirect(siteId, redirectData);
    }

    /**
     * Set System UI Colors.
     *
     * @deprecated since 5.0. Use CoreApp.setSystemUIColors from singletons folder instead.
     */
    setSystemUIColors(): void {
        NewCoreApp.setSystemUIColors();
    }

    /**
     * Set StatusBar color depending on platform.
     *
     * @param color RGB color to use as status bar background. If not set the css variable will be read.
     *
     * @deprecated since 5.0. Use CoreApp.setStatusBarColor from singletons folder instead.
     */
    setStatusBarColor(color?: string): void {
        NewCoreApp.setStatusBarColor(color);
    }

    /**
     * Initialize database.
     *
     * @deprecated since 5.0. Use CoreAppDB.initialize instead.
     */
    async initializeDatabase(): Promise<void> {
        const { CoreAppDB } = await import('./app-db');

        await CoreAppDB.initializeDatabase();
    }

    /**
     * Install and upgrade a certain schema.
     *
     * @param schema The schema to create.
     * @deprecated since 5.0. Use CoreAppDB.createTablesFromSchema instead.
     */
    async createTablesFromSchema(schema: CoreAppSchema): Promise<void> {
        const { CoreAppDB } = await import('./app-db');

        await CoreAppDB.createTablesFromSchema(schema);

    }

    /**
     * Delete table schema.
     *
     * @param name Schema name.
     * @deprecated since 5.0. Use CoreAppDB.deleteTableSchema instead.
     */
    async deleteTableSchema(name: string): Promise<void> {
        const { CoreAppDB } = await import('./app-db');

        await CoreAppDB.deleteTableSchema(name);
    }

    /**
     * Get the application global database.
     *
     * @returns App's DB.
     * @deprecated since 5.0. Use CoreAppDB.getDB instead.
     */
    getDB(): SQLiteDB {
        return CoreAppDB.getDB();
    }

}

/**
 * @deprecated since 5.0. Check the functions deprecation message.
 */
// eslint-disable-next-line deprecation/deprecation
export const CoreApp = makeSingleton(CoreAppProvider);
