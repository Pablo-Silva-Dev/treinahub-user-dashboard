export interface IUserDTO {
    id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birth_date: string;
    password: string;
    cep?: string;
    street?: string;
    district?: string;
    city?: string;
    uf?: string;
    residence_number?: string;
    is_admin: boolean;
  }
  
  export interface ICreateUserDTO {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birth_date: string;
    password: string;
    is_admin?: boolean;
  }