import { api, IApiSuccessResponse } from "@/services/api";
import { ICreateQuizAttemptDTO, IQuizAttemptDTO } from "./dtos/QuizAttemptDTO";
import { IQuizAttemptsRepository } from "./interfaces/quizAttemptsRepository";

export class QuizAttemptsRepository implements IQuizAttemptsRepository {
  async createQuizAttempt(
    data: ICreateQuizAttemptDTO
  ): Promise<IQuizAttemptDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizAttemptDTO>>(
        "/quizzes-attempts/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuizAttemptsByUser(userId: string): Promise<IQuizAttemptDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizAttemptDTO[]>>(
        `/quizzes-attempts/${userId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuizAttemptsById(quizAttemptId: string): Promise<IQuizAttemptDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizAttemptDTO>>(
        `/quizzes-attempts/get-by-id/${quizAttemptId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
