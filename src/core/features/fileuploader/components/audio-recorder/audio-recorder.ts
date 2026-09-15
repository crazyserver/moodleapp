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

import { ChangeDetectionStrategy, Component, computed, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { StopRecordingResult } from '@capgo/capacitor-audio-recorder';
import { CoreModalComponent } from '@classes/modal-component';
import { CorePlatform } from '@services/platform';
import { Translate } from '@singletons';
import { SafeUrl } from '@angular/platform-browser';
import { CAPTURE_ERROR_NO_MEDIA_FILES, CoreCaptureError } from '@classes/errors/captureerror';
import { CoreAnyError } from '@classes/errors/error';
import { CoreFileUploaderAudioRecording } from '@features/fileuploader/services/fileuploader';
import { CoreFile, CoreFileProvider } from '@services/file';
import { CorePath } from '@static/path';
import { CoreMimetype } from '@static/mimetype';
import { CorePromiseUtils } from '@static/promise-utils';
import { NativeAudioRecorder } from '@services/native/audio-recorder';
import { CoreSharedModule } from '@/core/shared.module';
import { CoreFileUploaderAudioHistogramComponent } from '../audio-histogram/audio-histogram';
import { CoreAlerts } from '@services/overlays/alerts';
import { CoreFileUtils } from '@static/file-utils';

/**
 * Recording status.
 */
type CoreFileUploaderAudioRecorderStatus = 'empty' | 'recording-ongoing' | 'recording-paused' | 'done';

@Component({
    selector: 'core-fileuploader-audio-recorder',
    styleUrl: 'audio-recorder.scss',
    templateUrl: 'audio-recorder.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CoreSharedModule,
        CoreFileUploaderAudioHistogramComponent,
    ],
})
export class CoreFileUploaderAudioRecorderComponent extends CoreModalComponent<CoreFileUploaderAudioRecording>
    implements OnDestroy {

    protected static readonly AMPLITUDE_POLL_INTERVAL = 100;

    readonly status = signal<CoreFileUploaderAudioRecorderStatus>('empty');
    readonly amplitude = signal(0);
    readonly recordingUrl = signal<SafeUrl | null>(null);
    readonly prefersReducedMotion = CorePlatform.prefersReducedMotion();

    protected recording: CoreFileUploaderAudioRecording | null = null;
    protected amplitudePolling?: number;

    protected previewObjectUrl?: string;
    protected readonly previewAudio = viewChild<ElementRef<HTMLAudioElement>>('previewAudio');
    protected readonly previewMedia = computed(() => this.previewAudio()?.nativeElement);

    /**
     * @inheritdoc
     */
    ngOnDestroy(): void {
        this.stopAmplitudePolling();

        if (this.isRecording()) {
            CorePromiseUtils.ignoreErrors(NativeAudioRecorder.cancelRecording());
        }
        this.clearPreview();
    }

    /**
     * Start recording.
     */
    async startRecording(): Promise<void> {
        try {
            await this.prepareMicrophoneAuthorization();
            await NativeAudioRecorder.startRecording();

            this.status.set('recording-ongoing');
            this.startAmplitudePolling();
        } catch (error) {
            CoreAlerts.showError(error as CoreAnyError);
        }
    }

    /**
     * Stop recording.
     */
    async stopRecording(): Promise<void> {
        try {
            this.stopAmplitudePolling();
            const result = await NativeAudioRecorder.stopRecording();

            this.recording = await this.buildRecording(result);

            this.recordingUrl.set(this.setRecordingSrc(result));

            this.status.set('done');
        } catch (error) {
            CoreAlerts.showError(error as CoreAnyError);
        }
    }

    /**
     * Pause recording.
     */
    async pauseRecording(): Promise<void> {
        try {
            await NativeAudioRecorder.pauseRecording();

            this.stopAmplitudePolling();
            this.status.set('recording-paused');
        } catch (error) {
            CoreAlerts.showError(error as CoreAnyError);
        }
    }

    /**
     * Resume recording.
     */
    async resumeRecording(): Promise<void> {
        try {
            await NativeAudioRecorder.resumeRecording();

            this.status.set('recording-ongoing');
            this.startAmplitudePolling();
        } catch (error) {
            CoreAlerts.showError(error as CoreAnyError);
        }
    }

    /**
     * Discard recording.
     */
    discardRecording(): void {
        this.recording = null;
        this.recordingUrl.set(null);
        this.status.set('empty');
        this.clearPreview();
    }

    /**
     * Dismiss modal without a result.
     */
    async cancel(): Promise<void> {
        if (this.isRecording()) {
            await CorePromiseUtils.ignoreErrors(NativeAudioRecorder.cancelRecording());
        }

        this.close(new CoreCaptureError(CAPTURE_ERROR_NO_MEDIA_FILES));
    }

    /**
     * Dismiss the modal with the current recording as a result.
     */
    async submit(): Promise<void> {
        if (!this.recording) {
            return;
        }

        this.close(this.recording);
    }

    /**
     * Check whether there is an ongoing or paused recording.
     *
     * @returns Whether there is an ongoing or paused recording.
     */
    protected isRecording(): boolean {
        return this.status() === 'recording-ongoing' || this.status() === 'recording-paused';
    }

    /**
     * Make sure that microphone usage has been authorized.
     */
    protected async prepareMicrophoneAuthorization(): Promise<void> {
        const { recordAudio } = await NativeAudioRecorder.checkPermissions();

        if (recordAudio === 'granted') {
            return;
        }

        const { recordAudio: requestedStatus } = await NativeAudioRecorder.requestPermissions();

        if (requestedStatus !== 'granted') {
            throw new Error(Translate.instant('core.fileuploader.microphonepermissiondenied'));
        }
    }

    /**
     * Build the recording file from the native plugin result.
     *
     * @param result Stop recording result.
     * @returns Recording file.
     */
    protected async buildRecording(result: StopRecordingResult): Promise<CoreFileUploaderAudioRecording> {
        if (result.blob) {
            const type = result.blob.type.split(';')[0];
            const extension = CoreMimetype.getExtension(type) ?? 'weba';
            const fileName = await CoreFile.getUniqueNameInFolder(CoreFileProvider.TMPFOLDER, `recording.${extension}`);
            const filePath = CorePath.concatenatePaths(CoreFileProvider.TMPFOLDER, fileName);
            const fileEntry = await CoreFile.writeFile(filePath, result.blob);

            return {
                name: fileEntry.name,
                fullPath: fileEntry.toURL(),
                type,
                duration: result.duration,
            };
        }

        if (!result.uri) {
            throw new CoreCaptureError(CAPTURE_ERROR_NO_MEDIA_FILES);
        }

        // Native platforms already persist the recording to a file, no need to copy it here.
        const fullPath = CoreFileUtils.convertToFileUrl(result.uri);
        const name = fullPath.split('/').pop() ?? 'recording';

        return {
            name,
            fullPath,
            type: CoreMimetype.getMimeType(CoreMimetype.getFileExtension(name)) ?? 'audio/mp4',
            duration: result.duration,
        };
    }

    /**
     * Build a URL to preview the recording.
     *
     * @param result Stop recording result.
     * @returns URL to preview the recording, or null if not available.
     */
    protected setRecordingSrc(result: StopRecordingResult): string | null {
        let url = '';
        if (result.blob) {
            url = this.createPreviewUrl(result.blob);
        } else if (result.uri) {
            url = CoreFile.convertFileSrc(result.uri);
        }

        return url || null;
    }

    /**
     * Create a preview URL, releasing the previous one first.
     *
     * @param blob Blob to preview.
     * @returns Object URL for the preview.
     */
    protected createPreviewUrl(blob: Blob): string {
        this.revokePreviewUrl();
        this.previewObjectUrl = URL.createObjectURL(blob);

        return this.previewObjectUrl;
    }

    /**
     * Clear the preview and release its object URL.
     */
    protected clearPreview(): void {
        this.previewMedia()?.pause();
        this.previewMedia()?.removeAttribute('src');
        this.previewMedia()?.load();
        this.recordingUrl.set(null);
        this.revokePreviewUrl();
    }

    /**
     * Revoke the current preview URL.
     */
    protected revokePreviewUrl(): void {
        if (!this.previewObjectUrl) {
            return;
        }

        URL.revokeObjectURL(this.previewObjectUrl);
        delete this.previewObjectUrl;
    }

    /**
     * Start polling the microphone amplitude to feed the histogram.
     */
    protected startAmplitudePolling(): void {
        this.stopAmplitudePolling();

        this.amplitudePolling = window.setInterval(async () => {
            const { value } = await NativeAudioRecorder.getCurrentAmplitude();

            this.amplitude.set(value);
        }, CoreFileUploaderAudioRecorderComponent.AMPLITUDE_POLL_INTERVAL);
    }

    /**
     * Stop polling the microphone amplitude.
     */
    protected stopAmplitudePolling(): void {
        if (this.amplitudePolling === undefined) {
            return;
        }

        window.clearInterval(this.amplitudePolling);
        this.amplitudePolling = undefined;
        this.amplitude.set(0);
    }

}
