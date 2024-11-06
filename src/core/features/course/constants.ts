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

export const COURSE_INDEX_PATH = ':courseId';
export const COURSE_PAGE_NAME = 'course';
export const CONTENTS_PAGE_NAME = 'contents';
export const COURSE_CONTENTS_PATH = `${COURSE_PAGE_NAME}/${COURSE_INDEX_PATH}/${CONTENTS_PAGE_NAME}`;

export const COURSE_ALL_SECTIONS_PREFERRED_PREFIX = 'CoreCourseFormatAllSectionsPreferred-';
export const COURSE_EXPANDED_SECTIONS_PREFIX = 'CoreCourseFormatExpandedSections-';

export const COURSE_ALL_SECTIONS_ID = -2;
export const COURSE_STEALTH_MODULES_SECTION_ID = -1;
export const COURSE_ALL_COURSES_CLEARED = -1;

export const COURSE_PROGRESS_UPDATED_EVENT = 'progress_updated';

export const COURSE_AUTO_SYNCED = 'core_course_autom_synced';

export const COURSE_COMPONENT = 'CoreCourse';

export const COURSE_CORE_MODULES = [
    'assign', 'bigbluebuttonbn', 'book', 'chat', 'choice', 'data', 'feedback', 'folder', 'forum', 'glossary', 'h5pactivity',
    'imscp', 'label', 'lesson', 'lti', 'page', 'quiz', 'resource', 'scorm', 'survey', 'url', 'wiki', 'workshop',
];

/**
 * Course Module completion status enumeration.
 */
export const enum CoreCourseModuleCompletionStatus {
    COMPLETION_INCOMPLETE = 0,
    COMPLETION_COMPLETE = 1,
    COMPLETION_COMPLETE_PASS = 2,
    COMPLETION_COMPLETE_FAIL = 3,
}

/**
 * Completion tracking valid values.
 */
export const enum CoreCourseModuleCompletionTracking {
    NONE = 0,
    MANUAL = 1,
    AUTOMATIC = 2,
}

export const CoreCourseAccessDataType = {
    ACCESS_GUEST: 'courses_access_guest', // eslint-disable-line @typescript-eslint/naming-convention
    ACCESS_DEFAULT: 'courses_access_default', // eslint-disable-line @typescript-eslint/naming-convention
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CoreCourseAccessDataType = typeof CoreCourseAccessDataType[keyof typeof CoreCourseAccessDataType];
