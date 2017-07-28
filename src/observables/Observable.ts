import { DependencyTracker } from "./DependencyTracker";
import EventEmitter from "./EventEmitter";

export class Observable<T> extends EventEmitter {
    private currentValue: T;

    constructor(value?: T) {
        super();

        if (typeof value !== "undefined") {
            this.currentValue = value;
        }
    }

    public get() {
        if (DependencyTracker.isTracking) {
            DependencyTracker.registerDependency(this);
        }
        return this.currentValue;
    }
    public set(value: T) {
        const oldValue = this.currentValue;
        const newValue = value;
        this.currentValue = newValue;
        this.emit("change", newValue, oldValue);
    }
}
