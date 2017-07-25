import { process } from "./templating";

const elem = document.getElementById("target");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

process(elem!, model);
