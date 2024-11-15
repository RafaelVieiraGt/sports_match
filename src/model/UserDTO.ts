export class UserDTO {
    name: string;
    email: string;
    password: string;
    sport: number;
    position: number;
    cep: string;
  
    constructor(
      name: string,
      email: string,
      password: string,
      sport: number,
      position: number,
      cep: string
    ) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.sport = sport;
      this.position = position;
      this.cep = cep;
    }
  }