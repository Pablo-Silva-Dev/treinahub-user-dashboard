import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateWatchedClassesDTO,
  IGetWatchedClassByUserAndClassDTO,
  IGetWatchedClassesByUserAndTrainingDTO,
  IRemoveWatchedClassDTO,
  IUpdateVideoClassExecutionStatusDTO,
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
  async listWatchedClassesByUser(userId: string): Promise<IWatchedClassDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IWatchedClassDTO[]>>(
        `/watched-classes/list-by-user/${userId}`
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
  async updateVideoClassExecutionStatus(
    data: IUpdateVideoClassExecutionStatusDTO
  ) {
    try {
      const response = await api.put<IApiSuccessResponse<IWatchedClassDTO>>(
        "/watched-classes/update-execution-time",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getWatchedClass(data: IGetWatchedClassByUserAndClassDTO) {
    try {
      const response = await api.post<IApiSuccessResponse<IWatchedClassDTO>>(
        "/watched-classes/get-by-user-and-class",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
