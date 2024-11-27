import { Controller } from "./controller/controller.js";
import PromptSync from "prompt-sync";
import { Erro, Sucesso } from "./model/Resposta.js";


class Conversor{

    /**
     * 
     * @param {String} mensagem 
     * @param {(entrada: String)=> Sucesso | Erro} metodo 
     * @returns {String} Retorna a entrada válida
     */
    static #lerEntrada(mensagem, metodo, sairSeVazio=false) {

        let resposta, entrada;
        do{
            entrada = this.prompt(mensagem);

            if(sairSeVazio && (entrada===""))
                return "";

            resposta = metodo(entrada);

            if(!resposta.sucesso)
                console.log(resposta.erro);

        }while(!resposta.sucesso);
        
        return entrada;
    }

    /**
     * Obtem as entradas do usuário e indica se o programa deve continuar ou não
     * @returns {boolean} - Indica se o programa deve seguir
     */
    static #getUserInfo(){
        const moeda_origem  = this.#lerEntrada("Moeda origem: ", (entrada) => this.controller.setMoedaOrigem(entrada), true);

        if(moeda_origem === "")
            return false;

        this.#lerEntrada("Moeda Destino: ", (entrada) => this.controller.setMoedaDestino(entrada));
        this.#lerEntrada("Valor: ", (entrada) => this.controller.setValor(entrada));

        return true;
    }

    /**
     * 
     * @param {Sucesso | Erro} response 
     * @param {string} valor 
     */
    static #printResult(response, valor){
        if(!response.sucesso){
            console.log(response.erro);
            return;
        }
        const data = response.data;

        console.log(`\n${data.base_code} ${valor} => ${data.target_code} ${data.conversion_result.toFixed(2)}`)
        console.log(`Taxa: ${data.conversion_rate.toFixed(6)}\n`)
    }

    /**
     * Função principal do programa
     */
    static async main(){

        while(true){
            this.controller = new Controller();
            this.prompt = PromptSync({sigint: true});
            const user_info = this.#getUserInfo();

            if(!user_info)
                break;

            const valor = this.controller.valor;
            const response = await this.controller.converter();
            this.#printResult(response, valor);
        }
    }
};

await Conversor.main();
