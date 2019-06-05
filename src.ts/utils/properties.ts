
/// Returns a promise that contains all properties of given object resolved.
export function resolveProperties(object: any): Promise<any> {
    let result: any = {};

    let promises: Array<Promise<void>> = [];
    Object.keys(object).forEach((key) => {
        let value = object[key];
        if (value instanceof Promise) {
            promises.push(value.then((value) => { result[key] = value; return null; }));
        } else {
            result[key] = value;
        }
    });
    
    return Promise.all(promises).then(() => { return result; });
}
