export class Cep {
  cep: string;
  logradouro: string;
  localidade: string;
  uf: string;

  constructor(cep: string, logradouro: string, localidade: string, uf: string) {
    this.cep = cep;
    this.logradouro = logradouro;
    this.localidade = localidade;
    this.uf = uf;
  }
}