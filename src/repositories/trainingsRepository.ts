import { api, IApiSuccessResponse } from "@/services/api";
import { ITrainingDTO } from "./dtos/TrainingDTO";
import { ITrainingsRepository } from "./interfaces/trainingsRepository";

export class TrainingsRepository implements ITrainingsRepository {
  async listTrainings(): Promise<ITrainingDTO[]> {
    try {
      const response =
        await api.get<IApiSuccessResponse<ITrainingDTO[]>>("/trainings/list");
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getTrainingById(id: string): Promise<ITrainingDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<ITrainingDTO>>(
        `/trainings/get-by-id/${id}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
