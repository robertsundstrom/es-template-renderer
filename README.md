es-template-renderer
==

Simple and extendible templating library using the ECMAScript interpolation syntax.

This library is written in TypeScript, but should be able to target any version of JavaScript and any browser environment that support the features being used.

Targeting the AMD module format.

This is **experimental** and not a finished product.

## Features
* The abillity to hook into the binding and evaluation steps with custom handlers. This enables the implementation of higher order features, such as data-binding. *(See "customBinder.ts")*


## Usage

**index.html:**

```html
<div id="template">
    <h1>${title}</h1>
    <p>${description + "!"}</p>
    <p>${greet("John Doe")} ${2017}</p>
</div>
```

**index.ts:**

```ts
import { bind } from "./templating";

const element = document.getElementById("template");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

bind(element!, model);
```

That will render this:

```html
<div id="template">
    <h1>Hey!</h1>
    <p>Whats up!</p>
    <p><span>Hello, John Doe!</span> <span>2017</span></p>
</div>
```

## Extendibility

Simple case extending the expression evaluator to cache the generated functions.

```ts
import {  bindExpression, render } from "./templating";

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

export const myBinder = (elem: Element, data: any) => render(elem!, data, customBindingHandler);

```

## Build
Requires Bower.

```sh
$ npm install
$ bower install
$ npm run build
```

Open index.html/index2.html.

## TODO
* Write tests
* Revise project structure

## Contributions
Feel free to come with contributions and/or suggestions!