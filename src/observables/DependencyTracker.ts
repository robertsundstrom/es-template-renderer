import EventEmitter from "./EventEmitter";
import { IObservable } from "./IObservable";

export interface IDependencyFrame {
    dependencies: Array<IObservable<any>>;
}

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

    public static registerDependency(dependency: IObservable<any>) {
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
