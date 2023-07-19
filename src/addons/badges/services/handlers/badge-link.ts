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

import { CoreContentLinksHandlerBase } from '@features/contentlinks/classes/base-handler';
import { CoreContentLinksAction } from '@features/contentlinks/services/contentlinks-delegate';
import { CoreNavigator } from '@services/navigator';
import { makeSingleton } from '@singletons';
import { AddonBadges } from '../badges';

/**
 * Handler to treat links to user participants page.
 */
@Injectable({ providedIn: 'root' })
export class AddonBadgesBadgeLinkHandlerService extends CoreContentLinksHandlerBase {

    name = 'AddonBadgesBadgeLinkHandler';
    pattern = /\/badges\/badge\.php.*([?&]hash=)|\/badges\/badgeclass\.php.*([?&]id=)/;

    /**
     * @inheritdoc
     */
    async getActions(siteIds: string[], url: string, params: Record<string, string>): Promise<CoreContentLinksAction[]> {

        let path = '';
        if (params.hash) {
            path = `/badges/${params.hash}`;
        } else if (params.id) {
            const badgeId = Number(params.id);
            const badges = await AddonBadges.getUserBadges();
            const badge = badges.find((badge) => badgeId == badge.id);
            if (badge) {
                path = `/badges/${badge.uniquehash}`;
            }
        }

        if (!path) {
            return [];
        }

        return [{
            action: (siteId: string): void => {
                CoreNavigator.navigateToSitePath(path, { siteId });
            },
        }];
    }

    /**
     * @inheritdoc
     */
    isEnabled(siteId: string): Promise<boolean> {
        return AddonBadges.isPluginEnabled(siteId);
    }

}

export const AddonBadgesBadgeLinkHandler = makeSingleton(AddonBadgesBadgeLinkHandlerService);
