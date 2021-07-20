import { schedule, danger } from 'danger';
import {
    checkForRelease,
    checkForNewDependencies,
    checkForLockfileDiff,
    checkForTypesInDeps
} from 'danger-plugin-yarn';

schedule(async () => {
    const packageDiff = await danger.git.JSONDiffForFile("package.json")
    checkForRelease(packageDiff)
    checkForNewDependencies(packageDiff)
    checkForLockfileDiff(packageDiff)
    checkForTypesInDeps(packageDiff)
  })