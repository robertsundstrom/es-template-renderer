import EventEmitter from "./EventEmitter";
import { IObservable } from "./IObservable";

export class ObservableArray<T>
    extends Array<T>
    implements IObservable<T> {
    private events: any;
    constructor(...items: T[]) {
        super(...items);

        this.events = {};

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ObservableArray.prototype);
    }

    public push(...items: T[]): number {
        const r = super.push(...items);
        this.emit("change", { added: items });
        return r;
    }

    public pop(): T | undefined {
        const r = super.pop();
        this.emit("change", { removed: [ r ] });
        return r;
    }

    // #region EventEmitter

    public on(event: string, listener: (args?: any) => void) {
        this.addEventListener(event, listener);
    }

    public addEventListener(event: string, listener: (args?: any) => void) {
        if (typeof this.events[event] !== "object") {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    public removeEventListener(event: string, listener: () => void) {
        let idx;
        if (typeof this.events[event] === "object") {
            idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    public emit(event: string, ...args: any[]) {
        if (typeof this.events[event] === "object") {
            const listeners = this.events[event].slice();
            const length = listeners.length;
            for (let i = 0; i < length; i++) {
                listeners[i](...args);
            }
        }
    }
    public once(event: string, listener: (args?: any) => any) {
        const g = () => {
            this.removeEventListener(event, g);
        };
        this.on(event, g);
    }

    // #endregion
}
