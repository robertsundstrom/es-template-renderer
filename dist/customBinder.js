define(["require", "exports", "./templating"], function (require, exports, templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const cache = {};
    const customEvaluator = (expr, context) => {
        let f = null;
        if (expr in cache) {
            f = cache[expr];
        }
        else {
            f = new Function('context', `with(context) { return ${expr}; }`);
            cache[expr] = f;
        }
        return f(context);
    };
    const customBindingHandler = (elem, expr, context) => {
        templating_1.bindExpression(customEvaluator, elem, expr, context);
        console.log('Handling expression:', expr);
    };
    exports.myBinder = (elem, data) => templating_1.bind(elem, data, customBindingHandler);
});
//# sourceMappingURL=customBinder.js.map