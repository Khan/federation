"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.findAndExtract = exports.compactMap = void 0;
function isNotNullOrUndefined(value) {
    return value !== null && typeof value !== 'undefined';
}
function compactMap(array, callbackfn) {
    return array.reduce((accumulator, element, index, array) => {
        const result = callbackfn(element, index, array);
        if (isNotNullOrUndefined(result)) {
            accumulator.push(result);
        }
        return accumulator;
    }, []);
}
exports.compactMap = compactMap;
function findAndExtract(array, predicate) {
    const index = array.findIndex(predicate);
    if (index === -1)
        return [undefined, array];
    let remaining = array.slice(0, index);
    if (index < array.length - 1) {
        remaining.push(...array.slice(index + 1));
    }
    return [array[index], remaining];
}
exports.findAndExtract = findAndExtract;
function groupBy(keyFunction) {
    return (iterable) => {
        const result = new Map();
        for (const element of iterable) {
            const key = keyFunction(element);
            const group = result.get(key);
            if (group) {
                group.push(element);
            }
            else {
                result.set(key, [element]);
            }
        }
        return result;
    };
}
exports.groupBy = groupBy;
//# sourceMappingURL=array.js.map