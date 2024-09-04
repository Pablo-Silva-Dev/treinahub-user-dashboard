import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateWatchedClassesDTO,
  IGetWatchedClassesByUserAndTrainingDTO,
  IRemoveWatchedClassDTO,
  IWatchedClassDTO,
} from "./dtos/WatchedClassDTO";
import { IWatchedClassesRepository } from "./interfaces/watchedClassesRepository";

export class WatchedClassesRepository implements IWatchedClassesRepository {
  async listWatchedClassesByUserAndTraining(
    data: IGetWatchedClassesByUserAndTrainingDTO
  ): Promise<IWatchedClassDTO[]> {
    try {
      const response = await api.post<IApiSuccessResponse<IWatchedClassDTO[]>>(
        "/watched-classes/list-by-user-and-training",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async addWatchedClass(
    data: ICreateWatchedClassesDTO
  ): Promise<IWatchedClassDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IWatchedClassDTO>>(
        "/watched-classes/add",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async removeWatchedClass(data: IRemoveWatchedClassDTO): Promise<void> {
    try {
      const response = await api.post<IApiSuccessResponse<void>>(
        "/watched-classes/remove",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
