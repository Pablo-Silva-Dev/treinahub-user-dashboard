import { api, IApiSuccessResponse } from "@/services/api";
import { ICreateUserDTO, IUserDTO } from "./dtos/UserDTO";
import {
  IAuthenticateUserRequest,
  IAuthenticateUserResponse,
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
}
