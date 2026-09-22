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
import { CoreSitePublicConfigResponse, CoreUnauthenticatedSite } from '@classes/sites/unauthenticated-site';

import { CoreContentLinksHandlerBase } from '@features/contentlinks/classes/base-handler';
import { CoreContentLinksAction } from '@features/contentlinks/services/contentlinks-delegate';
import { EMAIL_SIGNUP_FEATURE_NAME } from '@features/login/constants';
import { CoreNavigator } from '@services/navigator';
import { CoreSites } from '@services/sites';
import { CoreSitesFactory } from '@services/sites-factory';
import { makeSingleton } from '@singletons';

/**
 * Handler to treat links to the signup page.
 */
@Injectable({ providedIn: 'root' })
export class CoreLoginSignupLinkHandlerService extends CoreContentLinksHandlerBase {

    name = 'CoreLoginSignupLinkHandler';
    pattern = /\/login\/signup\.php/;
    featureName = EMAIL_SIGNUP_FEATURE_NAME;
    unauthenticated = true;

    protected site?: CoreUnauthenticatedSite;
    protected siteConfig?: CoreSitePublicConfigResponse;

    /**
     * Check the site referenced by a signup URL.
     *
     * @param url Signup URL.
     * @returns Site response.
     */
    async getSite(url: string): Promise<CoreUnauthenticatedSite> {
        const a = this.getSiteUrl(url);
        console.error(url, a);

        const siteUrl = this.getSiteUrl(url) || url;
        // If the site is configured with http:// protocol we force that one, otherwise we use default mode.
        const protocol = siteUrl.startsWith('http://') ? 'http://' : undefined;

        const siteCheck = await CoreSites.checkSite(siteUrl, protocol, 'Signup link');

        this.siteConfig = siteCheck.config;

        this.site = CoreSitesFactory.makeUnauthenticatedSite(siteCheck.siteUrl, this.siteConfig);

        console.error(this.site, this.siteConfig);

        return this.site;
    }

    /**
     * @inheritdoc
     */
    getActions(siteIds: string[], url: string): CoreContentLinksAction[] {
        console.error(siteIds, url);

        return [{
            action: async (): Promise<void> => {
                const site = await this.getSite(url);
                console.error(site);

                await CoreNavigator.navigate('/login/emailsignup', { params: { siteUrl: site.getURL() } });
            },
        }];
    }

    /**
     * @inheritdoc
     */
    async isEnabled(siteId: string, url: string): Promise<boolean> {
        const site2 = await CoreSites.getSite(siteId);
        console.error(siteId, url, site2);

        const site = await this.getSite(url);

        return this.siteConfig?.registerauth === 'email' && !site.isFeatureDisabled(EMAIL_SIGNUP_FEATURE_NAME);
    }

}

export const CoreLoginSignupLinkHandler = makeSingleton(CoreLoginSignupLinkHandlerService);
