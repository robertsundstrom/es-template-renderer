import { component, renderComponent, template, components } from "./Component";

@component()
@template("./Foo.html")
export class Foo {
    // public static template: string = "./Foo.html";

    private static times = 0;

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

    public test(ev: Event) {
        console.log(ev);
        this.lastName = "Boo";
    }

    public attach() {
        console.log("Component attached.");

        setTimeout(() => {
            this.firstName = `Component #${++Foo.times}`;
        }, 2000);
    }

    public detach() {
        console.log("Component detached.");
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        console.log(mutation);
        for (const node of Array.from(mutation.addedNodes)) {
            // console.log(node);
            if (node.localName && node.localName in components) {
                console.log(node.localName);
                renderComponent(node as any);
            }
        }
    }
    return true;
});
observer.observe(document, {
    childList: true, // report added/removed nodes
    subtree: true,   // observe any descendant elements
});

document.body.appendChild(document.createElement("foo"));
