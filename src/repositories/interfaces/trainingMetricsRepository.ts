import {
  ICreateTrainingMetricsDTO,
  IGetTrainingMetricsDTO,
  ITrainingMetricsDTO,
  IUpdateTrainingMetricsDTO,
} from "../dtos/TrainingMetricDTO";

export interface ITrainingMetricsRepository {
  listTrainingMetricsByUser(userId: string): Promise<ITrainingMetricsDTO[]>;
  createTrainingMetrics(
    data: ICreateTrainingMetricsDTO
  ): Promise<ITrainingMetricsDTO>;
  updateTrainingMetrics(
    data: IUpdateTrainingMetricsDTO
  ): Promise<ITrainingMetricsDTO>;
  getTrainingMetricsByUserAndTraining(
    data: IGetTrainingMetricsDTO
  ): Promise<ITrainingMetricsDTO>;
}
