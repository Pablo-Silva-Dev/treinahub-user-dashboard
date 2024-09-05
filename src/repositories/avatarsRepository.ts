import { api, IApiSuccessResponse } from "@/services/api";
import { IAvatarDTO, IUpdateAvatarDTO } from "./dtos/AvatarDTO";
import { IAvatarsRepository } from "./interfaces/avatarsRepository";

export class AvatarsRepository implements IAvatarsRepository {
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
}
