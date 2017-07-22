es-templating-engine
==

Simple and extendible templating library using the ECMAScript templating placeholders.

This library is written in TypeScript, but should be able to target any version of JavaScript and browser environments that supports the features being used.

This is **experimental** and not a finished product.

## Features
* The abillity to hook into the binding and evaluation steps with custom handlers. This enables the implementation of higher order features, such as data-binding. *(See "customBinder.ts")*


## Usage

**index.html:**

```html
<div id="template">        
    <h1>${title}</h1>
    <p>${description + "!"}</p>
    <p>${greet("John Doe")}</p>
</div>
```

**index.ts:**

```ts
import { bindTemplate } from "./templating";

const element = document.getElementById("template");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

bindTemplate(element!, model);
```

That will render this:

```html
<div id="template">
    <h1><span>Hey!</span></h1>
    <p><span>Whats up!</span></p>
    <p><span>Hello, John Doe!</span></p>
</div>
```

## Extendibility

Simple case extending the expression evaluator to cache the generated functions.

```ts
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

const customBindingHandler = (elem: Element, expr: string, context: any) => {
    bindExpression(customEvaluator, elem, expr, context);
    // Here shorthand for: elem.innerHTML = customEvaluator(expr, context);

    console.log("Handling expression:", expr);
};

export const myBinder = (elem: Element, data: any) => bindTemplate(elem!, data, customBindingHandler);

```

## TODO
* Write tests
* Revise project structure

## Contributions
Feel free to come with contributions and/or suggestions!