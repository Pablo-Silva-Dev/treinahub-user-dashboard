import { IUserDTO } from "./UserDTO";

export interface IWatchedClassDTO {
  user_id: string;
  training_id: string;
  videoclass_id: string;
  watchedAt: Date;
  user?: IUserDTO;
}

export interface ICreateWatchedClassesDTO {
  user_id: string;
  training_id: string;
  videoclass_id: string;
}

export interface IGetWatchedClassesByUserAndTrainingDTO {
  user_id: string;
  training_id: string;
}

export interface IRemoveWatchedClassDTO {
  user_id: string;
  videoclass_id: string;
}
