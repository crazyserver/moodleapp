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

import { mock, mockSingleton } from '@/testing/utils';
import { CoreSite } from '@classes/sites/site';
import { CoreSites } from '@services/sites';
import { CoreUserDelegate, CoreUserDelegateContext, CoreUserProfileHandlerToDisplay } from '../services/user-delegate';
import { CoreEvents } from '@singletons/events';
import { CoreWait } from '@singletons/wait';
import { AddonBadgesUserHandler } from '@addons/badges/services/handlers/user';
import { AddonBlogUserHandler } from '@addons/blog/services/handlers/user';
import { AddonCompetencyUserHandler } from '@addons/competency/services/handlers/user';
import { AddonPrivateFilesUserHandler } from '@addons/privatefiles/services/handlers/user';
import { CoreDataPrivacyUserHandler } from '@features/dataprivacy/services/handlers/user';
import { CoreGradesUserHandler } from '@features/grades/services/handlers/user';
import { CorePolicyUserHandler } from '@features/policy/services/handlers/user';
import { CoreReportBuilderHandler } from '@features/reportbuilder/services/handlers/reportbuilder';
import { CoreCourses } from '@features/courses/services/courses';
import { AddonCompetency } from '@addons/competency/services/competency';
import { CoreDataPrivacy } from '@features/dataprivacy/services/dataprivacy';
import { CoreConstants } from '@/core/constants';

describe('User delegate handlers', () => {
    const userId = 123;

    const user = {
        firstname: 'John',
        lastname: 'Doe',
        fullname: '',
        id: userId,
    };

    const siteId = '25';

    beforeEach(async () => {
        CoreEvents.trigger(CoreEvents.LOGOUT, { siteId }, siteId);

        CoreUserDelegate.registerHandler(AddonBadgesUserHandler.instance);
        CoreUserDelegate.registerHandler(AddonBlogUserHandler.instance);
        CoreUserDelegate.registerHandler(AddonCompetencyUserHandler.instance);
        CoreUserDelegate.registerHandler(AddonPrivateFilesUserHandler.instance);
        CoreUserDelegate.registerHandler(CoreDataPrivacyUserHandler.instance);
        CoreUserDelegate.registerHandler(CoreGradesUserHandler.instance);
        CoreUserDelegate.registerHandler(CorePolicyUserHandler.instance);
        CoreUserDelegate.registerHandler(CoreReportBuilderHandler.instance);

        // Arrange
        const site = mock(new CoreSite(siteId, 'https://mysite.com', 'token'), {
            getId: () => site.id,
            canUseAdvancedFeature: () => true,
            wsAvailable: () => true,
            getStoredConfig: (key: string) => {
                if (key === 'mygradesurl') {
                    return '/grade/report/overview/';
                }

                return '';
            },
            getConfig: (key: string) => {
                if (key === 'sitepolicyhandler') {
                    return 'tool_policy';
                }

                return '';
            },
            isVersionGreaterEqualThan: () => true,
        });

        mockSingleton(CoreSites, {
            getSite: () => Promise.resolve(site),
            getCurrentSite: () => site,
            getRequiredCurrentSite: () => site,
            getCurrentSiteId: () => site.id,
            getCurrentSiteUserId: () => userId,
        });

        mockSingleton(CoreCourses, {
            getCoursesAdminAndNavOptions: () => Promise.resolve({ admOptions: {}, navOptions: {} }),
        });

        mockSingleton(CoreDataPrivacy, {
            isEnabled: () => Promise.resolve(true),
        });

        mockSingleton(AddonCompetency, {
            getLearningPlans: () => Promise.resolve([{} as any]),
        });
    });

  test('should return all user menu handlers', async () => {

    CoreConstants.CONFIG.disabledFeatures = '';

    CoreEvents.trigger(CoreEvents.LOGIN, { siteId }, siteId);
    // Wait the event to be processed.
    await CoreWait.nextTick();

    const subject = CoreUserDelegate.getProfileHandlersFor(user, CoreUserDelegateContext.USER_MENU);
    let handlers: CoreUserProfileHandlerToDisplay[] = [];

    subject.subscribe((newHandlers) => {
        handlers = newHandlers;
    });
    await CoreUserDelegate.waitForReadyInContext(user.id, CoreUserDelegateContext.USER_MENU);

    const handlersNames = handlers.map((handler) => handler.name).sort();

    expect(handlersNames).toEqual([
        'AddonBadges:fakename',
        'AddonBlog',
        'AddonCompetency:fakename',
        'AddonPrivateFiles',
        'CoreDataPrivacy',
        'CoreGrades:fakename',
        'CorePolicy',
        'CoreReportBuilderDelegate',
    ].sort());

    subject.unsubscribe();

    const currentSite = CoreSites.getRequiredCurrentSite();
    const switchAccountEnabled =  !currentSite.isFeatureDisabled('NoDelegate_SwitchAccount');
    expect(switchAccountEnabled).toBe(true);

  });

  test('should not return any user menu handlers', async () => {
    // eslint-disable-next-line max-len
    CoreConstants.CONFIG.disabledFeatures = 'CoreUserDelegate_CoreGrades,CoreUserDelegate_AddonPrivateFiles,CoreUserDelegate_AddonBadges:account,CoreUserDelegate_AddonBlog:account,CoreUserDelegate_AddonCompetency,CoreUserDelegate_CorePolicy,CoreUserDelegate_CoreDataPrivacy,NoDelegate_SwitchAccount,CoreReportBuilderDelegate';

    CoreEvents.trigger(CoreEvents.LOGIN, { siteId }, siteId);
    // Wait the event to be processed.
    await CoreWait.nextTick();

    const subject = CoreUserDelegate.getProfileHandlersFor(user, CoreUserDelegateContext.USER_MENU);
    let handlers: CoreUserProfileHandlerToDisplay[] = [];

    subject.subscribe((newHandlers) => {
        handlers = newHandlers;
    });
    await CoreUserDelegate.waitForReadyInContext(user.id, CoreUserDelegateContext.USER_MENU);

    const handlersNames = handlers.map((handler) => handler.name).sort();
    expect(handlersNames).toHaveLength(0);

    subject.unsubscribe();

    const currentSite = CoreSites.getRequiredCurrentSite();
    const switchAccountEnabled =  !currentSite.isFeatureDisabled('NoDelegate_SwitchAccount');
    expect(switchAccountEnabled).toBe(false);

  });

});
