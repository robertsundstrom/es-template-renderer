import {  process, bindExpression } from "./templating";

const cache: any = {};

const customEvaluator = (expr: string, context: any)  => {
    let f = null;
    if (expr in cache) {
        f = cache[expr];
    } else {
        f = new Function("context", `with(context) { return ${expr}; }`);
        cache[expr] = f;
    }
    return f(context);
};

const customBindingHandler = (elem: Element, expr: string, context: any) => {
    bindExpression(customEvaluator, elem, expr, context);
    // Here shorthand for: elem.innerHTML = customEvaluator(expr, context);

    console.log("Handling expression:", expr);
};

export const myBinder = (elem: Element, data: any) => process(elem!, data, customBindingHandler);
