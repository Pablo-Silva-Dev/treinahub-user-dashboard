import { IUserDTO } from "./UserDTO";

export type TPlan =
  | "gold_mensal"
  | "silver_mensal"
  | "bronze_mensal"
  | "gold_anual"
  | "silver_anual"
  | "bronze_anual"
  | null;

export interface ICompanyDTO {
  id: string;
  fantasy_name: string;
  cnpj: string;
  social_reason: string;
  email: string;
  phone: string;
  current_plan: TPlan;
  logo_url: string;
  users?: IUserDTO[];
  subscription_id?: string;
}

export interface IReportNewUserDTO {
  totalCompanyUsers: number;
  subscriptionId: string;
  companyPlan: TPlan;
  companyEmail: string;
}
