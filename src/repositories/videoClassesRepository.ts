import { api } from "@/services/api";
import { IVideoClassDTO } from "./dtos/VideoClassDTO";
import { IVideoClassesRepository } from "./interfaces/videoClassesRepository";

export class VideoClassesRepository implements IVideoClassesRepository {
  async listVideoClassesByTraining(
    trainingId: string
  ): Promise<IVideoClassDTO[]> {
    try {
      const response = await api.get(
        `/video-classes/list-by-training/${trainingId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getVideoClassById(videoClassId: string): Promise<IVideoClassDTO> {
    try {
      const response = await api.get(
        `/video-classes/get-by-id/${videoClassId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
