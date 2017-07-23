import { component, renderComponent, template } from "./Component";

@component()
@template("./Foo.html")
export class Foo {
    // public static template: string = "./Foo.html";

    public firstName: string;
    public lastName: string;

    private element: Element;

    constructor(element: Element) {
        this.element = element;

        this.firstName = "Foo";
        this.lastName = "Bar";
    }

    public get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    public attach() {
        console.log("Component attached.");

        setTimeout(() => {
            this.firstName = "000";
        }, 3000);
    }

    public detach() {
        console.log("Component detached.");
    }
}

const fooComponents = document.getElementsByTagName("Foo");

for (const componentNode of Array.from(fooComponents)) {
    renderComponent(componentNode);
}
