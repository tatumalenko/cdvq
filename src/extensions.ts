/* eslint-disable func-names */
/* eslint-disable no-extend-native */
export { };

declare global {
    interface Array<T> {
        flatMap<E>(this: T[], mapper: (element: T) => E[]): E[];
        first(this: T[], filter?: (element: T) => Boolean): T | undefined;
        last(this: T[]): T | undefined;
        includesAny(this: T[], of: T[]): Boolean
    }
}

Array.prototype.flatMap = function<T, E> (this: T[], mapper: (element: T) => E[]): E[] {
    let array: E[] = [];
    for (const e of this) {
        array = array.concat(mapper(e));
    }
    return array;
};

Array.prototype.first = function<T> (this: T[], filter?: (element: T) => Boolean): T | undefined {
    const results = this.filter((e: T) => {
        if (filter) {
            return filter(e);
        }
        return true;
    });
    return results.length > 0 ? results[0] : undefined;
};

Array.prototype.last = function<T> (this: T[]): T | undefined {
    const size = this.length;
    if (size > 0) {
        return this[size - 1];
    }
    return undefined;
};

Array.prototype.includesAny = function<T> (this: T[], of: T[]): Boolean {
    return this.some((e) => of.includes(e));
};
