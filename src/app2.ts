import { renderTemplate } from "./templating";

const template = document.getElementById("template");
const target = document.getElementById("target");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

renderTemplate(target!, template!, model);
