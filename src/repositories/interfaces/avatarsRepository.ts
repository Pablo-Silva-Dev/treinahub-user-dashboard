import { IAvatarDTO, IUpdateAvatarDTO } from "../dtos/AvatarDTO";

export interface IAvatarsRepository {
  getAvatarByUserId(userId: string): Promise<IAvatarDTO>;
  updateAvatar(data: IUpdateAvatarDTO): Promise<IAvatarDTO>;
}
