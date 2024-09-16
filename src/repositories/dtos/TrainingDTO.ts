import { ICertificateDTO } from "./CertificateDTO";
import { ITrainingMetricsDTO } from "./TrainingMetricDTO";
import { IUserDTO } from "./UserDTO";
import { IVideoClassDTO } from "./VideoClassDTO";

export interface ITrainingDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  cover_url?: string;
  users?: IUserDTO[];
  video_classes?: IVideoClassDTO[];
  certificates?: ICertificateDTO[];
  training_metrics?: ITrainingMetricsDTO[];
  formatted_duration?: string;
  last_watched_class_id?: string | null;
  last_watched_class_name?: string | null;
  last_watched_class_duration?: number | null;
}
