import { ObservableArray } from "./observables/Array";

const a = new ObservableArray<number>();
a.on("change", console.log);

a.push(42, 3, 4);
