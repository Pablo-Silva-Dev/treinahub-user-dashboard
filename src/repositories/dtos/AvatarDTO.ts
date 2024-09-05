export interface IAvatarDTO {
  id: string;
  user_id: string;
  url: string;
}

export interface IUpdateAvatarDTO {
  id: string;
  img_file: Blob;
}
