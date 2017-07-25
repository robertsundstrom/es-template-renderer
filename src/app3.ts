import { attribute, customElement, renderTemplate, template } from "./Component";

@customElement("foo-element")
@template("./Foo.html")
export class Foo extends HTMLElement {
    // public static template: string = "./Foo.html";

    static get observedAttributes() {return ["firstname", "lastname"]; }

    private static times = 0;

    public firstname: string;
    public lastname: string;

    constructor() {
        super();

        this.firstname = "Foo";
        this.lastname = "Bar";

        renderTemplate(this);
    }

    public get fullName() {
        return `${this.firstname} ${this.lastname}`;
    }

    public test(ev: Event) {
        console.log(ev);
        this.lastname = "Boo";
    }

    private connectedCallback() {
        console.log("Connected");
    }

    private disconnectedCallback() {
        console.log("Disconnected");
    }

    private attributeChanged (attr: any, oldValue: any, newValue: any) {
        this[attr] = newValue;
        /*
        this.__props_[attr].on("change", (newValue: any) => {
            let attr = this.attributes.getNamedItem(attr);
            attr.value = newValue;
        });
        */
        if ("onAttributeChanged" in this) {
            this.onAttributeChanged(attr, oldValue, newValue);
        }
    }
}

