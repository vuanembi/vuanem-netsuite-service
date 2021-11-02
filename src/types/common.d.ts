export type PromiseSideEffect<O,T> = (options: O) => Promise<[unknown | null, T | null]>;
