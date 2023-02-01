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

import { NgModule } from '@angular/core';

import { CoreAriaButtonClickDirective } from './aria-button';
import { CoreAutoFocusDirective } from './auto-focus';
import { CoreAutoRowsDirective } from './auto-rows';
import { CoreCollapsibleFooterDirective } from './collapsible-footer';
import { CoreCollapsibleHeaderDirective } from './collapsible-header';
import { CoreCollapsibleItemDirective } from './collapsible-item';
import { CoreContentDirective } from './content';
import { CoreDownloadFileDirective } from './download-file';
import { CoreExternalContentDirective } from './external-content';
import { CoreFabDirective } from './fab';
import { CoreFaIconDirective } from './fa-icon';
import { CoreFocusableIosFixDirective } from './focusable-ios-fix';
import { CoreFormatTextDirective } from './format-text';
import { CoreLinkDirective } from './link';
import { CoreLongPressDirective } from './long-press';
import { CoreOnResizeDirective } from './on-resize';
import { CoreSupressEventsDirective } from './supress-events';
import { CoreSwipeNavigationDirective } from './swipe-navigation';
import { CoreUpdateNonReactiveAttributesDirective } from './update-non-reactive-attributes';
import { CoreUserLinkDirective } from './user-link';
import { CoreUserTourDirective } from './user-tour';

@NgModule({
    declarations: [
        CoreAriaButtonClickDirective,
        CoreAutoFocusDirective,
        CoreAutoRowsDirective,
        CoreCollapsibleFooterDirective,
        CoreCollapsibleHeaderDirective,
        CoreCollapsibleItemDirective,
        CoreContentDirective,
        CoreDownloadFileDirective,
        CoreExternalContentDirective,
        CoreFabDirective,
        CoreFaIconDirective,
        CoreFocusableIosFixDirective,
        CoreFormatTextDirective,
        CoreLinkDirective,
        CoreLongPressDirective,
        CoreOnResizeDirective,
        CoreSupressEventsDirective,
        CoreSwipeNavigationDirective,
        CoreUpdateNonReactiveAttributesDirective,
        CoreUserLinkDirective,
        CoreUserTourDirective,
    ],
    exports: [
        CoreAriaButtonClickDirective,
        CoreAutoFocusDirective,
        CoreAutoRowsDirective,
        CoreCollapsibleFooterDirective,
        CoreCollapsibleHeaderDirective,
        CoreCollapsibleItemDirective,
        CoreContentDirective,
        CoreDownloadFileDirective,
        CoreExternalContentDirective,
        CoreFabDirective,
        CoreFaIconDirective,
        CoreFocusableIosFixDirective,
        CoreFormatTextDirective,
        CoreLinkDirective,
        CoreLongPressDirective,
        CoreOnResizeDirective,
        CoreSupressEventsDirective,
        CoreSwipeNavigationDirective,
        CoreUpdateNonReactiveAttributesDirective,
        CoreUserLinkDirective,
        CoreUserTourDirective,
    ],
})
export class CoreDirectivesModule {}
