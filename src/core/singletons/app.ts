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

import { CorePromisedValue } from '@classes/promised-value';
import { MAIN_MENU_VISIBILITY_UPDATED_EVENT } from '@features/mainmenu/constants';
import { CorePlatform } from '@services/platform';
import { CoreEventObserver, CoreEvents } from '@singletons/events';
import { Subscription } from 'rxjs';
import { CoreColors } from './colors';
import { CoreLogger } from './logger';
import { StatusBar } from '@singletons';

/**
 * Singleton with helper functions to manage app functionality.
 */
export class CoreApp {

    protected static logger: CoreLogger = CoreLogger.getInstance('CoreApp');
    protected static mainMenuListener?: CoreEventObserver;

    static initialize(): void {
        if (!CorePlatform.isAndroid()) {
            return;
        }

        CoreEvents.on(MAIN_MENU_VISIBILITY_UPDATED_EVENT, () => this.setAndroidNavigationBarColor());
    }

    /**
     * Get app store URL.
     *
     * @param storesConfig Config params to send the user to the right place.
     * @returns Store URL.
     */
    static getAppStoreUrl(storesConfig: CoreStoreConfig): string | undefined {
        if (CorePlatform.isIOS() && storesConfig.ios) {
            return 'itms-apps://itunes.apple.com/app/' + storesConfig.ios;
        }

        if (CorePlatform.isAndroid() && storesConfig.android) {
            return 'market://details?id=' + storesConfig.android;
        }

        if (CorePlatform.isMobile() && storesConfig.mobile) {
            return storesConfig.mobile;
        }

        return storesConfig.default;
    }

    /**
     * Wait until the application is resumed.
     *
     * @param timeout Maximum time to wait, use null to wait forever.
     */
    static async waitForResume(timeout: number | null = null): Promise<void> {
        let deferred: CorePromisedValue<void> | null = new CorePromisedValue();
        let resumeSubscription: Subscription | null = null;
        let timeoutId: number | null = null;

        const stopWaiting = () => {
            if (!deferred) {
                return;
            }

            deferred.resolve();
            resumeSubscription?.unsubscribe();
            timeoutId && clearTimeout(timeoutId);

            deferred = null;
        };

        resumeSubscription = CorePlatform.resume.subscribe(stopWaiting);
        timeoutId = timeout ? window.setTimeout(stopWaiting, timeout) : null;

        await deferred;
    }

    /**
     * Close the app.
     */
    static closeApp(): void {
        const nav = <any> window.navigator; // eslint-disable-line @typescript-eslint/no-explicit-any
        nav.app?.exitApp();
    }

    /**
     * Set System UI Colors.
     */
    static setSystemUIColors(): void {
        this.setStatusBarColor();
        this.setAndroidNavigationBarColor();
    }

    /**
     * Set StatusBar color depending on platform.
     *
     * @param color RGB color to use as status bar background. If not set the css variable will be read.
     */
    static setStatusBarColor(color?: string): void {
        if (!CorePlatform.isMobile()) {
            return;
        }

        if (!color) {
            // Get the default color to change it.
            color = CoreColors.getToolbarBackgroundColor();
        }

        this.logger.debug(`Set status bar color ${color}`);

        StatusBar.backgroundColorByHexString(color);
    }

    /**
     * Set NavigationBar color for Android
     *
     * @param color RGB color to use as background. If not set the css variable will be read.
     */
    static setAndroidNavigationBarColor(color?: string): void {
        if (!CorePlatform.isAndroid()) {
            return;
        }

        if (!color) {
            // Get the default color to change it.
            color = CoreColors.getBottomPageBackgroundColor();
        }

        this.logger.debug(`Set navigation bar color ${color}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (<any> window).StatusBar.navigationBackgroundColorByHexString(color);
    }

}

/**
 * Store config data.
 */
export type CoreStoreConfig = {
    /**
     * ID of the Apple store where the mobile iOS app is uploaded.
     */
    ios?: string;

    /**
     * ID of the Google play store where the android app is uploaded.
     */
    android?: string;

    /**
     * Fallback URL when the mobile options is not set.
     */
    mobile?: string;

    /**
     * Fallback URL when the other fallbacks options are not set.
     */
    default?: string;
};
