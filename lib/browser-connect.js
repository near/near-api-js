"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const near_1 = require("./near");
/**
 * Initialize connection to Near network.
 */
async function connect(config) {
    return new near_1.Near(config);
}
exports.connect = connect;
