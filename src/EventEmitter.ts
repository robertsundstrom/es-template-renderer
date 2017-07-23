export default class EventEmitter {
    private events: any;
    constructor() {
        this.events = {};
    }
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
}
