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

export const ADDON_MOD_SCORM_COMPONENT = 'mmaModScorm';
export const ADDON_MOD_SCORM_PAGE_NAME = 'mod_scorm';

// Public constants.
export const enum AddonModScormGradeMethod {
    GRADESCOES = 0,
    GRADEHIGHEST = 1,
    GRADEAVERAGE = 2,
    GRADESUM = 3,
}

export const enum AddonModScormWhatGrade {
    HIGHESTATTEMPT = 0,
    AVERAGEATTEMPT = 1,
    FIRSTATTEMPT = 2,
    LASTATTEMPT = 3,
}

export const enum AddonModScormMode {
    MODEBROWSE = 'browse',
    MODENORMAL = 'normal',
    MODEREVIEW = 'review',
}

export const enum AddonModScormForceAttempt {
    SCORM_FORCEATTEMPT_NO = 0,
    SCORM_FORCEATTEMPT_ONCOMPLETE = 1,
    SCORM_FORCEATTEMPT_ALWAYS = 2,
}

export const enum AddonModScormSkipView {
    SKIPVIEW_NEVER = 0,
    SKIPVIEW_FIRST = 1,
    SKIPVIEW_ALWAYS = 2,
}

// Events.
export const ADDON_MOD_SCORM_LAUNCH_NEXT_SCO_EVENT = 'addon_mod_scorm_launch_next_sco';
export const ADDON_MOD_SCORM_LAUNCH_PREV_SCO_EVENT = 'addon_mod_scorm_launch_prev_sco';
export const ADDON_MOD_SCORM_UPDATE_TOC_EVENT = 'addon_mod_scorm_update_toc';
export const ADDON_MOD_SCORM_GO_OFFLINE_EVENT = 'addon_mod_scorm_go_offline';
export const ADDON_MOD_SCORM_DATA_SENT_EVENT = 'addon_mod_scorm_data_sent';
export const ADDON_MOD_SCORM_DATA_AUTO_SYNCED = 'addon_mod_scorm_autom_synced';
