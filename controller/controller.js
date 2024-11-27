import { API } from "../api/Api.js";
import { Erro, Sucesso } from "../model/Resposta.js";

/**
 * Classe controladora com metodos de validação, atribuição de valores e consulta a API
 */
export class Controller{
    #moeda_origem
    #moeda_destino
    #valor
    #api

    /**
     * Inicia a API
     */
    constructor(){
        this.#api = new API();
    }

    /**
     * Retorna o valor da conversão
     */
    get valor(){
        return this.#valor;
    }

    /**
     * Define qual sera a moeda de origem
     * @param {String} moeda 
     * @returns {Sucesso | Erro}
     */
    setMoedaOrigem(moeda){
        const isValida = this.#validaMoeda(moeda);
        if(!isValida.sucesso)
            return isValida;

        if(moeda === this.#moeda_destino)
            return new Erro("Erro: Moeda Origem igual a Moeda Destino");

        this.#moeda_origem = moeda;
        return new Sucesso(this.#moeda_origem);
    }

    /**
     * Define qual sera a moeda de destino
     * @param {String} moeda 
     * @returns {Sucesso | Erro}
     */
    setMoedaDestino(moeda){
        const isValida = this.#validaMoeda(moeda);
        if(!isValida.sucesso)
            return isValida;

        if(moeda === this.#moeda_origem)
            return new Erro("Erro: Moeda Origem igual a Moeda Destino");

        this.#moeda_destino = moeda;
        return new Sucesso(this.#moeda_destino);
    }

    /**
     * Define qual o valor que será convertido
     * @param {string} valor 
     * @returns {Sucesso | Erro}
     */
    setValor(valor){
        const isValido = this.#validaValor(valor);
        if(!isValido.sucesso)
            return isValido;

        this.#valor = isValido.data; // this.#valor vai receber o valor convertido em float 
        return new Sucesso(this.#valor);
    }


    /**
     * Chama a API para converter os valores monetários
     * @returns {Promise<Sucesso | Erro>}
     */
    async converter(){
        if(this.#moeda_origem == null)
            throw new Erro("valor de moeda origem não definido");

        if(this.#moeda_destino == null)
            throw new Erro("valor de moeda destino não definido");

        if(this.#valor == null)
            throw new Erro("valor de \"valor\" não definido");
            

        const resultado = await this.#api.getConversion(this.#moeda_origem, this.#moeda_destino, this.#valor);

        this.#clear();
        return resultado
    }

    /**
     * Valida se uma moeda é válida
     * @param {String} moeda 
     * @returns {Sucesso | Erro}
     */
    #validaMoeda(moeda){
        if(moeda.length !== 3)
            return new Erro("Erro: Moeda inválida");

        return new Sucesso(moeda);
    }

    /**
     * Verifica se valor é válido e converte para float com duas casas decimais
     * @param {String} valor 
     * @returns {Erro | Sucesso} - Data possui o valor com duas casas decimais
     */
    #validaValor(valor){

        if(!valor.includes(','))
            return new Erro("Erro: valor tem que ser separado por virgula");

        const [inteiro, decimal] = valor.split(",")

        const valor_float = Number(`${inteiro}.${decimal}`);
        if(!valor_float)
            return new Erro("Erro: valor não é um number");

        if(valor_float <= 0)
            return new Erro("Erro: valor menor ou igual a zero");

        return new Sucesso(valor_float.toFixed(2));
    }

    /**
     * Limpa os valores dos atributos do controller
     */
    #clear(){
        this.#valor = null;
        this.#moeda_destino = null;
        this.#moeda_origem = null;
    }
};