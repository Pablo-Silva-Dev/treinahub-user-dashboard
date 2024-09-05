import { ICreateUserDTO, IUserDTO } from "../dtos/UserDTO";

export interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUserResponse {
  name: string;
  email: string;
  token: string;
}

export interface IGetRecoveryPasswordCodeByEmailDTO {
  cpf: string;
  email: string;
}

export interface IGetRecoveryPasswordCodeBySMSDTO {
  phone: string;
}

export interface IUsersRepository {
  authenticateUser(
    user: IAuthenticateUserRequest
  ): Promise<IAuthenticateUserResponse>;
  registerUser(data: ICreateUserDTO): Promise<IUserDTO>;
  getUserById(userId: string): Promise<IUserDTO>;
}
