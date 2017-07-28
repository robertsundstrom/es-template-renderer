import { attribute, customElement, renderTemplate, template } from "./Component";

@customElement("foo-element")
@template("./Foo.html")
export class Foo extends HTMLElement {
    // public static template: string = "./Foo.html";

    static get observedAttributes() {return ["firstname", "lastname"]; }

    private static times = 0;

    public firstname: string = "Foo";
    public lastname: string = "Bar";
    public counter: number = 0;

    constructor() {
        super();

        this.counter = 0;

        renderTemplate(this);
    }

    public get fullname() {
        return `${this.firstname} ${this.lastname}`;
    }

    public test(ev: Event) {
        console.log(ev);
        this.counter++;
    }

    private connectedCallback() {
        console.log("Connected");
    }

    private disconnectedCallback() {
        console.log("Disconnected");
    }

    private attributeChanged(attr: any, oldValue: any, newValue: any) {
        this[attr] = newValue;
        /*
        this.__props_[attr].on("change", (newValue: any) => {
            let attr = this.attributes.getNamedItem(attr);
            attr.value = newValue;
        });
        */
    }
}
