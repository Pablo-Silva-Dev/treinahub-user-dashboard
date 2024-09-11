import { api, IApiSuccessResponse } from "@/services/api";
import {
  IAvatarDTO,
  ICreateAvatarDTO,
  IDeleteUserAvatars,
  IUpdateAvatarDTO,
} from "./dtos/AvatarDTO";
import { IAvatarsRepository } from "./interfaces/avatarsRepository";

export class AvatarsRepository implements IAvatarsRepository {
  async createAvatar(data: ICreateAvatarDTO): Promise<IAvatarDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IAvatarDTO>>(
        "/avatars/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getAvatarByUserId(userId: string): Promise<IAvatarDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IAvatarDTO>>(
        `/avatars/get-by-user-id/${userId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(data: IUpdateAvatarDTO): Promise<IAvatarDTO> {
    try {
      const { id, img_file } = data;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("img_file", img_file);

      const response = await api.put<IApiSuccessResponse<IAvatarDTO>>(
        "/avatars/update",
        formData
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteUserAvatars(data: IDeleteUserAvatars) {
    try {
      const response = await api.delete<
        IApiSuccessResponse<IDeleteUserAvatars>
      >("/avatars/delete-users-avatars", {
        data,
      });
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
