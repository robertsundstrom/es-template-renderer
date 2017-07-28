import { defaultEvaluator, ITemplateContext, render } from "../templating";
import { ObservableArray } from "./Array";
import EventEmitter from "./EventEmitter";
import { IObservable } from "./IObservable";
import { Observable } from "./Observable";

export { Observable } from "./Observable";
export { Computed } from "./Computed";

const propsKey = "__props__";

export function getProperty<T>(obj: any, name: string): IObservable<T> | undefined {
    let props = obj[propsKey];
    if (!props) {
        props = obj[propsKey] = {};
    }
    if (name in props) {
        return props[name];
    }
    return undefined;
}

export function defineProperty<T>(obj: any, name: string, value?: T): IObservable<T> {
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

export const track = (obj: any) => {
    for (const key of Object.keys(obj)) {
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
}
