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

import { CoreCronHandler } from '@services/cron';
import { makeSingleton } from '@singletons';
import { CoreCronBaseHandler } from '@services/handlers/default-cron-handler';
import { type CorePushNotificationsProvider } from '../pushnotifications';

/**
 * Cron handler to retry pending unregisters.
 */
@Injectable({ providedIn: 'root' })
export class CorePushNotificationsUnregisterCronHandlerService
    extends CoreCronBaseHandler<CorePushNotificationsProvider>
    implements CoreCronHandler {

    name = 'CorePushNotificationsUnregisterCronHandler';

    /**
     * @inheritdoc
     */
    async execute(siteId?: string): Promise<void> {
        if (this.cronComponent !== undefined) {
            return;
        }

        const { CorePushNotifications } = await import('../pushnotifications');
        this.cronComponent = CorePushNotifications;

        await this.cronComponent?.retryUnregisters(siteId);
    }

}

export const CorePushNotificationsUnregisterCronHandler = makeSingleton(CorePushNotificationsUnregisterCronHandlerService);
