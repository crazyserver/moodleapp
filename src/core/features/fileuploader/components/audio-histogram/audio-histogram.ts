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

import { CoreSharedModule } from '@/core/shared.module';
import { toBoolean } from '@/core/transforms/boolean';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    viewChild,
    input,
    computed,
    effect,
} from '@angular/core';

@Component({
    selector: 'core-audio-histogram',
    templateUrl: 'audio-histogram.html',
    styleUrl: 'audio-histogram.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CoreSharedModule,
    ],
})
export class CoreFileUploaderAudioHistogramComponent implements OnDestroy {

    protected static readonly BARS_WIDTH = 2;
    protected static readonly BARS_MIN_HEIGHT = 4;
    protected static readonly BARS_GUTTER = 4;

    readonly amplitude = input.required<number>();
    readonly paused = input(false, { transform: toBoolean });
    readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

    protected hostElement: HTMLElement = inject(ElementRef).nativeElement;
    protected readonly canvas = computed(() => this.canvasRef()?.nativeElement);
    protected readonly context = computed(() => this.canvas()?.getContext('2d'));
    protected history: number[] = [];
    protected destroyed = false;

    constructor() {
        effect(() => {
            const canvas = this.canvas();
            const context = this.context();
            if (!canvas || !context) {
                return;
            }
            this.updateCanvas(this.hostElement.clientWidth, this.hostElement.clientHeight);
            this.draw();
        });
    }

    /**
     * @inheritdoc
     */
    ngOnDestroy(): void {
        this.destroyed = true;
    }

    /**
     * Draw histogram.
     */
    protected draw(): void {
        const canvas = this.canvas();
        const context = this.context();

        if (this.destroyed || !canvas || !context) {
            return;
        }

        if (canvas.width !== this.hostElement.clientWidth || canvas.height !== this.hostElement.clientHeight) {
            this.updateCanvas(this.hostElement.clientWidth, this.hostElement.clientHeight);
        }

        const width = canvas.width;
        const height = canvas.height;
        const barsWidth = CoreFileUploaderAudioHistogramComponent.BARS_WIDTH;
        const barsGutter = CoreFileUploaderAudioHistogramComponent.BARS_GUTTER;
        const barsCount = Math.max(1, Math.floor((width - barsWidth - 1) / (barsWidth + barsGutter)));

        if (!this.paused()) {
            this.updateHistory(barsCount);
        }

        // Reset canvas.
        context.fillRect(0, 0, width, height);

        // Draw bars.
        const startX = Math.floor((width - (barsWidth + barsGutter)*barsCount - barsWidth - 1)/2);

        context.beginPath();
        this.drawActiveBars(startX);
        context.stroke();

        // Schedule next frame.
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Keep a rolling window of the most recent amplitude readings, one per bar.
     *
     * @param barsCount Number of bars that fit in the canvas.
     */
    protected updateHistory(barsCount: number): void {
        this.history.push(this.amplitude());

        const overflow = this.history.length - barsCount;

        if (overflow > 0) {
            this.history.splice(0, overflow);
        }
    }

    /**
     * Draws bars on the histogram when it is active.
     *
     * @param x Starting x position.
     */
    protected drawActiveBars(x: number): void {
        const canvas = this.canvas();
        const context = this.context();

        if (!canvas || !context) {
            return;
        }

        const halfHeight = canvas.height / 2;
        const halfMinHeight = CoreFileUploaderAudioHistogramComponent.BARS_MIN_HEIGHT / 2;
        const barsWidth = CoreFileUploaderAudioHistogramComponent.BARS_WIDTH;
        const barsGutter = CoreFileUploaderAudioHistogramComponent.BARS_GUTTER;

        for (const level of this.history) {
            const barHeight = Math.max(halfMinHeight, halfHeight * Math.min(1, Math.max(0, level)));

            context.moveTo(x, halfHeight - barHeight);
            context.lineTo(x, halfHeight + barHeight);

            x += barsWidth + barsGutter;
        }
    }

    /**
     * Set canvas element dimensions and configure styles.
     *
     * @param width Canvas width.
     * @param height Canvas height.
     */
    protected updateCanvas(width: number, height: number): void {
        const canvas = this.canvas();
        const context = this.context();
        if (!canvas || !context) {
            return;
        }

        const styles = getComputedStyle(this.hostElement);

        canvas.width = width;
        canvas.height = height;
        context.fillStyle = styles.getPropertyValue('--background-color');
        context.lineCap = 'round';
        context.lineWidth = CoreFileUploaderAudioHistogramComponent.BARS_WIDTH;
        context.strokeStyle = styles.getPropertyValue('--bars-color');
    }

}
