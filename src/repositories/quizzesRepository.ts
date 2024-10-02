import { api, IApiSuccessResponse } from "@/services/api";
import { ICompleteQuizQuestionDTO } from "./dtos/QuizDTO";
import { IQuizzesRepository } from "./interfaces/quizzesRepository";

export class QuizzesRepository implements IQuizzesRepository {
  async getQuizById(quizId: string): Promise<ICompleteQuizQuestionDTO> {
    try {
      const response = await api.get<
        IApiSuccessResponse<ICompleteQuizQuestionDTO>
      >(`/quizzes/get-by-id/${quizId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuizByTraining(
    trainingId: string
  ): Promise<ICompleteQuizQuestionDTO> {
    try {
      const response = await api.get<
        IApiSuccessResponse<ICompleteQuizQuestionDTO>
      >(`/quizzes/get-by-training/${trainingId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
