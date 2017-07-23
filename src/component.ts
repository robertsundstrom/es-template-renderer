import { Computed, track } from "./observable";
import { defaultBindingHandler, ITemplateContext, renderTemplate as rt } from "./templating";

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

const components: any = {};

export const component = () => {
    return (target: any) => {
        components[target.name.toLowerCase()] = target;
    };
};

const javaScriptAssignmentTarget2 = /^([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)$/;

const createComputed = (expr: string, context: any) =>
    new Computed(
        new Function("context", `with(context) { return ${expr}; }`)
            .bind(context, context));

export const attachComponent = async (element: Element, component: any) => {
    const temp = await loadTemplate(component.constructor.template);
    component = track(component);
    const ctx = rt(element, temp, component, (elem2, expr, context) => {
        const computed = createComputed(expr, context);
        computed.on("change", (newValue) => {
            elem2.innerHTML = newValue;
        });
        computed.init();
    });

    const inputs = ctx.target.getElementsByTagName("input");
    for (const input of Array.from(inputs)) {
        if (input.localName !== "input" && input.type !== "text") {
            continue;
        }
        const attrs = Array.from(input.attributes);
        for (const attr of attrs) {
            const results = /@\(([^}]*)\)/g.exec(attr.localName!)!;
            if (results && results.length > 1) {
                const expr = results[1];

                input.addEventListener("input", (ev) => {
                    ctx.data[attr.value] = input.value;
                });

                const computed = createComputed(attr.value, ctx.data);
                computed.on("change", (newValue) => {
                    input.value = newValue;
                });
                computed.init();
            }
        }
    }

    const buttons = ctx.target.getElementsByTagName("button");
    for (const button of Array.from(buttons)) {
        const attrs = Array.from(button.attributes);
        for (const attr of attrs) {
            const results = /\(([^}]*)\)/g.exec(attr.localName!)!;
            if (results && results.length > 1) {
                const eventName = results[1];
                button.addEventListener(eventName, (ev) => {
                    ctx.data[attr.value](ev);
                });
            }
        }
    }
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

export async function renderComponent(element: Element, type?: any) {
    if (typeof type === "undefined") {
        type = components[element.localName!];
    }
    let component = new type(type);
    await attachComponent(element, component);
}
