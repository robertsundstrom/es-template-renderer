import { Component, renderComponent } from "./Component";

export class Foo extends Component {
    public static template: string = "./Foo.html";

    constructor(element: Element) {
        super(element);
    }

    get name() {
        return "Foo";
    }
}

renderComponent(document.getElementById("foo")!, Foo);
