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

import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

import { makeSingleton } from '@singletons';
import { CoreEvents } from '@singletons/events';
import { CorePlatform } from '@services/platform';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Screen breakpoints.
 *
 * @see https://ionicframework.com/docs/layout/grid#default-breakpoints
 */
enum Breakpoint {
    EXTRA_SMALL = 'xs',
    SMALL = 'sm',
    MEDIUM = 'md',
    LARGE = 'lg',
    EXTRA_LARGE = 'xl',
}

const BREAKPOINT_NAMES = Object.values(Breakpoint);
const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
    [Breakpoint.EXTRA_SMALL]: 0,
    [Breakpoint.SMALL]: 576,
    [Breakpoint.MEDIUM]: 768,
    [Breakpoint.LARGE]: 992,
    [Breakpoint.EXTRA_LARGE]: 1200,
};

/**
 * Screen layouts.
 */
export enum CoreScreenLayout {
    MOBILE = 'mobile',
    TABLET = 'tablet',
}

/**
 * Screen orientation.
 */
export enum CoreScreenOrientation {
    LANDSCAPE = 'landscape',
    PORTRAIT = 'portrait',
}

/**
 * Manage application screen.
 */
@Injectable({ providedIn: 'root' })
export class CoreScreenService {

    private _breakpoints: WritableSignal<Record<Breakpoint, boolean>>;
    private _layout: Signal<CoreScreenLayout>;
    private _orientation: WritableSignal<CoreScreenOrientation>;

    constructor() {
        this._breakpoints = signal(BREAKPOINT_NAMES.reduce((breakpoints, breakpoint) => ({
            ...breakpoints,
            [breakpoint]: false,
        }), {} as Record<Breakpoint, boolean>));

        this._layout = computed(() => this.calculateLayout(this._breakpoints()));
        this._orientation = signal(this.orientation);
    }

    get breakpoints(): Record<Breakpoint, boolean> {
        return this._breakpoints();
    }

    /**
     * Get breakpoints observable.
     *
     * @returns Breakpoints observable.
     * @deprecated since 5.0.0. Use `breakpointsSignal` instead.
     */
    get breakpointsObservable(): Observable<Record<Breakpoint, boolean>> {
        return toObservable(this._breakpoints);
    }

    get breakpointsSignal(): Signal<Record<Breakpoint, boolean>> {
        return this._breakpoints.asReadonly();
    }

    get layout(): CoreScreenLayout {
        return this.calculateLayout(this._breakpoints());
    }

    /**
     * Get layout observable.
     *
     * @returns Layout observable.
     * @deprecated since 5.0.0. Use `layoutSignal` instead.
     */
    get layoutObservable(): Observable<CoreScreenLayout> {
        return toObservable(this._layout);
    }

    get layoutSignal(): Signal<CoreScreenLayout> {
        return this._layout;
    }

    get isMobile(): boolean {
        return this._layout() === CoreScreenLayout.MOBILE;
    }

    get isTablet(): boolean {
        return this._layout() === CoreScreenLayout.TABLET;
    }

    isMobileSignal(): Signal<boolean> {
        return computed(() => this._layout() === CoreScreenLayout.MOBILE);
    }

    isTabletSignal(): Signal<boolean> {
        return computed(() => this._layout() === CoreScreenLayout.TABLET);
    }

    get orientation(): CoreScreenOrientation {
        return screen.orientation.type.startsWith(CoreScreenOrientation.LANDSCAPE)
            ? CoreScreenOrientation.LANDSCAPE
            : CoreScreenOrientation.PORTRAIT;
    }

    orientationSignal(): Signal<CoreScreenOrientation> {
        return this._orientation.asReadonly();
    }

    get isPortrait(): boolean {
        return this.orientation === CoreScreenOrientation.PORTRAIT;
    }

    get isLandscape(): boolean {
        return this.orientation === CoreScreenOrientation.LANDSCAPE;
    }

    /**
     * Watch orientation changes.
     */
    async watchOrientation(): Promise<void> {
        await CorePlatform.ready();

        screen.orientation.addEventListener('change', () => {
            const orientation = this.orientation;
            CoreEvents.trigger(CoreEvents.ORIENTATION_CHANGE, { orientation });
            this._orientation.set(orientation);
        });
    }

    /**
     * Watch viewport changes.
     */
    watchViewport(): void {
        for (const breakpoint of BREAKPOINT_NAMES) {
            const width = BREAKPOINT_WIDTHS[breakpoint];
            const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);

            this.updateBreakpointVisibility(breakpoint, mediaQuery.matches);

            mediaQuery.onchange = (({ matches }) => this.updateBreakpointVisibility(breakpoint, matches));
        }
    }

    /**
     * Update breakpoint visibility.
     *
     * @param breakpoint Breakpoint.
     * @param visible Visible.
     */
    protected updateBreakpointVisibility(breakpoint: Breakpoint, visible: boolean): void {
        if (this._breakpoints()[breakpoint] === visible) {
            return;
        }

        this._breakpoints.set({
            ...this._breakpoints(),
            [breakpoint]: visible,
        });
    }

    /**
     * Calculate the layout given the current breakpoints.
     *
     * @param breakpoints Breakpoints visibility.
     * @returns Active layout.
     */
    protected calculateLayout(breakpoints: Record<Breakpoint, boolean>): CoreScreenLayout {
        if (breakpoints[Breakpoint.MEDIUM]) {
            return CoreScreenLayout.TABLET;
        }

        return CoreScreenLayout.MOBILE;
    }

}

export const CoreScreen = makeSingleton(CoreScreenService);
