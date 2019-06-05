"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// Returns a promise that contains all properties of given object resolved.
function resolveProperties(object) {
    var result = {};
    var promises = [];
    Object.keys(object).forEach(function (key) {
        var value = object[key];
        if (value instanceof Promise) {
            promises.push(value.then(function (value) { result[key] = value; return null; }));
        }
        else {
            result[key] = value;
        }
    });
    return Promise.all(promises).then(function () { return result; });
}
exports.resolveProperties = resolveProperties;
