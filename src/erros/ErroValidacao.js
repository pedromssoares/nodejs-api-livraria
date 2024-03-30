import RequisicaoIncorreta from "./RequisicaoIncorreta.js";

class ErroValidacao extends RequisicaoIncorreta {
  constructor(erro) {
    const mensagensErro = Object.values(erro.errors)
      .map(erro => erro.message)
      .join(";");

    super(`Ocorreram os seguintes erros: ${mensagensErro}`);
  }
}

export default ErroValidacao;