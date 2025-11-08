import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

const commonRules = {
    indent: ["error", 4, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-console": "off",
    "object-curly-spacing": ["error", "always"],
};

export default [
    {
        ignores: [
            "**/lib/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/*.d.ts",
            "**/test/**",
        ],
    },
    js.configs.recommended,
    {
        files: ["**/src/**/*.{js,cjs,mjs}"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                Bun: "readonly",
            },
        },
        rules: commonRules,
    },
    {
        files: ["**/src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                Bun: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...commonRules,
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-empty-object-type": "off",
        },
    },
];
