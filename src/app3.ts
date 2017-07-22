import { renderComponent, template } from "./Component";

@template("./Foo.html")
export class Foo {
    // public static template: string = "./Foo.html";

    private element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    get name() {
        return "Foo";
    }

    public attach() {
        console.log("Component attached.");
    }

    public detach() {
        console.log("Component detached.");
    }
}

const fooComponents = document.getElementsByTagName("Foo");

for (const componentNode of Array.from(fooComponents)) {
    renderComponent(componentNode, Foo);
}
