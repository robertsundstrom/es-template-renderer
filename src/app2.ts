import { defaultEvaluator, render } from "./templating";

const template = document.getElementById("template");
const target = document.getElementById("target");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

const ctxt = render(target!, template!, model);

model.description = "Test";

setTimeout(() => {
    const updateBinding = (elem: Element, expr: string, context: any) => {
        elem.innerHTML = defaultEvaluator(expr, context);
    };
    for (const { elem, expr, context } of ctxt.placeholders) {
        // Update binding
        updateBinding(elem, expr, context.data);
    }
}, 2000);
