import { bindTemplate } from "./templating";

const element = document.getElementById("template");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

bindTemplate(element!, model);

model.title = "foo";