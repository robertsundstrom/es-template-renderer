String.prototype.matchAll = function(regexp: RegExp): string[][] | null {
    const matches: any[] = [];
    // tslint:disable-next-line:only-arrow-functions
    this.replace(regexp, function() {
        const arr = ([]).slice.call(arguments, 0);
        const extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
    } as any);
    return matches.length ? matches : null;
};

const expressionRegexp = /\${([^}]*)}/g;

const matchExpressions = (value: string) => value.matchAll(expressionRegexp);

function* getExpressions(elem: Node): Iterable<IExpressionInfo> {
    const nodes = processNode(elem);
    if (nodes) {
        for (const node of nodes) {
            yield node;
        }
    }
    for (const node of Array.from(elem.childNodes)) {
        const n2 = getExpressions(node);
        for (const n of n2) {
            yield n;
        }
    }
}

export interface IExpressionInfo {
    expr: any;
    node: Element;
}

function processNode(node: Node): IExpressionInfo[] {
    if (node.nodeType === 3) {
        if ("nodeValue" in node && node.nodeValue !== null) {
            const value = node.nodeValue;
            const match = matchExpressions(value);
            if (match !== null && match.length > 0) {
                const parentNode = node.parentNode;
                if (parentNode !== null) {
                    const nodes = [];
                    const textString = value;
                    let i = 0;
                    for (const entry of match) {
                        const startOffset = node.nodeValue.indexOf(entry[0]);
                        const endOffset = startOffset + entry[0].length;
                        const length = startOffset - i;
                        if (length > 0) {
                            const str = textString.substr(i, length);
                            const textNode = document.createTextNode(str);
                            parentNode.insertBefore(textNode, node);
                        }

                        const newNode2 = document.createElement("span");
                        parentNode.insertBefore(newNode2, node);

                        nodes.push({
                            expr: entry[1],
                            node: newNode2,
                        });

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

/** Evaluates an expression. (Used as a hook) */
export type Evaluator = (expr: string, context: any) => any;

/** Evaluate an expression within a certain context and returns the value. */
export const evalExpression = (evaluator: Evaluator, expr: string, context: any) =>
    evaluator(expr, context);

/** Evaluate and binds an expression to the DOM. (This can be replaced by extenders) */
export const bindExpression = (evaluator: Evaluator, elem: Element, expr: string, context: any) =>
    elem.innerHTML = evalExpression(evaluator, expr, context);

/** Hooks into the binding step */
export type BindingHandler = (elem: Element, expr: string, context: any) => void;

/*** Evaluate and bind expressions within a certain context. */
export const bindExpressions = (
    expressions: IExpressionInfo[],
    context: any, handler: BindingHandler) => {
    for (const ei of expressions) {
        const { expr, node } = ei;
        handler(node, expr, context);
    }
};

/** Default evaluator */
const defaultEvaluator = (expr: string, context: any)  =>
    new Function("context", `with(context) { return ${expr}; }`)(context);

/** Default binding handler */
const defaultBindingHandler = (target: Element, expr: string, context: any) => {
    bindExpression(defaultEvaluator, target, expr, context);
};

/** Bind a template to the DOM. */
export const bindTemplate = (elem: Element, model: any, bindingHandler: BindingHandler = defaultBindingHandler) =>
    bindExpressions(Array.from(getExpressions(elem)), model, bindingHandler);