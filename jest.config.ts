export default {
    preset: 'ts-jest',
    collectCoverage: true,
    testEnvironment: 'node',
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', {
            tsconfig: {
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                esModuleInterop: true,
                allowJs: true,
            },
            useESM: true,
        }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
