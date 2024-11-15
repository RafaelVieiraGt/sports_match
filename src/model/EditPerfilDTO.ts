export class EditPerfilDTO {
    nome: string;
    descricao: string;
    foto: string;
    position: number;
  
    constructor(nome: string, descricao: string, foto: string, position: number) {
      this.nome = nome;
      this.descricao = descricao;
      this.foto = foto;
      this.position = position;
    }
  }