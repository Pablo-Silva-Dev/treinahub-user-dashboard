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
  addWatchedClass(data: ICreateWatchedClassesDTO): Promise<IWatchedClassDTO>;
  removeWatchedClass(data: IRemoveWatchedClassDTO): Promise<void>;
}
