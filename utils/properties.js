"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// Returns a promise that contains all properties of given object resolved.
function resolveProperties(object) {
    let result = {};
    let promises = [];
    Object.keys(object).forEach((key) => {
        let value = object[key];
        if (value instanceof Promise) {
            promises.push(value.then((value) => { result[key] = value; return null; }));
        }
        else {
            result[key] = value;
        }
    });
    return Promise.all(promises).then(() => { return result; });
}
exports.resolveProperties = resolveProperties;
