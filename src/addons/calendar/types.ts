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

import { AddonCalendarEventType } from './constants';

/**
 * Calculated data for Calendar filtering.
 */
export type AddonCalendarFilter = {
    filtered: boolean; // If filter enabled (some filters applied).
    courseId: number | undefined; // Course Id to filter.
    categoryId?: number; // Category Id to filter.
    course: boolean; // Filter to show course events.
    group: boolean; // Filter to show group events.
    site: boolean; // Filter to show show site events.
    user: boolean; // Filter to show user events.
    category: boolean; // Filter to show category events.
};

export type AddonCalendarEventTypeOption = {
    name: string;
    value: AddonCalendarEventType;
};

/**
 * Formatted event reminder.
 */
export type AddonCalendarEventReminder = {
    id: number;
    timestamp?: number; // Timestamp (in seconds).
    label?: string; // Label to represent the reminder.
    sublabel?: string; // Sub label.
};

// Database

export type AddonCalendarEventDBRecord = {
    id: number;
    name: string;
    description: string;
    eventtype: AddonCalendarEventType | string;
    timestart: number;
    timeduration: number;
    categoryid?: number;
    groupid?: number;
    userid?: number;
    instance?: number;
    modulename?: string;
    timemodified: number;
    repeatid?: number;
    visible: number;
    // Following properties are only available on AddonCalendarGetEventsEvent
    courseid?: number;
    uuid?: string;
    sequence?: number;
    subscriptionid?: number;
    // Following properties are only available on AddonCalendarCalendarEvent
    location?: string;
    eventcount?: number;
    timesort?: number;
    category?: string;
    course?: string;
    subscription?: string;
    canedit?: number;
    candelete?: number;
    deleteurl?: string;
    editurl?: string;
    viewurl?: string;
    isactionevent?: number;
    url?: string;
    islastday?: number;
    popupname?: string;
    mindaytimestamp?: number;
    maxdaytimestamp?: number;
    draggable?: number;
};
