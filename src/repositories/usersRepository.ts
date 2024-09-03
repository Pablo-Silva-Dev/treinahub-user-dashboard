import { api, IApiSuccessResponse } from "@/services/api";
import { ICreateUserDTO, IUpdateUserDTO, IUserDTO } from "./dtos/UserDTO";
import {
  IAuthenticateUserRequest,
  IAuthenticateUserResponse,
  IGetRecoveryPasswordCodeByEmailDTO,
  IGetRecoveryPasswordCodeBySMSDTO,
  IUsersRepository,
} from "./interfaces/usersRepositoryInterfaces";

export class UsersRepository implements IUsersRepository {
  async authenticateUser(
    data: IAuthenticateUserRequest
  ): Promise<IAuthenticateUserResponse> {
    try {
      const response = await api.post<
        IApiSuccessResponse<IAuthenticateUserResponse>
      >("/users/auth", data);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async registerUser(data: ICreateUserDTO) {
    try {
      const response = await api.post<IApiSuccessResponse<IUserDTO>>(
        "/users/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(data: IUpdateUserDTO): Promise<IUserDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<IUserDTO>>(
        "/users/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmail(email: string): Promise<IUserDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO>>(
        `/users/get-by-email/${email}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserByPhone(phone: string): Promise<IUserDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO | void>>(
        `/users/get-by-phone/${phone}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getRecoveryPasswordCodeByEmail(
    data: IGetRecoveryPasswordCodeByEmailDTO
  ): Promise<string> {
    try {
      const response = await api.post<IApiSuccessResponse<string>>(
        "/users/get-recovery-password-code-by-email",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getRecoveryPasswordCodeBySMS(
    data: IGetRecoveryPasswordCodeBySMSDTO
  ): Promise<string> {
    try {
      const response = await api.post<IApiSuccessResponse<string>>(
        "/users/get-recovery-password-code-by-phone",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
