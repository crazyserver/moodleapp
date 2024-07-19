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

/*
 * Helper services for sites.
*/
@Injectable({ providedIn: 'root' })
export class CoreSitesHelperService {

    // List of regular expressions to convert the old nomenclature to new nomenclature for disabled features.
    protected static readonly DISABLED_FEATURES_COMPAT_REGEXPS: { old: RegExp; new: string }[] = [
        { old: /\$mmLoginEmailSignup/g, new: 'CoreLoginEmailSignup' },
        { old: /\$mmSideMenuDelegate/g, new: 'CoreMainMenuDelegate' },
        { old: /\$mmCoursesDelegate/g, new: 'CoreCourseOptionsDelegate' },
        { old: /\$mmUserDelegate/g, new: 'CoreUserDelegate' },
        { old: /\$mmCourseDelegate/g, new: 'CoreCourseModuleDelegate' },
        { old: /_mmCourses/g, new: '_CoreCourses' },
        { old: /_mmaFrontpage/g, new: '_CoreSiteHome' },
        { old: /_mmaGrades/g, new: '_CoreGrades' },
        { old: /_mmaCompetency/g, new: '_AddonCompetency' },
        { old: /_mmaNotifications/g, new: '_AddonNotifications' },
        { old: /_mmaMessages/g, new: '_AddonMessages' },
        { old: /_mmaCalendar/g, new: '_AddonCalendar' },
        { old: /_mmaFiles/g, new: '_AddonPrivateFiles' },
        { old: /_mmaParticipants/g, new: '_CoreUserParticipants' },
        { old: /_mmaCourseCompletion/g, new: '_AddonCourseCompletion' },
        { old: /_mmaNotes/g, new: '_AddonNotes' },
        { old: /_mmaBadges/g, new: '_AddonBadges' },
        { old: /files_privatefiles/g, new: 'AddonPrivateFilesPrivateFiles' },
        { old: /files_sitefiles/g, new: 'AddonPrivateFilesSiteFiles' },
        { old: /files_upload/g, new: 'AddonPrivateFilesUpload' },
        { old: /_mmaModAssign/g, new: '_AddonModAssign' },
        { old: /_mmaModBigbluebuttonbn/g, new: '_AddonModBBB' },
        { old: /_mmaModBook/g, new: '_AddonModBook' },
        { old: /_mmaModChat/g, new: '_AddonModChat' },
        { old: /_mmaModChoice/g, new: '_AddonModChoice' },
        { old: /_mmaModData/g, new: '_AddonModData' },
        { old: /_mmaModFeedback/g, new: '_AddonModFeedback' },
        { old: /_mmaModFolder/g, new: '_AddonModFolder' },
        { old: /_mmaModForum/g, new: '_AddonModForum' },
        { old: /_mmaModGlossary/g, new: '_AddonModGlossary' },
        { old: /_mmaModH5pactivity/g, new: '_AddonModH5PActivity' },
        { old: /_mmaModImscp/g, new: '_AddonModImscp' },
        { old: /_mmaModLabel/g, new: '_AddonModLabel' },
        { old: /_mmaModLesson/g, new: '_AddonModLesson' },
        { old: /_mmaModLti/g, new: '_AddonModLti' },
        { old: /_mmaModPage/g, new: '_AddonModPage' },
        { old: /_mmaModQuiz/g, new: '_AddonModQuiz' },
        { old: /_mmaModResource/g, new: '_AddonModResource' },
        { old: /_mmaModScorm/g, new: '_AddonModScorm' },
        { old: /_mmaModSurvey/g, new: '_AddonModSurvey' },
        { old: /_mmaModUrl/g, new: '_AddonModUrl' },
        { old: /_mmaModWiki/g, new: '_AddonModWiki' },
        { old: /_mmaModWorkshop/g, new: '_AddonModWorkshop' },
        { old: /remoteAddOn_/g, new: 'sitePlugin_' },
        { old: /AddonNotes:addNote/g, new: 'AddonNotes:notes' },
    ];

    /**
     * Treat the list of disabled features, replacing old nomenclature with the new one.
     *
     * @param features List of disabled features.
     * @returns Treated list.
     */
    treatDisabledFeatures(features: string): string {
        if (!features) {
            return '';
        }

        for (let i = 0; i < CoreSitesHelperService.DISABLED_FEATURES_COMPAT_REGEXPS.length; i++) {
            const entry = CoreSitesHelperService.DISABLED_FEATURES_COMPAT_REGEXPS[i];

            features = features.replace(entry.old, entry.new);
        }

        return features;
    }

}
export const CoreSitesHelper = makeSingleton(CoreSitesHelperService);
