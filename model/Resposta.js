/**
 * Classe abstrata que contém os atributos para uma resposta genérica
 */
class Resposta{

    /**
     * Construtor de uma resposta genérica
     * @param {boolean} sucesso 
     * @param {String | null} erro 
     * @param {any | null} data 
     */
    constructor(sucesso, erro, data){
        this.sucesso = sucesso;
        this.erro = erro;
        this.data = data;
    }
};

/**
 * Classe que representa um Erro qualquer que o sistema vai tratar posteriormente
 */
export class Erro extends Resposta{
    /**
     * @param {String} erro
     */
    constructor(erro){
        super(false, erro, null);
    }
}

/**
 * Classe que representa um Sucesso qualquer e que carrega dados importantes para serem utilizados posteriormente
 */
export class Sucesso extends Resposta{
    /**
     * @param {any} data
     */
    constructor(data){
        super(true, null, data);
    }
}