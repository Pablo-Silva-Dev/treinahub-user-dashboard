import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateQuizResultDTO,
  IGetQuizResultDTO,
  IQuizResultDTO,
} from "./dtos/QuizResultDTO";
import { IQuizResultsRepository } from "./interfaces/quizResultsRepository";

export class QuizResultsRepository implements IQuizResultsRepository {
  async createQuizResult(data: ICreateQuizResultDTO): Promise<IQuizResultDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizResultDTO>>(
        "/quizzes-results/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }

  async getQuizResultByUserAndQuizAttempt(
    data: IGetQuizResultDTO
  ): Promise<IQuizResultDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizResultDTO>>(
        "/quizzes-results/get-by-user-and-quiz-attempt",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }

  async deleteQuizResult(quizResultId: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/quizzes-results/delete/${quizResultId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuizzesResultsByUser(userId: string): Promise<IQuizResultDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizResultDTO[]>>(
        `/quizzes-results/list-by-user/${userId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
