'use strict';

import BN from 'bn.js';

/// Finds seat price.
/// Calculation follow the spec: https://nomicon.io/Economics/README.html#validator-selection
export function findSeatPrice(validators: any, numSeats: number): BN {
    let stakes = validators.map((v) => new BN(v.stake, 10)).sort((a, b) => a.cmp(b));
    let num = new BN(numSeats);
    let stakesSum = stakes.reduce((a, b) => a.add(b));
    if (stakesSum < numSeats) {
        throw "Stakes are below seats";
    }
    // assert stakesSum >= numSeats
    let left = new BN(1), right = stakesSum.add(new BN(1));
    while (!left.eq(right.sub(new BN(1)))) {
        const mid = left.add(right).div(new BN(2));
        let found = false;
        let currentSum = new BN(0);
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

