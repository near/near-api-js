export default {
    preset: 'ts-jest',
    collectCoverage: true,
    testEnvironment: 'node',
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', {
            tsconfig: {
               allowJs: true
            }
        }]
    },
};
