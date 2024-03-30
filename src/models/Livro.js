import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const livroSchema = new mongoose.Schema(
  {
    id: {type: String},
    titulo: {
      type: String,
      required: [true, "O título do livro é obrigatório"]
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "autores",
      required: [true, "O autor é obrigatório"],
      autopopulate: true
    },
    editora: {
      type: String,
      required: [true, "A editora é obrigatória"],
      enum: {
        values: ["Alura", "Casa do Codigo", "Abril"],
        message: "A editora {VALUE} não é permitida"
      }
    },
    numeroPaginas: {
      type: Number,
      validate: {
        validator:(valor) => {
          return valor >= 10 && valor <= 5000;
        },
        message: "O número de páginas precisa estar entre 10 e 5000. Valor informado: {VALUE}" 
      }
    }
  }
);

livroSchema.plugin(autopopulate);
const livros= mongoose.model("livros", livroSchema);

export default livros;