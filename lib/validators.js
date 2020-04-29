'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
/// Finds seat price.
/// Calculation follow the spec: https://nomicon.io/Economics/README.html#validator-selection
function findSeatPrice(validators, numSeats) {
    let stakes = validators.map((v) => new bn_js_1.default(v.stake, 10)).sort((a, b) => a.cmp(b));
    let num = new bn_js_1.default(numSeats);
    let stakesSum = stakes.reduce((a, b) => a.add(b));
    if (stakesSum < numSeats) {
        throw "Stakes are below seats";
    }
    // assert stakesSum >= numSeats
    let left = new bn_js_1.default(1), right = stakesSum.add(new bn_js_1.default(1));
    while (!left.eq(right.sub(new bn_js_1.default(1)))) {
        const mid = left.add(right).div(new bn_js_1.default(2));
        let found = false;
        let currentSum = new bn_js_1.default(0);
        for (let i = 0; i < stakes.length; ++i) {
            currentSum = currentSum.add(stakes[i].div(mid));
            if (currentSum.gte(num)) {
                left = mid;
                found = true;
                break;
            }
        }
        if (!found) {
            right = mid;
        }
    }
    return left;
}
exports.findSeatPrice = findSeatPrice;
