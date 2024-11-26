import dotenv from 'dotenv';
dotenv.config();

import { Erro, Sucesso } from '../model/Resposta.js';

// GET https://v6.exchangerate-api.com/v6/YOUR-API-KEY/pair/MOEDA-ORIGEM/MOEDA-DESTINO/VALOR

/**
 * API faz apenas as operações com a API
 */
export class API{
    #url

    constructor(){
        this.#url = `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/pair`;
    }

    /**
     * Faz a conversão entre moedas utilizando a API
     * @param {string} moeda_origem - Código da moeda de origem (ex.: 'USD')
     * @param {string} moeda_destino - Código da moeda de destino (ex.: 'EUR')
     * @param {number} valor - Valor a ser convertido
     * @returns {Promise<Sucesso | Erro>} Valor convertido
     */
    async getConversion(moeda_origem, moeda_destino, valor) {
        try {
            const url = `${this.#url}/${moeda_origem}/${moeda_destino}/${valor}`;
            const response = await fetch(url);

            const data = await response.json();

            if (data.result === 'error') 
                return this.#processarErros(data);
        
            // Verifica se a resposta contém o campo 'conversion_result'
            if (!(data && data.conversion_result)) 
                return new Erro('Erro: Resposta inesperada da API');
                
            return new Sucesso(data); // Retorna o valor convertido

        } catch (error) {
            if(error instanceof TypeError)
                return new Erro('Erro de conexão com a API: ' + error.message);

            return new Erro('Erro na conversão: '+ error);
        }
    }

    #processarErros(response){
        const erro = response['error-type'];

        switch (erro) {
            case "unsupported-code":
                return new Erro("Erro: Código monetário não suportado");

            case "malformed-request":
                return new Erro("Erro: Requisição mal formada");

            case "invalid-key":
                return new Erro("Erro: Chave da API inválida");
            
            case "inactive-account":
                return new Erro("Erro: Conta inativa");
            
            case "quota-reached":
                return new Erro("Erro: Essa conta excedeu o número de requisições");
        
            default:
                return new Erro("Erro: Erro Desconhecido na API");
        }
    }

}