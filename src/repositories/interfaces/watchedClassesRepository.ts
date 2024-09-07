import {
  ICreateWatchedClassesDTO,
  IGetWatchedClassesByUserAndTrainingDTO,
  IRemoveWatchedClassDTO,
  IWatchedClassDTO,
} from "../dtos/WatchedClassDTO";

export interface IWatchedClassesRepository {
  listWatchedClassesByUserAndTraining(
    data: IGetWatchedClassesByUserAndTrainingDTO
  ): Promise<IWatchedClassDTO[]>;
  listWatchedClassesByUser(userId: string): Promise<IWatchedClassDTO[]>;
  addWatchedClass(data: ICreateWatchedClassesDTO): Promise<IWatchedClassDTO>;
  removeWatchedClass(data: IRemoveWatchedClassDTO): Promise<void>;
}
