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

import { LazyDefaultStandaloneComponent } from '@/app/app-routing.module';
import { Type } from '@angular/core';
import { CoreError } from '@classes/errors/error';

/**
 * Singleton with helper functions for loading.
 */
export class CoreLoader {

    // Avoid creating singleton instances.
    private constructor() {
        // Nothing to do.
    }

    /**
     * Get the component to render.
     *
     * @param data  Data to render the component.
     * @returns The component to render.
     */
    static async getComponent<T=unknown>(data: HandlerData<T>): Promise<Type<T>> {
        if (data.component) {
            return data.component;
        } else if (data.loadComponent) {
            const defaultExport = await data.loadComponent();

            return defaultExport.default;
        } else {
            throw new CoreError('Invalid display data received.');
        }
    }

}

export type HandlerData<T=unknown> = {
    /**
     * The component to render.
     * It's recommended to return the class of the component, but you can also return an instance of the component.
     */
    component?: Type<T>;

    /**
     * The component to render, lazy loaded.
     * It's recommended to return the class of the component, but you can also return an instance of the component.
     */
    loadComponent?: () => LazyDefaultStandaloneComponent<T>;
};
