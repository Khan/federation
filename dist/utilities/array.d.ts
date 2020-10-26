export declare function compactMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U | null | undefined): U[];
export declare function findAndExtract<T>(array: T[], predicate: (element: T, index: number, array: T[]) => boolean): [T | undefined, T[]];
export declare function groupBy<T, U>(keyFunction: (element: T) => U): (iterable: Iterable<T>) => Map<U, T[]>;
//# sourceMappingURL=array.d.ts.map