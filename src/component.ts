import { renderTemplate } from "./templating";

export const loadTemplate = (url: string) => {
    return fetch(url).then((x) => {
        const div = document.createElement("div");
        div.innerHTML = x.body;
        return div.childNodes.item(0) as Element;
    });
};

export class Component {
    public element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    public async attach() {
        const template = await loadTemplate(this.__proto__.constructor.template);
        const ctx = renderTemplate(this.element, template, this);
    }
    public detach() {
        this.element.parentElement!.removeChild(this.element);
    }
}

export function renderComponent(element: Element, type: typeof Component) {
    const component = new type(element);
    component.attach();
}