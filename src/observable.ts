import EventEmitter from "./EventEmitter";
import { defaultEvaluator, ITemplateContext, render } from "./templating";

const propsKey = "__props__";

export function getProperty<T>(obj: any, name: string): undefined | undefined {
    let props = obj[propsKey];
    if (!props) {
        props = obj[propsKey] = {};
    }
    if (name in props) {
        return obj[name];
    }
    return undefined;
}

export function defineProperty<T>(obj: any, name: string, value?: T): Observable<T> {
    let props = obj[propsKey];
    if (!props) {
        props = obj[propsKey] = {};
    }
    if (name in props) {
        throw new Error(`The property "${name}" has already been defined.`);
    }
    const observable = new Observable<T>(value);
    delete obj[name];
    Object.defineProperty(obj, name, {
        get: () => {
            return props[name].get();
        },
        set: (v) => {
            props[name].set(v);
        },
    });
    props[name] = observable;
    return observable;
}

export const evaluate = (expr: string, context: any) => {
    return defaultEvaluator(expr, context);
};

// tslint:disable-next-line:no-empty-interface
export interface IObservable<T> extends EventEmitter {
    get(): T;
    set(value: T): void;
}

export class Observable<T> extends EventEmitter implements IObservable<T> {
    private currentValue: T;

    constructor(value?: T) {
        super();
        if (typeof value !== "undefined") {
            this.currentValue = value;
        }
    }

    public get() {
        if (DependencyTracker.isTracking) {
            DependencyTracker.registerDependenc(this);
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

export interface IDependencyFrame {
    dependencies: Array<IObservable<any>>;
}

// tslint:disable-next-line:max-classes-per-file
export class DependencyTracker {
    public static isTracking: boolean = false;

    public static detectDependencies(context: () => void): Array<IObservable<any>> {
        DependencyTracker.pushFrame();
        DependencyTracker.isTracking = true;
        context();
        DependencyTracker.isTracking = false;
        const frame = DependencyTracker.popFrame()!;
        return frame.dependencies;
    }

    public static registerDependenc(dependency: IObservable<any>) {
        DependencyTracker.currentFrame.dependencies.push(dependency);
    }

    private static frames: IDependencyFrame[] = [];

    private static get currentFrame() {
        const frames = DependencyTracker.frames;
        return frames[frames.length - 1];
    }

    private static pushFrame(): IDependencyFrame {
        const frame: IDependencyFrame = { dependencies: [] };
        DependencyTracker.frames.push(frame);
        return frame;
    }

    private static popFrame() {
        return DependencyTracker.frames.pop();
    }
}

// tslint:disable-next-line:max-classes-per-file
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
            DependencyTracker.registerDependenc(this);
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

export const track = (obj: any) => {
    for (const key of Object.getOwnPropertyNames(obj)) {
        if (key) {
            const value = obj[key];
            if (typeof value === "function") {
                continue;
            } else {
                const prop = getProperty(obj, key);
                if (!prop) {
                    defineProperty(obj, key, value);
                }
            }
        }
    }
    return obj;
};
