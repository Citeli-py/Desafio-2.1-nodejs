import { Controller } from "../controller/controller.js";
import { Sucesso, Erro } from "../model/Resposta.js";

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ ${message}: Esperado ${expected}, mas foi ${actual}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

function assertInstanceOf(obj, type, message) {
  if (!(obj instanceof type)) {
    console.error(`❌ ${message}: Esperava instância de ${type.name}, mas foi ${obj.constructor.name}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

async function testController() {
  console.log("Iniciando testes da classe Controller...");

  const controller = new Controller();

  // Teste de setMoedaOrigem
  console.log("Teste: setMoedaOrigem com moeda válida");
  let resultado = controller.setMoedaOrigem("USD");
  assertInstanceOf(resultado, Sucesso, "setMoedaOrigem deve retornar Sucesso");
  assertEqual(resultado.data, "USD", "Moeda origem definida corretamente");

  console.log("Teste: setMoedaOrigem com moeda inválida");
  resultado = controller.setMoedaOrigem("US");
  assertInstanceOf(resultado, Erro, "setMoedaOrigem deve retornar Erro para moeda inválida");
  assertEqual(resultado.erro, "Erro: Moeda inválida", "Erro esperado para moeda inválida");

  // Teste de setMoedaDestino
  console.log("Teste: setMoedaDestino com moeda válida");
  resultado = controller.setMoedaDestino("EUR");
  assertInstanceOf(resultado, Sucesso, "setMoedaDestino deve retornar Sucesso");
  assertEqual(resultado.data, "EUR", "Moeda destino definida corretamente");

  console.log("Teste: setMoedaDestino igual à moeda de origem");
  controller.setMoedaOrigem("EUR");
  resultado = controller.setMoedaDestino("EUR");
  assertInstanceOf(resultado, Erro, "setMoedaDestino deve retornar Erro para moeda igual à de origem");
  assertEqual(resultado.erro, "Erro: Moeda Origem igual a Moeda Destino", "Erro esperado para moedas iguais");

  // Teste de setValor
  console.log("Teste: setValor com valor válido");
  resultado = controller.setValor("123,45");
  assertInstanceOf(resultado, Sucesso, "setValor deve retornar Sucesso");
  assertEqual(resultado.data, "123.45", "Valor definido corretamente");

  console.log("Teste: setValor com valor inválido");
  resultado = controller.setValor("abc");
  assertInstanceOf(resultado, Erro, "setValor deve retornar Erro para valor inválido");
  assertEqual(resultado.erro, "Erro: valor não é um number", "Erro esperado para valor inválido");

  // Teste de converter
  console.log("Teste: converter com todos os valores definidos");
  controller.setMoedaOrigem("USD");
  controller.setMoedaDestino("EUR");
  controller.setValor("100,00");

  controller["#api"].getConversion = async () => new Sucesso("120.00"); // Mock manual da API

  const resultadoConversao = await controller.converter();
  assertInstanceOf(resultadoConversao, Sucesso, "converter deve retornar Sucesso");
  assertEqual(resultadoConversao.data, "120.00", "Conversão realizada corretamente");

  // Teste de conversão com valores não definidos
  console.log("Teste: converter sem moeda de origem definida");
  controller["#moeda_origem"] = null;
  try {
    await controller.converter();
    console.error("❌ converter deve lançar erro para moeda de origem não definida");
  } catch (e) {
    console.log("✅ converter lançou erro esperado para moeda de origem não definida");
  }

  console.log("Testes concluídos.");
}

// Rodar os testes
testController();
