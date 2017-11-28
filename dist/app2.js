define(["require", "exports", "./templating"], function (require, exports, templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const template = document.getElementById('template');
    const target = document.getElementById('target');
    const model = {
        description: 'Whats up',
        greet: (name) => `Hello, ${name}!`,
        title: 'Hey!'
    };
    const ctxt = templating_1.render(target, template, model);
    model.description = 'Test';
    setTimeout(() => {
        const updateBinding = (elem, expr, context) => {
            elem.innerHTML = templating_1.defaultEvaluator(expr, context);
        };
        for (const { elem, expr, context } of ctxt.placeholders) {
            updateBinding(elem, expr, context.data);
        }
    }, 2000);
});
//# sourceMappingURL=app2.js.map