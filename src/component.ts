import { defaultBindingHandler, renderTemplate } from "./templating";

export const loadTemplate = (url: string) => {
    return fetch(url).then(async (response) => {
        const div = document.createElement("div");
        div.innerHTML = await response.text();
        return div.childNodes[0] as Element;
    });
};

export const template = (path: string) => {
    return (target: any) => {
        target.template = path;
    };
};

export class Component {
    public element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    public async attach() {
        const template = await loadTemplate(this.__proto__.constructor.template);
        const ctx = renderTemplate(this.element, template, this, (elem, expr, context) => {
            defaultBindingHandler(elem, expr, context);
        }));
    }
    public detach() {
        this.element.parentElement!.removeChild(this.element);
    }
}

export function renderComponent(element: Element, type: typeof Component) {
    const component = new type(element);
    component.attach();
}