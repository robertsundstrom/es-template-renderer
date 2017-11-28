define(["require", "exports", "./templating"], function (require, exports, templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const elem = document.getElementById('target');
    const model = {
        description: 'Whats up',
        greet: (name) => `Hello, ${name}!`,
        title: 'Hey!'
    };
    templating_1.bind(elem, model);
});
//# sourceMappingURL=app.js.map