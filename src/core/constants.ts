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

import envJson from '@/assets/env.json';
import { EnvironmentConfig } from '@/types/config';
import {
    ModArchetype,
    ModFeature,
    ModResourceDisplay,
} from '@addons/mod/constants';
import { LOGIN_SSO_LAUNCH_DATA, NO_SITE_ID } from '@features/login/constants';
import { CORE_USER_CALENDAR_DEFAULT_STARTING_WEEKDAY } from '@features/user/constants';

/**
 * Context levels enumeration.
 */
export const enum ContextLevel {
    SYSTEM = 'system',
    USER = 'user',
    COURSECAT = 'coursecat',
    COURSE = 'course',
    MODULE = 'module',
    BLOCK = 'block',
}

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */
/**
 * Possible statuses for downloaded modules/files.
 */
export const DownloadedStatus = {
    DOWNLOADED: 'downloaded',
    DOWNLOADING: 'downloading',
    OUTDATED: 'outdated',
} as const;
export type DownloadedStatus = typeof DownloadedStatus[keyof typeof DownloadedStatus];

/**
 * Possible statuses for not downloaded modules/files.
 */
export const NotDownloadedStatus = {
    DOWNLOADABLE_NOT_DOWNLOADED: 'notdownloaded',
    NOT_DOWNLOADABLE: 'notdownloadable',
} as const;
export type NotDownloadedStatus = typeof NotDownloadedStatus[keyof typeof NotDownloadedStatus];

/**
 * Possible statuses for modules regarding download.
 */
export const DownloadStatus = {
    ...DownloadedStatus,
    ...NotDownloadedStatus,
} as const;
export type DownloadStatus = typeof DownloadStatus[keyof typeof DownloadStatus];
/* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */

// Constants for cache update frequency.
export const CoreCacheUpdateFrequency = {
    USUALLY: 0, // eslint-disable-line @typescript-eslint/naming-convention
    OFTEN: 1, // eslint-disable-line @typescript-eslint/naming-convention
    SOMETIMES: 2, // eslint-disable-line @typescript-eslint/naming-convention
    RARELY: 3, // eslint-disable-line @typescript-eslint/naming-convention
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CoreCacheUpdateFrequency = typeof CoreCacheUpdateFrequency[keyof typeof CoreCacheUpdateFrequency];

export const MINIMUM_MOODLE_VERSION = '3.5';

// Versions of Moodle releases.
export const MOODLE_RELEASES = {
    '3.5': 2018051700,
    '3.6': 2018120300,
    '3.7': 2019052000,
    '3.8': 2019111800,
    '3.9': 2020061500,
    '3.10': 2020110900,
    '3.11': 2021051700,
    '4.0': 2022041900,
    '4.1': 2022112800,
    '4.2': 2023042400,
    '4.3': 2023100900,
    '4.4': 2024042200,
    '4.5': 2024100700,
    '5.0': 2025041400,
    '5.1': 2025100600,
};

/**
 * Priority of the different back button actions in the app.
 */
export const enum BackButtonPriority {
    IFRAME_FULLSCREEN = 150,
    USER_TOURS = 100,
    CORE_TABS = 40,
    MAIN_MENU = -10, // Use a priority lower than 0 (navigation).
    QUIT_APP = -100, // This should always be the lowest priority.
}

/**
 * LMS enum with the different badge styles.
 */
export const enum LMSBadgeStyle {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
    INFO = 'info',
}

export enum CoreTimeConstants {
    SECONDS_YEAR = 31536000,
    SECONDS_MONTH = 2592000,
    SECONDS_WEEK = 604800,
    SECONDS_DAY = 86400,
    SECONDS_HOUR = 3600,
    SECONDS_MINUTE = 60,
    MILLISECONDS_YEAR = 31536000000,
    MILLISECONDS_MONTH = 2592000000,
    MILLISECONDS_WEEK = 604800000,
    MILLISECONDS_DAY = 86400000,
    MILLISECONDS_HOUR = 3600000,
    MILLISECONDS_MINUTE = 60000,
    MILLISECONDS_SECOND = 1000,
};

export enum CoreBytesConstants {
    KILOBYTE = 1024, // 1KB.
    MEGABYTE = 1048576, // 1MB.
    GIGABYTE = 1073741824, // 1GB.
};

export enum CoreConfigSettingKey {
    NOTIFICATION_SOUND = 'CoreSettingsNotificationSound',
    SYNC_ONLY_ON_WIFI = 'CoreSettingsSyncOnlyOnWifi',
    DEBUG_DISPLAY = 'CoreSettingsDebugDisplay',
    SEND_ON_ENTER = 'CoreSettingsSendOnEnter',
    ZOOM_LEVEL = 'CoreSettingsZoomLevel',
    COLOR_SCHEME = 'CoreSettingsColorScheme',
    ANALYTICS_ENABLED = 'CoreSettingsAnalyticsEnabled',
    DONT_SHOW_EXTERNAL_LINK_WARN = 'CoreSettingsDontShowExtLinkWarn',
    PINCH_TO_ZOOM = 'CoreSettingsPinchToZoom',
    EXACT_ALARMS_WARNING_DISPLAYED = 'CoreScheduleExactWarningModalDisplayed',
    DONT_SHOW_EXACT_ALARMS_WARNING = 'CoreDontShowScheduleExactWarning',
    DONT_SHOW_NOTIFICATIONS_PERMISSION_WARNING = 'CoreDontShowNotificationsPermissionWarning',
};

/**
 * Static class to contain all the core constants.
 */
export class CoreConstants {

     /**
      * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_YEAR instead.
      */
    static readonly SECONDS_YEAR = CoreTimeConstants.SECONDS_YEAR;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_MONTH instead.
     */
    static readonly SECONDS_MONTH = CoreTimeConstants.SECONDS_MONTH;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_WEEK instead.
     */
    static readonly SECONDS_WEEK = CoreTimeConstants.SECONDS_WEEK;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_DAY instead.
     */
    static readonly SECONDS_DAY = CoreTimeConstants.SECONDS_DAY;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_HOUR instead.
     */
    static readonly SECONDS_HOUR = CoreTimeConstants.SECONDS_HOUR;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.SECONDS_MINUTE instead.
     */
    static readonly SECONDS_MINUTE = CoreTimeConstants.SECONDS_MINUTE;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_YEAR instead.
     */
    static readonly MILLISECONDS_YEAR = CoreTimeConstants.MILLISECONDS_YEAR;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_MONTH instead.
     */
    static readonly MILLISECONDS_MONTH = CoreTimeConstants.MILLISECONDS_MONTH;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_WEEK instead.
     */
    static readonly MILLISECONDS_WEEK = CoreTimeConstants.MILLISECONDS_WEEK;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_DAY instead.
     */
    static readonly MILLISECONDS_DAY = CoreTimeConstants.MILLISECONDS_DAY;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_HOUR instead.
     */
    static readonly MILLISECONDS_HOUR = CoreTimeConstants.MILLISECONDS_HOUR;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_MINUTE instead.
     */
    static readonly MILLISECONDS_MINUTE = CoreTimeConstants.MILLISECONDS_MINUTE;
    /**
     * @deprecated since 5.1. Use CoreTimeConstants.MILLISECONDS_SECOND instead.
     */
    static readonly MILLISECONDS_SECOND = CoreTimeConstants.MILLISECONDS_SECOND;

    /**
     * @deprecated since 5.1. Use CoreFileProvider.WIFI_DOWNLOAD_DEFAULT_CONFIRMATION_THRESHOLD instead.
     */
    static readonly WIFI_DOWNLOAD_THRESHOLD = 100 * CoreBytesConstants.MEGABYTE; // 100MB.
    /**
     * @deprecated since 5.1. Use CoreFileProvider.DOWNLOAD_DEFAULT_CONFIRMATION_THRESHOLD instead.
     */
    static readonly DOWNLOAD_THRESHOLD = 10 * CoreBytesConstants.MEGABYTE; // 10MB.
    /**
     * @deprecated since 5.1. Use CoreFileProvider.MINIMUM_FREE_SPACE instead.
     */
    static readonly MINIMUM_FREE_SPACE = 10 * CoreBytesConstants.MEGABYTE; // 10MB.
    /**
     * @deprecated since 5.1. Not needed anymore.
     */
    static readonly IOS_FREE_SPACE_THRESHOLD = 500 * CoreBytesConstants.MEGABYTE; // 500MB.

    /**
     * @deprecated since 5.1. Use NO_SITE_ID constant instead.
     */
    static readonly NO_SITE_ID = NO_SITE_ID;

    // Settings constants.
    /**
     * @deprecated since 5.0. Plain text area editor has been removed.
     */
    static readonly SETTINGS_RICH_TEXT_EDITOR = 'CoreSettingsRichTextEditor';
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.NOTIFICATION_SOUND instead.
     */
    static readonly SETTINGS_NOTIFICATION_SOUND = CoreConfigSettingKey.NOTIFICATION_SOUND;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.SYNC_ONLY_ON_WIFI instead.
     */
    static readonly SETTINGS_SYNC_ONLY_ON_WIFI = CoreConfigSettingKey.SYNC_ONLY_ON_WIFI;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.DEBUG_DISPLAY instead.
     */
    static readonly SETTINGS_DEBUG_DISPLAY = CoreConfigSettingKey.DEBUG_DISPLAY;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.SEND_ON_ENTER instead.
     */
    static readonly SETTINGS_SEND_ON_ENTER = CoreConfigSettingKey.SEND_ON_ENTER;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.ZOOM_LEVEL instead.
     */
    static readonly SETTINGS_ZOOM_LEVEL = CoreConfigSettingKey.ZOOM_LEVEL;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.COLOR_SCHEME instead.
     */
    static readonly SETTINGS_COLOR_SCHEME = CoreConfigSettingKey.COLOR_SCHEME;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.ANALYTICS_ENABLED instead.
     */
    static readonly SETTINGS_ANALYTICS_ENABLED = CoreConfigSettingKey.ANALYTICS_ENABLED;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.DONT_SHOW_EXTERNAL_LINK_WARN instead.
     */
    static readonly SETTINGS_DONT_SHOW_EXTERNAL_LINK_WARN = CoreConfigSettingKey.DONT_SHOW_EXTERNAL_LINK_WARN;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.PINCH_TO_ZOOM instead.
     */
    static readonly SETTINGS_PINCH_TO_ZOOM = CoreConfigSettingKey.PINCH_TO_ZOOM;

    // WS constants.
    /**
     * Timeout when not in WiFi.
     *
     * @deprecated since 5.1. Use CoreWSProvider.WS_TIMEOUT instead.
     */
    static readonly WS_TIMEOUT = 30000;
    /**
     * Timeout when in WiFi.
     *
     * @deprecated since 5.1. Use CoreWSProvider.WS_TIMEOUT_WIFI instead.
     */
    static readonly WS_TIMEOUT_WIFI = 30000;

    /**
     * @deprecated since 5.1. Use LOGIN_SSO_LAUNCH_DATA instead.
     */
    static readonly LOGIN_LAUNCH_DATA = LOGIN_SSO_LAUNCH_DATA;

    // Download status constants.
    /**
     * @deprecated since 4.4. Use DownloadStatus.DOWNLOADED instead.
     */
    static readonly DOWNLOADED = DownloadStatus.DOWNLOADED;
    /**
     * @deprecated since 4.4. Use DownloadStatus.DOWNLOADING instead.
     */
    static readonly DOWNLOADING = DownloadStatus.DOWNLOADING;
    /**
     * @deprecated since 4.4. Use DownloadStatus.DOWNLOADABLE_NOT_DOWNLOADED instead.
     */
    static readonly NOT_DOWNLOADED = DownloadStatus.DOWNLOADABLE_NOT_DOWNLOADED;
    /**
     * @deprecated since 4.4. Use DownloadStatus.OUTDATED instead.
     */
    static readonly OUTDATED = DownloadStatus.OUTDATED;
    /**
     * @deprecated since 4.4. Use DownloadStatus.NOT_DOWNLOADABLE instead.
     */
    static readonly NOT_DOWNLOADABLE = DownloadStatus.NOT_DOWNLOADABLE;

    // Download / prefetch status icon.
    /**
     * @deprecated since 5.1. Use CoreCourseDownloadStatusIcon.DOWNLOADED instead.
     */
    static readonly ICON_DOWNLOADED = 'fam-cloud-done';
    /**
     * @deprecated since 5.1. Use CoreCourseDownloadStatusIcon.DOWNLOADING instead.
     */
    static readonly ICON_DOWNLOADING = 'spinner';
    /**
     * @deprecated since 5.1. Use CoreCourseDownloadStatusIcon.NOT_DOWNLOADED instead.
     */
    static readonly ICON_NOT_DOWNLOADED = 'fas-cloud-arrow-down';
    /**
     * @deprecated since 5.1. Use CoreCourseDownloadStatusIcon.OUTDATED instead.
     */
    static readonly ICON_OUTDATED = 'fam-cloud-refresh';
    /**
     * @deprecated since 5.1. Use CoreCourseDownloadStatusIcon.NOT_DOWNLOADABLE instead.
     */
    static readonly ICON_NOT_DOWNLOADABLE = '';

    /**
     * @deprecated since 5.1. Use CoreDownloadIcon.LOADING instead.
     */
    static readonly ICON_LOADING = 'spinner';
    /**
     * @deprecated since 5.1. Use CoreDownloadIcon.REFRESH instead.
     */
    static readonly ICON_REFRESH = 'fas-rotate-right';
    /**
     * @deprecated since 5.1. Use CoreDownloadIcon.SYNC instead.
     */
    static readonly ICON_SYNC = 'fas-rotate';

    /**
     * @deprecated since 5.0. Use ModResourceDisplay.AUTO instead.
     */
    static readonly RESOURCELIB_DISPLAY_AUTO = ModResourceDisplay.AUTO;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.EMBED instead.
     */
    static readonly RESOURCELIB_DISPLAY_EMBED = ModResourceDisplay.EMBED;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.FRAME instead.
     */
    static readonly RESOURCELIB_DISPLAY_FRAME = ModResourceDisplay.FRAME;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.NEW instead.
     */
    static readonly RESOURCELIB_DISPLAY_NEW = ModResourceDisplay.NEW;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.DOWNLOAD instead.
     */
    static readonly RESOURCELIB_DISPLAY_DOWNLOAD = ModResourceDisplay.DOWNLOAD;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.OPEN instead.
     */
    static readonly RESOURCELIB_DISPLAY_OPEN = ModResourceDisplay.OPEN;
    /**
     * @deprecated since 5.0. Use ModResourceDisplay.POPUP instead.
     */
    static readonly RESOURCELIB_DISPLAY_POPUP = ModResourceDisplay.POPUP;

    /**
     * @deprecated since 5.0. Use ModFeature.GRADE_HAS_GRADE instead.
     */
    static readonly FEATURE_GRADE_HAS_GRADE = ModFeature.GRADE_HAS_GRADE;
    /**
     * @deprecated since 5.0. Use ModFeature.GRADE_OUTCOMES instead.
     */
    static readonly FEATURE_GRADE_OUTCOMES = ModFeature.GRADE_OUTCOMES;
    /**
     * @deprecated since 5.0. Use ModFeature.ADVANCED_GRADING instead.
     */
    static readonly FEATURE_ADVANCED_GRADING = ModFeature.ADVANCED_GRADING;
    /**
     * @deprecated since 5.0. Use ModFeature.CONTROLS_GRADE_VISIBILITY instead.
     */
    static readonly FEATURE_CONTROLS_GRADE_VISIBILITY = ModFeature.CONTROLS_GRADE_VISIBILITY;
    /**
     * @deprecated since 5.0. Use ModFeature.PLAGIARISM instead.
     */
    static readonly FEATURE_PLAGIARISM = ModFeature.PLAGIARISM;
    /**
     * @deprecated since 5.0. Use ModFeature.COMPLETION_TRACKS_VIEWS instead.
     */
    static readonly FEATURE_COMPLETION_TRACKS_VIEWS = ModFeature.COMPLETION_TRACKS_VIEWS;
    /**
     * @deprecated since 5.0. Use ModFeature.COMPLETION_HAS_RULES instead.
     */
    static readonly FEATURE_COMPLETION_HAS_RULES = ModFeature.COMPLETION_HAS_RULES;
    /**
     * @deprecated since 5.0. Use ModFeature.NO_VIEW_LINK instead.
     */
    static readonly FEATURE_NO_VIEW_LINK = ModFeature.NO_VIEW_LINK;
    /**
     * @deprecated since 5.0. Use ModFeature.IDNUMBER instead.
     */
    static readonly FEATURE_IDNUMBER = ModFeature.IDNUMBER;
    /**
     * @deprecated since 5.0. Use ModFeature.GROUPS instead.
     */
    static readonly FEATURE_GROUPS = ModFeature.GROUPS;
    /**
     * @deprecated since 5.0. Use ModFeature.GROUPINGS instead.
     */
    static readonly FEATURE_GROUPINGS = ModFeature.GROUPINGS;
    /**
     * @deprecated since 5.0. Use ModFeature.MOD_ARCHETYPE instead.
     */
    static readonly FEATURE_MOD_ARCHETYPE = ModFeature.MOD_ARCHETYPE;
    /**
     * @deprecated since 5.0. Use ModFeature.MOD_INTRO instead.
     */
    static readonly FEATURE_MOD_INTRO = ModFeature.MOD_INTRO;
    /**
     * @deprecated since 5.0. Use ModFeature.MODEDIT_DEFAULT_COMPLETION instead.
     */
    static readonly FEATURE_MODEDIT_DEFAULT_COMPLETION = ModFeature.MODEDIT_DEFAULT_COMPLETION;
    /**
     * @deprecated since 5.0. Use ModFeature.COMMENT instead.
     */
    static readonly FEATURE_COMMENT = ModFeature.COMMENT;
    /**
     * @deprecated since 5.0. Use ModFeature.MOD_PURPOSE instead.
     */
    static readonly FEATURE_MOD_PURPOSE = ModFeature.MOD_PURPOSE;
    /**
     * @deprecated since 5.0. Use ModFeature.RATE instead.
     */
    static readonly FEATURE_RATE = ModFeature.RATE;
    /**
     * @deprecated since 5.0. Use ModFeature.BACKUP_MOODLE2 instead.
     */
    static readonly FEATURE_BACKUP_MOODLE2 = ModFeature.BACKUP_MOODLE2;
    /**
     * @deprecated since 5.0. Use ModFeature.SHOW_DESCRIPTION instead.
     */
    static readonly FEATURE_SHOW_DESCRIPTION = ModFeature.SHOW_DESCRIPTION;
    /**
     * @deprecated since 5.0. Use ModFeature.USES_QUESTIONS instead.
     */
    static readonly FEATURE_USES_QUESTIONS = ModFeature.USES_QUESTIONS;

    /**
     * @deprecated since 5.0. Use ModArchetype.OTHER instead.
     */
    static readonly MOD_ARCHETYPE_OTHER = ModArchetype.OTHER;
    /**
     * @deprecated since 5.0. Use ModArchetype.RESOURCE instead.
     */
    static readonly MOD_ARCHETYPE_RESOURCE = ModArchetype.RESOURCE;
    /**
     * @deprecated since 5.0. Use ModArchetype.ASSIGNMENT instead.
     */
    static readonly MOD_ARCHETYPE_ASSIGNMENT = ModArchetype.ASSIGNMENT;
    /**
     * @deprecated since 5.0. Use ModArchetype.SYSTEM instead.
     */
    static readonly MOD_ARCHETYPE_SYSTEM = ModArchetype.SYSTEM;

    // Other constants.
    /**
     * @deprecated since 5.1. Use CORE_USER_CALENDAR_DEFAULT_STARTING_WEEKDAY instead.
     */
    static readonly CALENDAR_DEFAULT_STARTING_WEEKDAY = CORE_USER_CALENDAR_DEFAULT_STARTING_WEEKDAY;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.DONT_SHOW_NOTIFICATIONS_PERMISSION_WARNING instead.
     */
    static readonly DONT_SHOW_NOTIFICATIONS_PERMISSION_WARNING = CoreConfigSettingKey.DONT_SHOW_NOTIFICATIONS_PERMISSION_WARNING;

    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.DONT_SHOW_EXACT_ALARMS_WARNING instead.
     */
    static readonly DONT_SHOW_EXACT_ALARMS_WARNING = CoreConfigSettingKey.DONT_SHOW_EXACT_ALARMS_WARNING;
    /**
     * @deprecated since 5.1. Use CoreConfigSettingKey.EXACT_ALARMS_WARNING_DISPLAYED instead.
     */
    static readonly EXACT_ALARMS_WARNING_DISPLAYED = CoreConfigSettingKey.EXACT_ALARMS_WARNING_DISPLAYED;

    // Config & environment constants.
    static readonly CONFIG = { ...envJson.config } as unknown as EnvironmentConfig; // Data parsed from config.json files.
    static readonly BUILD = envJson.build as unknown as EnvironmentBuild; // Build info.

    /**
     * Check whether devtools should be enabled.
     *
     * @returns Whether devtools should be enabled.
     *
     * @deprecated since 5.1. Use isDevOrTestingBuild() instead.
     */
    static enableDevTools(): boolean {
        return CoreConstants.isDevOrTestingBuild();

    }

    /**
     * Check whether the build is a development or testing build.
     *
     * @returns Whether the build is a development or testing build.
     */
    static isDevOrTestingBuild(): boolean {
        return CoreConstants.BUILD.isDevelopment || this.BUILD.isTesting;
    }

}

interface EnvironmentBuild {
    version: string;
    isProduction: boolean;
    isTesting: boolean;
    isDevelopment: boolean;
    lastCommitHash: string;
    compilationTime: number;
}

// General download and sync icons.
export const enum CoreDownloadIcon {
    LOADING = 'spinner',
    REFRESH = 'fas-rotate-right',
    SYNC = 'fas-rotate',
};
