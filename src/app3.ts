import { Component, renderComponent } from "./Component";

export class Foo extends Component {
    public static template: string = "./Foo.html";

    constructor(element: Element) {
        super(element);
    }
}

renderComponent(document.getElementById("foo")!, Foo);
