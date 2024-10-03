import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateQuizResponseDTO,
  IQuizResponseDTO,
} from "./dtos/QuizResponseDTO";
import { IQuizResponsesRepository } from "./interfaces/quizResponsesRepository";

export class QuizResponsesRepository implements IQuizResponsesRepository {
  async createQuizResponse(
    data: ICreateQuizResponseDTO
  ): Promise<IQuizResponseDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizResponseDTO>>(
        "/quizzes-responses/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuizResponsesByAttempt(
    attemptId: string
  ): Promise<IQuizResponseDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizResponseDTO[]>>(
        `/quizzes-responses/get-by-quiz-attempt/${attemptId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuizResponseById(quizResponseId: string): Promise<IQuizResponseDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizResponseDTO>>(
        `/quizzes-responses/get-by-id/${quizResponseId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteManyQuizzesResponsesByQuizAttempt(
    quizAttemptId: string
  ): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/quizzes-response/delete-many-by-quiz-attempt/${quizAttemptId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
