import { schedule, danger } from 'danger';
import {
    checkForRelease,
    checkForNewDependencies,
    checkForLockfileDiff,
    checkForTypesInDeps,
    DepDuplicationCache
} from 'danger-plugin-yarn';

schedule(async () => {
    const packagePath = 'package.json';
    const packageDiff = await danger.git.JSONDiffForFile(packagePath)
    const depDuplicationCache: DepDuplicationCache = {}
    checkForRelease(packageDiff)
    checkForNewDependencies(packagePath, packageDiff, depDuplicationCache)
    checkForLockfileDiff(packageDiff)
    checkForTypesInDeps(packageDiff)
})