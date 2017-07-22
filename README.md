es-templating-engine
==

Simple and extendible templating library using the ECMAScript templating placeholders.

This library is written in TypeScript, but should be able to target any version of JavaScript and browser environments that supports the features being used.

This is **experimental** and not a finished product.

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

```js
import { bindTemplate } from "./templating";

const element = document.getElementById("template");

const model = {
    description: "Whats up",
    greet: (name: string) => {
        return `Hello, ${name}!`;
    },
    title: "Hey!",
};

bindTemplate(element!, model);
```

## Features
* The abillity to hook into the binding and evaluation steps with custom handlers. This enables the implementation of higher order features, such as data-binding. *(See "customBInder.ts")*

## TODO
* Write tests.
* Revise project structure

## Contributions
Feel free to come with contributions and/or suggestions!