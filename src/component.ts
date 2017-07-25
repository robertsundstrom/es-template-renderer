import { Computed, track } from "./observable";
import { defaultBindingHandler, ITemplateContext, render as rt } from "./templating";

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

const javaScriptAssignmentTarget2 = /^([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)$/;

const createComputed = (expr: string, context: any) =>
    new Computed(
        new Function("context", `with(context) { return ${expr}; }`)
            .bind(context, context));

export const renderTemplate = async (component: HTMLElement) => {
    const shadow = component.attachShadow({mode: "open"});
    const element2 = document.createElement("div");
    const element = document.createElement("div");
    element2.appendChild(element);

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
            const results = /\(([^}]*)\)/g.exec(attr.localName!)!;
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
            const results = /\$\(([^}]*)\)/g.exec(attr.localName!)!;
            if (results && results.length > 1) {
                const eventName = results[1];
                button.addEventListener(eventName, (ev) => {
                    ctx.data[attr.value](ev);
                });
            }
        }
    }

    shadow.appendChild(element2);
};

export function customElement(name: string) {
    return (target: any) => {
        customElements.define(name, target);
    };
}

export function attribute(name?: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const constructor = target.constructor;
        if (!("observedAttributes" in constructor)) {
            constructor.observedAttributes = [];
        }
        let attr = "";
        if (typeof name !== "undefined") {
            attr = name;
        } else {
            attr = key;
        }
        constructor.observedAttributes.push(attr);

        if (!("attributeChangedCallback" in target)) {
            target.attributeChangedCallback = (attr: any, oldValue: any, newValue:
                any) => {
                if ("onAttributeChanged" in target) {
                    target.onAttributeChanged(attr, oldValue, newValue);
                }
                target[key] = newValue;
            };
        }
    };
}
