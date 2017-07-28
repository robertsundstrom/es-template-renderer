import { DependencyTracker } from "./DependencyTracker";
import EventEmitter from "./EventEmitter";
import { IObservable } from "./IObservable";

export class Computed<T> extends EventEmitter implements IObservable<T> {
    private func: () => T;
    private currentValue: T;
    private dependencies: Array<IObservable<T>>;

    constructor(func: () => T) {
        super();
        this.func = func;
    }

    public get() {
        if (DependencyTracker.isTracking) {
            DependencyTracker.registerDependency(this);
        }
        return this.currentValue;
    }
    public set(value: T) {
        this.update();
    }

    public dispose() {
        for (const depedendency of this.dependencies) {
            depedendency.removeEventListener("change", this.dependencyChangedHandler);
        }
    }

    public init() {
        this.dependencies = DependencyTracker.detectDependencies(async () => {
            await this.func();
            this.update();
        });
        for (const depedendency of this.dependencies) {
            depedendency.addEventListener("change", this.dependencyChangedHandler.bind(this));
        }
    }

    private update() {
        const oldValue = this.currentValue;
        const newValue = this.func();
        this.currentValue = newValue;
        this.emit("change", newValue, oldValue);
    }

    private dependencyChangedHandler() {
        this.update();
    }
}

