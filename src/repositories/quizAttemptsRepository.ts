import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateQuizAttemptDTO,
  IListQuizAttemptsByUserAndQuizDTO,
  IQuizAttemptDTO,
} from "./dtos/QuizAttemptDTO";
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
        `/quizzes-attempts/list-by-user/${userId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuizAttemptsByUserAndQuiz(
    data: IListQuizAttemptsByUserAndQuizDTO
  ): Promise<IQuizAttemptDTO[]> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizAttemptDTO[]>>(
        "/quizzes-attempts/list-by-user-and-quiz",
        data
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
  async deleteQuizAttempt(quizAttemptId: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/quizzes-attempts/delete/${quizAttemptId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
