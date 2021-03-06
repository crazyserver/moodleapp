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
import { RouterModule, Routes } from '@angular/router';

import { CoreSharedModule } from '@/core/shared.module';
import { AddonModQuizComponentsModule } from './components/components.module';

import { AddonModQuizIndexPage } from './pages/index/index.page';

const routes: Routes = [
    {
        path: ':courseId/:cmId',
        component: AddonModQuizIndexPage,
    },
    {
        path: ':courseId/:cmId/player',
        loadChildren: () => import('./pages/player/player.module').then( m => m.AddonModQuizPlayerPageModule),
    },
    {
        path: ':courseId/:cmId/attempt/:attemptId',
        loadChildren: () => import('./pages/attempt/attempt.module').then( m => m.AddonModQuizAttemptPageModule),
    },
    {
        path: ':courseId/:cmId/review/:attemptId',
        loadChildren: () => import('./pages/review/review.module').then( m => m.AddonModQuizReviewPageModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CoreSharedModule,
        AddonModQuizComponentsModule,
    ],
    declarations: [
        AddonModQuizIndexPage,
    ],
})
export class AddonModQuizLazyModule {}
