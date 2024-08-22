import { api, IApiSuccessResponse } from "@/services/api";
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
}
