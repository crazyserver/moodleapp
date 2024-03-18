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

import { GetLocalVariablesResponse } from '@figma/rest-api-spec';

export default class FigmaApi {

    private baseUrl = 'https://api.figma.com';

    constructor(private token: string) {
    }

    protected static async getJSON<T>(url: string, options?: RequestInit): Promise<T> {
        // 👇️ const response: Response
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        // 👇️ const result: GetUsersResponse
        const result = (await response.json()) as T;

        console.log('result is: ', JSON.stringify(result, null, 4));

        return result;

    }

    async getLocalVariables(fileKey: string): Promise<GetLocalVariablesResponse> {
        return FigmaApi.getJSON<GetLocalVariablesResponse>(
            `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
            {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': '*/*',
                'X-Figma-Token': this.token,
            },
            },
        );
    }

}
