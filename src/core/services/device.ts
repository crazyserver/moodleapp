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
import { DeviceId, DeviceInfo, Device as DeviceService } from '@capacitor/device';

/**
 * Service wrapping the Device plugin.
 *
 * @deprecated since 6.0 Not to be used anymore.
 */
@Injectable({ providedIn: 'root' })
export class Device {

    /**
     * Get the version of Cordova running on the device.
     *
     * @deprecated since 6.0. Cordova is not available anymore.
     */
    cordova = 'Cordova is not available anymore.';

    /**
     * The device.model returns the name of the device's model or product. The value is set
     * by the device manufacturer and may be different across versions of the same product.
     *
     * @deprecated since 6.0 Use getInfo().model.
     */
    model = '';

    /**
     * Get the device's operating system name.
     *
     * @deprecated since 6.0 Use getInfo().platform.
     */
    platform = '';

    /**
     * Get the device's Universally Unique Identifier (UUID).
     *
     * @deprecated since 6.0 Use getId().identifier.
     */
    uuid = '';

    /**
     * Get the operating system version.
     *
     * @deprecated since 6.0 Use getInfo().osVersion.
     */
    version = '';

    /**
     * Get the device's manufacturer.
     *
     * @deprecated since 6.0 Use getInfo().manufacturer.
     */
    manufacturer = '';

    /**
     * Whether the device is running on a simulator.
     *
     * @deprecated since 6.0 Use getInfo().isVirtual.
     */
    isVirtual = false;

    /**
     * Get the device hardware serial number.
     *
     * @deprecated since 6.0 Use getInfo().serial.
     */
    serial = '';

    /**
     * Get the Android device's SDK version. (Android-only)
     *
     * @deprecated since 6.0 Use getInfo().androidSDKVersion.
     */
    sdkVersion?: string;

    /**
     * Detect if app is running on a macOS desktop with Apple Silicon.
     *
     * @deprecated since 6.0 Use getInfo().operatingSystem and compare to 'mac'.
     */
    isiOSAppOnMac = 'false';

    constructor() {
        this.initialize();
    }

    async initialize(): Promise<void> {
        try {
            const info = await DeviceService.getInfo();

            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.model = info.model;
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.platform = info.platform;
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.version = info.osVersion;
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.manufacturer = info.manufacturer;
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.isVirtual = info.isVirtual;
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.sdkVersion = info.androidSDKVersion?.toString();
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.isiOSAppOnMac = (info.operatingSystem === 'mac').toString();
        } catch {
            // Ignore errors.
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            this.uuid = (await DeviceService.getId()).identifier;
        } catch {
            // Ignore errors.
        }
    }

    /**
     * Proxy of getInfo method of Device plugin.
     *
     * @returns Promise with device information.
     */
    async getInfo(): Promise<DeviceInfo> {
        return DeviceService.getInfo();
    }

    /**
     * Proxy of getId method of Device plugin.
     *
     * @returns Promise with device identifier.
     */
    async getId(): Promise<DeviceId> {
        return DeviceService.getId();
    }

}
