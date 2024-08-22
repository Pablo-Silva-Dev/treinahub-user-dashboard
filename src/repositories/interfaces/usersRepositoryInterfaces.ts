export interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUserResponse {
  email: string;
  token: string;
}

export interface IUsersRepository {
  authenticateUser(
    user: IAuthenticateUserRequest
  ): Promise<IAuthenticateUserResponse>;
}
