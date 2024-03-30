import NaoEncontrado from "../erros/NaoEncontrado.js";
import {livros, autores} from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const busca = livros.find();

      req.resultado = busca;

      next();
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros
        .findById(id, {}, { autopopulate: false })
        .populate("autor", "nome");

      if (livroResultado) {
        res.status(200).json(livroResultado);
      } else {
        next(new NaoEncontrado("ID do livro não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroEncontrado = await livros.findByIdAndUpdate(id, { $set: req.body });

      livroEncontrado ? res.status(200).send({ message: "Livro atualizado com sucesso" }) : next(new NaoEncontrado("Id do livro não encontrado!"));

    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroEncontrado = await livros.findByIdAndDelete(id);

      livroEncontrado ? res.status(200).send({ message: "Livro removido com sucesso" }) : next(new NaoEncontrado("Id do livro não encontrado!"));
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if(busca !== null) {
        const livrosResultado = livros
          .find(busca)
          .populate("autor");

        req.resultado = livrosResultado;

        next();
      } else {
        res.status(200).send([]);
      }


    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(parametros) {
  const {editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  let busca = {};

  if (editora) busca.editora = editora;
  if(titulo) busca.titulo = { $regex: titulo, $options: "i"};

  if(minPaginas || maxPaginas) busca.numeroPaginas = {};

  if(minPaginas) busca.numeroPaginas.$gte = minPaginas;
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if(nomeAutor) {
    const autor = await autores.findOne({nome: nomeAutor});

    if(autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }

  }

  return busca;
}
export default LivroController;