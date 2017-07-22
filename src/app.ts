import { bindData } from "./templating";

const element = document.getElementById("target");

const model = {
    description: "Whats up",
    greet: (name: string) => `Hello, ${name}!`,
    title: "Hey!",
};

bindData(element!, model);

model.title = "foo";
