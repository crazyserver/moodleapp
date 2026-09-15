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

import { Injectable } from '@angular/core';
import {
    CapacitorAudioRecorder,
    GetCurrentAmplitudeResult,
    GetRecordingStatusResult,
    PermissionStatus,
    StopRecordingResult,
} from '@capgo/capacitor-audio-recorder';
import { makeSingleton } from '@singletons';

/**
 * Service wrapping the Native Audio Recorder plugin.
 */
@Injectable({ providedIn: 'root' })
export class AudioRecorder {

    /**
     * Start recording audio using the device microphone.
     */
    async startRecording(): Promise<void> {
        await CapacitorAudioRecorder.startRecording();
    }

    /**
     * Pause the ongoing recording.
     */
    async pauseRecording(): Promise<void> {
        await CapacitorAudioRecorder.pauseRecording();
    }

    /**
     * Resume a previously paused recording.
     */
    async resumeRecording(): Promise<void> {
        await CapacitorAudioRecorder.resumeRecording();
    }

    /**
     * Stop the current recording and persist the recorded audio.
     *
     * @returns Recording metadata such as duration and URI/blob.
     */
    async stopRecording(): Promise<StopRecordingResult> {
        return CapacitorAudioRecorder.stopRecording();
    }

    /**
     * Cancel the current recording and discard any captured audio.
     */
    async cancelRecording(): Promise<void> {
        await CapacitorAudioRecorder.cancelRecording();
    }

    /**
     * Retrieve the current recording status.
     *
     * @returns Current recording status.
     */
    async getRecordingStatus(): Promise<GetRecordingStatusResult> {
        return CapacitorAudioRecorder.getRecordingStatus();
    }

    /**
     * Retrieve the current input amplitude (microphone level) normalized to the [0, 1] range.
     *
     * @returns Current amplitude.
     */
    async getCurrentAmplitude(): Promise<GetCurrentAmplitudeResult> {
        return CapacitorAudioRecorder.getCurrentAmplitude();
    }

    /**
     * Return the current permission state for accessing the microphone.
     *
     * @returns Permission status.
     */
    async checkPermissions(): Promise<PermissionStatus> {
        return CapacitorAudioRecorder.checkPermissions();
    }

    /**
     * Request permission to access the microphone.
     *
     * @returns Permission status.
     */
    async requestPermissions(): Promise<PermissionStatus> {
        return CapacitorAudioRecorder.requestPermissions();
    }

}
export const NativeAudioRecorder = makeSingleton(AudioRecorder);
