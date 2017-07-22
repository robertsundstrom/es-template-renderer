import {  bindExpression, bindTemplate } from "./templating";

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

const customBindingHandler = (target: Element, expr: string, context: any) => {
    bindExpression(customEvaluator, target, expr, context);
    console.log("Handling expression:", expr);
};

export const myBinder = (elem: Element, data: any) => bindTemplate(elem!, data, customBindingHandler);
