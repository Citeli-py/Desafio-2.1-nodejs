import { API } from "../api/Api.js";
import { Erro, Sucesso } from "../model/Resposta.js";

export class Controller{
    #moeda_origem
    #moeda_destino
    #valor
    #api

    constructor(){
        this.#api = new API();
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

    setValor(valor){
        const isValido = this.#validaValor(valor);
        if(!isValido.sucesso)
            return isValido;

        this.#valor = isValido.data; // this.#valor vai receber o valor convertido em float 
        return new Sucesso(this.#valor);
    }


    async converter(){
        if(this.#moeda_origem == null)
            throw new Error("valor de moeda origem não definido");

        if(this.#moeda_destino == null)
            throw new Error("valor de moeda destino não definido");

        if(this.#valor == null)
            throw new Error("valor de \"valor\" não definido");
            

        const resultado = await this.#api.getConversion(this.#moeda_origem, this.#moeda_destino, this.#valor);

        this.#clear();
        return resultado
    }

    /**
     * 
     * @param {String} moeda 
     * @returns {Sucesso | Erro}
     */
    #validaMoeda(moeda){
        if(moeda.length !== 3)
            return new Erro("Erro: Moeda inválida");

        return new Sucesso(moeda);
    }

    /**
     * 
     * @param {String} valor 
     * @returns {Erro | Sucesso}
     */
    #validaValor(valor){
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