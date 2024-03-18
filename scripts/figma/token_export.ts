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

import { GetLocalVariablesResponse, LocalVariable, RGB, RGBA } from '@figma/rest-api-spec';
import { Token, TokensFile } from './token_types.js';

export class FigmaTokenExport {

    /**
     * Convert a Figma variable type to a token type.
     *
     * @param variable The Figma variable.
     * @returns The token type.
     */
    protected static tokenTypeFromVariable(variable: LocalVariable): 'string' | 'boolean' | 'color' | 'number' {
        switch (variable.resolvedType) {
            case 'BOOLEAN':
                return 'boolean';
            case 'COLOR':
                return 'color';
            case 'FLOAT':
                return 'number';
            case 'STRING':
                return 'string';
        }
    }

    /**
     * Convert an RGB or RGBA object to a hex string.
     *
     * @param rgb The RGB or RGBA object.
     * @returns The hex string.
     */
    protected static rgbToHex({ r, g, b, ...rest }: RGB | RGBA): string {
        const a = 'a' in rest ? rest.a : 1;

        const toHex = (value: number) => {
            const hex = Math.round(value * 255).toString(16);

            return hex.length === 1 ? '0' + hex : hex;
        };

        const hex = [toHex(r), toHex(g), toHex(b)].join('');

        return `#${hex}` + (a !== 1 ? toHex(a) : '');
    }

    /**
     * Convert a Figma variable value to a token value.
     *
     * @param variable The Figma variable.
     * @param modeId The mode ID.
     * @param localVariables The local variables.
     * @returns The token value.
     */
    protected static tokenValueFromVariable(
        variable: LocalVariable,
        modeId: string,
        localVariables: { [id: string]: LocalVariable },
    ): string | number | boolean {
        const value = variable.valuesByMode[modeId];

        if (typeof value === 'object') {
            if ('type' in value && value.type === 'VARIABLE_ALIAS') {
                const aliasedVariable = localVariables[value.id];

                return `{${aliasedVariable.name.replace(/\//g, '.')}}`;
            } else if ('r' in value) {
                return FigmaTokenExport.rgbToHex(value);
            }

            throw new Error(`Format of variable value is invalid: ${value}`);
        }

        return value;
    }

    /**
     * Generate tokens files from local variables.
     *
     * @param localVariablesResponse The local variables response.
     * @returns The tokens files.
     */
    static tokenFilesFromLocalVariables(localVariablesResponse: GetLocalVariablesResponse): { [fileName: string]: TokensFile }{
        const tokenFiles: { [fileName: string]: TokensFile } = {};
        const localVariableCollections = localVariablesResponse.meta.variableCollections;
        const localVariables = localVariablesResponse.meta.variables;

        Object.values(localVariables).forEach((variable) => {
            // Skip remote variables because we only want to generate tokens for local variables
            if (variable.remote) {
                return;
            }

            const collection = localVariableCollections[variable.variableCollectionId];

            collection.modes.forEach((mode) => {
                const fileName = `${collection.name}.${mode.name}.json`;

                if (!tokenFiles[fileName]) {
                    tokenFiles[fileName] = {};
                }

                let obj = tokenFiles[fileName];

                variable.name.split('/').forEach((groupName) => {
                    obj[groupName] = obj[groupName] || {};
                    obj = obj[groupName] as TokensFile;
                });

                const token: Token = {
                    $type: FigmaTokenExport.tokenTypeFromVariable(variable),
                    $value: FigmaTokenExport.tokenValueFromVariable(variable, mode.modeId, localVariables),
                    $description: variable.description,
                    $extensions: {
                    'com.figma': {
                        hiddenFromPublishing: variable.hiddenFromPublishing,
                        scopes: variable.scopes,
                        codeSyntax: variable.codeSyntax,
                    },
                    },
                };

                Object.assign(obj, token);
            });
        });

        return tokenFiles;
    }

}
