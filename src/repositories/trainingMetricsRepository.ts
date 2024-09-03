import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateTrainingMetricsDTO,
  ITrainingMetricsDTO,
} from "./dtos/TrainingMetricDTO";
import { ITrainingMetricsRepository } from "./interfaces/trainingMetricsRepository";

export class TrainingMetricsRepository implements ITrainingMetricsRepository {
  async createTrainingMetrics(data: ICreateTrainingMetricsDTO) {
    try {
      const response = await api.post<IApiSuccessResponse<ITrainingMetricsDTO>>(
        "/training-metrics/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listTrainingMetricsByUser(
    userId: string
  ): Promise<ITrainingMetricsDTO[]> {
    try {
      const response = await api.get<
        IApiSuccessResponse<ITrainingMetricsDTO[]>
      >(`/training-metrics/list-by-user/${userId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
