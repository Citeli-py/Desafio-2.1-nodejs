import { Controller } from "./controller/controller.js";

const controller = new Controller();

console.log(controller.setMoedaOrigem("USD"));
console.log(controller.setMoedaDestino("BRL"));
console.log(controller.setValor("10,897"));
console.log( await controller.converter())