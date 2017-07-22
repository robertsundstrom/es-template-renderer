import { defaultEvaluator, renderTemplate } from "./templating";

const template = document.getElementById("template");
const target = document.getElementById("target");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

const updateBinding = (elem: Element, expr: string, context: any) => {
    elem.innerHTML = defaultEvaluator(expr, context);
};

const ctxt = renderTemplate(target!, template!, model);
for (const { elem, expr, context } of ctxt.bindings) {
    // Update binding
    updateBinding(elem, expr, context.data);
}
