// @ts-check

import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const recommended = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
)

export default [
    ...recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
        },
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
        },
    },
]
