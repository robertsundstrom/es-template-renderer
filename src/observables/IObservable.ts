import EventEmitter from "./EventEmitter";

export interface IObservable<T> extends EventEmitter {
    get(): T;
    set(value: T): void;
}
