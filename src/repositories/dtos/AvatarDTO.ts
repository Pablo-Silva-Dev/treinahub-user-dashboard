export interface IAvatarDTO {
  id: string;
  user_id: string;
  url: string;
}

export interface ICreateAvatarDTO {
  user_id: string;
  url: string;
}

export interface IUpdateAvatarDTO {
  id: string;
  img_file: Blob;
}

export interface IDeleteUserAvatars {
  user_id: string;
  avatar_id: string;
}
