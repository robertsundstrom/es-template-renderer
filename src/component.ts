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

export const attachComponent = async (element: Element, component: any) => {
    const temp = await loadTemplate(component.constructor.template);
    const ctx = renderTemplate(element, temp, component, (elem2, expr, context) => {
        defaultBindingHandler(elem2, expr, context);
    });
    if ("attach" in component) {
        component.attach();
    }
};

export const detachComponent = (element: Element, component: any) => {
    element.parentElement!.removeChild(element);
    if ("detach" in component) {
        component.detach();
    }
};

export function renderComponent(element: Element, type: any) {
    const component = new type(element);
    attachComponent(element, component);
}
