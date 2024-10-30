import { ICompanyDTO } from "./CompanyDTO";

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
  company?: ICompanyDTO;
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

export interface IUpdateUserDTO {
  id: string;
  phone?: string | null;
  password?: string | null;
  cep?: string | null;
  street?: string | null;
  district?: string | null;
  city?: string | null;
  uf?: string | null;
  residence_number?: string | null;
}
