import { ICertificateDTO } from "../dtos/CertificateDTO";
import { ITrainingMetricsDTO } from "../dtos/TrainingMetricDTO";
import { IUserDTO } from "../dtos/UserDTO";
import { IVideoClassDTO } from "../dtos/VideoClassDTO";

export interface ITrainingDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  cover_url?: string;
  formatted_duration?: string;
  users?: IUserDTO[];
  video_classes?: IVideoClassDTO[];
  certificates?: ICertificateDTO[];
  training_metrics?: ITrainingMetricsDTO[];
}

export interface ITrainingsRepository {
  listTrainings(companyId: string): Promise<ITrainingDTO[]>;
  getTrainingById(id: string): Promise<ITrainingDTO>;
}
