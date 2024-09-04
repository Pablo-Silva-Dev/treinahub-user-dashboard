import { IVideoClassDTO } from "../dtos/VideoClassDTO";

export interface IVideoClassesRepository {
  listVideoClassesByTraining(trainingId: string): Promise<IVideoClassDTO[]>;
  getVideoClassById(videoClassId: string): Promise<IVideoClassDTO>;
}
