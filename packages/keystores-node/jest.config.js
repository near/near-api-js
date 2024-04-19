module.exports = {
    preset: "ts-jest",
    collectCoverage: true,
    projects: [
        {
            displayName: "dom",
            testEnvironment: "jsdom",
            testMatch: [
                "**/test/**/*.test.js?(x)",
                "**/test/**/*.test.dom.js?(x)",
            ],
        },
        {
            displayName: "node",
            testEnvironment: "node",
            testMatch: [
                "**/test/**/*.test.js?(x)",
                "**/test/**/*.test.node.js?(x)",
            ],
        },
    ],
};
