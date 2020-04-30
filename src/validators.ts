'use strict';

import BN from 'bn.js';
import { CurrentEpochValidatorInfo, NextEpochValidatorInfo } from './providers/provider';

/** Finds seat price given validators stakes and number of seats.
 *  Calculation follow the spec: https://nomicon.io/Economics/README.html#validator-selection
 * @params validators: current or next epoch validators.
 * @params numSeats: number of seats.
 */
export function findSeatPrice(validators: (CurrentEpochValidatorInfo | NextEpochValidatorInfo)[], numSeats: number): BN {
    const stakes = validators.map(v => new BN(v.stake, 10)).sort((a, b) => a.cmp(b));
    const num = new BN(numSeats);
    const stakesSum = stakes.reduce((a, b) => a.add(b));
    if (stakesSum.lt(num)) {
        throw new Error('Stakes are below seats');
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

export interface ChangedValidatorInfo {
    current: CurrentEpochValidatorInfo;
    next: NextEpochValidatorInfo;
}

export interface EpochValidatorsDiff {
    newValidators: NextEpochValidatorInfo[];
    removedValidators: CurrentEpochValidatorInfo[];
    changedValidators: ChangedValidatorInfo[];
}

/** Diff validators between current and next epoch.
 * Returns additions, subtractions and changes to validator set.
 * @params currentValidators: list of current validators.
 * @params nextValidators: list of next validators.
 */
export function diffEpochValidators(currentValidators: CurrentEpochValidatorInfo[], nextValidators: NextEpochValidatorInfo[]): EpochValidatorsDiff {
    const validatorsMap = new Map<string, CurrentEpochValidatorInfo>();
    currentValidators.forEach(v => validatorsMap.set(v.account_id, v));
    const nextValidatorsSet = new Set(nextValidators.map(v => v.account_id));
    return { 
        newValidators: nextValidators.filter(v => !validatorsMap.has(v.account_id)),
        removedValidators: currentValidators.filter(v => !nextValidatorsSet.has(v.account_id)), 
        changedValidators: nextValidators.filter(v => (validatorsMap.has(v.account_id) && validatorsMap.get(v.account_id).stake != v.stake))
            .map(v => ({ current: validatorsMap.get(v.account_id), next: v }))
    };
}
