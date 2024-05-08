module.exports = {
    preset: "ts-jest",
    collectCoverage: true,
    projects: [
        {
            displayName: "dom",
            testEnvironment: "jsdom", // runs tests in a browser-like environment
            testMatch: [
                "**/test/**/*.test.js?(x)",
                "**/test/**/*.test.dom.js?(x)",
            ],
        },
        {
            displayName: "node",
            testEnvironment: "node", // runs tests in a Node.js environment
            testMatch: [
                "**/test/**/*.test.js?(x)",
                "**/test/**/*.test.node.js?(x)",
            ],
        },
    ],
};
