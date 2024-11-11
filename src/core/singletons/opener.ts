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

import { InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser';
import { CoreErrorWithOptions } from '@classes/errors/errorwithoptions';
import { CoreAnalytics, CoreAnalyticsEventType } from '@services/analytics';
import { CoreFilepool } from '@services/filepool';
import { CoreLang, CoreLangFormat } from '@services/lang';
import { CorePlatform } from '@services/platform';
import { CoreSites } from '@services/sites';
import { CoreMimetypeUtils } from '@services/utils/mimetype';
import { Translate, FileOpener, WebIntent } from '@singletons';
import { CoreConstants } from '../constants';
import { CoreFile } from '@services/file';
import { CoreInAppBrowser, CoreInAppBrowserOpenOptions } from './iab';
import { CorePromiseUtils } from './promise-utils';
import { CoreUrl } from './url';
import { CoreLogger } from './logger';
import { CoreConfig } from '@services/config';
import { CoreDomUtils } from '@services/utils/dom';

/**
 * Singleton with helper functions to handler open files and urls.
 */
export class CoreOpener {

    protected static logger = CoreLogger.getInstance('CoreOpener');

    // Avoid creating singleton instances.
    private constructor() {
        // Nothing to do.
    }

    /**
     * Show a confirm before opening a link in browser, unless the user previously marked to not show again.
     *
     * @param url URL to open.
     */
    protected static async confirmOpenBrowserIfNeeded(url: string): Promise<void> {
        if (!CoreUrl.isHttpURL(url)) {
            // Only ask confirm for http(s), other cases usually launch external apps.
            return;
        }

        // Check if the user decided not to see the warning.
        const dontShowWarning = await CoreConfig.get(CoreConstants.SETTINGS_DONT_SHOW_EXTERNAL_LINK_WARN, 0);
        if (dontShowWarning) {
            return;
        }

        // Remove common sensitive information from the URL.
        url = url
            .replace(/token=[^&#]+/gi, 'token=secret')
            .replace(/tokenpluginfile\.php\/[^/]+/gi, 'tokenpluginfile.php/secret');

        const dontShowAgain = await CoreDomUtils.showPrompt(
            Translate.instant('core.warnopeninbrowser', { url }),
            undefined,
            Translate.instant('core.dontshowagain'),
            'checkbox',
        );

        if (dontShowAgain) {
            CoreConfig.set(CoreConstants.SETTINGS_DONT_SHOW_EXTERNAL_LINK_WARN, 1);
        }
    }

    /**
     * Open a file using platform specific method.
     *
     * @param path The local path of the file to be open.
     * @param options Options.
     * @returns Promise resolved when done.
     */
    static async openFile(path: string, options: CoreOpenerOpenFileOptions = {}): Promise<void> {
        // Convert the path to a native path if needed.
        path = CoreFile.unconvertFileSrc(path);

        const extension = CoreMimetypeUtils.getFileExtension(path);
        const mimetype = extension && CoreMimetypeUtils.getMimeType(extension);

        if (mimetype == 'text/html' && CorePlatform.isAndroid()) {
            // Open HTML local files in InAppBrowser, in system browser some embedded files aren't loaded.
            CoreInAppBrowser.open(path);

            return;
        } else if (extension === 'apk' && CorePlatform.isAndroid()) {
            const url = await CorePromiseUtils.ignoreErrors(
                CoreFilepool.getFileUrlByPath(CoreSites.getCurrentSiteId(), CoreFile.removeBasePath(path)),
            );

            // @todo MOBILE-4167: Handle urls with expired tokens.

            throw new CoreErrorWithOptions(
                Translate.instant('core.cannotinstallapkinfo'),
                Translate.instant('core.cannotinstallapk'),
                url
                    ? [
                        {
                            text: Translate.instant('core.openinbrowser'),
                            handler: () => this.openInBrowser(url),
                        },
                        {
                            text: Translate.instant('core.cancel'),
                            role: 'cancel',
                        },
                    ]
                    : undefined,
            );
        }

        // Path needs to be decoded, the file won't be opened if the path has %20 instead of spaces and so.
        try {
            path = decodeURIComponent(path);
        } catch {
            // Error, use the original path.
        }

        const openFile = async (mimetype?: string) => {
            if (this.shouldOpenWithDialog(options)) {
                await FileOpener.showOpenWithDialog(path, mimetype || '');
            } else {
                await FileOpener.open(path, mimetype || '');
            }
        };

        try {
            try {
                await openFile(mimetype);
            } catch (error) {
                if (!extension || !error || Number(error.status) !== 9) {
                    throw error;
                }

                // Cannot open mimetype. Check if there is a deprecated mimetype for the extension.
                const deprecatedMimetype = CoreMimetypeUtils.getDeprecatedMimeType(extension);
                if (!deprecatedMimetype || deprecatedMimetype === mimetype) {
                    throw error;
                }

                await openFile(deprecatedMimetype);
            }
        } catch (error) {
            this.logger.error('Error opening file ' + path + ' with mimetype ' + mimetype);
            this.logger.error('Error: ', JSON.stringify(error));

            if (!extension || extension.indexOf('/') > -1 || extension.indexOf('\\') > -1) {
                // Extension not found.
                throw new Error(Translate.instant('core.erroropenfilenoextension'));
            }

            throw new Error(Translate.instant('core.erroropenfilenoapp'));
        }
    }

    /**
     * Open a URL using InAppBrowser.
     * Do not use for files, refer to {@link CoreOpener.openFile}.
     *
     * @param url The URL to open.
     * @param options Override default options passed to InAppBrowser.
     * @returns The opened window.
     */
    static openInApp(url: string, options?: CoreInAppBrowserOpenOptions): InAppBrowserObject {
        return CoreInAppBrowser.open(url, options);
    }

    /**
     * Open a URL using a browser.
     * Do not use for files, refer to {@link CoreOpener.openFile}.
     *
     * @param url The URL to open.
     * @param options Options.
     */
    static async openInBrowser(url: string, options: CoreOpenerOpenInBrowserOptions = {}): Promise<void> {
        // eslint-disable-next-line deprecation/deprecation
        const originaUrl = CoreUrl.unfixPluginfileURL(options.originalUrl ?? options.browserWarningUrl ?? url);
        if (options.showBrowserWarning || options.showBrowserWarning === undefined) {
            try {
                await this.confirmOpenBrowserIfNeeded(originaUrl);
            } catch {
                // Cancelled, stop.
                return;
            }
        }

        const site = CoreSites.getCurrentSite();
        CoreAnalytics.logEvent({ type: CoreAnalyticsEventType.OPEN_LINK, link: originaUrl });
        window.open(
            site?.containsUrl(url)
                ? CoreUrl.addParamsToUrl(url, { lang: await CoreLang.getCurrentLanguage(CoreLangFormat.LMS) })
                : url,
            '_system',
        );
    }

    /**
     * Open an online file using platform specific method.
     * Specially useful for audio and video since they can be streamed.
     *
     * @param url The URL of the file.
     * @returns Promise resolved when opened.
     */
    static async openOnlineFile(url: string): Promise<void> {
        if (CorePlatform.isAndroid()) {
            // In Android we need the mimetype to open it.
            const mimetype = await CorePromiseUtils.ignoreErrors(CoreMimetypeUtils.getMimeTypeFromUrl(url));

            if (!mimetype) {
                // Couldn't retrieve mimetype. Return error.
                throw new Error(Translate.instant('core.erroropenfilenoextension'));
            }

            const options = {
                action: WebIntent.ACTION_VIEW,
                url,
                type: mimetype,
            };

            try {
                await WebIntent.startActivity(options);

                CoreAnalytics.logEvent({
                    type: CoreAnalyticsEventType.OPEN_LINK,
                    link: CoreUrl.unfixPluginfileURL(url),
                });

                return;
            } catch (error) {
                this.logger.error('Error opening online file ' + url + ' with mimetype ' + mimetype);
                this.logger.error('Error: ', JSON.stringify(error));

                throw new Error(Translate.instant('core.erroropenfilenoapp'));
            }
        }

        // In the rest of platforms we need to open them in InAppBrowser.
        CoreInAppBrowser.open(url);
    }

    /**
     * Given some options, check if a file should be opened with showOpenWithDialog.
     *
     * @param options Options.
     * @returns Boolean.
     */
    static shouldOpenWithDialog(options: CoreOpenerOpenFileOptions = {}): boolean {
        const openFileAction = options.iOSOpenFileAction ?? CoreConstants.CONFIG.iOSDefaultOpenFileAction;

        return CorePlatform.isIOS() && openFileAction == OpenFileAction.OPEN_WITH;
    }

}

/**
 * Options for opening a file.
 */
export type CoreOpenerOpenFileOptions = {
    iOSOpenFileAction?: OpenFileAction; // Action to do when opening a file.
};

/**
 * Options for opening in browser.
 */
export type CoreOpenerOpenInBrowserOptions = {
    showBrowserWarning?: boolean; // Whether to display a warning before opening in browser. Defaults to true.
    originalUrl?: string; // Original URL to open (in case the URL was treated, e.g. to add a token or an auto-login).
    /**
     * @deprecated since 4.3. Use originalUrl instead.
     */
    browserWarningUrl?: string;
};

/**
 * Possible default picker actions.
 */
export enum OpenFileAction {
    OPEN = 'open',
    OPEN_WITH = 'open-with',
}
