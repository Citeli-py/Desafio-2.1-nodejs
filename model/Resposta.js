class Resposta{

    /**
     * 
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

export class Erro extends Resposta{
    /**
     * @param {String} erro
     */
    constructor(erro){
        super(false, erro, null);
    }
}

export class Sucesso extends Resposta{
    /**
     * @param {any} data
     */
    constructor(data){
        super(true, null, data);
    }
}