define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    String.prototype.matchAll = function (regexp) {
        const matches = [];
        this.replace(regexp, function () {
            const arr = ([]).slice.call(arguments, 0);
            const extras = arr.splice(-2);
            arr.index = extras[0];
            arr.input = extras[1];
            matches.push(arr);
        });
        return matches.length ? matches : null;
    };
    const expressionRegexp = /\${([^}]*)}/g;
    const matchExpressions = (value) => value.matchAll(expressionRegexp);
    function getExpressions(elem) {
        const result = [];
        const nodes = processNode(elem);
        if (nodes) {
            for (const node of nodes) {
                result.push(node);
            }
        }
        for (const node of Array.from(elem.childNodes)) {
            const n2 = getExpressions(node);
            for (const n of n2) {
                result.push(n);
            }
        }
        return result;
    }
    exports.getExpressions = getExpressions;
    function processNode(node) {
        if (node.nodeType === 3) {
            if ('nodeValue' in node && node.nodeValue) {
                const value = node.nodeValue;
                const match = matchExpressions(value);
                if (match && match.length > 0) {
                    const parentNode = node.parentNode;
                    if (parentNode) {
                        const nodes = [];
                        const textString = value;
                        let i = 0;
                        for (const entry of match) {
                            const startOffset = node.nodeValue.indexOf(entry[0]);
                            const endOffset = startOffset + entry[0].length;
                            const length2 = startOffset - i;
                            if (length2 > 0) {
                                const str = textString.substr(i, length2);
                                const textNode = document.createTextNode(str);
                                parentNode.insertBefore(textNode, node);
                            }
                            if (match.length === 1) {
                                nodes.push({
                                    expr: entry[1],
                                    node: parentNode
                                });
                            }
                            else {
                                const newNode2 = document.createElement('span');
                                parentNode.insertBefore(newNode2, node);
                                nodes.push({
                                    expr: entry[1],
                                    node: newNode2
                                });
                            }
                            i = endOffset;
                        }
                        const length = textString.length - i;
                        if (length > 0) {
                            const str = textString.substr(i, length);
                            const textNode = document.createTextNode(str);
                            parentNode.insertBefore(textNode, node);
                        }
                        parentNode.removeChild(node);
                        return nodes;
                    }
                }
            }
        }
        return [];
    }
    const bindExpressions = (expressions, context, handler) => {
        for (const ei of expressions) {
            const { expr, node } = ei;
            handler(node, expr, context);
        }
    };
    exports.evalExpression = (evaluator, expr, context) => evaluator(expr, context);
    exports.bindExpression = (evaluator, elem, expr, context) => elem.innerHTML = exports.evalExpression(evaluator, expr, context);
    exports.defaultEvaluator = (expr, context) => new Function('context', `with(context) { return ${expr}; }`)(context);
    const defaultBindingHandler = (target, expr, context) => {
        exports.bindExpression(exports.defaultEvaluator, target, expr, context);
    };
    exports.bind = (elem, data, bindingHandler = defaultBindingHandler) => bindExpressions(getExpressions(elem), data, bindingHandler);
    function cloneAttributes(element, sourceNode) {
        let attr = null;
        const attributes = Array.prototype.slice.call(sourceNode.attributes);
        while (attr = attributes.pop()) {
            if (attr !== null) {
                element.setAttribute(attr.nodeName, attr.nodeValue);
            }
        }
    }
    exports.render = (target, template, data, bindingHandler = defaultBindingHandler) => {
        const context = {
            data,
            placeholders: [],
            target,
            template
        };
        const parent = target.parentElement;
        let templateInstance = null;
        templateInstance = document.createElement('div');
        templateInstance.innerHTML = '';
        if (typeof template === 'string') {
            const templateRoot = document.createTextNode(template);
            templateInstance.appendChild(templateRoot);
        }
        else {
            if (template instanceof HTMLTemplateElement) {
                const templateRoot = document.importNode(template.content, true);
                templateInstance.appendChild(templateRoot);
            }
            else {
                const templateRoot = template.children.item(0).cloneNode(true);
                templateInstance.appendChild(templateRoot);
            }
        }
        const handlerWrapper = (elem, expr, ctx) => {
            context.placeholders.push({
                context,
                elem,
                expr
            });
            bindingHandler(elem, expr, ctx);
        };
        const node = [];
        exports.bind(templateInstance, data, handlerWrapper);
        cloneAttributes(templateInstance, target);
        parent.replaceChild(templateInstance, target);
        return context;
    };
});
//# sourceMappingURL=templating.js.map